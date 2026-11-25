/* Our guests photo wall + photobooth */
function getGallery() {
  return Store.get("galleryPhotos", []);
}

const FRAMES = [
  { id: "none", name: "None", emoji: "⬜" },
  { id: "polaroid", name: "Polaroid", emoji: "🖼️" },
  { id: "ancestra", name: "Ancestra", emoji: "☕" },
  { id: "vintage", name: "Vintage", emoji: "📷" },
  { id: "aesthetic", name: "Aesthetic", emoji: "🌸" },
  { id: "film", name: "Film", emoji: "🎞️" },
  { id: "floral", name: "Floral", emoji: "🌺" },
  { id: "gold", name: "Gold", emoji: "✨" },
  { id: "pastel", name: "Pastel", emoji: "🎨" },
];

let boothStream = null;
let slots = [];
let stripPhotos = [];
let retakeIndex = -1;
let selectedSlots = new Set();
let capturedDataUrl = null;
let selectedFrame = "none";
let pendingPhoto = null;
let selectedFilter = "none";
let stripMode = "single";
let stripCount = 1;
let stripRunning = false;
let stripFinalized = false;
let previewToken = 0;

const FILTERS = {
  none: { css: "none", canvas: "none" },
  grayscale: { css: "grayscale(1)", canvas: "grayscale(1)" },
  sepia: { css: "sepia(1)", canvas: "sepia(1)" },
  warm: { css: "sepia(0.35) saturate(1.4) brightness(1.05)", canvas: "sepia(0.35) saturate(1.4) brightness(1.05)" },
  cool: { css: "saturate(0.8) hue-rotate(20deg) brightness(1.05)", canvas: "saturate(0.8) hue-rotate(20deg) brightness(1.05)" },
  bright: { css: "brightness(1.2) contrast(1.05)", canvas: "brightness(1.2) contrast(1.05)" },
  contrast: { css: "contrast(1.35)", canvas: "contrast(1.35)" },
  vintage: { css: "sepia(0.5) contrast(1.1) brightness(0.9)", canvas: "sepia(0.5) contrast(1.1) brightness(0.9)" },
};

function ensurePhotoViewer() {
  if (document.querySelector(".photo-viewer")) return;
  const dialog = document.createElement("dialog");
  dialog.className = "photo-viewer";
  dialog.setAttribute("aria-label", "Photo preview");
  dialog.innerHTML = `<button class="photo-viewer-close" type="button" aria-label="Close photo preview">×</button><figure><img alt=""><figcaption></figcaption></figure>`;
  document.body.appendChild(dialog);
  const preview = dialog.querySelector("img");
  const caption = dialog.querySelector("figcaption");
  const close = () => {
    if (dialog.open) dialog.close();
  };
  dialog.querySelector(".photo-viewer-close").addEventListener("click", close);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });
  dialog.addEventListener("close", () => {
    preview.removeAttribute("src");
  });
}

function renderGallery() {
  const grid = document.getElementById("photoGrid");
  if (!grid) return;
  ensurePhotoViewer();
  const photos = getGallery().filter((p) => !p.hidden);
  grid.innerHTML = photos.length
    ? photos
        .map(
          (p) =>
            `<div class="col"><div class="photo photo-square" data-photo="${p.id}" style="cursor:zoom-in"><img class="img-cover" src="${p.dataUrl}" alt="${escapeHtml(p.caption || "Guest photo")}"><div class="small text-muted-2 mt-1">${escapeHtml(p.name)}${p.caption ? " · " + escapeHtml(p.caption) : ""}</div></div></div>`,
        )
        .join("")
    : `<div class="col-12"><p class="text-muted-2">No photos yet. Be the first!</p></div>`;
  grid.querySelectorAll("[data-photo]").forEach((el) => {
    el.addEventListener("click", () => {
      const p = getGallery().find((x) => x.id === el.dataset.photo);
      if (!p) return;
      const dialog = document.querySelector(".photo-viewer");
      if (dialog) {
        const img = dialog.querySelector("img");
        const cap = dialog.querySelector("figcaption");
        img.src = p.dataUrl;
        img.alt = p.caption || "Guest photo";
        cap.textContent = `${p.name}${p.caption ? " — " + p.caption : ""}`;
        if (typeof dialog.showModal === "function") dialog.showModal();
      }
    });
  });
}

function savePhoto(dataUrl, name, caption) {
  const photos = getGallery();
  photos.unshift({
    id: uid("PH"),
    name,
    caption,
    dataUrl,
    date: new Date().toISOString(),
    hidden: false,
  });
  Store.set("galleryPhotos", photos);
  renderGallery();
}

