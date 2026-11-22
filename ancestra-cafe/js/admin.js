/* Admin dashboard: reservations, orders, reviews (front-end demo only) */
const ADMIN_PASSWORD = "admin123"; // demo only – a real site would verify on a server
const fmtDate = iso => new Date(iso).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" });
const RES_BADGE = { Pending: "warning text-dark", Confirmed: "success", Cancelled: "secondary" };
const ORD_BADGE = { Pending: "warning text-dark", Preparing: "info text-dark", Ready: "primary", Completed: "success", Cancelled: "secondary" };

function showDash(on) {
  document.getElementById("loginView").classList.toggle("d-none", on);
  document.getElementById("dashView").classList.toggle("d-none", !on);
  if (on) renderAll();
}

function renderOverview(res, orders, reviews) {
  const revenue = orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
  const visible = reviews.filter(r => !r.hidden);
  const avg = visible.length ? (visible.reduce((s, r) => s + r.rating, 0) / visible.length).toFixed(1) : "–";
  const cards = [
    ["bi-calendar-check", "Demo reservations", res.length],
    ["bi-bag", "Demo orders", orders.length],
    ["bi-cash-coin", "Demo order total", Peso(revenue)],
    ["bi-star", "Avg rating", avg]
  ];
  document.getElementById("statCards").innerHTML = cards.map(([icon, label, val]) => `
    <div class="col"><div class="card-soft p-3 h-100"><i class="bi ${icon} text-muted-2"></i>
      <div class="stat-num mt-1">${val}</div><div class="small text-muted-2">${label}</div></div></div>`).join("");

  const statuses = Object.keys(ORD_BADGE);
  document.getElementById("statusBars").innerHTML = orders.length ? statuses.map(s => {
    const c = orders.filter(o => o.status === s).length;
    return `<div class="d-flex align-items-center gap-2 mb-2"><span style="width:90px" class="small">${s}</span>
      <div class="progress flex-grow-1" style="height:10px"><div class="progress-bar" style="width:${c / orders.length * 100}%;background:var(--blue)"></div></div>
      <span class="small" style="width:24px">${c}</span></div>`;
  }).join("") : '<p class="text-muted-2 mb-0">No orders yet.</p>';

  const totals = {};
  orders.filter(o => o.status !== "Cancelled").forEach(o => o.items.forEach(i => totals[i.name] = (totals[i.name] || 0) + i.qty));
  const top = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 5);
  document.getElementById("topItems").innerHTML = top.length
    ? top.map(([n, q]) => `<li>${escapeHtml(n)} <span class="text-muted-2">– ${q} sold</span></li>`).join("")
    : '<li class="list-unstyled text-muted-2">No sales yet.</li>';
}

