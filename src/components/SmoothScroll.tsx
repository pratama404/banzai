"use client";

import { useEffect, useRef } from "react";
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
    duration: 0.72,
    ease: "power3.out",
    stagger: 0.075,
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

  useEffect(() => {
    const updateProgress = (explicitProgress?: number) => {
      const bar = progressBarRef.current;
      if (!bar) return;

      let pct = 0;
      if (typeof explicitProgress === "number" && Number.isFinite(explicitProgress)) {
        pct = Math.max(0, Math.min(1, explicitProgress));
      } else {
        const doc = document.documentElement;
        const maxScroll = doc.scrollHeight - window.innerHeight;
        pct = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0;
      }
      bar.style.transform = `scaleX(${pct})`;
    };

    const onNativeScroll = () => updateProgress();
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("resize", onNativeScroll, { passive: true });
    updateProgress();

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

    lenis.on("scroll", (e: { progress?: number }) => {
      ScrollTrigger.update();
      updateProgress(e.progress);
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
    };
  }, []);

  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = "scaleX(0)";
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const timer = window.setTimeout(() => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      const headings = document.querySelectorAll<HTMLElement>(
        ".landing-hero__title, .section-title, .hero h1, #category-title",
      );
      headings.forEach((heading) => {
        heading.dataset.gsapSplit = "true";
        animateHeadingWords(heading, true);
      });
      ScrollTrigger.refresh();
    }, 40);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress__bar" ref={progressBarRef} />
    </div>
  );
}
