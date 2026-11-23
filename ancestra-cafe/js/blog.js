/* ==========================================================
   Ancestra Cafe – blog flip cards.
   Each card flips between a cover/teaser face and the full
   post. Only one card is flipped at a time, and the open card
   is carried in the URL as ?post=<card-id> through
   history.replaceState, so sharing or reloading that link
   reopens it. No browser storage is used.
   ========================================================== */

(function () {
  const cards = () => Array.from(document.querySelectorAll(".blog-card"));

  const cardById = (id) => cards().find((card) => card.id === id) || null;

  const faceOf = (card, side) => card.querySelector(`.blog-card-${side}`);

  const isFlipped = (card) => card.classList.contains("is-flipped");

  const setInert = (el, inert) => {
    if (!el) return;
    if ("inert" in el) el.inert = inert;
    el.setAttribute("aria-hidden", inert ? "true" : "false");
  };

  /* The card height always matches the visible face, so the back can be
     taller than the front (rewards terms, policies) without an inner
     scrollbar: the grid row grows with the flipped card only. */
  const syncHeight = (card) => {
    const inner = card.querySelector(".blog-card-inner");
    const face = faceOf(card, isFlipped(card) ? "back" : "front");
    if (!inner || !face) return;
    inner.style.height = `${Math.round(face.offsetHeight)}px`;
  };

  /* Keep the hidden face out of the tab order and the accessibility tree,
     and mirror the flipped state onto both toggle buttons. */
  const syncA11y = (card) => {
    const flipped = isFlipped(card);
    setInert(faceOf(card, "front"), flipped);
    setInert(faceOf(card, "back"), !flipped);
    card.querySelectorAll(".blog-toggle").forEach((btn) =>
      btn.setAttribute("aria-expanded", flipped ? "true" : "false"),
    );
  };

  /* The open card lives in the URL instead of localStorage. */
  const syncUrl = (id) => {
    try {
      const url = new URL(window.location.href);
      if (id) url.searchParams.set("post", id);
      else url.searchParams.delete("post");
      window.history.replaceState(null, "", url.toString());
    } catch (e) {
      /* URL update unavailable (e.g. file:// restrictions); flipping still works */
    }
  };

  const applyFlip = (card, open) => {
    card.classList.toggle("is-flipped", open);
    syncA11y(card);
    syncHeight(card);
  };

  const flip = (id, open, { updateUrl = true, focus = false } = {}) => {
    const card = cardById(id);
    if (!card || isFlipped(card) === open) return false;

    // Only one card may be open at a time.
    if (open) {
      cards().forEach((other) => {
        if (other !== card && isFlipped(other)) applyFlip(other, false);
      });
    }

    applyFlip(card, open);
    if (updateUrl) syncUrl(open ? id : null);

    if (focus) {
      const face = faceOf(card, open ? "back" : "front");
      const btn = face && face.querySelector(".blog-toggle");
      if (btn && typeof btn.focus === "function") btn.focus({ preventScroll: true });
    }
    return true;
  };

  /* ---------- wiring ---------- */
  function initBlogCards() {
    const list = cards();
    if (!list.length) return;

    list.forEach((card) => {
      syncA11y(card); // honours the static inert/aria-hidden on the back face

      // Clicking a face (but not its links or buttons) flips the card.
      card.querySelectorAll(".blog-card-face").forEach((face) => {
        face.addEventListener("click", (event) => {
          if (event.target.closest("a, button, input, select, textarea")) return;
          flip(card.id, !isFlipped(card));
        });
      });

      card.querySelectorAll(".blog-toggle").forEach((btn) => {
        btn.addEventListener("click", () => {
          flip(card.id, !isFlipped(card), { focus: true });
        });
      });
    });

    // Reopen the card named by the link: ?post=<id>, with the older
    // #hash form accepted so existing bookmarks keep working.
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("post");
    const fromHash = decodeURIComponent(
      (window.location.hash || "").replace(/^#/, ""),
    );
    let target = null;
    let openedFromHash = false;
    if (fromQuery && cardById(fromQuery)) {
      target = fromQuery;
    } else if (fromHash && cardById(fromHash)) {
      target = fromHash;
      openedFromHash = true;
    }

    if (target) {
      flip(target, true, { updateUrl: true });
      if (openedFromHash) {
        // Normalise old #hash links to the ?post= form.
        try {
          const url = new URL(window.location.href);
          url.hash = "";
          window.history.replaceState(null, "", url.toString());
        } catch (e) {
          /* ignore */
        }
      }
    }

    // Fonts and window size change how the faces measure; keep the height
    // of the visible face correct.
    let frame = null;
    const reflow = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        cards().forEach((card) => syncHeight(card));
      });
    };
    window.addEventListener("resize", reflow);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(reflow).catch(() => {});
    }

    // The policies accordion changes the back face's height while flipped.
    ["shown.bs.collapse", "hidden.bs.collapse"].forEach((name) => {
      document.addEventListener(name, (event) => {
        const card = event.target.closest?.(".blog-card");
        if (card && isFlipped(card)) syncHeight(card);
      });
    });
    if (typeof initReactions === "function") initReactions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBlogCards);
  } else {
    initBlogCards();
  }
})();
