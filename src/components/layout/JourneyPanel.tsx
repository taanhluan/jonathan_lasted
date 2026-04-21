import { AnimatePresence, motion } from "framer-motion";
import { Compass, X } from "lucide-react";
import { useEffect, useState } from "react";
import { sections } from "../../data/portfolioData";
import { cn } from "../../utils/cn";

type JourneyPanelProps = {
  activeId: string;
  sectionProgress: Record<string, number>;
};

export function JourneyPanel({
  activeId,
  sectionProgress,
}: JourneyPanelProps) {
  const [open, setOpen] = useState(false);

  const currentIndex = Math.max(
    0,
    sections.findIndex((section) => section.id === activeId),
  );
  const currentSection = sections[currentIndex] ?? sections[0];

  // 🔥 ESC CLOSE
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // 🔥 SMOOTH SCROLL
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="fixed bottom-8 left-4 z-40 hidden xl:block">
      <div className="flex items-center gap-3">
        {/* 🔥 TOGGLE BUTTON */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className={cn(
            "group inline-flex items-center gap-3 rounded-full border px-4 py-3 backdrop-blur-xl transition-all duration-300",
            open
              ? "border-gold/30 bg-graphite/90 text-ivory shadow-theater"
              : "border-white/10 bg-black/45 text-smoke shadow-luxe hover:border-gold/20 hover:text-ivory",
          )}
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold">
            {open ? <X size={16} /> : <Compass size={16} />}
          </span>

          <span className="text-left">
            <span className="block text-[10px] uppercase tracking-[0.32em] text-gold/75">
              Journey
            </span>

            {/* 🔥 CURRENT SCENE ANIMATION */}
            <motion.span
              key={currentIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block text-sm uppercase tracking-[0.22em]"
            >
              {String(currentIndex + 1).padStart(2, "0")}{" "}
              {currentSection.label}
            </motion.span>
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 w-[18rem] overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/70 p-4 shadow-theater backdrop-blur-xl"
          >
            {/* 🔥 HEADER */}
            <div className="mb-3 flex items-end justify-between border-b border-white/10 pb-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-gold/75">
                  Current Scene
                </p>

                <motion.p
                  key={currentIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 font-display text-4xl text-ivory"
                >
                  {String(currentIndex + 1).padStart(2, "0")}
                </motion.p>
              </div>

              <p className="text-sm uppercase tracking-[0.24em] text-gold">
                {currentSection.label}
              </p>
            </div>

            {/* 🔥 NAV */}
            <nav className="space-y-3">
              {sections.map((section, index) => {
                const isActive = activeId === section.id;
                const progress = sectionProgress?.[section.id] ?? 0;

                return (
                  <div key={section.id} className="relative">
                    {/* 🔥 PROGRESS LINE */}
                    {index !== sections.length - 1 && (
                      <div className="absolute left-[14px] top-8 w-[2px] h-10 bg-white/10">
                        <motion.div
                          className="w-full bg-gradient-to-b from-gold to-transparent origin-top"
                          style={{
                            height: `${progress * 100}%`,
                          }}
                        />
                      </div>
                    )}

                    <button
                      onClick={() => {
                        scrollToSection(section.id);
                        setOpen(false);
                      }}
                      className={cn(
                        "group flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition-all duration-300",
                        isActive
                          ? "bg-gold/12 text-ivory"
                          : "text-smoke hover:bg-white/[0.04] hover:text-ivory",
                      )}
                    >
                      {/* LEFT */}
                      <div className="flex items-center gap-3">
                        {/* DOT */}
                        <motion.div
                          className="relative flex h-6 w-6 items-center justify-center rounded-full border"
                          animate={{
                            scale: isActive ? 1.25 : 1,
                            backgroundColor: isActive
                              ? "rgba(212,175,55,1)"
                              : "rgba(255,255,255,0.05)",
                            borderColor: isActive
                              ? "rgba(212,175,55,1)"
                              : "rgba(255,255,255,0.2)",
                            boxShadow: isActive
                              ? "0 0 12px rgba(212,175,55,0.6)"
                              : "none",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                          }}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="active-dot"
                              className="h-2 w-2 rounded-full bg-black"
                            />
                          )}
                        </motion.div>

                        {/* NUMBER */}
                        <span className="font-display text-lg text-gold/85">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* LABEL */}
                      <motion.span
                        className="uppercase tracking-[0.18em]"
                        animate={{
                          opacity: isActive ? 1 : 0.5,
                          scale: isActive ? 1.05 : 1,
                        }}
                      >
                        {section.label}
                      </motion.span>
                    </button>
                  </div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}