/* Digital loyalty card (points-based) + promo vouchers + rewards catalog */
function renderCard() {
  const member = normalizeMember(Store.get("member", null));
  if (member) Store.set("member", member);
  document.getElementById("joinForm").classList.toggle("d-none", !!member);
  document.getElementById("cardJoined").classList.toggle("d-none", !member);
  if (!member) return;

  document.getElementById("memberName").textContent = member.name;
  document.getElementById("pointsCount").textContent = member.points;
  const filled = Math.min(member.points, 135);
  document.getElementById("pointsBar").style.width = (filled / 135) * 100 + "%";
  const stamps = document.getElementById("loyaltyStamps");
  if (stamps) { const count = Math.min(9, Math.floor(member.points / 15)); stamps.innerHTML = Array.from({length:9}, (_,i) => `<span class="loyalty-stamp ${i<count ? "is-filled" : ""}" title="${i<count ? "Earned" : "Not yet earned"}"><i class="bi ${i<count ? "bi-cup-hot-fill" : "bi-cup"}"></i></span>`).join(""); }
  const left = 135 - member.points;
  document.getElementById("rewardText").textContent =
    left > 0
      ? `${left} more point${left === 1 ? "" : "s"} until your next free drink.`
      : "You've earned a free drink! Redeem it below.";
  document.getElementById("redeemBtn").disabled = member.points < 135 && member.points < 500 && member.points < 1000;
  // tier
  const tier = tierFor(member.lifetimePoints || member.points);
  document.getElementById("tierBadge").textContent = tier;
  // qr
  const qr = document.getElementById("qrCode");
  if (qr) qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${encodeURIComponent(member.phone + ":" + member.name)}`;
  // referral
  const rc = document.getElementById("referralCode");
  if (rc) rc.textContent = member.referralCode;
  // birthday bonus
  checkBirthdayBonus(member);
}

function checkBirthdayBonus(member) {
  const bday = member.birthday;
  if (!bday) return;
  const today = new Date().toISOString().slice(0, 10);
  const mmdd = bday.slice(5);
  if (today.slice(5) !== mmdd) return;
  const year = today.slice(0, 4);
  if (member.lastBirthdayBonus === year) return;
  member.points += 50;
  member.lifetimePoints = (member.lifetimePoints || 0) + 50;
  member.lastBirthdayBonus = year;
  Store.set("member", member);
  if (typeof addPointsHistory === "function") addPointsHistory("Birthday bonus", 50);
  toast("Happy birthday! +50 points added.", "success");
  fireConfetti();
  renderCard();
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
    return toast("The loyalty reward is unlocked after enough points.", "warning");
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

// Rewards catalog
let pendingReward = null;
function renderRewardCatalog() {
  const grid = document.getElementById("rewardCatalogGrid");
  if (!grid) return;
  const member = normalizeMember(Store.get("member", null));
  grid.innerHTML = REWARDS.map((r) => {
    const can = member && member.points >= r.points;
    return `<div class="col"><div class="card-soft p-4 h-100 d-flex flex-column">
      <h3 class="h4 mb-1">${r.title}</h3>
      <p class="small text-muted-2 flex-grow-1">${r.desc}</p>
      <div class="d-flex justify-content-between align-items-center mt-2">
        <span class="code-chip">${r.points} pts</span>
        <button class="btn btn-blue btn-sm" data-reward="${r.id}" ${can ? "" : "disabled"}>Redeem</button>
      </div>
    </div></div>`;
  }).join("");
}
function openRedeem(rewardId) {
  const reward = REWARDS.find((r) => r.id === rewardId);
  if (!reward) return;
  const member = normalizeMember(Store.get("member", null));
  if (!member || member.points < reward.points) return toast("Not enough points.", "warning");
  pendingReward = reward;
  const sel = document.getElementById("redeemItemSelect");
  const items = MENU.filter(reward.filter);
  sel.innerHTML = items
    .map((m) => `<option value="${m.id}" data-price="${m.price}">${m.name} — ${Peso(m.price)}</option>`)
    .join("");
  document.getElementById("redeemModalDesc").textContent = `${reward.title} · ${reward.points} points`;
  new bootstrap.Modal(document.getElementById("redeemModal")).show();
}
function confirmRedeem() {
  if (!pendingReward) return;
  const member = normalizeMember(Store.get("member", null));
  if (!member || member.points < pendingReward.points) return toast("Not enough points.", "warning");
  const sel = document.getElementById("redeemItemSelect");
  const itemId = sel.value;
  const item = MENU.find((m) => m.id === itemId);
  if (!item) return toast("Select an item.", "warning");
  member.points -= pendingReward.points;
  member.lifetimePoints = member.lifetimePoints || 0;
  Store.set("member", member);
  if (typeof addPointsHistory === "function")
    addPointsHistory(`${pendingReward.title}: ${item.name}`, -pendingReward.points);
  // create reward voucher
  const code = "RWD-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  const rewards = Store.get("myRewards", []);
  rewards.unshift({ code, title: pendingReward.title, item: item.name, price: item.price, used: false, date: new Date().toISOString() });
  Store.set("myRewards", rewards);
  // register claimed so cart can apply
  const claimed = Store.get("claimedVouchers", []);
  claimed.push(code);
  Store.set("claimedVouchers", claimed);
  pendingReward = null;
  bootstrap.Modal.getInstance(document.getElementById("redeemModal")).hide();
  toast(`${item.name} reward unlocked! Apply ${code} in your cart.`);
  fireConfetti();
  renderCard();
  renderRewardCatalog();
  renderPointsHistory();
  Cart.render();
}

function renderPointsHistory() {
  const box = document.getElementById("pointsHistory");
  if (!box) return;
  const h = Store.get("pointsHistory", []);
  if (!h.length) {
    box.innerHTML = '<p class="text-muted-2 mb-0">No points activity yet.</p>';
    return;
  }
  box.innerHTML = h
    .map(
      (e) =>
        `<div class="d-flex justify-content-between border-bottom py-1"><span>${escapeHtml(e.reason)}</span><span class="${e.delta >= 0 ? "text-success" : "text-danger"}">${e.delta >= 0 ? "+" : ""}${e.delta}</span><span class="small text-muted-2">${new Date(e.date).toLocaleDateString()}</span></div>`,
    )
    .join("");
}

function fireConfetti() {
  const wrap = document.createElement("div");
  wrap.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden";
  for (let i = 0; i < 60; i++) {
    const p = document.createElement("span");
    p.style.cssText = `position:absolute;left:${Math.random() * 100}%;top:-10px;width:8px;height:8px;background:${["#284484", "#c8b4a6", "#f7f1e8", "#e0a526"][Math.floor(Math.random() * 4)]};opacity:${0.7 + Math.random() * 0.3};transform:rotate(${Math.random() * 360}deg);animation:confettiFall ${1.5 + Math.random() * 2}s linear forwards`;
    wrap.appendChild(p);
  }
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  renderCard();
  renderVouchers();
  renderRewardCatalog();
  renderPointsHistory();

  // inject confetti keyframes
  if (!document.getElementById("confettiStyle")) {
    const st = document.createElement("style");
    st.id = "confettiStyle";
    st.textContent = "@keyframes confettiFall{to{transform:translateY(110vh) rotate(720deg);opacity:0}}";
    document.head.appendChild(st);
  }

  document.getElementById("joinForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    if (!f.checkValidity()) {
      f.classList.add("was-validated");
      return;
    }
    const referralInput = document.getElementById("mReferral").value.trim();
    let bonus = 0;
    if (referralInput) {
      // reward referrer if exists
      const member = normalizeMember(Store.get("member", null));
      // no cross-user in demo; just acknowledge
      bonus = 10;
    }
    Store.set("member", {
      name: document.getElementById("mName").value.trim(),
      phone: document.getElementById("mPhone").value.trim(),
      birthday: document.getElementById("mBirthday").value,
      points: bonus,
      lifetimePoints: bonus,
      joined: new Date().toISOString(),
    });
    if (bonus) {
      if (typeof addPointsHistory === "function") addPointsHistory("Referral bonus", bonus);
    }
    toast("Welcome to the rewards card!");
    renderCard();
    renderRewardCatalog();
    renderPointsHistory();
  });

  document.getElementById("redeemBtn").addEventListener("click", () => {
    const m = normalizeMember(Store.get("member", null));
    if (!m) return;
    // open catalog choice: default first affordable
    const affordable = REWARDS.filter((r) => m.points >= r.points);
    if (!affordable.length) return toast("Not enough points yet.", "warning");
    openRedeem(affordable[affordable.length - 1].id);
  });

  document.getElementById("staffStampBtn").addEventListener("click", () => {
    const input = document.getElementById("staffCode");
    const m = normalizeMember(Store.get("member", null));
    if (!m) return toast("Join the rewards card first.", "warning");
    if (input.value.trim().toUpperCase() !== "STAFF")
      return toast("Incorrect staff code.", "danger");
    m.points += STAMP_TO_POINTS;
    m.lifetimePoints = (m.lifetimePoints || 0) + STAMP_TO_POINTS;
    Store.set("member", m);
    if (typeof addPointsHistory === "function") addPointsHistory("Staff points", STAMP_TO_POINTS);
    input.value = "";
    toast(`${STAMP_TO_POINTS} points added!`);
    renderCard();
    renderRewardCatalog();
    renderPointsHistory();
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

  // reward catalog redeem buttons
  const catGrid = document.getElementById("rewardCatalogGrid");
  if (catGrid)
    catGrid.addEventListener("click", (e) => {
      const b = e.target.closest("[data-reward]");
      if (b) openRedeem(b.dataset.reward);
    });
  const confirmBtn = document.getElementById("confirmRedeemBtn");
  if (confirmBtn) confirmBtn.addEventListener("click", confirmRedeem);

  const copyRef = document.getElementById("copyReferral");
  if (copyRef)
    copyRef.addEventListener("click", () => {
      const m = normalizeMember(Store.get("member", null));
      if (!m) return;
      navigator.clipboard?.writeText(m.referralCode).then(
        () => toast("Referral code copied!"),
        () => toast(m.referralCode, "info"),
      );
    });

  window.onOrderPlaced = () => {
    renderCard();
    renderVouchers();
    renderRewardCatalog();
    renderPointsHistory();
  };
});