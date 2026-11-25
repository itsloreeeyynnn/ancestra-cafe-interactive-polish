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
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem("ancestra_" + key, JSON.stringify(value));
    } catch (e) {
      /* storage unavailable */
    }
  },
};

const Peso = (n) =>
  "₱" +
  Number(n).toLocaleString("en-PH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
const uid = (prefix) =>
  prefix + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
const escapeHtml = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const todayISO = () => new Date().toISOString().slice(0, 10);

/* ---------- Points-based rewards ---------- */
const POINTS_DIVISOR = 10;        // pesos spent per 1 point earned
const FREE_DRINK_POINTS = 135;    // points needed for one free drink
const STAMP_TO_POINTS = 15;       // migration: 1 old stamp = 15 points
const pointsForAmount = (amount) =>
  Math.floor(Number(amount) / POINTS_DIVISOR);

function normalizeMember(m) {
  if (!m) return null;
  if (typeof m.points !== "number") {
    if (typeof m.stamps === "number") m.points = m.stamps * STAMP_TO_POINTS;
    else m.points = 0;
  }
  if (typeof m.lifetimePoints !== "number") m.lifetimePoints = m.points;
  if (!m.referralCode) m.referralCode = "ANCESTRA-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  delete m.stamps;
  return m;
}
const REWARDS = [
  { id: "rw1", title: "Free Drink", points: 135, desc: "Any menu drink without add-ons", filter: (m) => m.group === "drink" },
  { id: "rw2", title: "Free Frappe / Pastry", points: 500, desc: "One ice-blended drink or sandwich", filter: (m) => m.cat === "Ice Blended" || m.cat === "Sandwiches" },
  { id: "rw3", title: "Free Meal Combo", points: 1000, desc: "One main plus a drink", filter: (m) => m.group === "food" },
];
function tierFor(points) {
  if (points >= 1500) return "Gold";
  if (points >= 500) return "Silver";
  return "Bronze";
}
function addPointsHistory(reason, delta) {
  const h = Store.get("pointsHistory", []);
  h.unshift({ date: new Date().toISOString(), reason, delta });
  Store.set("pointsHistory", h.slice(0, 50));
}

/* ---------- Promo vouchers (catalogue) ---------- */
const VOUCHERS = [
  {
    code: "WELCOME10",
    title: "Welcome Offer",
    desc: "10% off your order",
    type: "pct",
    value: 10,
    min: 0,
    label: "10%",
  },
  {
    code: "SAVE50",
    title: "Peso-Off Voucher",
    desc: "₱50 off an order of ₱400 or more",
    type: "flat",
    value: 50,
    min: 400,
    label: "₱50",
  },
  {
    code: "FOOD15",
    title: "Food Offer",
    desc: "15% off an order of ₱600 or more",
    type: "pct",
    value: 15,
    min: 600,
    label: "15%",
  },
  {
    code: "LOYALTYCOFFEE",
    title: "Loyalty Coffee Reward",
    desc: "One menu drink without add-ons",
    type: "reward",
    value: 0,
    min: 0,
    label: "FREE",
    reward: true,
  },
];
const findVoucher = (code) =>
  VOUCHERS.find((v) => v.code === String(code).trim().toUpperCase());

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
  ["index.html", "Home", "home"],
  ["about.html", "About", "about"],
  ["menu.html", "Menu", "menu"],
  ["blog.html", "Blog", "blog"],
  ["contact.html", "Contact", "contact"],
  ["experience.html", "Rewards", "experience"],
  ["gallery.html", "Gallery", "gallery"],
  ["faq.html", "FAQ & Reviews", "faq"],
];

