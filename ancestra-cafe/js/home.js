/* Homepage menu highlights use items and prices from the published Ancestra menu. */
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("homeFavs");
  if (!grid) return;
  const highlights = MENU.filter((m) =>
    ["c1", "c2", "c6", "p1"].includes(m.id),
  );
  grid.innerHTML = highlights
    .map(
      (m) =>
        `<div class="col"><article class="card-soft hover-lift h-100 overflow-hidden"><div class="menu-tile ${TILE[m.cat]}" aria-hidden="true"><img src="${escapeHtml(m.image)}" alt="" loading="lazy" onerror="this.src='images/menu/placeholder.png';this.parentElement.classList.add('is-placeholder')"><span class="menu-tile-fallback">${m.emoji}</span></div><div class="p-3"><h3 class="h5 mb-1">${escapeHtml(m.name)}</h3><p class="small text-muted-2">${escapeHtml(m.desc)}</p><div class="d-flex justify-content-between align-items-center"><span class="price">${Peso(m.price)}</span><button class="btn btn-blue btn-sm" data-add="${m.id}">Add (demo)</button></div></div></article></div>`,
    )
    .join("");
  grid.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]");
    if (!b) return;
    const m = MENU.find((x) => x.id === b.dataset.add);
    Cart.add({
      id: m.id,
      name: m.name,
      price: m.price,
      emoji: m.emoji,
      group: m.group,
    });
  });
});
