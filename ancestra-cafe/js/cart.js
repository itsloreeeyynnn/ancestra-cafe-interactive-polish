/* ==========================================================
   Ancestra Cafe – student project ordering demo, voucher application, checkout
   Loaded on every page (after main.js).
   ========================================================== */

function cartMarkup() {
  return `
  <div class="offcanvas offcanvas-end" tabindex="-1" id="cartCanvas" aria-labelledby="cartTitle">
    <div class="offcanvas-header border-bottom">
      <h5 class="offcanvas-title" id="cartTitle"><i class="bi bi-bag me-2"></i>Your Order</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body d-flex flex-column">
      <div id="cartItems" class="flex-grow-1"></div>
      <div id="cartFooter" class="pt-3 border-top">
        <div class="small text-muted-2 mb-1" id="discountProgress"></div>
        <div class="progress mb-2" style="height:6px"><div class="progress-bar" id="discountProgressBar" style="width:0%;background:var(--blue)"></div></div>
        <div id="undoWrap" class="small mb-2 d-none"><button class="btn btn-link btn-sm p-0" id="undoRemoveBtn" type="button">Undo remove</button></div>
        <div class="d-flex gap-2 mb-2">
          <button class="btn btn-outline-blue btn-sm" id="saveCartBtn" type="button">Save cart</button>
          <select class="form-select form-select-sm" id="savedCartSelect"><option value="">Saved carts…</option></select>
          <button class="btn btn-outline-blue btn-sm" id="loadCartBtn" type="button">Load</button>
        </div>
        <label for="voucherInput" class="form-label small mb-1">Promo voucher</label>
        <div class="input-group input-group-sm mb-1">
          <input class="form-control" id="voucherInput" list="voucherList" placeholder="Enter or pick a code" autocomplete="off">
          <datalist id="voucherList"></datalist>
          <button class="btn btn-outline-blue" id="applyVoucherBtn" type="button">Apply</button>
        </div>
        <div class="small mb-2" id="voucherMsg"></div>
        <dl class="row small mb-2">
          <dt class="col-6 fw-normal">Subtotal</dt><dd class="col-6 text-end" id="cartSubtotal">₱0</dd>
          <dt class="col-6 fw-normal text-success">Discount</dt><dd class="col-6 text-end text-success" id="cartDiscount">-₱0</dd>
          <dt class="col-6 fs-5">Total</dt><dd class="col-6 text-end fs-5 fw-bold" id="cartTotal">₱0</dd>
        </dl>
        <div class="d-grid gap-2">
          <button class="btn btn-blue" id="checkoutBtn" type="button">Place Order</button>
          <button class="btn btn-link btn-sm text-danger" id="clearCartBtn" type="button">Clear cart</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="checkoutModal" tabindex="-1" aria-labelledby="checkoutTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <form class="modal-content needs-validation" id="checkoutForm" novalidate>
        <div class="modal-header"><h5 class="modal-title" id="checkoutTitle">Confirm your order</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
        <div class="modal-body">
          <div class="mb-3"><label class="form-label" for="coName">Name</label>
            <input class="form-control" id="coName" required minlength="2"><div class="invalid-feedback">Please enter your name.</div></div>
          <div class="mb-3"><label class="form-label" for="coType">Order type</label>
            <select class="form-select" id="coType"><option>Dine-in</option><option>Pickup</option></select></div>
           <div class="mb-3"><label class="form-label" for="coPickup">Pickup time</label>
             <select class="form-select" id="coPickup"></select></div>
          <div class="mb-3"><label class="form-label" for="coNote">Notes (optional)</label>
            <textarea class="form-control" id="coNote" rows="2" placeholder="Table number, allergies…"></textarea></div>
          <p class="mb-0 fw-semibold">Amount due: <span id="coTotal"></span></p>
          <p class="small text-muted-2 mb-0">Payment is made at the counter.</p>
        </div>
        <div class="modal-footer"><button type="button" class="btn btn-outline-blue" data-bs-dismiss="modal">Back</button>
          <button type="submit" class="btn btn-blue">Confirm order</button></div>
      </form>
    </div>
  </div>

  <div class="modal fade" id="orderDoneModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered"><div class="modal-content text-center p-4">
      <div class="display-4 text-success"><i class="bi bi-check-circle"></i></div>
      <h4 class="mt-2">Order received!</h4>
      <p class="mb-1">Your order number is <span class="code-chip" id="orderNo"></span></p>
      <p class="small text-muted-2" id="orderDoneMsg"></p>
      <div class="d-flex gap-2 justify-content-center flex-wrap">
        <button class="btn btn-outline-blue" id="printReceiptBtn" type="button"><i class="bi bi-printer me-1"></i>Print receipt</button>
        <button class="btn btn-outline-blue" id="reorderBtn" type="button"><i class="bi bi-arrow-repeat me-1"></i>Reorder</button>
        <button class="btn btn-blue" data-bs-dismiss="modal">Done</button>
      </div>
    </div></div>
  </div>

  <div class="modal fade" id="receiptModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered"><div class="modal-content p-4" id="receiptContent">
    </div></div>
  </div>`;
}