function renderChrome() {
  const page = document.body.dataset.page;
  const links = NAV_LINKS.map(
    ([href, label, key]) =>
      `<li class="nav-item">
        <a class="nav-link ${key === page ? "active" : ""}" ${key === page ? 'aria-current="page"' : ""} href="${href}">
          ${label}
        </a>
      </li>`,
  ).join("");

  const header = document.getElementById("site-header");
  if (header)
    header.innerHTML = `
    <nav class="navbar navbar-expand-lg site-nav sticky-top">
      <div class="container-fluid px-lg-5">
        <a class="navbar-brand nav-logo" href="index.html" aria-label="Ancestra Cafe home">
          <img src="images/Lettermark+02.png" alt="Ancestra Cafe" class="nav-wordmark">
        </a>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            ${links}
          </ul>
          <div class="d-flex align-items-center gap-2 nav-right">
            <a class="nav-social" href="https://www.instagram.com/ancestracafe/" target="_blank" rel="noopener" aria-label="Ancestra Cafe Instagram">
              <i class="bi bi-instagram"></i>
            </a>
            <a class="nav-social" href="https://www.facebook.com/profile.php?id=61574579534127" target="_blank" rel="noopener" aria-label="Ancestra Cafe Facebook">
              <i class="bi bi-facebook"></i>
            </a>
            <button class="btn btn-outline-blue btn-sm ms-1" type="button" id="darkModeBtn" aria-label="Toggle dark mode">
              <i class="bi bi-moon"></i>
            </button>
            <button class="btn btn-outline-blue btn-sm cart-btn ms-1" type="button" data-bs-toggle="offcanvas" data-bs-target="#cartCanvas" aria-label="Open cart">
              <i class="bi bi-bag"></i>
              <span class="badge rounded-pill cart-badge" id="cartBadge" aria-live="polite" aria-atomic="true">0</span>
            </button>
          </div>
        </div>
      </div>
    </nav>`;
  const footer = document.getElementById("site-footer");
  if (footer)
    footer.innerHTML = `<footer class="site-footer text-center"><div class="container">
      <img src="images/Lettermark+02.png" alt="Ancestra Cafe official wordmark" class="footer-wordmark mb-3">
      <p class="mb-3">A coffee shop for community, where heritage is celebrated.</p>
      <ul class="list-inline footer-links mb-3"><li class="list-inline-item"><a href="about.html">About</a></li><li class="list-inline-item"><a href="menu.html">Menu</a></li><li class="list-inline-item"><a href="blog.html?post=policies">Guest Policies</a></li><li class="list-inline-item"><a href="contact.html">Contact</a></li><li class="list-inline-item"><a href="experience.html">Rewards &amp; Reviews</a></li><li class="list-inline-item"><a href="gallery.html">Gallery</a></li><li class="list-inline-item"><a href="faq.html">FAQ &amp; Reviews</a></li><li class="list-inline-item"><a href="admin.html">Admin</a></li></ul>
      <div class="social mb-3"><a href="https://www.instagram.com/ancestracafe/" target="_blank" rel="noopener" aria-label="Instagram"><i class="bi bi-instagram"></i></a><a href="https://www.facebook.com/profile.php?id=61574579534127" target="_blank" rel="noopener" aria-label="Facebook"><i class="bi bi-facebook"></i></a></div>
      <hr>
      <p class="footer-note">© Ancestra Cafe — reproduced from the café's public website for an ITE17 academic project. Ordering, loyalty, voucher, review, reservation and admin tools are student-project features only.</p>
    </div></footer><button class="btn btn-blue back-top" id="backTop" aria-label="Back to top"><i class="bi bi-arrow-up"></i></button>`;
  document.body.insertAdjacentHTML("beforeend", cartMarkup());
  const back = document.getElementById("backTop");
  if (back) {
    window.addEventListener(
      "scroll",
      () => {
        back.style.display = window.scrollY > 400 ? "block" : "none";
      },
      { passive: true },
    );
    back.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }
  initGlobalUX();
}

/* Ancestra's restrained page and scroll motion.
   Content is progressively revealed as it enters the viewport; all content
   remains available when reduced-motion is enabled or observers are unsupported. */