function renderAll() {
  const res = Store.get("reservations", []);
  const orders = Store.get("orders", []);
  const reviews = getReviews();

  document.getElementById("resBadge").textContent = res.filter(r => r.status === "Pending").length;
  document.getElementById("ordBadge").textContent = orders.filter(o => o.status === "Pending").length;
  renderOverview(res, orders, reviews);

  document.getElementById("resBody").innerHTML = res.length ? res.map(r => `
    <tr><td><span class="code-chip">${r.id}</span></td>
      <td>${escapeHtml(r.name)}<div class="small text-muted-2">${escapeHtml(r.phone)}</div></td>
      <td>${escapeHtml(r.date)}<div class="small text-muted-2">${escapeHtml(r.timeLabel)}</div></td>
      <td>${r.guests}</td>
      <td class="small">${escapeHtml(r.occasion)}${r.notes ? " – " + escapeHtml(r.notes) : ""}</td>
      <td><span class="badge text-bg-${RES_BADGE[r.status]}">${r.status}</span></td>
      <td class="text-end text-nowrap">
        <button class="btn btn-sm btn-success" data-res="${r.id}" data-set="Confirmed" title="Confirm"><i class="bi bi-check-lg"></i></button>
        <button class="btn btn-sm btn-outline-secondary" data-res="${r.id}" data-set="Cancelled" title="Cancel"><i class="bi bi-x-lg"></i></button>
        <button class="btn btn-sm btn-outline-danger" data-res-del="${r.id}" title="Delete"><i class="bi bi-trash"></i></button></td></tr>`).join("")
    : '<tr><td colspan="7" class="text-center text-muted-2 py-4">No reservations yet.</td></tr>';

  document.getElementById("ordBody").innerHTML = orders.length ? orders.map(o => `
    <tr><td><span class="code-chip">${o.id}</span><div class="small text-muted-2">${fmtDate(o.date)}</div></td>
      <td>${escapeHtml(o.name)}<div class="small text-muted-2">${o.type}</div></td>
      <td class="small">${o.items.map(i => `${i.qty}× ${escapeHtml(i.name)}`).join("<br>")}${o.note ? `<div class="text-muted-2 fst-italic">“${escapeHtml(o.note)}”</div>` : ""}</td>
      <td>${Peso(o.total)}${o.voucher ? `<div class="small text-success">${o.voucher}</div>` : ""}</td>
      <td><select class="form-select form-select-sm" data-ord="${o.id}" aria-label="Order status">
        ${Object.keys(ORD_BADGE).map(s => `<option ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}</select></td>
      <td class="text-end"><button class="btn btn-sm btn-outline-danger" data-ord-del="${o.id}" title="Delete"><i class="bi bi-trash"></i></button></td></tr>`).join("")
    : '<tr><td colspan="6" class="text-center text-muted-2 py-4">No orders yet.</td></tr>';

  document.getElementById("revBody").innerHTML = reviews.map(r => `
    <tr><td>${escapeHtml(r.name)}<div class="small text-muted-2">${fmtDate(r.date)}</div></td>
      <td class="stars text-nowrap">${starString(r.rating)}</td>
      <td class="small">${escapeHtml(r.text)}</td>
      <td><span class="badge text-bg-${r.hidden ? "secondary" : "success"}">${r.hidden ? "Hidden" : "Visible"}</span></td>
      <td class="text-end text-nowrap">
        <button class="btn btn-sm btn-outline-secondary" data-rev-toggle="${r.id}" title="${r.hidden ? "Show" : "Hide"}"><i class="bi ${r.hidden ? "bi-eye" : "bi-eye-slash"}"></i></button>
        <button class="btn btn-sm btn-outline-danger" data-rev-del="${r.id}" title="Delete"><i class="bi bi-trash"></i></button></td></tr>`).join("")
    || '<tr><td colspan="5" class="text-center text-muted-2 py-4">No reviews.</td></tr>';
}

document.addEventListener("DOMContentLoaded", () => {
  let authed = false;
  try { authed = sessionStorage.getItem("pc_admin") === "1"; } catch (e) { /* ignore */ }
  showDash(authed);

  document.getElementById("loginForm").addEventListener("submit", e => {
    e.preventDefault();
    const input = document.getElementById("adminPass");
    if (input.value === ADMIN_PASSWORD) {
      try { sessionStorage.setItem("pc_admin", "1"); } catch (err) { /* ignore */ }
      input.classList.remove("is-invalid"); input.value = ""; showDash(true);
    } else input.classList.add("is-invalid");
  });
  document.getElementById("logoutBtn").addEventListener("click", () => {
    try { sessionStorage.removeItem("pc_admin"); } catch (e) { /* ignore */ }
    showDash(false);
  });

  document.getElementById("dashView").addEventListener("click", e => {
    const set = e.target.closest("[data-set]");
    if (set) {
      const all = Store.get("reservations", []); const r = all.find(x => x.id === set.dataset.res);
      if (r) { r.status = set.dataset.set; Store.set("reservations", all); renderAll(); toast(`Reservation ${r.status.toLowerCase()}.`); }
      return;
    }
    const rd = e.target.closest("[data-res-del]");
    if (rd && confirm("Delete this reservation?")) { Store.set("reservations", Store.get("reservations", []).filter(x => x.id !== rd.dataset.resDel)); renderAll(); return; }
    const od = e.target.closest("[data-ord-del]");
    if (od && confirm("Delete this order?")) { Store.set("orders", Store.get("orders", []).filter(x => x.id !== od.dataset.ordDel)); renderAll(); return; }
    const rt = e.target.closest("[data-rev-toggle]");
    if (rt) { const list = getReviews(); const r = list.find(x => x.id === rt.dataset.revToggle); if (r) { r.hidden = !r.hidden; Store.set("reviews", list); renderAll(); } return; }
    const rv = e.target.closest("[data-rev-del]");
    if (rv && confirm("Delete this review?")) { Store.set("reviews", getReviews().filter(x => x.id !== rv.dataset.revDel)); renderAll(); }
  });

  document.getElementById("dashView").addEventListener("change", e => {
    const sel = e.target.closest("[data-ord]"); if (!sel) return;
    const orders = Store.get("orders", []); const o = orders.find(x => x.id === sel.dataset.ord);
    if (o) { o.status = sel.value; Store.set("orders", orders); renderAll(); toast(`Order ${o.id} → ${o.status}`); }
  });

  document.getElementById("exportBtn").addEventListener("click", () => {
    const orders = Store.get("orders", []);
    if (!orders.length) return toast("No orders to export.", "warning");
    const q = v => `"${String(v).replace(/"/g, '""')}"`;
    const rows = [["Order", "Date", "Customer", "Type", "Items", "Total", "Status"],
      ...orders.map(o => [o.id, o.date, o.name, o.type, o.items.map(i => `${i.qty}x ${i.name}`).join("; "), o.total, o.status])];
    const blob = new Blob([rows.map(r => r.map(q).join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "ancestra-demo-orders.csv"; a.click();
    URL.revokeObjectURL(a.href);
  });

  document.getElementById("resetDemo").addEventListener("click", () => {
    if (!confirm("Clear all reservations, orders, reviews, loyalty card and vouchers saved in this browser?")) return;
    ["reservations", "myReservations", "orders", "reviews", "member", "claimedVouchers", "usedVouchers", "appliedVoucher", "cart", "favs"].forEach(k => {
      try { localStorage.removeItem("ancestra_" + k); } catch (e) { /* ignore */ }
    });
    Cart.render(); renderAll(); toast("Demo data cleared.", "secondary");
  });
});
