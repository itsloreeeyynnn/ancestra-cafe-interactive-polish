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
          <div class="mb-3"><label class="form-label" for="coNote">Notes (optional)</label>
            <textarea class="form-control" id="coNote" rows="2" placeholder="Table number, allergies…"></textarea></div>
          <p class="mb-0 fw-semibold">Amount due: <span id="coTotal"></span></p>
          <p class="small text-muted-2 mb-0">Demo only – payment is paid at the counter.</p>
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
      <button class="btn btn-blue" data-bs-dismiss="modal">Done</button>
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

  subtotal() {
    return this.items().reduce((s, i) => s + i.price * i.qty, 0);
  },

  /* returns {discount, message, ok} for the currently applied voucher */
  discountInfo() {
    const code = Store.get("appliedVoucher", null);
    if (!code) return { discount: 0 };
    const v = findVoucher(code);
    const sub = this.subtotal();
    if (!v) return { discount: 0 };
    if (v.reward) {
      const drinks = this.items().filter((i) => i.group === "drink");
      if (!drinks.length)
        return {
          discount: 0,
          message:
            "Add a menu drink to your demo cart to use the 9-stamp reward.",
          ok: false,
        };
      const freeDrink = drinks.reduce(
        (best, item) => (item.price > best.price ? item : best),
        drinks[0],
      );
      return {
        discount: freeDrink.price,
        message: `One ${freeDrink.name} reward applied (demo).`,
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
    const msg = document.getElementById("voucherMsg");
    if (!v) {
      msg.className = "small text-danger";
      msg.textContent = "That code isn't valid.";
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
        "Unlock the 9-stamp demo loyalty reward on the homepage first.";
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
      this.setQty(id, btn.dataset.act === "plus" ? item.qty + 1 : item.qty - 1);
    });
    document
      .getElementById("checkoutForm")
      .addEventListener("submit", (e) => this.checkout(e));
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
      <div class="cart-line d-flex align-items-center gap-2">
        <div class="fs-3" aria-hidden="true">${i.emoji}</div>
        <div class="flex-grow-1"><div class="fw-semibold">${escapeHtml(i.name)}</div>
          <div class="small text-muted-2">${Peso(i.price)} each</div></div>
        <div class="d-flex align-items-center gap-1">
          <button class="btn btn-outline-secondary qty-btn" data-act="minus" data-id="${i.id}" aria-label="Decrease quantity">−</button>
          <span class="px-1">${i.qty}</span>
          <button class="btn btn-outline-secondary qty-btn" data-act="plus" data-id="${i.id}" aria-label="Increase quantity">+</button>
        </div>
        <div class="text-end" style="min-width:64px">${Peso(i.price * i.qty)}</div>
      </div>`,
          )
          .join("")
      : `<div class="text-center text-muted-2 py-5"><i class="bi bi-cup-hot display-4"></i><p class="mt-2">Your cart is empty.<br><a href="menu.html">Browse the menu</a></p></div>`;

    // voucher suggestions = claimed & unused
    const used = Store.get("usedVouchers", []);
    document.getElementById("voucherList").innerHTML = Store.get(
      "claimedVouchers",
      [],
    )
      .filter((c) => !used.includes(c))
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
      })),
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
    }
    let stampMsg =
      "This is a student-project demo order and is not sent to Ancestra Cafe.";
    const member = Store.get("member", null);
    const drinkCount = order.items
      .filter((i) => i.group === "drink")
      .reduce((sum, i) => sum + i.qty, 0);
    if (member && drinkCount > 0) {
      member.stamps += drinkCount;
      Store.set("member", member);
      stampMsg += ` Demo loyalty progress: ${drinkCount} drink stamp(s) added (${member.stamps} total).`;
    }
    Store.set("appliedVoucher", null);
    this.save([]);
    form.classList.remove("was-validated");
    form.reset();
    bootstrap.Modal.getInstance(
      document.getElementById("checkoutModal"),
    ).hide();
    document.getElementById("orderNo").textContent = order.id;
    document.getElementById("orderDoneMsg").textContent = stampMsg;
    new bootstrap.Modal(document.getElementById("orderDoneModal")).show();
    if (typeof window.onOrderPlaced === "function") window.onOrderPlaced();
  },
};