function initAncestraMotion() {
  const hero = document.querySelector(".hero");
  if (hero) hero.classList.add("hero-ready");

  const revealTargets = document.querySelectorAll("main > section, .page-hero");
  revealTargets.forEach((el, index) => {
    el.classList.add("ancestra-reveal");
  });

  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.body.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      (entries, io) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -55px 0px" },
    );
    revealTargets.forEach((el) => observer.observe(el));
  }

  /* The original navigation remains fixed while the page scrolls. */
  const nav = document.querySelector(".site-nav");
  if (nav) {
    const update = () =>
      nav.classList.toggle("is-scrolled", window.scrollY > 32);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }
}

/* The hero video is decorative: it plays silently in the background and is
   stopped completely when the reader prefers reduced motion, where CSS hides
   it and the static still takes over. */
function initHeroVideo() {
  const video = document.querySelector(".hero-video");
  if (!video) return;
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const apply = () => {
    if (preference.matches) {
      video.pause();
      return;
    }
    if (video.paused) {
      const attempt = video.play();
      if (attempt && typeof attempt.catch === "function")
        attempt.catch(() => {});
    }
  };
  apply();
  if (typeof preference.addEventListener === "function") {
    preference.addEventListener("change", apply);
  }
}

/* ---------- Small global UX improvements ---------- */
function initGlobalUX() {
  // Dark mode
  const darkBtn = document.getElementById("darkModeBtn");
  const applyDark = (on) => {
    document.body.classList.toggle("dark-mode", on);
    if (darkBtn) darkBtn.innerHTML = on ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon"></i>';
  };
  applyDark(Store.get("darkMode", false));
  if (darkBtn)
    darkBtn.addEventListener("click", () => {
      const on = !document.body.classList.contains("dark-mode");
      Store.set("darkMode", on);
      applyDark(on);
    });

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
  progress.innerHTML = "<span></span>";
  document.body.appendChild(progress);
  const progressBar = progress.firstElementChild;
  let ticking = false;
  const updateProgress = () => {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.transform = `scaleX(${Math.min(100, Math.max(0, amount)) / 100})`;
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    },
    { passive: true },
  );
  updateProgress();

  // Collapse the mobile menu after choosing a page; avoid leaving it over the content.
  const navCollapse = document.getElementById("mainNav");
  if (navCollapse && window.bootstrap?.Collapse) {
    navCollapse.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 991.98px)").matches) {
          bootstrap.Collapse.getOrCreateInstance(navCollapse, {
            toggle: false,
          }).hide();
        }
      });
    });
  }

  // Keyboard shortcut on the menu page: press / to focus menu search.
  const menuSearch = document.getElementById("searchInput");
  if (menuSearch) {
    document.addEventListener("keydown", (event) => {
      const target = event.target;
      const typing =
        target &&
        (target.isContentEditable ||
          /INPUT|TEXTAREA|SELECT/.test(target.tagName));
      if (
        event.key === "/" &&
        !typing &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        event.preventDefault();
        menuSearch.focus();
      }
      if (event.key === "Escape" && document.activeElement === menuSearch)
        menuSearch.blur();
    });
    const label = document.querySelector('label[for="searchInput"]');
    if (label && !label.querySelector("kbd"))
      label.insertAdjacentHTML(
        "beforeend",
        ' <kbd class="search-shortcut">/</kbd>',
      );
  }

  initPhotoViewer();
  initOnboardingAndShortcuts();
  // PWA
  if (!document.querySelector('link[rel="manifest"]')) {
    const l = document.createElement("link");
    l.rel = "manifest";
    l.href = "manifest.json";
    document.head.appendChild(l);
  }
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

