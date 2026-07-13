(function () {
  const doc = document.documentElement;
  const body = document.body;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function initLoader() {
    const loader = document.querySelector("[data-loader]");
    if (!loader) return;

    const hasLoaded = sessionStorage.getItem("marketrova-loader-seen") === "true";
    if (hasLoaded) {
      loader.classList.add("is-hidden");
      body.classList.remove("is-loading");
      return;
    }

    body.classList.add("is-loading");
    window.setTimeout(() => {
      loader.classList.add("is-hidden");
      body.classList.remove("is-loading");
      sessionStorage.setItem("marketrova-loader-seen", "true");
    }, prefersReducedMotion ? 120 : 1150);
  }

  function initHeader() {
    const header = document.querySelector("[data-header]");
    if (!header) return;

    const update = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function initMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const menu = document.querySelector("[data-mobile-menu]");
    if (!toggle || !menu) return;

    const setOpen = (isOpen) => {
      body.classList.toggle("menu-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      menu.setAttribute("aria-hidden", String(!isOpen));
    };

    toggle.addEventListener("click", () => {
      setOpen(!body.classList.contains("menu-open"));
    });

    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  function initCursor() {
    if (!canHover || prefersReducedMotion) return;

    const cursor = document.querySelector("[data-cursor]");
    const follower = document.querySelector("[data-cursor-follower]");
    const label = document.querySelector("[data-cursor-label]");
    if (!cursor || !follower || !label) return;

    body.classList.add("cursor-ready");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let fx = x;
    let fy = y;

    window.addEventListener("mousemove", (event) => {
      x = event.clientX;
      y = event.clientY;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      label.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    const tick = () => {
      fx += (x - fx) * 0.16;
      fy += (y - fy) * 0.16;
      follower.style.transform = `translate3d(${fx}px, ${fy}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    tick();

    document.addEventListener("mouseover", (event) => {
      const interactive = event.target.closest("a, button, input, textarea, [data-cursor-hover]");
      const view = event.target.closest("[data-cursor-view]");
      body.classList.toggle("cursor-hover", Boolean(interactive || view));
      body.classList.toggle("cursor-view", Boolean(view));
    });

    document.addEventListener("mouseout", (event) => {
      if (!event.relatedTarget || !document.body.contains(event.relatedTarget)) {
        body.classList.remove("cursor-hover", "cursor-view");
      }
    });
  }

  function initMagnetic() {
    if (!canHover || prefersReducedMotion) return;

    document.querySelectorAll("[data-magnetic]").forEach((element) => {
      element.addEventListener("mousemove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
        element.style.setProperty("--mx", `${x}px`);
        element.style.setProperty("--my", `${y}px`);
      });

      element.addEventListener("mouseleave", () => {
        element.style.setProperty("--mx", "0px");
        element.style.setProperty("--my", "0px");
      });
    });
  }

  function initReveal() {
    const elements = document.querySelectorAll("[data-animate]");
    if (!elements.length) return;

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });

    elements.forEach((element) => observer.observe(element));
  }

  function initHomeData() {
    alert("THIS IS MY MAIN.JS");
    const data = window.MARKETROVA_DATA || {};
    const services = data.services || [];
    const serviceTiles = document.querySelectorAll("[data-service-list] .service-tile");

    console.log("Services:", services);
console.log("Tiles:", serviceTiles);
console.log("First title before:", serviceTiles[0]?.querySelector("h3")?.textContent);

    serviceTiles.forEach((tile, index) => {
      const service = services[index];
      if (!service) return;
      const number = tile.querySelector("span");
      const title = tile.querySelector("h3");
      const summary = tile.querySelector("p");
      if (number) number.textContent = String(index + 1).padStart(2, "0");
      if (title) title.textContent = service.title;
      if (summary) summary.textContent = service.summary;
      tile.dataset.serviceShape = service.shape;
    });
  }

  function initHeroSystem() {
    const stage = document.querySelector("[data-hero-scene]");
    const system = stage ? stage.querySelector(".growth-map") : null;
    if (!system || !stage || prefersReducedMotion) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let visible = true;

    const setFromPointer = (event) => {
      const rect = stage.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      targetY = px * 10;
      targetX = py * -8;
    };

    const reset = () => {
      targetX = 0;
      targetY = 0;
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          visible = entry.isIntersecting;
        });
      }, { threshold: 0.08 });
      observer.observe(stage);
    }

    if (canHover) {
      stage.addEventListener("mousemove", setFromPointer, { passive: true });
      stage.addEventListener("mouseleave", reset);
    }

    const tick = () => {
      if (visible) {
        const rect = stage.getBoundingClientRect();
        const scrollInfluence = Math.max(-5, Math.min((window.innerHeight * 0.5 - rect.top) / 80, 7));
        currentX += (targetX + scrollInfluence - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        system.style.setProperty("--rx", `${currentX.toFixed(2)}deg`);
        system.style.setProperty("--ry", `${currentY.toFixed(2)}deg`);
      }
      requestAnimationFrame(tick);
    };

    tick();
  }

  function initSystemSteps() {
    const steps = document.querySelectorAll("[data-system-steps] .system-step");
    const visual = document.querySelector(".system-visual");
    if (!steps.length) return;

    const setActive = (target) => {
      steps.forEach((step) => step.classList.toggle("is-active", step === target));
      if (visual) visual.dataset.activeModule = target.dataset.module || "";
    };

    steps.forEach((step) => {
      step.addEventListener("mouseenter", () => setActive(step));
      step.addEventListener("focusin", () => setActive(step));
    });

    if (!("IntersectionObserver" in window) || prefersReducedMotion) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target);
      });
    }, { rootMargin: "-35% 0px -40% 0px", threshold: 0.2 });

    steps.forEach((step) => observer.observe(step));
  }

  function initClickRipple() {
    document.addEventListener("click", (event) => {
      const target = event.target.closest(".btn, .nav-link, .mobile-menu a");
      if (!target) return;

      const ripple = document.createElement("span");
      if (getComputedStyle(target).position === "static") {
        target.style.position = "relative";
      }
      ripple.style.position = "absolute";
      ripple.style.inset = "50% auto auto 50%";
      ripple.style.width = "0.5rem";
      ripple.style.height = "0.5rem";
      ripple.style.borderRadius = "999px";
      ripple.style.background = "rgba(255,255,255,0.45)";
      ripple.style.pointerEvents = "none";
      ripple.style.transform = "translate(-50%, -50%) scale(1)";
      ripple.style.transition = "transform 520ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 520ms";
      target.style.overflow = "hidden";
      target.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.style.transform = "translate(-50%, -50%) scale(20)";
        ripple.style.opacity = "0";
      });
      window.setTimeout(() => ripple.remove(), 560);
    });
  }

  initLoader();
  initHeader();
  initMenu();
  initCursor();
  initMagnetic();
  initReveal();
  initHomeData();
  initHeroSystem();
  initSystemSteps();
  initClickRipple();

  doc.classList.add("js-ready");
})();
