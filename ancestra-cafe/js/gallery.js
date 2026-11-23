/* Our guests photo wall */
function getGallery() {
  return Store.get("galleryPhotos", []);
}
function renderGallery() {
  const grid = document.getElementById("photoGrid");
  if (!grid) return;
  const photos = getGallery().filter((p) => !p.hidden);
  grid.innerHTML = photos.length
    ? photos
        .map(
          (p) =>
            `<div class="col"><div class="photo photo-square" data-photo="${p.id}" style="cursor:zoom-in"><img class="img-cover" src="${p.dataUrl}" alt="${escapeHtml(p.caption || "Guest photo")}"><div class="small text-muted-2 mt-1">${escapeHtml(p.name)}${p.caption ? " · " + escapeHtml(p.caption) : ""}</div></div></div>`,
        )
        .join("")
    : `<div class="col-12"><p class="text-muted-2">No photos yet. Be the first!</p></div>`;
  // lightbox
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
document.addEventListener("DOMContentLoaded", () => {
  renderGallery();
  const form = document.getElementById("photoForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("photoName").value.trim();
    const caption = document.getElementById("photoCaption").value.trim();
    const file = document.getElementById("photoFile").files[0];
    if (!name || !file) {
      toast("Name and photo are required.", "warning");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const photos = getGallery();
      photos.unshift({
        id: uid("PH"),
        name,
        caption,
        dataUrl: reader.result,
        date: new Date().toISOString(),
        hidden: false,
      });
      Store.set("galleryPhotos", photos);
      form.reset();
      toast("Photo shared! Thank you.");
      renderGallery();
    };
    reader.readAsDataURL(file);
  });
});