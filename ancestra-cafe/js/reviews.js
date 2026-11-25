/* Customer reviews: list, summary, submission, sort/search, helpful, pagination */
const REVIEW_PAGE_SIZE = 5;
let reviewPage = 1;
let reviewPhoto = null;

function compressImage(file, maxDim = 900, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Not a valid image"));
      img.onload = () => {
        let { width: w, height: h } = img;
        const scale = Math.min(1, maxDim / Math.max(w, h));
        w = Math.round(w * scale);
        h = Math.round(h * scale);
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function ensureReviewViewer() {
  if (document.querySelector(".photo-viewer")) return;
  const dialog = document.createElement("dialog");
  dialog.className = "photo-viewer";
  dialog.setAttribute("aria-label", "Review photo preview");
  dialog.innerHTML = `<button class="photo-viewer-close" type="button" aria-label="Close photo preview">×</button><figure><img alt=""><figcaption></figcaption></figure>`;
  document.body.appendChild(dialog);
  const preview = dialog.querySelector("img");
  const caption = dialog.querySelector("figcaption");
  const close = () => dialog.open && dialog.close();
  dialog.querySelector(".photo-viewer-close").addEventListener("click", close);
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) close();
  });
  dialog.addEventListener("close", () => preview.removeAttribute("src"));
  return dialog;
}

function openReviewPhoto(src, caption) {
  const dialog = ensureReviewViewer();
  if (!dialog) return;
  dialog.querySelector("img").src = src;
  dialog.querySelector("figcaption").textContent = caption || "";
  dialog.showModal();
}

function isVerifiedPurchase(name) {
  const orders = Store.get("orders", []);
  return orders.some((o) => o.name && o.name.toLowerCase() === String(name).toLowerCase());
}

function helpfulCount(id) {
  const all = Store.get("reviewHelpful", {});
  return (all && all[id]) || 0;
}
function hasHelpful(id) {
  const mine = Store.get("myHelpful", []);
  return mine.includes(id);
}
function toggleHelpful(id) {
  const all = Store.get("reviewHelpful", {});
  const mine = Store.get("myHelpful", []);
  if (!all[id]) all[id] = 0;
  if (mine.includes(id)) {
    all[id] = Math.max(0, all[id] - 1);
    Store.set("myHelpful", mine.filter((x) => x !== id));
  } else {
    all[id] += 1;
    mine.push(id);
    Store.set("myHelpful", mine);
  }
  Store.set("reviewHelpful", all);
}

function getFilteredReviews() {
  const all = getReviews().filter((r) => !r.hidden);
  const filter = Number(document.getElementById("reviewFilter").value);
  const q = (document.getElementById("reviewSearch")?.value || "").trim().toLowerCase();
  const sort = document.getElementById("reviewSort")?.value || "newest";
  let list = filter ? all.filter((r) => r.rating === filter) : all;
  if (q) list = list.filter((r) => (r.name + " " + (r.dish || "") + " " + r.text).toLowerCase().includes(q));
  if (sort === "newest") list.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (sort === "oldest") list.sort((a, b) => new Date(a.date) - new Date(b.date));
  if (sort === "highest") list.sort((a, b) => b.rating - a.rating);
  if (sort === "lowest") list.sort((a, b) => a.rating - b.rating);
  if (sort === "helpful") list.sort((a, b) => helpfulCount(b.id) - helpfulCount(a.id));
  return list;
}

/* A dish mentioned in a review is shown as a linked pill with the menu
   photo, so guests can jump straight to that item on the menu page. */
function dishPill(name) {
  const item = (typeof MENU !== "undefined" ? MENU : []).find(
    (m) => m.name.toLowerCase() === String(name).toLowerCase(),
  );
  const label = escapeHtml(name);
  if (!item || typeof catImage !== "function") {
    return `<span class="tag-pill review-dish my-2 d-inline-block">${label}</span>`;
  }
  return `<a class="tag-pill review-dish my-2 d-inline-flex align-items-center gap-2 text-decoration-none" href="menu.html" title="View ${label} on the menu">
    <img src="${escapeHtml(catImage(item))}" alt="" width="22" height="22" loading="lazy" decoding="async" class="review-dish-thumb" onerror="this.style.display='none'">
    <span>${label}</span>
    <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
  </a>`;
}

