/* Customer reviews: list, summary, submission, sort/search, helpful, pagination */
const REVIEW_PAGE_SIZE = 5;
let reviewPage = 1;

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
      ${r.dish ? `<span class="tag-pill my-2 d-inline-block">${escapeHtml(r.dish)}</span>` : ""}
      <p class="mb-0 mt-1">${escapeHtml(r.text)}</p>
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
    const b = e.target.closest("[data-helpful]");
    if (!b) return;
    toggleHelpful(b.dataset.helpful);
    renderReviews();
  });

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
      date: new Date().toISOString(),
      hidden: false,
      reply: null,
    });
    Store.set("reviews", list);
    form.reset();
    form.classList.remove("was-validated");
    toast("Thank you for your review!");
    reviewPage = 1;
    renderReviews();
  });
  renderReviews();
});