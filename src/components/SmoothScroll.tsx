"use client";

import { useEffect } from "react";
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
  // Restore original raw HTML if previously split
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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    window.animateHeadingWords = animateHeadingWords;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);
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
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
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

  return null;
}