function renderReviews() {
  const all = getReviews().filter((r) => !r.hidden);
  const avg = all.length ? all.reduce((s, r) => s + r.rating, 0) / all.length : 0;
  document.getElementById("avgRating").textContent = avg.toFixed(1);
  document.getElementById("avgStars").textContent = starString(Math.round(avg));
  document.getElementById("reviewTotal").textContent = `Based on ${all.length} review${all.length === 1 ? "" : "s"}`;
  document.getElementById("ratingBars").innerHTML = [5, 4, 3, 2, 1]
    .map((n) => {
      const c = all.filter((r) => r.rating === n).length;
      const pct = all.length ? (c / all.length) * 100 : 0;
      return `<div class="d-flex align-items-center gap-2 mb-1"><span style="width:2.2rem">${n}★</span>
      <div class="progress flex-grow-1" style="height:8px"><div class="progress-bar" style="width:${pct}%;background:var(--blue)"></div></div>
      <span style="width:1.5rem" class="text-end">${c}</span></div>`;
    })
    .join("");

  const list = getFilteredReviews();
  const shown = list.slice(0, reviewPage * REVIEW_PAGE_SIZE);
  document.getElementById("reviewList").innerHTML = shown.length
    ? shown
        .map(
          (r) => `
    <article class="card-soft p-4 mb-3">
      <div class="d-flex justify-content-between flex-wrap">
        <div><strong>${escapeHtml(r.name)}</strong> ${isVerifiedPurchase(r.name) ? '<span class="badge text-bg-success small">Verified purchase</span>' : ""} <span class="stars ms-2">${starString(r.rating)}</span></div>
        <span class="small text-muted-2">${new Date(r.date).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}</span>
      </div>
      ${r.dish ? dishPill(r.dish) : ""}
      <p class="mb-0 mt-1">${escapeHtml(r.text)}</p>
      ${r.photo ? `<button type="button" class="review-photo-btn p-0 border-0 bg-transparent mt-2" data-photo="${r.id}" aria-label="View photo from ${escapeHtml(r.name)}"><img src="${r.photo}" alt="Photo from ${escapeHtml(r.name)}" style="width:100%;max-height:220px;object-fit:cover;border-radius:8px;border:1px solid #d7cbbd;cursor:zoom-in"></button>` : ""}
      ${r.reply ? `<div class="card-soft p-2 mt-2 small"><strong>Café:</strong> ${escapeHtml(r.reply)}</div>` : ""}
      <div class="d-flex align-items-center gap-2 mt-2">
        <button class="btn btn-outline-secondary btn-sm" data-helpful="${r.id}">👍 Helpful <span class="helpful-count">${helpfulCount(r.id)}</span></button>
      </div>
    </article>`,
        )
        .join("")
    : `<p class="text-muted-2">No reviews match this filter yet.</p>`;
  const loadBtn = document.getElementById("loadMoreReviews");
  if (loadBtn) loadBtn.classList.toggle("d-none", shown.length >= list.length);
}

