/* =========================================================
   110 STREET — animations.js
   Fichier AJOUTÉ après script.js : il ne modifie pas ta logique.
   - le plat du hero tourne au scroll
   - les plats / étapes apparaissent quand on les voit
   - le panier réagit quand on ajoute un plat
   - le formulaire secoue en cas d'erreur
   ========================================================= */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Prévient le filet de sécurité de index.html que le script a bien démarré
  window.__animReady = true;

  /* ---------- 1. Le plat tourne au scroll ---------- */
  const visual = $('.hero-visual');
  const plate  = $('.hero-image-placeholder img');

  if (visual && plate && !reduceMotion) {
    const DEG_PER_PX = 0.28;   // 0.28° par pixel scrollé (≈ 1 tour toutes les 1300 px)
    let targetY = window.scrollY;
    let currentY = targetY;
    let raf = 0;
    let visible = true;

    const renderPlate = () => {
      currentY += (targetY - currentY) * 0.12;          // lissage
      plate.style.rotate    = (currentY * DEG_PER_PX).toFixed(2) + 'deg';
      plate.style.scale     = Math.max(0.82, 1 - currentY / 2400).toFixed(3);
      plate.style.translate = '0 ' + (currentY * 0.06).toFixed(1) + 'px';
      raf = Math.abs(targetY - currentY) > 0.1 ? requestAnimationFrame(renderPlate) : 0;
    };

    const requestPlate = () => {
      targetY = window.scrollY;
      if (visible && !raf) raf = requestAnimationFrame(renderPlate);
    };

    // On ne calcule que lorsque le plat est (presque) à l'écran
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) requestPlate();
      }, { rootMargin: '200px 0px' }).observe(visual);
    }

    window.addEventListener('scroll', requestPlate, { passive: true });
    requestPlate();
  }

  /* ---------- 2. Apparition au scroll (plats, étapes) ---------- */
  const revealObserver = ('IntersectionObserver' in window && !reduceMotion)
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add('is-visible');
          revealObserver.unobserve(el);
          // on retire le délai pour ne pas ralentir le survol ensuite
          setTimeout(() => { el.style.transitionDelay = ''; }, 1400);
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' })
    : null;

  const reveal = (el, delayMs = 0) => {
    if (!el || el.dataset.revealed) return;
    el.dataset.revealed = '1';
    if (!revealObserver) { el.classList.add('is-visible'); return; }
    if (delayMs) el.style.transitionDelay = delayMs + 'ms';
    revealObserver.observe(el);
  };

  // Étapes « Comment commander » + illustration
  $$('.step').forEach((el, i) => reveal(el, i * 110));
  reveal($('.ordering-visual'));

  // Plats : générés par script.js (displayProducts), donc on surveille la grille
  const grid = $('#productsGrid');
  if (grid) {
    const revealCards = () => {
      const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length || 2;
      $$('.product-card', grid).forEach((card, i) => reveal(card, (i % cols) * 90));
    };
    new MutationObserver(revealCards).observe(grid, { childList: true });
    revealCards();
  }

  /* ---------- 3. Le panier réagit ---------- */
  const retrigger = (el, cls) => {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth;                  // relance l'animation
    el.classList.add(cls);
    el.addEventListener('animationend', () => el.classList.remove(cls), { once: true });
  };

  const cartButton = $('#openCart');

  // Compteur, total (dans le panier) et bouton flottant
  ['cartCount', 'drawerCount', 'cartTotal'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    let last = el.textContent;
    new MutationObserver(() => {
      if (el.textContent === last) return;      // updateCart() réécrit parfois la même valeur
      last = el.textContent;
      retrigger(el, 'bump');
      if (id === 'cartCount') retrigger(cartButton, 'wiggle');
    }).observe(el, { childList: true, characterData: true, subtree: true });
  });

  // Pastille jaune qui vole du bouton « Ajouter » vers le panier
  const flyToCart = (fromEl) => {
    if (!cartButton) return;
    const a = fromEl.getBoundingClientRect();
    const b = cartButton.getBoundingClientRect();
    const size = 18;
    const sx = a.left + a.width / 2 - size / 2;
    const sy = a.top  + a.height / 2 - size / 2;
    const ex = b.left + b.width / 2 - size / 2;
    const ey = b.top  + b.height / 2 - size / 2;
    const mx = (sx + ex) / 2;
    const my = Math.min(sy, ey) - 90;

    const dot = document.createElement('span');
    dot.className = 'fly-dot';
    document.body.appendChild(dot);

    dot.animate([
      { transform: `translate(${sx}px, ${sy}px) scale(1)`,    opacity: 1 },
      { transform: `translate(${mx}px, ${my}px) scale(1.25)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${ex}px, ${ey}px) scale(.3)`,   opacity: 0.2 }
    ], { duration: 700, easing: 'cubic-bezier(.4, 0, .2, 1)' }).onfinish = () => dot.remove();
  };

  if (grid) {
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.add-cart');
      if (!btn) return;
      retrigger(btn, 'is-pop');
      if (!reduceMotion) flyToCart(btn);
    });
  }

  // À l'ouverture du panier, les articles glissent l'un après l'autre
  const drawer = $('#cartDrawer');
  const items  = $('#cartItems');
  if (drawer && items && !reduceMotion) {
    let wasOpen = drawer.classList.contains('active');
    new MutationObserver(() => {
      const isOpen = drawer.classList.contains('active');
      if (isOpen && !wasOpen) {
        items.classList.add('stagger-in');
        setTimeout(() => items.classList.remove('stagger-in'), 900);
      }
      wasOpen = isOpen;
    }).observe(drawer, { attributes: true, attributeFilter: ['class'] });
  }

  /* ---------- 4. Le formulaire secoue en cas d'erreur ---------- */
  const formError = $('#formError');
  const modalBox  = $('.checkout-modal');
  if (formError && modalBox && !reduceMotion) {
    new MutationObserver(() => {
      if (formError.textContent.trim()) retrigger(modalBox, 'shake');
    }).observe(formError, { childList: true, characterData: true, subtree: true });
  }
})();