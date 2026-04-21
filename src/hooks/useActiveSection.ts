import { useEffect, useRef, useState } from "react";

type ScrollDirection = "up" | "down";
type SectionProgressMap = Record<string, number>;

export function useActiveSection(sectionIds: readonly string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");
  const [direction, setDirection] = useState<ScrollDirection>("down");
  const [progress, setProgress] = useState(0);
  const [sectionProgress, setSectionProgress] =
    useState<SectionProgressMap>({});

  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const isManualScroll = useRef(false);

  // 🔥 cache DOM elements (IMPORTANT)
  const elementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!sectionIds.length) return;

    elementsRef.current = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    // =========================
    // 🔥 HASH SYNC (CLICK MENU FIX)
    // =========================
    const onHashChange = () => {
      const hashId = window.location.hash.replace("#", "");
      if (hashId && sectionIds.includes(hashId)) {
        isManualScroll.current = true;
        setActiveId(hashId);

        setTimeout(() => {
          isManualScroll.current = false;
        }, 400);
      }
    };

    window.addEventListener("hashchange", onHashChange);

    // =========================
    // 🔥 SCROLL ENGINE
    // =========================
    const handleScroll = () => {
      const currentY = window.scrollY;

      // direction
      setDirection(currentY > lastScrollY.current ? "down" : "up");
      lastScrollY.current = currentY;

      // global progress
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const p = docHeight > 0 ? currentY / docHeight : 0;
      setProgress(Math.min(Math.max(p, 0), 1));

      let bestSection = sectionIds[0];
      let maxRatio = 0;

      const progressMap: SectionProgressMap = {};

      elementsRef.current.forEach((el) => {
        const id = el.id;
        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // 🔥 visible area
        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(rect.bottom, viewportHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        // 🔥 FIX: ratio theo chính section
        const ratio = visibleHeight / rect.height;

        // 🔥 SECTION PROGRESS (SMOOTH)
        const total = rect.height + viewportHeight;
        const current = viewportHeight - rect.top;
        let sectionP = current / total;

        // clamp
        sectionP = Math.min(Math.max(sectionP, 0), 1);

        // 🔥 OPTIONAL: easing nhẹ (mượt animation)
        sectionP = sectionP * sectionP * (3 - 2 * sectionP); // smoothstep

        progressMap[id] = sectionP;

        // 🔥 PICK ACTIVE SECTION
        if (ratio > maxRatio) {
          maxRatio = ratio;
          bestSection = id;
        }
      });

      setSectionProgress(progressMap);

      // tránh conflict khi click menu
      if (!isManualScroll.current) {
        setActiveId(bestSection);
      }
    };

    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    // =========================
    // 🔥 RESIZE FIX (IMPORTANT)
    // =========================
    const onResize = () => {
      elementsRef.current = sectionIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => Boolean(el));

      handleScroll();
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);

    // init
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [sectionIds.join(",")]);

  return {
    activeId,
    direction,
    progress,
    sectionProgress,
  };
}