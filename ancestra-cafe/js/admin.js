/* Admin dashboard: reservations, orders, reviews (front-end demo only) */
const ADMIN_PASSWORD = "admin123"; // demo only – a real site would verify on a server
function downloadCsv(rows, filename) {
  const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const blob = new Blob([rows.map((r) => r.map(q).join(",")).join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
const fmtDate = (iso) =>
  new Date(iso).toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
const RES_BADGE = {
  Pending: "warning text-dark",
  Confirmed: "success",
  Cancelled: "secondary",
};
const ORD_BADGE = {
  Pending: "warning text-dark",
  Preparing: "info text-dark",
  Ready: "primary",
  Completed: "success",
  Cancelled: "secondary",
};

function showDash(on) {
  document.getElementById("loginView").classList.toggle("d-none", on);
  document.getElementById("dashView").classList.toggle("d-none", !on);
  if (on) renderAll();
}

function renderOverview(res, orders, reviews) {
  const revenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((s, o) => s + o.total, 0);
  const visible = reviews.filter((r) => !r.hidden);
  const avg = visible.length
    ? (visible.reduce((s, r) => s + r.rating, 0) / visible.length).toFixed(1)
    : "–";
  const cards = [
    ["bi-calendar-check", "Reservations", res.length],
    ["bi-bag", "Orders", orders.length],
    ["bi-cash-coin", "Order total", Peso(revenue)],
    ["bi-star", "Avg rating", avg],
  ];
  document.getElementById("statCards").innerHTML = cards
    .map(
      ([icon, label, val]) => `
    <div class="col"><div class="card-soft p-3 h-100"><i class="bi ${icon} text-muted-2"></i>
      <div class="stat-num mt-1">${val}</div><div class="small text-muted-2">${label}</div></div></div>`,
    )
    .join("");

  const statuses = Object.keys(ORD_BADGE);
  document.getElementById("statusBars").innerHTML = orders.length
    ? statuses
        .map((s) => {
          const c = orders.filter((o) => o.status === s).length;
          return `<div class="d-flex align-items-center gap-2 mb-2"><span style="width:90px" class="small">${s}</span>
      <div class="progress flex-grow-1" style="height:10px"><div class="progress-bar" style="width:${(c / orders.length) * 100}%;background:var(--blue)"></div></div>
      <span class="small" style="width:24px">${c}</span></div>`;
        })
        .join("")
    : '<p class="text-muted-2 mb-0">No orders yet.</p>';

  const totals = {};
  orders
    .filter((o) => o.status !== "Cancelled")
    .forEach((o) =>
      o.items.forEach((i) => (totals[i.name] = (totals[i.name] || 0) + i.qty)),
    );
  const top = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  document.getElementById("topItems").innerHTML = top.length
    ? top
        .map(
          ([n, q]) =>
            `<li>${escapeHtml(n)} <span class="text-muted-2">– ${q} sold</span></li>`,
        )
        .join("")
    : '<li class="list-unstyled text-muted-2">No sales yet.</li>';
}

function drawCharts(res, orders) {
  // status chart
  const c1 = document.getElementById("statusChart");
  if (c1) {
    const ctx = c1.getContext("2d");
    ctx.clearRect(0, 0, c1.width, c1.height);
    const statuses = Object.keys(ORD_BADGE);
    const counts = statuses.map((s) => orders.filter((o) => o.status === s).length);
    const max = Math.max(1, ...counts);
    const barW = c1.width / statuses.length - 8;
    statuses.forEach((s, i) => {
      const h = (counts[i] / max) * (c1.height - 30);
      const x = i * (barW + 8) + 4;
      const y = c1.height - h - 20;
      ctx.fillStyle = "#284484";
      ctx.fillRect(x, y, barW, h);
      ctx.fillStyle = "#284484";
      ctx.font = "10px Arial";
      ctx.fillText(s, x, c1.height - 6);
    });
  }
  // top items chart
  const c2 = document.getElementById("topChart");
  if (c2) {
    const ctx = c2.getContext("2d");
    ctx.clearRect(0, 0, c2.width, c2.height);
    const totals = {};
    orders
      .filter((o) => o.status !== "Cancelled")
      .forEach((o) => o.items.forEach((i) => (totals[i.name] = (totals[i.name] || 0) + i.qty)));
    const top = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const max = Math.max(1, ...top.map((t) => t[1]));
    const barH = c2.height / Math.max(1, top.length) - 6;
    top.forEach(([name, q], i) => {
      const w = (q / max) * (c2.width - 90);
      const y = i * (barH + 6);
      ctx.fillStyle = "#284484";
      ctx.fillRect(90, y, w, barH);
      ctx.fillStyle = "#284484";
      ctx.font = "10px Arial";
      ctx.fillText(name.slice(0, 12), 4, y + barH / 2 + 3);
    });
  }
}

function renderAll() {
  const resAll = Store.get("reservations", []);
  const ordersAll = Store.get("orders", []);
  const reviewsAll = getReviews();
  const resQ = (document.getElementById("resSearch")?.value || "").toLowerCase();
  const ordQ = (document.getElementById("ordSearch")?.value || "").toLowerCase();
  const revQ = (document.getElementById("revSearch")?.value || "").toLowerCase();
  const menuQ = (document.getElementById("menuSearch")?.value || "").toLowerCase();
  const res = resQ
    ? resAll.filter((r) =>
        (r.name + r.phone + r.id + r.date + r.occasion).toLowerCase().includes(resQ),
      )
    : resAll;
  const orders = ordQ
    ? ordersAll.filter((o) =>
        (o.name + o.id + o.items.map((i) => i.name).join(" ")).toLowerCase().includes(ordQ),
      )
    : ordersAll;
  const reviews = revQ
    ? reviewsAll.filter((r) =>
        (r.name + r.text + (r.dish || "")).toLowerCase().includes(revQ),
      )
    : reviewsAll;

  document.getElementById("resBadge").textContent = resAll.filter(
    (r) => r.status === "Pending",
  ).length;
  document.getElementById("ordBadge").textContent = ordersAll.filter(
    (o) => o.status === "Pending",
  ).length;
  renderOverview(resAll, ordersAll, reviewsAll);

  document.getElementById("resBody").innerHTML = res.length
    ? res
        .map(
          (r) => `
    <tr><td><span class="code-chip">${r.id}</span></td>
      <td>${escapeHtml(r.name)}<div class="small text-muted-2">${escapeHtml(r.phone)}</div></td>
      <td>${escapeHtml(r.date)}<div class="small text-muted-2">${escapeHtml(r.timeLabel)}</div></td>
      <td>${r.guests}</td>
      <td class="small">${escapeHtml(r.occasion)}${r.notes ? " – " + escapeHtml(r.notes) : ""}</td>
      <td><span class="badge text-bg-${RES_BADGE[r.status]}">${r.status}</span></td>
      <td class="text-end text-nowrap">
        <button class="btn btn-sm btn-success" data-res="${r.id}" data-set="Confirmed" title="Confirm"><i class="bi bi-check-lg"></i></button>
        <button class="btn btn-sm btn-outline-secondary" data-res="${r.id}" data-set="Cancelled" title="Cancel"><i class="bi bi-x-lg"></i></button>
        <button class="btn btn-sm btn-outline-danger" data-res-del="${r.id}" title="Delete"><i class="bi bi-trash"></i></button></td></tr>`,
        )
        .join("")
    : '<tr><td colspan="7" class="text-center text-muted-2 py-4">No reservations yet.</td></tr>';

  document.getElementById("ordBody").innerHTML = orders.length
    ? orders
        .map(
          (o) => `
    <tr><td><span class="code-chip">${o.id}</span><div class="small text-muted-2">${fmtDate(o.date)}</div></td>
      <td>${escapeHtml(o.name)}<div class="small text-muted-2">${o.type}</div></td>
      <td class="small">${o.items.map((i) => `${i.qty}× ${escapeHtml(i.name)}`).join("<br>")}${o.note ? `<div class="text-muted-2 fst-italic">“${escapeHtml(o.note)}”</div>` : ""}</td>
      <td>${Peso(o.total)}${o.voucher ? `<div class="small text-success">${o.voucher}</div>` : ""}${o.pointsEarned ? `<div class="small text-muted-2">+${o.pointsEarned} pts</div>` : ""}</td>
      <td><select class="form-select form-select-sm" data-ord="${o.id}" aria-label="Order status">
        ${Object.keys(ORD_BADGE)
          .map(
            (s) => `<option ${s === o.status ? "selected" : ""}>${s}</option>`,
          )
          .join("")}</select></td>
      <td class="text-end"><button class="btn btn-sm btn-outline-danger" data-ord-del="${o.id}" title="Delete"><i class="bi bi-trash"></i></button></td></tr>`,
        )
        .join("")
    : '<tr><td colspan="6" class="text-center text-muted-2 py-4">No orders yet.</td></tr>';

  document.getElementById("revBody").innerHTML =
    reviews
      .map(
        (r) => `
    <tr><td>${escapeHtml(r.name)}<div class="small text-muted-2">${fmtDate(r.date)}</div></td>
      <td class="stars text-nowrap">${starString(r.rating)}</td>
      <td class="small">${escapeHtml(r.text)}${r.reply ? `<div class="text-muted-2 fst-italic mt-1">Reply: ${escapeHtml(r.reply)}</div>` : ""}<div class="mt-1"><input class="form-control form-control-sm" placeholder="Reply…" data-rev-reply="${r.id}"></div></td>
      <td><span class="badge text-bg-${r.hidden ? "secondary" : "success"}">${r.hidden ? "Hidden" : "Visible"}</span></td>
      <td class="text-end text-nowrap">
        <button class="btn btn-sm btn-outline-secondary" data-rev-toggle="${r.id}" title="${r.hidden ? "Show" : "Hide"}"><i class="bi ${r.hidden ? "bi-eye" : "bi-eye-slash"}"></i></button>
        <button class="btn btn-sm btn-outline-danger" data-rev-del="${r.id}" title="Delete"><i class="bi bi-trash"></i></button></td></tr>`,
      )
      .join("") ||
    '<tr><td colspan="5" class="text-center text-muted-2 py-4">No reviews.</td></tr>';

  // menu availability
  const disabled = Store.get("disabledItems", []);
  const menuItems = MENU.filter((m) =>
    !menuQ || (m.name + m.cat).toLowerCase().includes(menuQ),
  );
  document.getElementById("menuBody").innerHTML = menuItems
    .map(
      (m) => `
    <tr><td>${escapeHtml(m.name)}</td><td>${escapeHtml(m.cat)}</td><td>${Peso(m.price)}</td>
      <td><div class="form-check form-switch"><input class="form-check-input" type="checkbox" data-menu-toggle="${m.id}" ${disabled.includes(m.id) ? "" : "checked"}></div></td></tr>`,
    )
    .join("") ||
    '<tr><td colspan="4" class="text-center text-muted-2 py-4">No items.</td></tr>';

  // gallery
  const photos = Store.get("galleryPhotos", []);
  document.getElementById("galleryBody").innerHTML = photos.length
    ? photos
        .map(
          (p) => `
    <tr><td><img src="${p.dataUrl}" style="width:48px;height:48px;object-fit:cover;border-radius:6px" alt=""></td>
      <td>${escapeHtml(p.name)}</td><td class="small">${escapeHtml(p.caption || "")}</td>
      <td><span class="badge text-bg-${p.hidden ? "secondary" : "success"}">${p.hidden ? "Hidden" : "Visible"}</span></td>
      <td class="text-end text-nowrap">
        <button class="btn btn-sm btn-outline-secondary" data-gal-toggle="${p.id}"><i class="bi ${p.hidden ? "bi-eye" : "bi-eye-slash"}"></i></button>
        <button class="btn btn-sm btn-outline-danger" data-gal-del="${p.id}"><i class="bi bi-trash"></i></button></td></tr>`,
        )
        .join("")
    : '<tr><td colspan="5" class="text-center text-muted-2 py-4">No photos.</td></tr>';

  drawCharts(resAll, ordersAll);
}

document.addEventListener("DOMContentLoaded", () => {
  let authed = false;
  try {
    authed = sessionStorage.getItem("pc_admin") === "1";
  } catch (e) {
    /* ignore */
  }
  showDash(authed);
  ["resSearch", "ordSearch", "revSearch", "menuSearch"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => renderAll());
  });

  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("adminPass");
    if (input.value === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem("pc_admin", "1");
      } catch (err) {
        /* ignore */
      }
      input.classList.remove("is-invalid");
      input.value = "";
      showDash(true);
    } else input.classList.add("is-invalid");
  });
  document.getElementById("logoutBtn").addEventListener("click", () => {
    try {
      sessionStorage.removeItem("pc_admin");
    } catch (e) {
      /* ignore */
    }
    showDash(false);
  });

  document.getElementById("dashView").addEventListener("click", (e) => {
    const set = e.target.closest("[data-set]");
    if (set) {
      const all = Store.get("reservations", []);
      const r = all.find((x) => x.id === set.dataset.res);
      if (r) {
        r.status = set.dataset.set;
        Store.set("reservations", all);
        renderAll();
        toast(`Reservation ${r.status.toLowerCase()}.`);
      }
      return;
    }
    const rd = e.target.closest("[data-res-del]");
    if (rd && confirm("Delete this reservation?")) {
      Store.set(
        "reservations",
        Store.get("reservations", []).filter((x) => x.id !== rd.dataset.resDel),
      );
      renderAll();
      return;
    }
    const od = e.target.closest("[data-ord-del]");
    if (od && confirm("Delete this order?")) {
      const allOrders = Store.get("orders", []);
      const o = allOrders.find((x) => x.id === od.dataset.ordDel);
      if (o && !o.pointsReversed && o.pointsEarned && o.memberPhone) {
        const m = normalizeMember(Store.get("member", null));
        if (m && m.phone === o.memberPhone) {
          m.points = Math.max(0, m.points - o.pointsEarned);
          Store.set("member", m);
        }
        o.pointsReversed = true;
      }
      Store.set(
        "orders",
        allOrders.filter((x) => x.id !== od.dataset.ordDel),
      );
      renderAll();
      return;
    }
    const rt = e.target.closest("[data-rev-toggle]");
    if (rt) {
      const list = getReviews();
      const r = list.find((x) => x.id === rt.dataset.revToggle);
      if (r) {
        r.hidden = !r.hidden;
        Store.set("reviews", list);
        renderAll();
      }
      return;
    }
    const rv = e.target.closest("[data-rev-del]");
    if (rv && confirm("Delete this review?")) {
      Store.set(
        "reviews",
        getReviews().filter((x) => x.id !== rv.dataset.revDel),
      );
      renderAll();
      return;
    }
    const gt = e.target.closest("[data-gal-toggle]");
    if (gt) {
      const photos = Store.get("galleryPhotos", []);
      const p = photos.find((x) => x.id === gt.dataset.galToggle);
      if (p) {
        p.hidden = !p.hidden;
        Store.set("galleryPhotos", photos);
        renderAll();
      }
      return;
    }
    const gd = e.target.closest("[data-gal-del]");
    if (gd && confirm("Delete this photo?")) {
      Store.set(
        "galleryPhotos",
        Store.get("galleryPhotos", []).filter((x) => x.id !== gd.dataset.galDel),
      );
      renderAll();
      return;
    }
  });

  document.getElementById("dashView").addEventListener("change", (e) => {
    const mt = e.target.closest("[data-menu-toggle]");
    if (mt) {
      const disabled = Store.get("disabledItems", []);
      const id = mt.dataset.menuToggle;
      if (mt.checked) {
        const idx = disabled.indexOf(id);
        if (idx !== -1) disabled.splice(idx, 1);
      } else {
        if (!disabled.includes(id)) disabled.push(id);
      }
      Store.set("disabledItems", disabled);
      renderAll();
      return;
    }
    const rr = e.target.closest("[data-rev-reply]");
    if (rr) {
      const reviews = getReviews();
      const r = reviews.find((x) => x.id === rr.dataset.revReply);
      if (r) {
        r.reply = rr.value;
        Store.set("reviews", reviews);
      }
      return;
    }
    const sel = e.target.closest("[data-ord]");
    if (!sel) return;
    const orders = Store.get("orders", []);
    const o = orders.find((x) => x.id === sel.dataset.ord);
    if (o) {
      const prev = o.status;
      o.status = sel.value;
      if (sel.value === "Ready" && "Notification" in window && Notification.permission === "granted") {
        new Notification("Order ready", { body: `${o.id} for ${o.name} is ready for pickup.` });
      }
      if (
        sel.value === "Cancelled" &&
        prev !== "Cancelled" &&
        !o.pointsReversed &&
        o.pointsEarned &&
        o.memberPhone
      ) {
        const m = normalizeMember(Store.get("member", null));
        if (m && m.phone === o.memberPhone) {
          m.points = Math.max(0, m.points - o.pointsEarned);
          Store.set("member", m);
        }
        o.pointsReversed = true;
      }
      Store.set("orders", orders);
      renderAll();
      toast(`Order ${o.id} → ${o.status}`);
    }
  });

  document.getElementById("exportBtn").addEventListener("click", () => {
    const orders = Store.get("orders", []);
    if (!orders.length) return toast("No orders to export.", "warning");
    const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = [
      ["Order", "Date", "Customer", "Type", "Items", "Total", "Points Earned", "Status"],
      ...orders.map((o) => [
        o.id,
        o.date,
        o.name,
        o.type,
        o.items.map((i) => `${i.qty}x ${i.name}`).join("; "),
        o.total,
        o.pointsEarned || 0,
        o.status,
      ]),
    ];
    const blob = new Blob([rows.map((r) => r.map(q).join(",")).join("\n")], {
      type: "text/csv",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ancestra-orders.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  });
  const exportResBtn = document.getElementById("exportResBtn");
  if (exportResBtn)
    exportResBtn.addEventListener("click", () => {
      const rows = [
        ["Ref", "Name", "Phone", "Date", "Time", "Guests", "Status"],
        ...Store.get("reservations", []).map((r) => [r.id, r.name, r.phone, r.date, r.timeLabel, r.guests, r.status]),
      ];
      downloadCsv(rows, "ancestra-reservations.csv");
    });
  const exportRevBtn = document.getElementById("exportRevBtn");
  if (exportRevBtn)
    exportRevBtn.addEventListener("click", () => {
      const rows = [
        ["Name", "Rating", "Dish", "Review", "Date", "Hidden"],
        ...getReviews().map((r) => [r.name, r.rating, r.dish || "", r.text, r.date, r.hidden]),
      ];
      downloadCsv(rows, "ancestra-reviews.csv");
    });

  document.getElementById("resetDemo").addEventListener("click", () => {
    if (
      !confirm(
        "Clear all reservations, orders, reviews, loyalty card and vouchers saved in this browser?",
      )
    )
      return;
    [
      "reservations",
      "myReservations",
      "orders",
      "reviews",
      "member",
      "claimedVouchers",
      "usedVouchers",
      "appliedVoucher",
      "cart",
      "favs",
    ].forEach((k) => {
      try {
        localStorage.removeItem("ancestra_" + k);
      } catch (e) {
        /* ignore */
      }
    });
    Cart.render();
    renderAll();
    toast("Data cleared.", "secondary");
  });
});
