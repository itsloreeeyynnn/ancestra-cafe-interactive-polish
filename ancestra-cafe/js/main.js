/* ==========================================================
   Ancestra Cafe – shared helpers, site chrome (navbar/footer),
   toasts and localStorage "database".
   ========================================================== */

/* ---------- Tiny localStorage store ---------- */
const Store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem("ancestra_" + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem("ancestra_" + key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
  }
};

const Peso = n => "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const uid = prefix => prefix + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const todayISO = () => new Date().toISOString().slice(0, 10);

/* ---------- Promo vouchers (catalogue) ---------- */
const VOUCHERS = [
  { code: "PROJECT10", title: "Project Demo Offer", desc: "10% off a demo order (not an official café promotion)", type: "pct", value: 10, min: 0, label: "10%" },
  { code: "PROJECT50", title: "Project Demo Peso-Off", desc: "₱50 off a demo order of ₱400 or more", type: "flat", value: 50, min: 400, label: "₱50" },
  { code: "PROJECT15", title: "Project Demo Food Offer", desc: "15% off a demo order of ₱600 or more", type: "pct", value: 15, min: 600, label: "15%" },
  { code: "LOYALTYCOFFEE", title: "Loyalty Coffee Reward (demo)", desc: "One menu drink without add-ons after 9 stamps", type: "reward", value: 0, min: 0, label: "FREE", reward: true }
];
const findVoucher = code => VOUCHERS.find(v => v.code === String(code).trim().toUpperCase());

/* ---------- Toasts ---------- */
function toast(message, variant = "success") {
  let wrap = document.getElementById("toastWrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "toastWrap";
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const el = document.createElement("div");
  el.className = `toast align-items-center text-bg-${variant} border-0 mb-2`;
  el.setAttribute("role", "alert");
  el.innerHTML = `<div class="d-flex"><div class="toast-body">${escapeHtml(message)}</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>`;
  wrap.appendChild(el);
  const t = new bootstrap.Toast(el, { delay: 3200 });
  t.show();
  el.addEventListener("hidden.bs.toast", () => el.remove());
}

/* ---------- Site chrome ----------
   Navigation follows the reference site's structure: five main pages
   (Home, About, Menu, Blog, Contact), a centered logo and social icons.
   The extra features live inside those pages (see README). */
const NAV_LINKS = [
  ["index.html", "Home", "home"], ["about.html", "About", "about"],
  ["menu.html", "Menu", "menu"], ["blog.html", "Blog", "blog"], ["contact.html", "Contact", "contact"], ["experience.html", "Rewards", "experience"]
];
function renderChrome() {
  const page = document.body.dataset.page;
  const links = NAV_LINKS.map(([href,label,key]) => `<li class="nav-item"><a class="nav-link ${key===page?"active":""}" ${key===page?'aria-current="page"':''} href="${href}">${label}</a></li>`).join("");
  const header=document.getElementById("site-header");
  if(header) header.innerHTML=`<nav class="navbar navbar-expand-lg site-nav sticky-top"><div class="container-fluid px-lg-5">
    <a class="navbar-brand nav-logo" href="index.html" aria-label="Ancestra Cafe home"><img src="https://images.squarespace-cdn.com/content/v1/67a2a8606844a1403f9d8ca4/29690841-f2a3-40c5-92b8-9e08620be63a/Lettermark%2B02.png" alt="Ancestra Cafe" class="nav-wordmark"></a>
    <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="mainNav"><ul class="navbar-nav me-auto mb-2 mb-lg-0">${links}</ul><div class="d-flex align-items-center gap-2 nav-right">
      <a class="nav-social" href="https://www.instagram.com/ancestracafe/" target="_blank" rel="noopener" aria-label="Ancestra Cafe Instagram"><i class="bi bi-instagram"></i></a>
      <a class="nav-social" href="https://www.facebook.com/ancestracafe" target="_blank" rel="noopener" aria-label="Ancestra Cafe Facebook"><i class="bi bi-facebook"></i></a>
      <button class="btn btn-outline-blue btn-sm cart-btn ms-1" type="button" data-bs-toggle="offcanvas" data-bs-target="#cartCanvas" aria-label="Open demo cart"><i class="bi bi-bag"></i><span class="badge rounded-pill cart-badge" id="cartBadge">0</span></button>
    </div></div></div></nav>`;
  const footer=document.getElementById("site-footer");
  if(footer) footer.innerHTML=`<footer class="site-footer text-center"><div class="container"><img src="https://images.squarespace-cdn.com/content/v1/67a2a8606844a1403f9d8ca4/29690841-f2a3-40c5-92b8-9e08620be63a/Lettermark%2B02.png" alt="Ancestra Cafe official wordmark" class="footer-wordmark mb-3">
    <p class="small mb-3">A coffee shop for community, where heritage is celebrated.</p>
    <ul class="list-inline footer-links mb-3"><li class="list-inline-item"><a href="about.html">About</a></li><li class="list-inline-item"><a href="menu.html">Menu</a></li><li class="list-inline-item"><a href="blog.html#policies">Guest Policies</a></li><li class="list-inline-item"><a href="contact.html">Contact</a></li><li class="list-inline-item"><a href="experience.html">Rewards &amp; Reviews</a></li><li class="list-inline-item"><a href="admin.html">Demo Admin</a></li></ul>
    <div class="social mb-3"><a href="https://www.instagram.com/ancestracafe/" target="_blank" rel="noopener" aria-label="Instagram"><i class="bi bi-instagram"></i></a><a href="https://www.facebook.com/ancestracafe" target="_blank" rel="noopener" aria-label="Facebook"><i class="bi bi-facebook"></i></a></div><hr class="border-light opacity-25">
    <p class="small mb-1">© Ancestra Cafe. Business information and menu content are reproduced from the café’s public website for an ITE17 academic project.</p>
    <p class="small mb-0 opacity-75">Additional ordering, loyalty-card, voucher, review, reservation-demo and admin tools are student-project features only and are not operated by Ancestra Cafe.</p></div></footer><button class="btn btn-blue back-top" id="backTop" aria-label="Back to top"><i class="bi bi-arrow-up"></i></button>`;
  document.body.insertAdjacentHTML("beforeend",cartMarkup());
  const back=document.getElementById("backTop"); if(back){window.addEventListener("scroll",()=>{back.style.display=window.scrollY>400?"block":"none";},{passive:true});back.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));}
  initGlobalUX();
}

