/* Digital loyalty card + promo vouchers */
const STAMPS_FOR_REWARD = 9;

function renderCard() {
  const member = Store.get("member", null);
  document.getElementById("joinForm").classList.toggle("d-none", !!member);
  document.getElementById("cardJoined").classList.toggle("d-none", !member);
  if (!member) return;

  document.getElementById("memberName").textContent = member.name;
  document.getElementById("stampCount").textContent = member.stamps;
  const filled = Math.min(member.stamps, STAMPS_FOR_REWARD);
  document.getElementById("stampGrid").innerHTML = Array.from(
    { length: STAMPS_FOR_REWARD },
    (_, i) =>
      `<div class="stamp ${i < filled ? "filled" : ""}">${i < filled ? '<i class="bi bi-cup-hot-fill"></i>' : i + 1}</div>`,
  ).join("");
  document.getElementById("stampBar").style.width =
    (filled / STAMPS_FOR_REWARD) * 100 + "%";
  const left = STAMPS_FOR_REWARD - member.stamps;
  document.getElementById("rewardText").textContent =
    left > 0
      ? `${left} more stamp${left === 1 ? "" : "s"} until your free drink.`
      : "You've earned a free drink! Redeem it below.";
  document.getElementById("redeemBtn").disabled = left > 0;
}

function renderVouchers() {
  const claimed = Store.get("claimedVouchers", []);
  const used = Store.get("usedVouchers", []);
  const list = VOUCHERS.filter(
    (v) => !v.reward || claimed.includes(v.code) || used.includes(v.code),
  );
  document.getElementById("voucherGrid").innerHTML = list
    .map((v) => {
      const isUsed = used.includes(v.code),
        isClaimed = claimed.includes(v.code);
      const btn = isUsed
        ? `<button class="btn btn-sm btn-secondary" disabled>Used</button>`
        : isClaimed
          ? `<button class="btn btn-sm btn-outline-blue" data-copy="${v.code}"><i class="bi bi-clipboard me-1"></i>Claimed – copy</button>`
          : `<button class="btn btn-sm btn-blue" data-claim="${v.code}">Claim</button>`;
      return `<div class="col"><div class="voucher h-100">
      <div class="voucher-side">${v.label}<br><small style="font-size:.7rem;font-family:Jost">OFF</small></div>
      <div class="voucher-body d-flex flex-column">
        <h3 class="h5 mb-0">${v.title}</h3>
        <p class="small text-muted-2 mb-2">${v.desc}</p>
        <div class="d-flex justify-content-between align-items-center mt-auto">
          <span class="code-chip">${v.code}</span>${btn}</div>
      </div></div></div>`;
    })
    .join("");
}

function claim(code) {
  const v = findVoucher(code);
  if (!v) return toast("That code isn't valid.", "danger");
  if (v.reward)
    return toast("The loyalty reward is unlocked after 9 stamps.", "warning");
  const claimed = Store.get("claimedVouchers", []);
  if (Store.get("usedVouchers", []).includes(v.code))
    return toast("You've already used that voucher.", "warning");
  if (claimed.includes(v.code)) return toast("Already in your wallet.", "info");
  claimed.push(v.code);
  Store.set("claimedVouchers", claimed);
  toast(`${v.code} claimed! Apply it in your cart.`);
  renderVouchers();
  Cart.render();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCard();
  renderVouchers();

  document.getElementById("joinForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    if (!f.checkValidity()) {
      f.classList.add("was-validated");
      return;
    }
    Store.set("member", {
      name: document.getElementById("mName").value.trim(),
      phone: document.getElementById("mPhone").value.trim(),
      stamps: 0,
      joined: new Date().toISOString(),
    });
    toast("Welcome to the loyalty card!");
    renderCard();
  });

  document.getElementById("redeemBtn").addEventListener("click", () => {
    const m = Store.get("member", null);
    if (!m || m.stamps < STAMPS_FOR_REWARD) return;
    m.stamps -= STAMPS_FOR_REWARD;
    Store.set("member", m);
    const claimed = Store.get("claimedVouchers", []);
    if (!claimed.includes("LOYALTYCOFFEE")) {
      claimed.push("LOYALTYCOFFEE");
      Store.set("claimedVouchers", claimed);
    }
    toast(
      "Coffee reward unlocked! Add a drink to your demo cart and apply LOYALTYCOFFEE.",
    );
    renderCard();
    renderVouchers();
    Cart.render();
  });

  document.getElementById("staffStampBtn").addEventListener("click", () => {
    const input = document.getElementById("staffCode");
    const m = Store.get("member", null);
    if (!m) return toast("Join the loyalty card first.", "warning");
    if (input.value.trim().toUpperCase() !== "STAFF")
      return toast("Incorrect staff code.", "danger");
    m.stamps += 1;
    Store.set("member", m);
    input.value = "";
    toast("Stamp added!");
    renderCard();
  });

  document.getElementById("voucherGrid").addEventListener("click", (e) => {
    const c = e.target.closest("[data-claim]");
    if (c) return claim(c.dataset.claim);
    const cp = e.target.closest("[data-copy]");
    if (cp)
      navigator.clipboard?.writeText(cp.dataset.copy).then(
        () => toast("Code copied!"),
        () => toast(cp.dataset.copy, "info"),
      );
  });
  document.getElementById("redeemCodeBtn").addEventListener("click", () => {
    const el = document.getElementById("redeemCode");
    if (el.value.trim()) {
      claim(el.value);
      el.value = "";
    }
  });

  window.onOrderPlaced = () => {
    renderCard();
    renderVouchers();
  };
});