document.addEventListener("DOMContentLoaded", () => {
  const dish = document.getElementById("vDish");
  MENU.forEach((m) =>
    dish.insertAdjacentHTML(
      "beforeend",
      `<option>${escapeHtml(m.name)}</option>`,
    ),
  );
  const member = Store.get("member", null);
  if (member) document.getElementById("vName").value = member.name;

  document
    .getElementById("reviewFilter")
    .addEventListener("change", () => {
      reviewPage = 1;
      renderReviews();
    });
  const search = document.getElementById("reviewSearch");
  if (search)
    search.addEventListener("input", () => {
      reviewPage = 1;
      renderReviews();
    });
  const sort = document.getElementById("reviewSort");
  if (sort)
    sort.addEventListener("change", () => {
      reviewPage = 1;
      renderReviews();
    });
  const loadBtn = document.getElementById("loadMoreReviews");
  if (loadBtn)
    loadBtn.addEventListener("click", () => {
      reviewPage += 1;
      renderReviews();
    });

  document.getElementById("reviewList").addEventListener("click", (e) => {
    const photoBtn = e.target.closest("[data-photo]");
    if (photoBtn) {
      const rev = getReviews().find((r) => r.id === photoBtn.dataset.photo);
      if (rev && rev.photo) openReviewPhoto(rev.photo, `${rev.name} — ${rev.dish || "their order"}`);
      return;
    }
    const b = e.target.closest("[data-helpful]");
    if (!b) return;
    toggleHelpful(b.dataset.helpful);
    renderReviews();
  });

  const photoPreview = document.getElementById("vPhotoPreview");
  const photoRemove = document.getElementById("vPhotoRemove");
  const showPhotoPreview = (dataUrl) => {
    reviewPhoto = dataUrl;
    if (photoPreview) {
      photoPreview.src = dataUrl;
      photoPreview.classList.remove("d-none");
    }
    if (photoRemove) photoRemove.classList.remove("d-none");
    toast("Photo added to your review.");
  };
  const setPhoto = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("Please choose an image file.", "warning");
      return;
    }
    compressImage(file)
      .then(showPhotoPreview)
      .catch(() => toast("That file doesn't look like an image.", "warning"));
  };
  const fileInput = document.getElementById("vPhotoFile");
  if (fileInput) fileInput.addEventListener("change", () => setPhoto(fileInput.files[0]));
  if (photoRemove) {
    photoRemove.addEventListener("click", () => {
      reviewPhoto = null;
      if (fileInput) fileInput.value = "";
      if (photoPreview) {
        photoPreview.removeAttribute("src");
        photoPreview.classList.add("d-none");
      }
      photoRemove.classList.add("d-none");
    });
  }

  // ---- In-page camera for food photos ----
  const camModalEl = document.getElementById("reviewCamModal");
  const camVideo = document.getElementById("reviewCamVideo");
  const camCountdown = document.getElementById("reviewCamCountdown");
  const camStatus = document.getElementById("reviewCamStatus");
  const camShoot = document.getElementById("reviewCamShoot");
  const camRetake = document.getElementById("reviewCamRetake");
  const camUse = document.getElementById("reviewCamUse");
  let camStream = null;
  let camShot = null;

  const stopReviewCam = () => {
    if (camStream) {
      camStream.getTracks().forEach((t) => t.stop());
      camStream = null;
    }
    if (camVideo) camVideo.srcObject = null;
    camShot = null;
    if (camRetake) camRetake.disabled = true;
    if (camUse) camUse.disabled = true;
    if (camShoot) camShoot.disabled = false;
  };
  const showLive = (on) => {
    if (camVideo) camVideo.classList.toggle("d-none", !on);
    const shot = document.getElementById("reviewCamShot");
    if (shot) shot.classList.toggle("d-none", on);
  };

  const startReviewCam = async () => {
    if (!camModalEl || !window.bootstrap) return;
    const m = bootstrap.Modal.getOrCreateInstance(camModalEl);
    if (camStatus) {
      camStatus.textContent = "";
      camStatus.classList.add("d-none");
    }
    showLive(true);
    m.show();
    if (camStream) return;
    try {
      camStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 } },
        audio: false,
      });
      camVideo.srcObject = camStream;
    } catch (err) {
      if (camStatus) {
        camStatus.textContent =
          "Camera unavailable or permission denied. Use “Upload photo” instead.";
        camStatus.classList.remove("d-none");
      }
      if (camShoot) camShoot.disabled = true;
    }
  };

  const grabReviewFrame = () => {
    const w = camVideo.videoWidth || 640;
    const h = camVideo.videoHeight || 480;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    ctx.save();
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(camVideo, 0, 0, w, h);
    ctx.restore();
    return c.toDataURL("image/jpeg", 0.85);
  };

  const camBtn = document.getElementById("vPhotoCamBtn");
  if (camBtn) camBtn.addEventListener("click", startReviewCam);

  if (camShoot) {
    camShoot.addEventListener("click", async () => {
      if (!camStream || !camVideo || camVideo.readyState < 2) {
        if (camStatus) {
          camStatus.textContent = "Camera isn't ready yet.";
          camStatus.classList.remove("d-none");
        }
        return;
      }
      camShoot.disabled = true;
      for (let c = 3; c > 0; c--) {
        if (camCountdown) {
          camCountdown.textContent = c;
          camCountdown.classList.remove("d-none");
        }
        await new Promise((r) => setTimeout(r, 700));
      }
      if (camCountdown) {
        camCountdown.textContent = "📸";
        await new Promise((r) => setTimeout(r, 250));
        camCountdown.classList.add("d-none");
      }
      camShot = grabReviewFrame();
      let shot = document.getElementById("reviewCamShot");
      if (!shot) {
        shot = document.createElement("img");
        shot.id = "reviewCamShot";
        shot.alt = "Captured photo";
        shot.style.cssText = "width:100%;display:block;border-radius:8px";
        camVideo.parentElement.appendChild(shot);
      }
      shot.src = camShot;
      showLive(false);
      if (camRetake) camRetake.disabled = false;
      if (camUse) camUse.disabled = false;
    });
  }
  if (camRetake) {
    camRetake.addEventListener("click", () => {
      camShot = null;
      showLive(true);
      camRetake.disabled = true;
      camUse.disabled = true;
      camShoot.disabled = false;
    });
  }
  if (camUse) {
    camUse.addEventListener("click", () => {
      if (!camShot) return;
      showPhotoPreview(camShot);
      stopReviewCam();
      showLive(true);
      if (camModalEl && window.bootstrap) {
        const m = bootstrap.Modal.getInstance(camModalEl);
        if (m) m.hide();
      }
    });
  }
  if (camModalEl) camModalEl.addEventListener("hidden.bs.modal", stopReviewCam);

  document.getElementById("reviewForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const rating = form.querySelector('input[name="rating"]:checked');
    document.getElementById("ratingError").classList.toggle("d-none", !!rating);
    if (!form.checkValidity() || !rating) {
      form.classList.add("was-validated");
      return;
    }

    const list = getReviews();
    list.unshift({
      id: uid("R"),
      name: document.getElementById("vName").value.trim(),
      rating: Number(rating.value),
      dish: dish.value,
      text: document.getElementById("vText").value.trim(),
      photo: reviewPhoto || null,
      date: new Date().toISOString(),
      hidden: false,
      reply: null,
    });
    Store.set("reviews", list);
    reviewPhoto = null;
    form.reset();
    form.classList.remove("was-validated");
    const photoPrev2 = document.getElementById("vPhotoPreview");
    if (photoPrev2) {
      photoPrev2.removeAttribute("src");
      photoPrev2.classList.add("d-none");
    }
    const photoRemove2 = document.getElementById("vPhotoRemove");
    if (photoRemove2) photoRemove2.classList.add("d-none");
    toast("Thank you for your review!");
    reviewPage = 1;
    renderReviews();
  });
  renderReviews();
});