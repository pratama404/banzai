"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

declare global {
  interface Window {
    animateHeadingWords?: (heading: HTMLElement, useScrollTrigger?: boolean) => void;
  }
}

function splitNodeIntoWords(node: Node): Node {
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
    const el = node as HTMLElement;
    if (el.tagName === "BR") {
      return el.cloneNode(false);
    }
    if (el.classList.contains("word-mask")) {
      return el.cloneNode(true);
    }
    const clone = el.cloneNode(false);
    for (const child of Array.from(el.childNodes)) {
      clone.appendChild(splitNodeIntoWords(child));
    }
    return clone;
  }

  return document.createTextNode("");
}

function prepareHeadingWords(heading: HTMLElement): NodeListOf<HTMLElement> {
  if (heading.dataset.originalHtml) {
    heading.innerHTML = heading.dataset.originalHtml;
  } else {
    heading.dataset.originalHtml = heading.innerHTML;
  }

  const frag = document.createDocumentFragment();
  for (const child of Array.from(heading.childNodes)) {
    frag.appendChild(splitNodeIntoWords(child));
  }
  heading.replaceChildren(frag);
  return heading.querySelectorAll<HTMLElement>(".word-unit");
}

export function animateHeadingWords(heading: HTMLElement, useScrollTrigger = true) {
  if (!heading) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const words = prepareHeadingWords(heading);
  if (!words.length) return;

  const tweenConfig: gsap.TweenVars = {
    yPercent: 0,
    opacity: 1,
    rotateZ: 0,
    duration: 0.78,
    ease: "power3.out",
    stagger: 0.08,
  };

  if (useScrollTrigger) {
    tweenConfig.scrollTrigger = {
      trigger: heading,
      start: "top 88%",
      toggleActions: "play none none reverse",
    };
  }

  gsap.fromTo(
    words,
    { yPercent: 115, opacity: 0, rotateZ: 2 },
    tweenConfig,
  );
}

export default function SmoothScroll() {
  const pathname = usePathname();
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const updateScrollUI = (explicitProgress?: number, explicitScrollY?: number) => {
      const bar = progressBarRef.current;
      const y = typeof explicitScrollY === "number" ? explicitScrollY : window.scrollY;

      if (bar) {
        let pct = 0;
        if (typeof explicitProgress === "number" && Number.isFinite(explicitProgress)) {
          pct = Math.max(0, Math.min(1, explicitProgress));
        } else {
          const doc = document.documentElement;
          const maxScroll = doc.scrollHeight - window.innerHeight;
          pct = maxScroll > 0 ? Math.max(0, Math.min(1, y / maxScroll)) : 0;
        }
        bar.style.transform = `scaleX(${pct})`;
      }

      // Navbar scroll shrink on landing page
      const transparentNav = document.querySelector(".topbar--transparent");
      if (transparentNav) {
        transparentNav.classList.toggle("is-scrolled", y > 40);
      }

      setShowBackTop(y > 380);
    };

    const onNativeScroll = () => updateScrollUI();
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("resize", onNativeScroll, { passive: true });
    updateScrollUI();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        window.removeEventListener("scroll", onNativeScroll);
        window.removeEventListener("resize", onNativeScroll);
      };
    }

    gsap.registerPlugin(ScrollTrigger);
    window.animateHeadingWords = animateHeadingWords;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", (e: { progress?: number; scroll?: number }) => {
      ScrollTrigger.update();
      updateScrollUI(e.progress, e.scroll);
    });
    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      const dest = document.querySelector(href);
      if (dest instanceof HTMLElement) {
        e.preventDefault();
        lenis.scrollTo(dest, { offset: -20 });
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("resize", onNativeScroll);
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = "scaleX(0)";
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    let ctx: gsap.Context | null = null;

    const timer = window.setTimeout(() => {
      ScrollTrigger.getAll().forEach((st) => st.kill());

      ctx = gsap.context(() => {
        // 1. Immediate dramatic Hero Text Reveal + CTA + Slogans on page load
        const heroTitle = document.querySelector<HTMLElement>(".landing-hero__title");
        if (heroTitle) {
          heroTitle.dataset.gsapSplit = "true";
          animateHeadingWords(heroTitle, false);
        }

        const heroCta = document.querySelector<HTMLElement>(".landing-hero__cta");
        if (heroCta) {
          gsap.fromTo(
            heroCta,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, delay: 0.35, ease: "power3.out" },
          );
        }

        const heroSlogans = document.querySelectorAll<HTMLElement>(".hero-slogan");
        if (heroSlogans.length) {
          gsap.fromTo(
            heroSlogans,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              delay: 0.45,
              stagger: 0.12,
              ease: "power3.out",
            },
          );
        }

        // 2. Smooth Parallax on Hero Background
        const heroSection = document.querySelector<HTMLElement>(".landing-hero");
        const heroBgImg = document.querySelector<HTMLElement>(".landing-hero__bg img");
        if (heroSection && heroBgImg) {
          gsap.fromTo(
            heroBgImg,
            { yPercent: -4, scale: 1.08 },
            {
              yPercent: 14,
              scale: 1.14,
              ease: "none",
              scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }

        // 3. Scroll-triggered word reveal for section headings
        const headings = document.querySelectorAll<HTMLElement>(
          ".section-title, .hero h1, #category-title",
        );
        headings.forEach((heading) => {
          heading.dataset.gsapSplit = "true";
          animateHeadingWords(heading, true);
        });

        // 4. About section fade-in reveal
        const aboutText = document.querySelector<HTMLElement>(".about-section__text");
        const aboutImage = document.querySelector<HTMLElement>(".about-section__image");
        if (aboutText) {
          gsap.fromTo(
            aboutText.querySelectorAll("p, .about-stat"),
            { y: 26, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: aboutText,
                start: "top 82%",
                once: true,
              },
            },
          );
        }
        if (aboutImage) {
          gsap.fromTo(
            aboutImage,
            { y: 36, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: aboutImage,
                start: "top 84%",
                once: true,
              },
            },
          );
        }

        // 5. Animated Counters on About Stats (0 -> target)
        const counters = document.querySelectorAll<HTMLElement>("[data-count-to]");
        counters.forEach((el) => {
          const target = Number(el.dataset.countTo || "0");
          if (!Number.isFinite(target) || target <= 0) return;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: target > 100 ? 1.5 : 1.0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
            onUpdate: () => {
              el.textContent = String(Math.round(obj.val));
            },
          });
        });

        // 6. Staggered Scroll Reveal for Materi Preview Cards
        const materiGrid = document.querySelector<HTMLElement>(".materi-grid");
        const materiCards = document.querySelectorAll<HTMLElement>(".materi-card");
        if (materiGrid && materiCards.length) {
          gsap.fromTo(
            materiCards,
            { y: 34, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: materiGrid,
                start: "top 84%",
                once: true,
              },
            },
          );
        }
      });

      ScrollTrigger.refresh();
    }, 40);

    return () => {
      window.clearTimeout(timer);
      ctx?.revert();
    };
  }, [pathname]);

  function handleBackToTop() {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.1 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <div className="scroll-progress__bar" ref={progressBarRef} />
      </div>

      <button
        type="button"
        className={`back-to-top${showBackTop ? " is-visible" : ""}`}
        aria-label="Kembali ke atas"
        title="Kembali ke atas"
        onClick={handleBackToTop}
      >
        ↑
      </button>
    </>
  );
}