function initOnboardingAndShortcuts() {
  // Keyboard shortcuts modal
  if (!document.getElementById("shortcutsModal")) {
    const m = document.createElement("div");
    m.className = "modal fade";
    m.id = "shortcutsModal";
    m.tabIndex = -1;
    m.innerHTML = `<div class="modal-dialog modal-dialog-centered"><div class="modal-content p-4">
      <h5 class="mb-2">Keyboard shortcuts</h5>
      <ul class="small mb-0">
        <li><kbd>/</kbd> — Focus menu search (on Menu page)</li>
        <li><kbd>?</kbd> — Show this help</li>
        <li><kbd>Esc</kbd> — Close dialogs / blur search</li>
      </ul>
      <button class="btn btn-blue btn-sm mt-3" data-bs-dismiss="modal" type="button">Close</button>
    </div></div>`;
    document.body.appendChild(m);
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const target = e.target;
      const typing = target && (target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(target.tagName));
      if (typing) return;
      e.preventDefault();
      new bootstrap.Modal(document.getElementById("shortcutsModal")).show();
    }
  });

  // Onboarding tour (first visit only)
  if (!Store.get("onboarded", false)) {
    Store.set("onboarded", true);
    const tour = document.createElement("div");
    tour.className = "modal fade";
    tour.id = "onboardModal";
    tour.tabIndex = -1;
    tour.innerHTML = `<div class="modal-dialog modal-dialog-centered"><div class="modal-content p-4 text-center">
      <div class="display-4 mb-2">👋</div>
      <h5>Welcome to Ancestra Cafe</h5>
      <p class="small text-muted-2">Browse the menu, add to cart, earn rewards points, and share reviews. Press <kbd>?</kbd> anytime for shortcuts.</p>
      <button class="btn btn-blue btn-sm" data-bs-dismiss="modal" type="button">Get started</button>
    </div></div>`;
    document.body.appendChild(tour);
    setTimeout(() => new bootstrap.Modal(tour).show(), 600);
  }
}

/* Accessible, dependency-free photo viewer for café photography and menu boards. */
function initPhotoViewer() {
  const candidates = document.querySelectorAll(
    ".photo img, .story-photo img, .menu-board-link img, a > img.menu-board",
  );
  if (!candidates.length) return;
  const dialog = document.createElement("dialog");
  dialog.className = "photo-viewer";
  dialog.setAttribute("aria-label", "Photo preview");
  dialog.innerHTML = `<button class="photo-viewer-close" type="button" aria-label="Close photo preview">×</button><figure><img alt=""><figcaption></figcaption></figure>`;
  document.body.appendChild(dialog);
  const preview = dialog.querySelector("img");
  const caption = dialog.querySelector("figcaption");
  const close = () => {
    if (dialog.open) dialog.close();
  };
  dialog.querySelector(".photo-viewer-close").addEventListener("click", close);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });
  dialog.addEventListener("close", () => {
    preview.removeAttribute("src");
  });

  candidates.forEach((img) => {
    const trigger = img.closest("a") || img;
    if (trigger.dataset.viewerReady) return;
    trigger.dataset.viewerReady = "true";
    if (trigger.tagName !== "A") {
      trigger.tabIndex = 0;
      trigger.setAttribute("role", "button");
      trigger.setAttribute(
        "aria-label",
        `View larger image: ${img.alt || "Ancestra Cafe photo"}`,
      );
    } else {
      trigger.setAttribute(
        "aria-label",
        `View larger image: ${img.alt || "Ancestra Cafe photo"}`,
      );
    }
    const open = (event) => {
      event.preventDefault();
      preview.src = img.currentSrc || img.src;
      preview.alt = img.alt || "Ancestra Cafe photo";
      caption.textContent = img.alt || "Ancestra Cafe";
      if (typeof dialog.showModal === "function") dialog.showModal();
    };
    trigger.addEventListener("click", open);
    if (trigger.tagName !== "A")
      trigger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open(event);
        }
      });
  });
}

function initPageTransition() {
  document.body.classList.add("page-loaded");
  document
    .querySelectorAll('a[href$=".html"], a[href*=".html#"], a[href*=".html?"]')
    .forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || link.target === "_blank" || href.startsWith("http")) return;
      link.addEventListener("click", (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        const target = new URL(href, location.href);
        if (target.pathname === location.pathname && target.hash) return;
        event.preventDefault();
        document.body.classList.add("page-leaving");
        window.setTimeout(() => {
          location.href = href;
        }, 220);
      });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  renderChrome();
  if (typeof Cart !== "undefined") Cart.init();
  initAncestraMotion();
  initHeroVideo();
  initPageTransition();
});
