/* Customer reviews: list, summary, submission */
function renderReviews() {
  const all = getReviews().filter(r => !r.hidden);
  const filter = Number(document.getElementById("reviewFilter").value);
  const shown = (filter ? all.filter(r => r.rating === filter) : all)
    .slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  const avg = all.length ? all.reduce((s, r) => s + r.rating, 0) / all.length : 0;
  document.getElementById("avgRating").textContent = avg.toFixed(1);
  document.getElementById("avgStars").textContent = starString(Math.round(avg));
  document.getElementById("reviewTotal").textContent = `Based on ${all.length} review${all.length === 1 ? "" : "s"}`;
  document.getElementById("ratingBars").innerHTML = [5, 4, 3, 2, 1].map(n => {
    const c = all.filter(r => r.rating === n).length;
    const pct = all.length ? c / all.length * 100 : 0;
    return `<div class="d-flex align-items-center gap-2 mb-1"><span style="width:2.2rem">${n}★</span>
      <div class="progress flex-grow-1" style="height:8px"><div class="progress-bar" style="width:${pct}%;background:var(--blue)"></div></div>
      <span style="width:1.5rem" class="text-end">${c}</span></div>`;
  }).join("");

  document.getElementById("reviewList").innerHTML = shown.length ? shown.map(r => `
    <article class="card-soft p-4 mb-3">
      <div class="d-flex justify-content-between flex-wrap">
        <div><strong>${escapeHtml(r.name)}</strong> <span class="stars ms-2">${starString(r.rating)}</span></div>
        <span class="small text-muted-2">${new Date(r.date).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}</span>
      </div>
      ${r.dish ? `<span class="tag-pill my-2 d-inline-block">${escapeHtml(r.dish)}</span>` : ""}
      <p class="mb-0 mt-1">${escapeHtml(r.text)}</p>
    </article>`).join("")
    : `<p class="text-muted-2">No reviews match this filter yet.</p>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const dish = document.getElementById("vDish");
  MENU.forEach(m => dish.insertAdjacentHTML("beforeend", `<option>${escapeHtml(m.name)}</option>`));
  const member = Store.get("member", null);
  if (member) document.getElementById("vName").value = member.name;

  document.getElementById("reviewFilter").addEventListener("change", renderReviews);
  document.getElementById("reviewForm").addEventListener("submit", e => {
    e.preventDefault();
    const form = e.target;
    const rating = form.querySelector('input[name="rating"]:checked');
    document.getElementById("ratingError").classList.toggle("d-none", !!rating);
    if (!form.checkValidity() || !rating) { form.classList.add("was-validated"); return; }

    const list = getReviews();
    list.unshift({
      id: uid("R"),
      name: document.getElementById("vName").value.trim(),
      rating: Number(rating.value),
      dish: dish.value,
      text: document.getElementById("vText").value.trim(),
      date: new Date().toISOString(),
      hidden: false
    });
    Store.set("reviews", list);
    form.reset(); form.classList.remove("was-validated");
    toast("Thank you for your review!");
    renderReviews();
  });
  renderReviews();
});
