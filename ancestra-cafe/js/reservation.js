/* Table reservation form */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reserveForm");
  const dateEl = document.getElementById("rDate");
  const timeEl = document.getElementById("rTime");
  const guestsEl = document.getElementById("rGuests");

  dateEl.min = todayISO();
  for (let h = 8; h <= 20; h++) {
    ["00", "30"].forEach(m => {
      if (h === 20 && m === "30") return;
      const hr12 = ((h + 11) % 12) + 1, ampm = h < 12 ? "AM" : "PM";
      const label = `${hr12}:${m} ${ampm}`;
      timeEl.insertAdjacentHTML("beforeend", `<option value="${h}:${m}">${label}</option>`);
    });
  }
  for (let g = 1; g <= 10; g++) guestsEl.insertAdjacentHTML("beforeend", `<option value="${g}" ${g === 2 ? "selected" : ""}>${g} ${g === 1 ? "guest" : "guests"}</option>`);

  function renderMine() {
    const mine = Store.get("myReservations", []);
    const all = Store.get("reservations", []);
    const box = document.getElementById("myReservations");
    if (!mine.length) { box.innerHTML = '<p class="text-muted-2 mb-0">No reservations yet.</p>'; return; }
    const badge = { Pending: "warning text-dark", Confirmed: "success", Cancelled: "secondary" };
    box.innerHTML = mine.map(id => all.find(r => r.id === id)).filter(Boolean).map(r => `
      <div class="border-bottom py-2">
        <div class="d-flex justify-content-between"><strong>${escapeHtml(r.date)} · ${escapeHtml(r.timeLabel)}</strong>
          <span class="badge text-bg-${badge[r.status]}">${r.status}</span></div>
        <div class="small text-muted-2">${r.guests} guest(s) · Ref <span class="code-chip">${r.id}</span></div>
        ${r.status !== "Cancelled" ? `<button class="btn btn-link btn-sm text-danger p-0" data-cancel="${r.id}">Cancel</button>` : ""}
      </div>`).join("");
  }

  document.getElementById("myReservations").addEventListener("click", e => {
    const b = e.target.closest("[data-cancel]"); if (!b) return;
    const all = Store.get("reservations", []);
    const r = all.find(x => x.id === b.dataset.cancel);
    if (r) { r.status = "Cancelled"; Store.set("reservations", all); renderMine(); toast("Reservation cancelled.", "secondary"); }
  });
  document.getElementById("clearMine").addEventListener("click", () => { Store.set("myReservations", []); renderMine(); });

  form.addEventListener("submit", e => {
    e.preventDefault();
    form.classList.add("was-validated");
    const dateOk = dateEl.value && dateEl.value >= todayISO();
    dateEl.setCustomValidity(dateOk ? "" : "invalid");
    if (!form.checkValidity() || !dateOk) { form.classList.add("was-validated"); return; }

    const res = {
      id: uid("RSV"),
      name: document.getElementById("rName").value.trim(),
      phone: document.getElementById("rPhone").value.trim(),
      email: document.getElementById("rEmail").value.trim(),
      date: dateEl.value,
      time: timeEl.value,
      timeLabel: timeEl.options[timeEl.selectedIndex].text,
      guests: Number(guestsEl.value),
      occasion: document.getElementById("rOccasion").value,
      notes: document.getElementById("rNotes").value.trim(),
      status: "Pending",
      created: new Date().toISOString()
    };
    const all = Store.get("reservations", []); all.unshift(res); Store.set("reservations", all);
    const mine = Store.get("myReservations", []); mine.unshift(res.id); Store.set("myReservations", mine);

    document.getElementById("refCode").textContent = res.id;
    document.getElementById("refSummary").textContent = `${res.name}, table for ${res.guests} on ${res.date} at ${res.timeLabel}. This is a local project demo only; it is not sent to Ancestra Cafe.`;
    new bootstrap.Modal(document.getElementById("reserveDone")).show();
    form.reset(); form.classList.remove("was-validated"); dateEl.setCustomValidity("");
    guestsEl.value = "2";
    renderMine();
  });
  dateEl.addEventListener("input", () => dateEl.setCustomValidity(""));

  renderMine();
});
