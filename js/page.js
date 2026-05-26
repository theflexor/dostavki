/* ============================================================
   ПЕРЕВОЗКИ.kg — общий JS для внутренних SEO-страниц
   Подключается через <script defer src="/js/page.js">
   ============================================================ */

(() => {
  /* --------- nav: тёмный фон при скролле --------- */
  const nav = document.querySelector("[data-nav]");
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --------- мобильное бургер-меню --------- */
  const burger = document.querySelector("[data-burger]");
  const menu = document.querySelector("[data-menu]");
  if (burger && menu) {
    const close = () => {
      menu.classList.remove("is-open");
      burger.classList.remove("is-open");
      document.body.style.overflow = "";
    };
    burger.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  }

  /* --------- год в футере --------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* --------- GA4: трекинг WhatsApp / звонков --------- */
  function track(name, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params || {});
    }
  }
  document.querySelectorAll('a[href*="wa.me"]').forEach((el) => {
    el.addEventListener("click", () => {
      track("whatsapp_click", { event_category: "contact", page: location.pathname });
    });
  });
  document.querySelectorAll('a[href^="tel:"]').forEach((el) => {
    el.addEventListener("click", () => {
      track("phone_click", { event_category: "contact", page: location.pathname });
    });
  });

  /* --------- плавный скролл к якорям на той же странице --------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const tgt = document.querySelector(href);
      if (!tgt) return;
      e.preventDefault();
      const offset = 72;
      const y = tgt.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });
})();
