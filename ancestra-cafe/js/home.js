/* Homepage "right now" picks change by time of day. */
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("homeFavs");
  if (!grid) return;
  const hour = new Date().getHours();
  let ids, title;
  if (hour < 11) {
    ids = ["c1", "c2", "c6", "n4"];
    title = "Morning picks";
  } else if (hour < 15) {
    ids = ["c2", "s1", "sp1", "i6"];
    title = "Afternoon picks";
  } else {
    ids = ["p1", "m1", "m5", "sa1"];
    title = "Evening picks";
  }
  const t = document.getElementById("todayTitle");
  if (t) t.textContent = title;
  const highlights = ids
    .map((id) => MENU.find((m) => m.id === id))
    .filter(Boolean);
  grid.innerHTML = highlights
    .map(
      (m) =>
        `<div class="col"><article class="card-soft hover-lift h-100 overflow-hidden"><div class="menu-tile ${TILE[m.cat]}" aria-hidden="true"><img src="${escapeHtml(CAT_IMAGE ? CAT_IMAGE[m.cat] : m.image)}" alt="" loading="lazy" decoding="async" onerror="this.src='images/menu/placeholder.png';this.parentElement.classList.add('is-placeholder')"><span class="menu-tile-fallback">${m.emoji}</span></div><div class="p-3"><h3 class="h5 mb-1">${escapeHtml(m.name)}</h3><p class="small text-muted-2">${escapeHtml(m.desc)}</p><div class="d-flex justify-content-between align-items-center"><span class="price">${Peso(m.price)}</span><button class="btn btn-blue btn-sm" data-add="${m.id}">Add</button></div></div></article></div>`,
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
    if (typeof trackRecent === "function") trackRecent(m.id);
  });
});