/* Ancestra's restrained page and scroll motion.
   Content is progressively revealed as it enters the viewport; all content
   remains available when reduced-motion is enabled or observers are unsupported. */
function initAncestraMotion() {
  const hero = document.querySelector(".hero");
  if (hero) hero.classList.add("hero-ready");

  const revealTargets = document.querySelectorAll(
    "main > section, .page-hero"
  );
  revealTargets.forEach((el, index) => {
    el.classList.add("ancestra-reveal");
  });

  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.body.classList.add("motion-ready");
    const observer = new IntersectionObserver((entries, io) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -55px 0px" });
    revealTargets.forEach(el => observer.observe(el));
  }

  /* The original navigation remains fixed while the page scrolls. */
  const nav = document.querySelector(".site-nav");
  if (nav) {
    const update = () => nav.classList.toggle("is-scrolled", window.scrollY > 32);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }
}


/* ---------- Small global UX improvements ---------- */
function initGlobalUX() {
  // Skip link helps keyboard and screen-reader users reach page content quickly.
  const main = document.querySelector("main");
  if (main) {
    if (!main.id) main.id = "main-content";
    const skip = document.createElement("a");
    skip.className = "skip-link";
    skip.href = `#${main.id}`;
    skip.textContent = "Skip to content";
    document.body.prepend(skip);
    main.setAttribute("tabindex", "-1");
  }

  // Slim reading progress indicator; purely decorative and does not cover content.
  const progress = document.createElement("div");
  progress.className = "reading-progress";
  progress.setAttribute("aria-hidden", "true");
  progress.innerHTML = '<span></span>';
  document.body.appendChild(progress);
  const progressBar = progress.firstElementChild;
  let ticking = false;
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.transform = `scaleX(${Math.min(100, Math.max(0, amount)) / 100})`;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { window.requestAnimationFrame(updateProgress); ticking = true; }
  }, { passive: true });
  updateProgress();

  // Collapse the mobile menu after choosing a page; avoid leaving it over the content.
  const navCollapse = document.getElementById("mainNav");
  if (navCollapse && window.bootstrap?.Collapse) {
    navCollapse.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 991.98px)").matches) {
          bootstrap.Collapse.getOrCreateInstance(navCollapse, { toggle: false }).hide();
        }
      });
    });
  }

  // Keyboard shortcut on the menu page: press / to focus menu search.
  const menuSearch = document.getElementById("searchInput");
  if (menuSearch) {
    document.addEventListener("keydown", event => {
      const target = event.target;
      const typing = target && (target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(target.tagName));
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        menuSearch.focus();
      }
      if (event.key === "Escape" && document.activeElement === menuSearch) menuSearch.blur();
    });
    const label = document.querySelector('label[for="searchInput"]');
    if (label && !label.querySelector("kbd")) label.insertAdjacentHTML("beforeend", ' <kbd class="search-shortcut">/</kbd>');
  }

  initPhotoViewer();
}