const Cart = {
  items() {
    return Store.get("cart", []);
  },
  save(items) {
    Store.set("cart", items);
    this.render();
  },
  count() {
    return this.items().reduce((n, i) => n + i.qty, 0);
  },

  add(item) {
    const items = this.items();
    const found = items.find((i) => i.id === item.id);
    if (found) found.qty += 1;
    else items.push({ ...item, qty: 1 });
    this.save(items);
    toast(`${item.name} added to your order`);
  },
  setQty(id, qty) {
    let items = this.items();
    items = items
      .map((i) => (i.id === id ? { ...i, qty } : i))
      .filter((i) => i.qty > 0);
    this.save(items);
  },
  clear() {
    Store.set("appliedVoucher", null);
    this.save([]);
  },
  removeLine(id) {
    const items = this.items();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const removed = items.splice(idx, 1)[0];
    this._lastRemoved = removed;
    Store.set("cart", items);
    this.render();
    const wrap = document.getElementById("undoWrap");
    if (wrap) wrap.classList.remove("d-none");
    toast(`${removed.name} removed`, "secondary");
  },
  undoRemove() {
    if (!this._lastRemoved) return;
    const items = this.items();
    const found = items.find((i) => i.id === this._lastRemoved.id);
    if (found) found.qty += this._lastRemoved.qty;
    else items.push({ ...this._lastRemoved });
    this._lastRemoved = null;
    Store.set("cart", items);
    this.render();
    const wrap = document.getElementById("undoWrap");
    if (wrap) wrap.classList.add("d-none");
    toast("Restored", "success");
  },
  setNote(id, value, rerender = false) {
    const items = this.items().map((i) =>
      i.id === id ? { ...i, note: value } : i,
    );
    Store.set("cart", items);
    if (rerender) this.render();
  },
  saveCart() {
    const items = this.items();
    if (!items.length) {
      toast("Cart is empty.", "warning");
      return;
    }
    const saved = Store.get("savedCarts", []);
    saved.unshift({ date: new Date().toISOString(), items: items.map((i) => ({ ...i })) });
    Store.set("savedCarts", saved.slice(0, 5));
    toast("Cart saved.", "success");
    this.render();
  },
  loadCart(index) {
    const saved = Store.get("savedCarts", []);
    const c = saved[index];
    if (!c) return;
    Store.set("cart", c.items.map((i) => ({ ...i })));
    this.render();
    toast("Cart loaded.", "success");
  },

  subtotal() {
    return this.items().reduce((s, i) => s + i.price * i.qty, 0);
  },

  /* returns {discount, message, ok} for the currently applied voucher */
  discountInfo() {
    const code = Store.get("appliedVoucher", null);
    if (!code) return { discount: 0 };
    const v = findVoucher(code);
    const myReward = (Store.get("myRewards", []) || []).find(
      (r) => r.code === code && !r.used,
    );
    const sub = this.subtotal();
    if (myReward) {
      const drinks = this.items(); // allow any item
      return {
        discount: myReward.price,
        message: `${myReward.item} reward applied.`,
        ok: true,
        voucher: { code: myReward.code, reward: true },
      };
    }
    if (!v) return { discount: 0 };
    if (v.reward) {
      const drinks = this.items().filter((i) => i.group === "drink");
      if (!drinks.length)
        return {
          discount: 0,
          message:
            "Add a menu drink to your cart to use the loyalty reward.",
          ok: false,
        };
      const freeDrink = drinks.reduce(
        (best, item) => (item.price > best.price ? item : best),
        drinks[0],
      );
      return {
        discount: freeDrink.price,
        message: `One ${freeDrink.name} reward applied.`,
        ok: true,
        voucher: v,
      };
    }
    if (sub < v.min)
      return {
        discount: 0,
        message: `Spend ${Peso(v.min)} or more to use ${v.code}.`,
        ok: false,
      };
    const discount =
      v.type === "pct"
        ? Math.round(sub * v.value) / 100
        : Math.min(v.value, sub);
    return {
      discount,
      message: `${v.code} applied – ${v.desc}.`,
      ok: true,
      voucher: v,
    };
  },
  total() {
    return Math.max(0, this.subtotal() - this.discountInfo().discount);
  },

  applyVoucher(code) {
    const v = findVoucher(code);
    const myReward = (Store.get("myRewards", []) || []).find(
      (r) => r.code === code.trim().toUpperCase() && !r.used,
    );
    const msg = document.getElementById("voucherMsg");
    if (!v && !myReward) {
      msg.className = "small text-danger";
      msg.textContent = "That code isn't valid.";
      return;
    }
    const target = myReward ? { code: myReward.code, reward: true } : v;
    if (myReward) {
      Store.set("appliedVoucher", myReward.code);
      this.render();
      return;
    }
    const used = Store.get("usedVouchers", []);
    if (used.includes(v.code)) {
      msg.className = "small text-danger";
      msg.textContent = "You've already used this voucher.";
      return;
    }
    if (v.reward && !Store.get("claimedVouchers", []).includes(v.code)) {
      msg.className = "small text-danger";
      msg.textContent =
        "Unlock the loyalty reward on the Rewards page first.";
      return;
    }
    if (v.reward && !this.items().some((i) => i.group === "drink")) {
      msg.className = "small text-danger";
      msg.textContent =
        "Add a menu drink to your cart before applying this reward.";
      return;
    }
    const claimed = Store.get("claimedVouchers", []);
    if (!claimed.includes(v.code)) {
      claimed.push(v.code);
      Store.set("claimedVouchers", claimed);
    }
    Store.set("appliedVoucher", v.code);
    this.render();
  },

  init() {
    document.getElementById("applyVoucherBtn").addEventListener("click", () => {
      const val = document.getElementById("voucherInput").value;
      if (val.trim()) this.applyVoucher(val);
    });
    document
      .getElementById("clearCartBtn")
      .addEventListener("click", () => this.clear());
    const undoBtn = document.getElementById("undoRemoveBtn");
    if (undoBtn) undoBtn.addEventListener("click", () => this.undoRemove());
    const saveBtn = document.getElementById("saveCartBtn");
    if (saveBtn) saveBtn.addEventListener("click", () => this.saveCart());
    const loadBtn = document.getElementById("loadCartBtn");
    if (loadBtn)
      loadBtn.addEventListener("click", () => {
        const sel = document.getElementById("savedCartSelect");
        if (sel && sel.value !== "") this.loadCart(Number(sel.value));
      });
    // pickup time slots
    const pickup = document.getElementById("coPickup");
    if (pickup) {
      const now = new Date();
      pickup.innerHTML = `<option value="ASAP">ASAP</option>`;
      for (let i = 1; i <= 8; i++) {
        const t = new Date(now.getTime() + i * 15 * 60000);
        const hh = String(t.getHours()).padStart(2, "0");
        const mm = String(t.getMinutes()).padStart(2, "0");
        pickup.insertAdjacentHTML(
          "beforeend",
          `<option value="${hh}:${mm}">${hh}:${mm}</option>`,
        );
      }
    }
    document.getElementById("checkoutBtn").addEventListener("click", () => {
      if (!this.count()) {
        toast("Your cart is empty.", "warning");
        return;
      }
      const member = Store.get("member", null);
      if (member) document.getElementById("coName").value = member.name;
      document.getElementById("coTotal").textContent = Peso(this.total());
      bootstrap.Offcanvas.getInstance(
        document.getElementById("cartCanvas"),
      )?.hide();
      new bootstrap.Modal(document.getElementById("checkoutModal")).show();
    });
    document.getElementById("cartItems").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-act]");
      if (!btn) return;
      const id = btn.dataset.id;
      const item = this.items().find((i) => i.id === id);
      if (!item) return;
      if (btn.dataset.act === "remove") {
        this.removeLine(id);
        return;
      }
      this.setQty(id, btn.dataset.act === "plus" ? item.qty + 1 : item.qty - 1);
    });
    document.getElementById("cartItems").addEventListener("change", (e) => {
      const input = e.target.closest(".qty-input");
      if (input) {
        const id = input.dataset.id;
        const qty = Math.max(1, parseInt(input.value, 10) || 1);
        this.setQty(id, qty);
        return;
      }
      const note = e.target.closest(".cart-note");
      if (note) {
        this.setNote(note.dataset.id, note.value);
      }
    });
    document.getElementById("cartItems").addEventListener("input", (e) => {
      const note = e.target.closest(".cart-note");
      if (note) this.setNote(note.dataset.id, note.value, false);
    });
    document
      .getElementById("checkoutForm")
      .addEventListener("submit", (e) => this.checkout(e));
    const printBtn = document.getElementById("printReceiptBtn");
    if (printBtn)
      printBtn.addEventListener("click", () => {
        const content = document.getElementById("receiptContent");
        if (!content) return;
        const w = window.open("", "_blank");
        w.document.write(
          `<html><head><title>Receipt</title><link rel="stylesheet" href="css/style.css"></head><body style="padding:2rem;font-family:Arial">${content.innerHTML}</body></html>`,
        );
        w.document.close();
        w.focus();
        w.print();
      });
    const reorderBtn = document.getElementById("reorderBtn");
    if (reorderBtn)
      reorderBtn.addEventListener("click", () => {
        const last = Store.get("lastOrder", null);
        if (!last) return toast("No previous order.", "warning");
        Store.set(
          "cart",
          last.items.map((i) => ({ ...i, qty: i.qty })),
        );
        this.render();
        bootstrap.Modal.getInstance(
          document.getElementById("orderDoneModal"),
        )?.hide();
        toast("Items added to cart.", "success");
      });
    this.render();
  },

  render() {
    const items = this.items();
    const badge = document.getElementById("cartBadge");
    if (badge) badge.textContent = this.count();
    const list = document.getElementById("cartItems");
    if (!list) return;

    list.innerHTML = items.length
      ? items
          .map(
            (i) => `
      <div class="cart-line" data-id="${i.id}">
        <div class="d-flex align-items-center gap-2">
          <div class="fs-3" aria-hidden="true">${i.emoji}</div>
          <div class="flex-grow-1"><div class="fw-semibold">${escapeHtml(i.name)}</div>
            <div class="small text-muted-2">${Peso(i.price)} each</div></div>
          <div class="d-flex align-items-center gap-1">
            <button class="btn btn-outline-secondary qty-btn" data-act="minus" data-id="${i.id}" aria-label="Decrease quantity">−</button>
            <input type="number" min="1" class="form-control form-control-sm qty-input" data-id="${i.id}" value="${i.qty}" style="width:52px">
            <button class="btn btn-outline-secondary qty-btn" data-act="plus" data-id="${i.id}" aria-label="Increase quantity">+</button>
            <button class="btn btn-outline-danger qty-btn" data-act="remove" data-id="${i.id}" aria-label="Remove item">✕</button>
          </div>
          <div class="text-end" style="min-width:64px">${Peso(i.price * i.qty)}</div>
        </div>
        <input type="text" class="form-control form-control-sm mt-2 cart-note" data-id="${i.id}" placeholder="Notes: milk, sweetness, ice…" value="${escapeHtml(i.note || "")}">
      </div>`,
          )
          .join("")
      : `<div class="text-center text-muted-2 py-5"><i class="bi bi-cup-hot display-4"></i><p class="mt-2">Your cart is empty.<br><a href="menu.html">Browse the menu</a></p></div>`;

    // voucher suggestions = claimed & unused
    const used = Store.get("usedVouchers", []);
    const claimed = Store.get("claimedVouchers", []).filter((c) => !used.includes(c));
    const rewardCodes = (Store.get("myRewards", []) || [])
      .filter((r) => !r.used)
      .map((r) => r.code);
    document.getElementById("voucherList").innerHTML = [...new Set([...claimed, ...rewardCodes])]
      .map((c) => `<option value="${c}">`)
      .join("");

    const info = this.discountInfo();
    const msg = document.getElementById("voucherMsg");
    if (info.message) {
      msg.className = "small " + (info.ok ? "text-success" : "text-danger");
      msg.textContent = info.message;
    } else msg.textContent = "";
    document.getElementById("cartSubtotal").textContent = Peso(this.subtotal());
    document.getElementById("cartDiscount").textContent =
      "-" + Peso(info.discount || 0);
    document.getElementById("cartTotal").textContent = Peso(this.total());
    document.getElementById("checkoutBtn").disabled = !items.length;

    const undoWrap = document.getElementById("undoWrap");
    if (undoWrap) undoWrap.classList.toggle("d-none", !this._lastRemoved);

    // saved carts dropdown
    const sel = document.getElementById("savedCartSelect");
    if (sel) {
      const saved = Store.get("savedCarts", []);
      sel.innerHTML =
        `<option value="">Saved carts (${saved.length})</option>` +
        saved
          .map(
            (c, i) =>
              `<option value="${i}">${new Date(c.date).toLocaleDateString()} · ${c.items.length} items</option>`,
          )
          .join("");
    }

    // discount progress toward next voucher threshold
    const sub = this.subtotal();
    const thresholds = [400, 600].filter((t) => sub < t);
    const next = thresholds.length ? Math.min(...thresholds) : null;
    const prog = document.getElementById("discountProgress");
    const bar = document.getElementById("discountProgressBar");
    if (next) {
      const pct = Math.min(100, (sub / next) * 100);
      if (prog)
        prog.textContent = `Spend ${Peso(next - sub)} more to unlock a voucher at ${Peso(next)}.`;
      if (bar) bar.style.width = pct + "%";
    } else {
      if (prog) prog.textContent = sub ? "All voucher thresholds unlocked." : "";
      if (bar) bar.style.width = sub ? "100%" : "0%";
    }
  },

  checkout(e) {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    const info = this.discountInfo();
    const order = {
      id: uid("ORD"),
      name: document.getElementById("coName").value.trim(),
      type: document.getElementById("coType").value,
      note: document.getElementById("coNote").value.trim(),
      items: this.items().map((i) => ({
        name: i.name,
        qty: i.qty,
        price: i.price,
        group: i.group,
        note: i.note || "",
      })),
      pickup: document.getElementById("coPickup")
        ? document.getElementById("coPickup").value
        : "ASAP",
      subtotal: this.subtotal(),
      discount: info.discount || 0,
      voucher: info.ok ? info.voucher.code : null,
      total: this.total(),
      status: "Pending",
      date: new Date().toISOString(),
    };
    const orders = Store.get("orders", []);
    orders.unshift(order);
    Store.set("orders", orders);

    if (order.voucher) {
      const used = Store.get("usedVouchers", []);
      used.push(order.voucher);
      Store.set("usedVouchers", used);
      Store.set(
        "claimedVouchers",
        Store.get("claimedVouchers", []).filter((c) => c !== order.voucher),
      );
      const rewards = Store.get("myRewards", []);
      const r = rewards.find((x) => x.code === order.voucher);
      if (r) {
        r.used = true;
        Store.set("myRewards", rewards);
      }
    }
    const pendingCount = Store.get("orders", []).filter(
      (o) => o.status === "Pending" || o.status === "Preparing",
    ).length;
    const waitMin = (pendingCount + 1) * 8;
    let stampMsg =
      "Thank you for your order. Payment is made at the counter.";
    const member = normalizeMember(Store.get("member", null));
    if (member) Store.set("member", member);
    const earned = member ? pointsForAmount(order.total) : 0;
    if (member) {
      order.memberPhone = member.phone;
      order.pointsEarned = earned;
      if (earned > 0) {
        member.points += earned;
        member.lifetimePoints = (member.lifetimePoints || 0) + earned;
        Store.set("member", member);
        if (typeof addPointsHistory === "function")
          addPointsHistory(`Order ${order.id}`, earned);
        stampMsg += ` Rewards: +${earned} point${earned === 1 ? "" : "s"} earned (${member.points} total).`;
      } else {
        stampMsg += ` Rewards: no points earned on this order (spend ₱${POINTS_DIVISOR}+ to earn).`;
      }
    } else {
      stampMsg +=
        " Join the rewards card to earn points on your orders.";
    }
    Store.set("orders", orders);
    Store.set("lastOrder", order);
    Store.set("appliedVoucher", null);
    this.save([]);
    // build receipt
    const rc = document.getElementById("receiptContent");
    if (rc) {
      rc.innerHTML = `<h4 class="mb-1">Ancestra Cafe — Receipt</h4>
        <p class="small text-muted-2 mb-3">${new Date(order.date).toLocaleString()} · ${order.id}</p>
        <p class="mb-1"><strong>${escapeHtml(order.name)}</strong> · ${escapeHtml(order.type)} · Pickup: ${escapeHtml(order.pickup)}</p>
        <hr>
        ${order.items
          .map(
            (i) =>
              `<div class="d-flex justify-content-between"><span>${i.qty}× ${escapeHtml(i.name)}${i.note ? ` <span class="small text-muted-2">(${escapeHtml(i.note)})</span>` : ""}</span><span>${Peso(i.price * i.qty)}</span></div>`,
          )
          .join("")}
        <hr>
        <div class="d-flex justify-content-between"><span>Subtotal</span><span>${Peso(order.subtotal)}</span></div>
        <div class="d-flex justify-content-between text-success"><span>Discount</span><span>-${Peso(order.discount)}</span></div>
        <div class="d-flex justify-content-between fw-bold"><span>Total</span><span>${Peso(order.total)}</span></div>
        <p class="small text-muted-2 mt-3 mb-0">Payment at the counter. Thank you!</p>`;
    }
    form.classList.remove("was-validated");
    form.reset();
    bootstrap.Modal.getInstance(
      document.getElementById("checkoutModal"),
    ).hide();
    document.getElementById("orderNo").textContent = order.id;
    stampMsg += ` Estimated wait: ~${waitMin} min.`;
    document.getElementById("orderDoneMsg").textContent = stampMsg;
    new bootstrap.Modal(document.getElementById("orderDoneModal")).show();
    if (typeof window.onOrderPlaced === "function") window.onOrderPlaced();
  },
};