/* ---------- Frame drawing ---------- */
function drawFrameOverlay(ctx, w, h, frame, name, caption) {
  const pad = Math.max(8, Math.round(w * 0.04));
  const txt = (caption || name || "").slice(0, 30);
  const dateStr = new Date().toLocaleDateString();
  const brand = "Ancestra Cafe";
  const drawBrand = (y, color, size) => {
    ctx.fillStyle = color;
    ctx.font = `bold ${size}px Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(brand, w / 2, y);
  };
  const drawDate = (y, color, size) => {
    ctx.fillStyle = color;
    ctx.font = `${size}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(dateStr, w / 2, y);
  };
  switch (frame) {
    case "polaroid": {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, pad * 1.6);
      ctx.fillRect(0, 0, pad, h);
      ctx.fillRect(w - pad, 0, pad, h);
      ctx.fillRect(0, h - pad * 2.2, w, pad * 2.2);
      ctx.strokeStyle = "rgba(0,0,0,0.12)";
      ctx.lineWidth = 1;
      ctx.strokeRect(pad, pad * 1.6, w - pad * 2, h - pad * 3.8);
      // washi tape corners
      ctx.fillStyle = "rgba(200,180,166,0.55)";
      ctx.save(); ctx.translate(pad * 1.2, pad * 0.8); ctx.rotate(-0.35); ctx.fillRect(0, 0, pad * 2.2, pad * 0.7); ctx.restore();
      ctx.save(); ctx.translate(w - pad * 3.4, pad * 0.8); ctx.rotate(0.35); ctx.fillRect(0, 0, pad * 2.2, pad * 0.7); ctx.restore();
      drawBrand(pad * 0.8, "#284484", Math.round(w * 0.04));
      drawDate(h - pad * 0.9, "rgba(119,115,110,0.8)", Math.round(w * 0.026));
      // caption
      ctx.fillStyle = "#284484";
      ctx.font = `italic ${Math.round(w * 0.038)}px Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (txt) ctx.fillText(txt, w / 2, h - pad * 1.6);
      break;
    }
    case "ancestra": {
      const b = Math.round(w * 0.08);
      ctx.fillStyle = "#284484";
      ctx.fillRect(0, 0, w, b);
      ctx.fillRect(0, h - b, w, b);
      ctx.fillRect(0, 0, b, h);
      ctx.fillRect(w - b, 0, b, h);
      drawBrand(b * 0.55, "#f7f1e8", Math.round(w * 0.05));
      drawDate(h - b * 0.5, "#f7f1e8", Math.round(w * 0.026));
      break;
    }
    case "vintage": {
      const leak = ctx.createLinearGradient(0, 0, w * 0.6, h * 0.4);
      leak.addColorStop(0, "rgba(255,180,90,0.25)");
      leak.addColorStop(1, "rgba(255,180,90,0)");
      ctx.fillStyle = leak;
      ctx.fillRect(0, 0, w, h);
      const grd = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.8);
      grd.addColorStop(0, "rgba(0,0,0,0)");
      grd.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#0f0f0f";
      ctx.lineWidth = Math.round(w * 0.03);
      ctx.strokeRect(0, 0, w, h);
      ctx.fillStyle = "#f7f1e8";
      const hole = Math.max(4, Math.round(w * 0.016));
      const step = hole * 3;
      for (let y = step; y < h - step; y += step) {
        ctx.fillRect(Math.round(w * 0.005), y, hole, hole);
        ctx.fillRect(w - Math.round(w * 0.005) - hole, y, hole, hole);
      }
      for (let i = 0; i < Math.round(w * h * 0.002); i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.08})`;
        ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
      }
      // top brand band
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(hole * 2, hole * 1.5, w - hole * 4, hole * 2.2);
      drawBrand(hole * 2.6, "rgba(247,241,232,0.95)", Math.round(w * 0.034));
      drawDate(h - hole * 1.6, "rgba(255,120,60,0.9)", Math.round(w * 0.028));
      break;
    }
    case "aesthetic": {
      const b = Math.round(w * 0.06);
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#f7d9e3");
      grad.addColorStop(0.5, "#f3e9dc");
      grad.addColorStop(1, "#dce7f3");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, b);
      ctx.fillRect(0, h - b, w, b);
      ctx.fillRect(0, 0, b, h);
      ctx.fillRect(w - b, 0, b, h);
      ctx.strokeStyle = "rgba(40,68,132,0.22)";
      ctx.lineWidth = 1;
      ctx.strokeRect(b, b, w - b * 2, h - b * 2);
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      [[b * 0.5, b * 0.5], [w - b * 0.5, b * 0.5], [b * 0.5, h - b * 0.5], [w - b * 0.5, h - b * 0.5], [w * 0.5, b * 0.4]].forEach(([sx, sy]) => {
        ctx.beginPath(); ctx.arc(sx, sy, Math.max(2, w * 0.006), 0, Math.PI * 2); ctx.fill();
      });
      ctx.font = `${Math.round(w * 0.032)}px serif`;
      ctx.fillStyle = "rgba(247,241,232,0.95)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✿", w * 0.15, b * 0.55);
      ctx.fillText("✿", w * 0.85, b * 0.55);
      ctx.fillText("✿", w * 0.15, h - b * 0.55);
      ctx.fillText("✿", w * 0.85, h - b * 0.55);
      drawBrand(b * 0.55, "#284484", Math.round(w * 0.042));
      drawDate(h - b * 0.55, "#284484", Math.round(w * 0.026));
      break;
    }
    case "film": {
      const b = Math.round(w * 0.05);
      // dark film base
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, w, b * 2.4);
      ctx.fillRect(0, h - b * 2.4, w, b * 2.4);
      ctx.fillRect(0, 0, b * 1.2, h);
      ctx.fillRect(w - b * 1.2, 0, b * 1.2, h);
      // sprocket holes
      ctx.fillStyle = "#f7f1e8";
      const holeW = Math.round(w * 0.018);
      const holeH = Math.round(w * 0.012);
      const step = holeW * 2.2;
      for (let x = step; x < w - step; x += step) {
        ctx.fillRect(x, b * 0.6, holeW, holeH);
        ctx.fillRect(x, h - b * 1.4, holeW, holeH);
      }
      // top/bottom bands
      ctx.fillStyle = "#f7f1e8";
      ctx.fillRect(b * 1.2, b * 0.3, w - b * 2.4, b * 1.8);
      ctx.fillRect(b * 1.2, h - b * 2.1, w - b * 2.4, b * 1.8);
      drawBrand(b * 1.2, "#1a1a1a", Math.round(w * 0.04));
      drawDate(h - b * 1.2, "#1a1a1a", Math.round(w * 0.024));
      break;
    }
    case "floral": {
      const b = Math.round(w * 0.07);
      // pastel border
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#fbcfe8");
      g.addColorStop(1, "#bfdbfe");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, b);
      ctx.fillRect(0, h - b, w, b);
      ctx.fillRect(0, 0, b, h);
      ctx.fillRect(w - b, 0, b, h);
      // floral icons
      ctx.font = `${Math.round(w * 0.04)}px serif`;
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const icons = ["❀", "✿", "❁", "❀", "✿", "❁", "❀", "✿"];
      // top
      for (let i = 0; i < 4; i++) ctx.fillText(icons[i], (w / 5) * (i + 1), b * 0.5);
      // bottom
      for (let i = 0; i < 4; i++) ctx.fillText(icons[i + 4], (w / 5) * (i + 1), h - b * 0.5);
      // sides
      for (let i = 0; i < 3; i++) ctx.fillText("❀", b * 0.5, (h / 4) * (i + 1));
      for (let i = 0; i < 3; i++) ctx.fillText("❀", w - b * 0.5, (h / 4) * (i + 1));
      drawBrand(b * 0.55, "#ffffff", Math.round(w * 0.042));
      drawDate(h - b * 0.55, "#ffffff", Math.round(w * 0.026));
      break;
    }
    case "gold": {
      const b = Math.round(w * 0.06);
      // gold gradient border
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#fde68a");
      g.addColorStop(0.5, "#f59e0b");
      g.addColorStop(1, "#fde68a");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, b);
      ctx.fillRect(0, h - b, w, b);
      ctx.fillRect(0, 0, b, h);
      ctx.fillRect(w - b, 0, b, h);
      // inner dark line
      ctx.strokeStyle = "rgba(120,53,15,0.5)";
      ctx.lineWidth = 1;
      ctx.strokeRect(b, b, w - b * 2, h - b * 2);
      // corner ornaments
      ctx.fillStyle = "rgba(120,53,15,0.7)";
      ctx.font = `${Math.round(w * 0.03)}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✦", b * 0.5, b * 0.5);
      ctx.fillText("✦", w - b * 0.5, b * 0.5);
      ctx.fillText("✦", b * 0.5, h - b * 0.5);
      ctx.fillText("✦", w - b * 0.5, h - b * 0.5);
      drawBrand(b * 0.55, "#78350f", Math.round(w * 0.042));
      drawDate(h - b * 0.55, "#78350f", Math.round(w * 0.026));
      break;
    }
    case "pastel": {
      const b = Math.round(w * 0.04);
      // soft pastel gradient border
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#fde2e4");
      g.addColorStop(0.33, "#e0e7ff");
      g.addColorStop(0.66, "#dcfce7");
      g.addColorStop(1, "#fef9c3");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, b);
      ctx.fillRect(0, h - b, w, b);
      ctx.fillRect(0, 0, b, h);
      ctx.fillRect(w - b, 0, b, h);
      // inner white bands
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillRect(b, b, w - b * 2, b * 1.6);
      ctx.fillRect(b, h - b * 2.6, w - b * 2, b * 1.6);
      // sparkles
      ctx.fillStyle = "rgba(40,68,132,0.4)";
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.arc(b * 0.5 + (w - b) * (i / 7), b * 0.5, Math.max(2, w * 0.005), 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(b * 0.5 + (w - b) * (i / 7), h - b * 0.5, Math.max(2, w * 0.005), 0, Math.PI * 2);
        ctx.fill();
      }
      drawBrand(b * 1.8, "#284484", Math.round(w * 0.042));
      drawDate(h - b * 1.8, "#284484", Math.round(w * 0.026));
      break;
    }
    default:
      break;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
}

function applyVideoFilter() {
  const video = document.getElementById("boothVideo");
  if (!video) return;
  const css = FILTERS[selectedFilter]?.css || "none";
  video.style.filter = css === "none" ? "" : css;
}

/* The stage box must always equal the active media element's box exactly —
   otherwise the black stage shows as a band around the video or composite.
   The stage's aspect-ratio is derived from real intrinsic dimensions:
   the composited canvas when a strip/photo is shown, the camera frame while
   live, and the video's rendered box before metadata arrives. */
function syncBoothStage() {
  const stage = document.getElementById("boothStage");
  if (!stage) return;
  const video = document.getElementById("boothVideo");
  const canvas = document.getElementById("boothCanvas");
  let w = 0;
  let h = 0;
  if (canvas && !canvas.classList.contains("d-none") && canvas.width && canvas.height) {
    w = canvas.width;
    h = canvas.height;
  } else if (video && video.videoWidth && video.videoHeight) {
    w = video.videoWidth;
    h = video.videoHeight;
  } else if (video && video.offsetWidth && video.offsetHeight) {
    // Before metadata (or with no camera): use the video's rendered box.
    w = video.offsetWidth;
    h = video.offsetHeight;
  }
  if (w > 0 && h > 0) stage.style.aspectRatio = `${w} / ${h}`;
  if (video && video.videoWidth && video.videoHeight) updateOverlay();
}

function updateOverlay() {
  const video = document.getElementById("boothVideo");
  const overlay = document.getElementById("boothOverlay");
  if (!video || !overlay || !video.videoWidth) return;
  overlay.width = video.videoWidth;
  overlay.height = video.videoHeight;
  const ctx = overlay.getContext("2d");
  ctx.clearRect(0, 0, overlay.width, overlay.height);
  ctx.save();
  ctx.translate(overlay.width, 0);
  ctx.scale(-1, 1);
  drawFrameOverlay(
    ctx,
    overlay.width,
    overlay.height,
    selectedFrame,
    (document.getElementById("boothName").value || "").trim(),
    (document.getElementById("boothCaption").value || "").trim(),
  );
  ctx.restore();
}

/* ---------- Camera ---------- */
async function startBoothCamera() {
  const status = document.getElementById("boothStatus");
  const video = document.getElementById("boothVideo");
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("unsupported");
    }
    boothStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false,
    });
    video.srcObject = boothStream;
    await video.play();
    if (status) status.textContent = "";
    applyVideoFilter();
    updateOverlay();
  } catch (e) {
    if (status)
      status.textContent =
        "Camera unavailable or permission denied. You can still upload a photo file.";
    const capBtn = document.getElementById("captureBtn");
    if (capBtn) capBtn.disabled = true;
  }
}

function stopBoothCamera() {
  if (boothStream) {
    boothStream.getTracks().forEach((t) => t.stop());
    boothStream = null;
  }
  const video = document.getElementById("boothVideo");
  if (video) video.srcObject = null;
}

async function renderComposite() {
  if (!stripPhotos.length) return;
  const canvas = document.getElementById("boothCanvas");
  const images = await Promise.all(stripPhotos.map(loadImage));
  const w = images[0].width;
  const h = images[0].height;
  const gap = 0;
  const border = 0;
  const count = images.length;
  canvas.width = w;
  canvas.height = count * h;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let y = border;
  images.forEach((img) => {
    const filters = [];
    const cf = FILTERS[selectedFilter]?.canvas;
    if (cf && cf !== "none") filters.push(cf);
    if (selectedFrame === "vintage") filters.push("sepia(0.7) contrast(1.05) brightness(0.95)");
    ctx.filter = filters.length ? filters.join(" ") : "none";
    ctx.drawImage(img, border, y, w, h);
    ctx.filter = "none";
    y += h + gap;
  });

  // apply frame overlay to whole strip canvas
  const name = (document.getElementById("boothName").value || "").trim();
  const caption = (document.getElementById("boothCaption").value || "").trim();
  drawFrameOverlay(ctx, canvas.width, canvas.height, selectedFrame, name, caption);

  capturedDataUrl = canvas.toDataURL("image/png");
  const useBtn = document.getElementById("usePhotoBtn");
  if (useBtn) useBtn.disabled = false;
  const dlBtn = document.getElementById("downloadBtn");
  if (dlBtn) dlBtn.disabled = false;
}

async function runCountdown() {
  const countdownEl = document.getElementById("boothCountdown");
  if (countdownEl) {
    for (let c = 3; c > 0; c--) {
      countdownEl.textContent = c;
      countdownEl.classList.remove("d-none");
      await delay(800);
      if (!stripRunning && c > 1) return false;
    }
    countdownEl.textContent = "📸";
    await delay(300);
    countdownEl.classList.add("d-none");
  }
  return true;
}

function grabFrame(video) {
  const w = video.videoWidth || 640;
  const h = video.videoHeight || 480;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  ctx.save();
  ctx.translate(w, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, w, h);
  ctx.restore();
  return c.toDataURL("image/png");
}

function setCaptureButtonState(running) {
  const capBtn = document.getElementById("captureBtn");
  if (!capBtn) return;
  if (running) {
    capBtn.innerHTML = '<i class="bi bi-stop-fill"></i> Stop';
    capBtn.classList.remove("btn-blue");
    capBtn.classList.add("btn-danger");
  } else {
    capBtn.innerHTML = '<i class="bi bi-camera-fill"></i> Capture';
    capBtn.classList.remove("btn-danger");
    capBtn.classList.add("btn-blue");
  }
}

function addSlot(dataUrl) {
  if (retakeIndex >= 0 && retakeIndex < slots.length) {
    const idx = retakeIndex;
    slots[idx] = dataUrl;
    retakeIndex = -1;
    selectedSlots = new Set(slots.map((_, i) => i));
    renderSlots();
    updateBuildBtn();
    return true;
  }
  if (slots.length >= stripCount) return false;
  slots.push(dataUrl);
  selectedSlots = new Set(slots.map((_, i) => i));
  renderSlots();
  updateBuildBtn();
  return true;
}

async function captureSlot() {
  const video = document.getElementById("boothVideo");

  if (stripMode === "strip") {
    if (stripRunning) {
      stripRunning = false;
      setCaptureButtonState(false);
      return;
    }
    stripRunning = true;
    setCaptureButtonState(true);
    while (stripRunning && slots.length < stripCount) {
      const ok = await runCountdown();
      if (!ok || !stripRunning) break;
      addSlot(grabFrame(video));
      if (slots.length >= stripCount) break;
      await delay(500);
    }
    stripRunning = false;
    setCaptureButtonState(false);
    if (slots.length >= stripCount) {
      toast(`${stripCount} photos taken — tap the ones you want in the strip, then tap Done.`);
    } else {
      toast("Now tap the photos you want in the strip, then tap Done.");
    }
    return;
  }

  // single mode
  stripRunning = true;
  const ok = await runCountdown();
  stripRunning = false;
  if (!ok) return;
  const dataUrl = grabFrame(video);
  slots = [dataUrl];
  stripPhotos = [dataUrl];
  selectedSlots = new Set([0]);
  renderSlots();
  updateBuildBtn();
  await buildSingle();
}

function renderSlots() {
  const grid = document.getElementById("slotGrid");
  if (!grid) return;
  grid.innerHTML = slots
    .map(
      (src, i) => `
    <div class="position-relative" style="width:72px">
      <img src="${src}" alt="Shot ${i + 1}" data-idx="${i}" class="slot-img" style="width:72px;height:72px;object-fit:cover;border-radius:6px;border:2px solid ${selectedSlots.has(i) ? "#284484" : "#d7cbbd"};cursor:pointer">
      <input type="checkbox" class="form-check-input position-absolute top-0 start-0 m-1 slot-check" data-idx="${i}" ${selectedSlots.has(i) ? "checked" : ""} aria-label="Include shot ${i + 1}">
      <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 p-0 px-1 slot-remove" data-idx="${i}" style="font-size:.7rem;line-height:1" aria-label="Remove shot ${i + 1}">×</button>
      <button type="button" class="btn btn-sm btn-secondary position-absolute bottom-0 end-0 p-0 px-1 slot-retake" data-idx="${i}" style="font-size:.7rem;line-height:1" aria-label="Retake shot ${i + 1}">↻</button>
    </div>`,
    )
    .join("");

  const syncSelection = (i, on) => {
    if (on) selectedSlots.add(i);
    else selectedSlots.delete(i);
    const img = grid.querySelector(`img[data-idx="${i}"]`);
    if (img) img.style.borderColor = on ? "#284484" : "#d7cbbd";
    updateBuildBtn();
  };

  grid.querySelectorAll(".slot-check").forEach((cb) => {
    cb.addEventListener("change", (e) => {
      syncSelection(Number(e.target.dataset.idx), e.target.checked);
    });
  });

  grid.querySelectorAll("img.slot-img").forEach((img) => {
    img.addEventListener("click", (e) => {
      const i = Number(e.target.dataset.idx);
      const on = !selectedSlots.has(i);
      const cb = grid.querySelector(`.slot-check[data-idx="${i}"]`);
      if (cb) cb.checked = on;
      syncSelection(i, on);
    });
  });
  grid.querySelectorAll(".slot-remove").forEach((b) => {
    b.addEventListener("click", (e) => {
      const i = Number(e.target.dataset.idx);
      slots.splice(i, 1);
      selectedSlots = new Set(slots.map((_, idx) => idx));
      renderSlots();
      updateBuildBtn();
    });
  });
  grid.querySelectorAll(".slot-retake").forEach((b) => {
    b.addEventListener("click", (e) => {
      const i = Number(e.target.dataset.idx);
      retakeIndex = i;
      toast("Capture a new photo to replace this shot.");
    });
  });
}

function updateBuildBtn() {
  const btn = document.getElementById("buildBtn");
  const wrap = document.getElementById("stripPreviewWrap");
  const editBtn = document.getElementById("editBtn");
  const showPreview = stripMode === "strip" && slots.length > 0 && !stripFinalized;
  if (wrap) {
    wrap.classList.toggle("d-none", !showPreview);
    if (showPreview) renderStripPreview();
  }
  if (editBtn) {
    editBtn.classList.toggle("d-none", !(stripMode === "strip" && stripFinalized));
  }
  if (!btn) return;
  if (stripMode === "single" || stripFinalized) {
    btn.classList.add("d-none");
    return;
  }
  btn.classList.remove("d-none");
  const n = selectedSlots.size;
  btn.disabled = n < 3 || n > stripCount;
}

function chosenShots() {
  return [...selectedSlots].sort((a, b) => a - b).map((i) => slots[i]).filter(Boolean);
}

async function renderStripPreview() {
  const canvas = document.getElementById("stripPreview");
  if (!canvas || stripFinalized || stripMode !== "strip") return;
  const chosen = chosenShots();
  if (!chosen.length) return;
  const token = ++previewToken;
  const images = await Promise.all(chosen.map(loadImage));
  if (token !== previewToken) return;
  const w = images[0].width;
  const h = images[0].height;
  canvas.width = w;
  canvas.height = images.length * h;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let y = 0;
  images.forEach((img) => {
    const filters = [];
    const cf = FILTERS[selectedFilter]?.canvas;
    if (cf && cf !== "none") filters.push(cf);
    if (selectedFrame === "vintage") filters.push("sepia(0.7) contrast(1.05) brightness(0.95)");
    ctx.filter = filters.length ? filters.join(" ") : "none";
    ctx.drawImage(img, 0, y, w, h);
    ctx.filter = "none";
    y += h;
  });
  const name = (document.getElementById("boothName")?.value || "").trim();
  const caption = (document.getElementById("boothCaption")?.value || "").trim();
  drawFrameOverlay(ctx, canvas.width, canvas.height, selectedFrame, name, caption);
}

function backToEdit() {
  stripFinalized = false;
  capturedDataUrl = null;
  const video = document.getElementById("boothVideo");
  const canvas = document.getElementById("boothCanvas");
  const overlay = document.getElementById("boothOverlay");
  if (video) video.classList.remove("d-none");
  if (canvas) canvas.classList.add("d-none");
  if (overlay) overlay.classList.remove("d-none");
  syncBoothStage();
  const useBtn = document.getElementById("usePhotoBtn");
  const dlBtn = document.getElementById("downloadBtn");
  if (useBtn) useBtn.disabled = true;
  if (dlBtn) dlBtn.disabled = true;
  updateBuildBtn();
}

async function buildStrip() {
  const chosen = [...selectedSlots]
    .sort((a, b) => a - b)
    .map((i) => slots[i])
    .filter(Boolean);
  if (stripMode === "single") {
    if (chosen.length !== 1) {
      toast("Select exactly 1 photo for a single shot.", "warning");
      return;
    }
  } else if (chosen.length < 3 || chosen.length > stripCount) {
    toast(`Select between 3 and ${stripCount} photos for the strip.`, "warning");
    return;
  }
  stripPhotos = chosen;
  const video = document.getElementById("boothVideo");
  const overlay = document.getElementById("boothOverlay");
  const canvas = document.getElementById("boothCanvas");
  if (video) video.classList.add("d-none");
  if (overlay) overlay.classList.add("d-none");
  if (canvas) canvas.classList.remove("d-none");
  await renderComposite();
  syncBoothStage();
  stripFinalized = true;
  const wrap = document.getElementById("stripPreviewWrap");
  if (wrap) wrap.classList.add("d-none");
  const doneBtn = document.getElementById("buildBtn");
  if (doneBtn) doneBtn.classList.add("d-none");
  const editBtn = document.getElementById("editBtn");
  if (editBtn) editBtn.classList.remove("d-none");
  const useBtn = document.getElementById("usePhotoBtn");
  const dlBtn = document.getElementById("downloadBtn");
  if (useBtn) useBtn.disabled = false;
  if (dlBtn) dlBtn.disabled = false;
  toast("Strip ready.");
}

async function buildSingle() {
  const video = document.getElementById("boothVideo");
  const overlay = document.getElementById("boothOverlay");
  const canvas = document.getElementById("boothCanvas");
  if (video) video.classList.add("d-none");
  if (overlay) overlay.classList.add("d-none");
  if (canvas) canvas.classList.remove("d-none");
  await renderComposite();
  syncBoothStage();
  stripFinalized = true;
  const useBtn = document.getElementById("usePhotoBtn");
  const dlBtn = document.getElementById("downloadBtn");
  if (useBtn) useBtn.disabled = false;
  if (dlBtn) dlBtn.disabled = false;
  const buildBtn = document.getElementById("buildBtn");
  if (buildBtn) buildBtn.disabled = true;
  toast("Photo ready.");
}

function startOverBooth() {
  slots = [];
  selectedSlots = new Set();
  retakeIndex = -1;
  capturedDataUrl = null;
  stripFinalized = false;
  const video = document.getElementById("boothVideo");
  const canvas = document.getElementById("boothCanvas");
  const overlay = document.getElementById("boothOverlay");
  if (video) video.classList.remove("d-none");
  if (canvas) canvas.classList.add("d-none");
  if (overlay) overlay.classList.remove("d-none");
  syncBoothStage();
  updateOverlay();
  applyVideoFilter();
  renderSlots();
  updateBuildBtn();
  const useBtn = document.getElementById("usePhotoBtn");
  const dlBtn = document.getElementById("downloadBtn");
  if (useBtn) useBtn.disabled = true;
  if (dlBtn) dlBtn.disabled = true;
}

function renderFramePicker() {
  const picker = document.getElementById("framePicker");
  if (!picker) return;
  picker.innerHTML = FRAMES.map(
    (f) =>
      `<button type="button" class="btn btn-sm btn-outline-secondary frame-btn ${f.id === selectedFrame ? "active" : ""}" data-frame="${f.id}">${f.emoji} ${f.name}</button>`,
  ).join("");
  picker.querySelectorAll("[data-frame]").forEach((b) => {
    b.addEventListener("click", () => {
      selectedFrame = b.dataset.frame;
      picker.querySelectorAll(".frame-btn").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      updateOverlay();
      if (stripPhotos.length && stripFinalized) renderComposite();
      else updateBuildBtn();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderGallery();

  const form = document.getElementById("photoForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("photoName").value.trim();
      const caption = document.getElementById("photoCaption").value.trim();
      const file = document.getElementById("photoFile").files[0];
      if (!name) {
        toast("Name is required.", "warning");
        return;
      }
      if (pendingPhoto) {
        savePhoto(pendingPhoto, name, caption);
        pendingPhoto = null;
        const prev = document.getElementById("capturedPreview");
        if (prev) prev.classList.add("d-none");
        const img = document.getElementById("capturedImg");
        if (img) img.src = "";
        form.reset();
        toast("Photo shared! Thank you.");
        return;
      }
      if (!file) {
        toast("Photo is required.", "warning");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        savePhoto(reader.result, name, caption);
        form.reset();
        toast("Photo shared! Thank you.");
      };
      reader.readAsDataURL(file);
    });
  }

  const clearBtn = document.getElementById("clearCaptured");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      pendingPhoto = null;
      const prev = document.getElementById("capturedPreview");
      if (prev) prev.classList.add("d-none");
      const img = document.getElementById("capturedImg");
      if (img) img.src = "";
    });
  }

  const openBtn = document.getElementById("openBoothBtn");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      const modalEl = document.getElementById("boothModal");
      if (!modalEl || !window.bootstrap) return;
      const m = bootstrap.Modal.getOrCreateInstance(modalEl);
      m.show();
    });
  }

  const modalEl = document.getElementById("boothModal");
  if (modalEl) {
    modalEl.addEventListener("show.bs.modal", () => {
      slots = [];
      stripPhotos = [];
      capturedDataUrl = null;
      selectedSlots = new Set();
      retakeIndex = -1;
      stripFinalized = false;
      selectedFrame = "none";
      selectedFilter = "none";
      const video = document.getElementById("boothVideo");
      const canvas = document.getElementById("boothCanvas");
      const overlay = document.getElementById("boothOverlay");
      if (video) video.classList.remove("d-none");
      if (canvas) canvas.classList.add("d-none");
      if (overlay) overlay.classList.remove("d-none");
      const capBtn = document.getElementById("captureBtn");
      const useBtn = document.getElementById("usePhotoBtn");
      const dlBtn0 = document.getElementById("downloadBtn");
      const buildBtn = document.getElementById("buildBtn");
      const countdown = document.getElementById("boothCountdown");
      if (capBtn) {
        capBtn.classList.remove("d-none");
        capBtn.disabled = false;
      }
      if (useBtn) useBtn.disabled = true;
      if (dlBtn0) dlBtn0.disabled = true;
      if (buildBtn) buildBtn.disabled = true;
      if (countdown) countdown.classList.add("d-none");
      const filterSel = document.getElementById("filterSelect");
      if (filterSel) filterSel.value = "none";
      const shotSel0 = document.getElementById("shotCount");
      if (shotSel0) {
        shotSel0.value = "1";
        stripMode = "single";
        stripCount = 1;
      }
      stripFinalized = false;
      renderSlots();
      updateBuildBtn();
      renderFramePicker();
      const bn = document.getElementById("boothName");
      const bc = document.getElementById("boothCaption");
      const pn = document.getElementById("photoName");
      const pc = document.getElementById("photoCaption");
      if (bn && pn) bn.value = pn.value;
      if (bc && pc) bc.value = pc.value;
      syncBoothStage();
      startBoothCamera();
    });
    modalEl.addEventListener("hidden.bs.modal", () => {
      stripRunning = false;
      setCaptureButtonState(false);
      stopBoothCamera();
    });
  }

  const captureBtn = document.getElementById("captureBtn");
  if (captureBtn) captureBtn.addEventListener("click", captureSlot);
  const buildBtn = document.getElementById("buildBtn");
  if (buildBtn) buildBtn.addEventListener("click", buildStrip);
  const editBtn = document.getElementById("editBtn");
  if (editBtn) editBtn.addEventListener("click", backToEdit);

  // Keep the stage box locked to the live video's real dimensions.
  const boothVideo = document.getElementById("boothVideo");
  if (boothVideo) {
    boothVideo.addEventListener("loadedmetadata", syncBoothStage);
    boothVideo.addEventListener("resize", syncBoothStage);
  }
  window.addEventListener("resize", syncBoothStage);

  const useBtn = document.getElementById("usePhotoBtn");
  if (useBtn) {
    useBtn.addEventListener("click", () => {
      if (!capturedDataUrl) return;
      pendingPhoto = capturedDataUrl;
      const prev = document.getElementById("capturedPreview");
      const img = document.getElementById("capturedImg");
      if (img) img.src = capturedDataUrl;
      if (prev) prev.classList.remove("d-none");
      const n = (document.getElementById("boothName").value || "").trim();
      const c = (document.getElementById("boothCaption").value || "").trim();
      if (n) document.getElementById("photoName").value = n;
      if (c) document.getElementById("photoCaption").value = c;
      const modalEl = document.getElementById("boothModal");
      if (modalEl && window.bootstrap) {
        const m = bootstrap.Modal.getInstance(modalEl);
        if (m) m.hide();
      }
      toast("Photo ready. Click “Share photo” to post.");
    });
  }

  const downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      if (!capturedDataUrl) return;
      const a = document.createElement("a");
      a.href = capturedDataUrl;
      a.download = "ancestra-photobooth.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast("Photo downloaded.");
    });
  }

  ["boothName", "boothCaption"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", () => {
        updateOverlay();
        if (stripPhotos.length && stripFinalized) renderComposite();
        else updateBuildBtn();
      });
    }
  });

  const shotSel = document.getElementById("shotCount");
  if (shotSel) {
    shotSel.addEventListener("change", () => {
      stripCount = parseInt(shotSel.value, 10) || 1;
      stripMode = stripCount === 1 ? "single" : "strip";
      if (stripMode === "single") {
        if (slots.length > 1) slots = slots.slice(0, 1);
      } else if (slots.length > stripCount) {
        slots = slots.slice(0, stripCount);
      }
      selectedSlots = new Set(slots.map((_, i) => i));
      if (stripMode === "strip" && stripFinalized) backToEdit();
      renderSlots();
      updateBuildBtn();
    });
  }

  const filterSel = document.getElementById("filterSelect");
  if (filterSel) {
    filterSel.addEventListener("change", () => {
      selectedFilter = filterSel.value;
      applyVideoFilter();
      if (stripPhotos.length && stripFinalized) renderComposite();
      else updateBuildBtn();
    });
  }
});