/* Accessible, dependency-free photo viewer for café photography and menu boards. */
function initPhotoViewer() {
  const candidates = document.querySelectorAll(".photo img, .story-photo img, .menu-board-link img, a > img.menu-board");
  if (!candidates.length) return;
  const dialog = document.createElement("dialog");
  dialog.className = "photo-viewer";
  dialog.setAttribute("aria-label", "Photo preview");
  dialog.innerHTML = `<button class="photo-viewer-close" type="button" aria-label="Close photo preview">×</button><figure><img alt=""><figcaption></figcaption></figure>`;
  document.body.appendChild(dialog);
  const preview = dialog.querySelector("img");
  const caption = dialog.querySelector("figcaption");
  const close = () => { if (dialog.open) dialog.close(); };
  dialog.querySelector(".photo-viewer-close").addEventListener("click", close);
  dialog.addEventListener("click", event => { if (event.target === dialog) close(); });
  dialog.addEventListener("close", () => { preview.removeAttribute("src"); });

  candidates.forEach(img => {
    const trigger = img.closest("a") || img;
    if (trigger.dataset.viewerReady) return;
    trigger.dataset.viewerReady = "true";
    if (trigger.tagName !== "A") {
      trigger.tabIndex = 0;
      trigger.setAttribute("role", "button");
      trigger.setAttribute("aria-label", `View larger image: ${img.alt || "Ancestra Cafe photo"}`);
    } else {
      trigger.setAttribute("aria-label", `View larger image: ${img.alt || "Ancestra Cafe photo"}`);
    }
    const open = event => {
      event.preventDefault();
      preview.src = img.currentSrc || img.src;
      preview.alt = img.alt || "Ancestra Cafe photo";
      caption.textContent = img.alt || "Ancestra Cafe";
      if (typeof dialog.showModal === "function") dialog.showModal();
    };
    trigger.addEventListener("click", open);
    if (trigger.tagName !== "A") trigger.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(event); }
    });
  });
}

function initPageTransition() {
  document.body.classList.add("page-loaded");
  document.querySelectorAll('a[href$=".html"], a[href*=".html#"]').forEach(link => {
    const href = link.getAttribute("href");
    if (!href || link.target === "_blank" || href.startsWith("http")) return;
    link.addEventListener("click", event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = new URL(href, location.href);
      if (target.pathname === location.pathname && target.hash) return;
      event.preventDefault();
      document.body.classList.add("page-leaving");
      window.setTimeout(() => { location.href = href; }, 220);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderChrome();
  if (typeof Cart !== "undefined") Cart.init();
  initAncestraMotion();
  initPageTransition();
});
