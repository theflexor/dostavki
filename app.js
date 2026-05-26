/* ============================================================
   ПЕРЕВОЗКИ.kg — минимум JS: smooth scroll, fade-in, калькулятор
   ============================================================ */

(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- ГОД В ФУТЕРЕ ---------------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------------- LENIS SMOOTH SCROLL ---------------- */
  let lenis = null;
  if (window.Lenis && !prefersReduced) {
    lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  /* ---------------- НАВИГАЦИЯ — фон при скролле ---------------- */
  const nav = document.querySelector("[data-nav]");
  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 30);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- ПЛАВНЫЕ ЯКОРЯ ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const tgt = document.querySelector(href);
      if (!tgt) return;
      e.preventDefault();
      const offset = 72;
      if (lenis) {
        lenis.scrollTo(tgt, { offset: -offset, duration: 1.2 });
      } else {
        const y = tgt.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
      closeMenu();
    });
  });

  /* ---------------- МОБИЛЬНОЕ МЕНЮ ---------------- */
  const burger = document.querySelector("[data-burger]");
  const menu = document.querySelector("[data-menu]");
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("is-open");
    burger.classList.remove("is-open");
    if (lenis) lenis.start();
    document.body.style.overflow = "";
  }
  if (burger && menu) {
    burger.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      if (lenis) open ? lenis.stop() : lenis.start();
      document.body.style.overflow = open ? "hidden" : "";
    });
    // закрытие меню при клике по ЛЮБОЙ ссылке (включая внешние пути типа /faq/)
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  }

  /* ---------------- FADE-IN ПРИ СКРОЛЛЕ ---------------- */
  if (!prefersReduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    document.querySelectorAll("[data-fade]").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll("[data-fade]").forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------- БЕГУЩАЯ СТРОКА ---------------- */
  const marquee = document.querySelector("[data-marquee]");
  if (marquee && !prefersReduced) {
    // дублируем для бесшовности
    marquee.innerHTML += marquee.innerHTML;
    if (window.gsap) {
      gsap.to(marquee, {
        xPercent: -50,
        ease: "none",
        duration: 35,
        repeat: -1,
      });
    }
  }

  /* ---------------- СЧЁТЧИКИ ---------------- */
  const fmt = (n) => n.toLocaleString("ru-RU");
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    if (!isFinite(target)) return;
    el.textContent = "0";

    const run = () => {
      if (el._counted) return;
      el._counted = true;
      const start = performance.now();
      const dur = 1500;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = fmt(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => { if (e.isIntersecting) { run(); obs.unobserve(e.target); } });
      }, { threshold: 0.4 });
      io.observe(el);
    } else { run(); }
  });

  /* ---------------- КАЛЬКУЛЯТОР ---------------- */
  const calc = {
    car: 1200,
    carLabel: "Спринтер будка",
    hours: 2,
    loaders: 0,
    floor: 1,
    lift: true,
    furniture: false,
  };
  const LOADER_RATE = 500;
  const FURNITURE_FEE = 1500;

  const $price = document.querySelector("[data-price]");
  const $breakCar = document.querySelector("[data-break='car']");
  const $breakLoaders = document.querySelector("[data-break='loaders']");
  const $breakFloor = document.querySelector("[data-break='floor']");
  const $outCar = document.querySelector("[data-out='car']");
  const $outLink = document.querySelector("[data-out='link']");

  let priceAnimFrame = null;
  function animateNum(el, to, dur = 400) {
    if (priceAnimFrame) cancelAnimationFrame(priceAnimFrame);
    const from = parseInt(el.textContent.replace(/\D/g, ""), 10) || 0;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(from + (to - from) * eased);
      el.textContent = fmt(val);
      if (t < 1) priceAnimFrame = requestAnimationFrame(step);
    };
    priceAnimFrame = requestAnimationFrame(step);
  }

  const $breakFurniture = document.querySelector("[data-break='furniture']");

  function compute() {
    const carCost = calc.car * calc.hours;
    const loadersCost = calc.loaders * LOADER_RATE * calc.hours;
    const floorExtra = calc.lift ? 0 : Math.round((calc.floor - 1) * 0.2 * carCost);
    const furnitureCost = calc.furniture ? FURNITURE_FEE : 0;
    const total = carCost + loadersCost + floorExtra + furnitureCost;

    if ($price) animateNum($price, total);
    if ($breakCar) $breakCar.textContent = fmt(carCost);
    if ($breakLoaders) $breakLoaders.textContent = fmt(loadersCost);
    if ($breakFloor) $breakFloor.textContent = fmt(floorExtra);
    if ($breakFurniture) $breakFurniture.textContent = fmt(furnitureCost);
    if ($outCar) $outCar.textContent = calc.carLabel;

    if ($outLink) {
      const parts = [
        calc.carLabel,
        `${calc.hours} ч`,
        `${calc.loaders} грузчика`,
        `${calc.floor} этаж${calc.lift ? "" : " (без лифта)"}`,
      ];
      if (calc.furniture) parts.push("с разборкой/сборкой мебели");
      const msg = `Здравствуйте! Хочу заказать: ${parts.join(", ")}. Итого ≈ ${fmt(total)} сом.`;
      $outLink.href = `https://wa.me/996505848591?text=${encodeURIComponent(msg)}`;
    }
  }

  document.querySelectorAll(".calc__tabs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".calc__tabs button").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      calc.car = parseInt(btn.dataset.car, 10);
      calc.carLabel = btn.dataset.label;
      compute();
    });
  });

  document.querySelectorAll("[data-input]").forEach((inp) => {
    const key = inp.dataset.input;
    inp.addEventListener("input", () => {
      if (inp.type === "checkbox") {
        calc[key] = inp.checked;
      } else {
        calc[key] = parseInt(inp.value, 10);
        const out = document.querySelector(`[data-out='${key}']`);
        if (out) out.textContent = inp.value;
      }
      compute();
    });
  });

  compute();

  /* ---------------- ANALYTICS / CONVERSIONS ---------------- */
  // Безопасный wrapper — работает даже если GA4 ещё не загрузился или ID не указан
  function track(name, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params || {});
    }
  }

  // WhatsApp клики — конверсия
  document.querySelectorAll('a[href*="wa.me"]').forEach((el) => {
    el.addEventListener("click", () => {
      const phone = (el.href.match(/wa\.me\/(\d+)/) || [])[1] || "unknown";
      track("whatsapp_click", {
        event_category: "contact",
        event_label: el.textContent.trim().slice(0, 60),
        phone_number: phone,
      });
    });
  });

  // Клики по телефону
  document.querySelectorAll('a[href^="tel:"]').forEach((el) => {
    el.addEventListener("click", () => {
      track("phone_click", {
        event_category: "contact",
        event_label: el.href.replace("tel:", ""),
      });
    });
  });

  // Главная конверсия — нажатие «Оформить заказ» в калькуляторе с указанием суммы
  const $orderLink = document.querySelector("[data-out='link']");
  if ($orderLink) {
    $orderLink.addEventListener("click", () => {
      const priceText = document.querySelector("[data-price]")?.textContent || "0";
      const value = parseInt(priceText.replace(/\D/g, ""), 10) || 0;
      track("generate_lead", {
        event_category: "conversion",
        event_label: "calculator_submit",
        value: value,
        currency: "KGS",
        car: calc.carLabel,
        hours: calc.hours,
        loaders: calc.loaders,
        furniture: calc.furniture,
      });
    });
  }

  // Использование калькулятора (хотя бы один клик по ползунку/табу) — soft conversion
  let calcUsed = false;
  document.querySelectorAll(".calc__tabs button, [data-input]").forEach((el) => {
    el.addEventListener("change", markCalcUsed);
    el.addEventListener("click", markCalcUsed);
  });
  function markCalcUsed() {
    if (calcUsed) return;
    calcUsed = true;
    track("calc_interaction", { event_category: "engagement" });
  }

})();
