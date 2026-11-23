/* Interactive directions, open status, FAQ helpers, gift/catering, notifications */
const CAFE_DESTINATION =
  "Ancestra Cafe, 311 General Ortega St., Poblacion, Argao, Cebu, Philippines";
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("directionsBtn");
  const mode = document.getElementById("travelMode");
  const build = () =>
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CAFE_DESTINATION)}&travelmode=${mode.value}`;
  if (btn) btn.href = build();
  if (mode) mode.addEventListener("change", () => { if (btn) btn.href = build(); });

  // open/closed status
  function updateStatus() {
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    const open = 8 * 60, close = 21 * 60;
    const badge = document.getElementById("openStatus");
    const cd = document.getElementById("openCountdown");
    if (!badge) return;
    if (mins >= open && mins < close) {
      badge.textContent = "Open now";
      badge.className = "badge text-bg-success";
      const left = close - mins;
      if (cd) cd.textContent = `Closes in ${Math.floor(left / 60)}h ${left % 60}m`;
    } else {
      badge.textContent = "Closed";
      badge.className = "badge text-bg-secondary";
      let next = mins < open ? open - mins : 24 * 60 - mins + open;
      if (cd) cd.textContent = `Opens in ${Math.floor(next / 60)}h ${next % 60}m`;
    }
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    if (!f.checkValidity()) { f.classList.add("was-validated"); return; }
    f.reset();
    f.classList.remove("was-validated");
    toast("Message sent. For inquiries, email contact@ancestracafe.ph.", "info");
  });

  // gift/catering calculator
  function updateEstimate() {
    const qty = Number(document.getElementById("giftQty")?.value) || 1;
    const val = Number(document.getElementById("giftValue")?.value) || 0;
    const el = document.getElementById("giftEstimate");
    if (el) el.textContent = Peso(qty * val);
  }
  ["giftQty", "giftValue"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", updateEstimate);
  });
  updateEstimate();

  const giftForm = document.getElementById("giftForm");
  if (giftForm)
    giftForm.addEventListener("submit", (e) => {
      e.preventDefault();
      toast("Inquiry sent. We'll be in touch shortly.", "success");
      giftForm.reset();
      updateEstimate();
    });

  const notifBtn = document.getElementById("enableNotifBtn");
  if (notifBtn)
    notifBtn.addEventListener("click", async () => {
      if (!("Notification" in window)) return toast("Notifications not supported.", "warning");
      const perm = await Notification.requestPermission();
      toast(perm === "granted" ? "Notifications enabled." : "Permission not granted.", perm === "granted" ? "success" : "warning");
    });
});