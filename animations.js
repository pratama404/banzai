/**
 * Lenis Smooth Scroll + GSAP ScrollTrigger — Word-by-word heading reveal
 */
(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initSmoothScroll() {
    if (prefersReducedMotion || typeof window.Lenis === "undefined") return null;

    const lenis = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    if (typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined") {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Smooth scroll for in-page anchor links (e.g. #materi)
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const targetId = anchor.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          lenis.scrollTo(targetEl, { offset: -20 });
        }
      });
    });

    return lenis;
  }

  function splitNodeIntoWords(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text || !text.trim()) return document.createTextNode(text || "");

      const frag = document.createDocumentFragment();
      const parts = text.split(/(\s+)/);

      for (const part of parts) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(" "));
        } else {
          const mask = document.createElement("span");
          mask.className = "word-mask";
          const unit = document.createElement("span");
          unit.className = "word-unit";
          unit.textContent = part;
          mask.appendChild(unit);
          frag.appendChild(mask);
        }
      }
      return frag;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === "BR") {
        return node.cloneNode(false);
      }
      if (node.classList.contains("word-mask")) {
        return node.cloneNode(true);
      }
      const clone = node.cloneNode(false);
      for (const child of Array.from(node.childNodes)) {
        clone.appendChild(splitNodeIntoWords(child));
      }
      return clone;
    }

    return document.createTextNode("");
  }

  function prepareHeadingWords(heading) {
    const frag = document.createDocumentFragment();
    for (const child of Array.from(heading.childNodes)) {
      frag.appendChild(splitNodeIntoWords(child));
    }
    heading.replaceChildren(frag);
    return heading.querySelectorAll(".word-unit");
  }

  function animateHeadingWords(heading, useScrollTrigger = true) {
    if (!heading || prefersReducedMotion || typeof window.gsap === "undefined") return;

    const words = prepareHeadingWords(heading);
    if (!words.length) return;

    const tweenConfig = {
      yPercent: 0,
      opacity: 1,
      rotateZ: 0,
      duration: 0.72,
      ease: "power3.out",
      stagger: 0.075,
    };

    if (useScrollTrigger && typeof window.ScrollTrigger !== "undefined") {
      tweenConfig.scrollTrigger = {
        trigger: heading,
        start: "top 88%",
        toggleActions: "play none none reverse",
      };
    }

    window.gsap.fromTo(
      words,
      { yPercent: 115, opacity: 0, rotateZ: 2 },
      tweenConfig,
    );
  }

  function initAnimations() {
    if (prefersReducedMotion) return;

    if (typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined") {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }

    initSmoothScroll();

    const headings = document.querySelectorAll(
      ".landing-hero__title, .section-title, .hero h1, #category-title",
    );

    headings.forEach((heading) => {
      heading.dataset.gsapSplit = "true";
      animateHeadingWords(heading, true);
    });
  }

  window.animateHeadingWords = animateHeadingWords;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAnimations);
  } else {
    initAnimations();
  }
})();
