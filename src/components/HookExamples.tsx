import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Flame, Sparkles } from "lucide-react";

type Example = {
  brief: string;
  audience: string;
  tone: string;
  hooks: { line: string; score: number }[];
};

const examples: Example[] = [
  {
    brief: "Online fitness course",
    audience: "Women 25-40",
    tone: "Storytime",
    hooks: [
      {
        line: "I tried 12 workout programs before realizing the problem wasn't my willpower — it was the method.",
        score: 94,
      },
      {
        line: "POV: you open the app at 6am and your coach already knows you skipped yesterday.",
        score: 89,
      },
      {
        line: "Three months ago I couldn't do a plank. Today my jeans don't fit — in the good way.",
        score: 87,
      },
      {
        line: "The program that made my gym membership feel like a waste of money.",
        score: 83,
      },
    ],
  },
  {
    brief: "SaaS analytics tool",
    audience: "Startup founders",
    tone: "Deadpan",
    hooks: [
      {
        line: "We were making decisions on vibes until this dashboard made us feel stupid.",
        score: 92,
      },
      {
        line: "The 4 metrics your board actually cares about — now in one screen, finally.",
        score: 88,
      },
      {
        line: "I replaced 7 spreadsheets with one link. My co-founder thinks I'm a genius.",
        score: 86,
      },
      {
        line: "Stop guessing what's working. The data already knows.",
        score: 81,
      },
    ],
  },
  {
    brief: "Skincare brand launch",
    audience: "Gen-Z beauty lovers",
    tone: "Hype",
    hooks: [
      {
        line: "This serum did in 2 weeks what my 10-step routine couldn't do in 2 years.",
        score: 95,
      },
      {
        line: "The only bottle on my shelf that survived the great declutter of 2024.",
        score: 91,
      },
      {
        line: "My skin is so clear my camera thinks the filter is already on.",
        score: 88,
      },
      {
        line: "I stopped watching skincare TikTok because I already found the answer.",
        score: 84,
      },
    ],
  },
  {
    brief: "Telegram channel growth",
    audience: "Content creators",
    tone: "Expert voice",
    hooks: [
      {
        line: "I grew from 200 to 15K subscribers with one content system. Here's the framework.",
        score: 93,
      },
      {
        line: "Your Telegram channel isn't dying — your content plan just doesn't exist.",
        score: 90,
      },
      {
        line: "The posting schedule that tripled my reach without tripling my workload.",
        score: 86,
      },
      {
        line: "Every creator thinks the algorithm is broken. The algorithm thinks your hooks are.",
        score: 82,
      },
    ],
  },
];

// Cascade animation total time: base delay + last row delay + duration.
// 0.05 + 3 * 0.09 + 0.65 = 0.97s → round to 1000ms lock.
const ANIMATION_LOCK_MS = 1000;

export default function HookExamples() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const lockedUntilRef = useRef(0);

  const isLocked = () => Date.now() < lockedUntilRef.current;
  const lock = () => {
    lockedUntilRef.current = Date.now() + ANIMATION_LOCK_MS;
  };

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      if (isLocked()) return;
      setDirection(1);
      setIdx((i) => (i + 1) % examples.length);
      lock();
    }, 6000);
    return () => clearInterval(t);
  }, [paused]);

  const prev = () => {
    if (isLocked()) return;
    setDirection(-1);
    setIdx((i) => (i - 1 + examples.length) % examples.length);
    lock();
  };
  const next = () => {
    if (isLocked()) return;
    setDirection(1);
    setIdx((i) => (i + 1) % examples.length);
    lock();
  };
  const goTo = (target: number) => {
    if (target === idx || isLocked()) return;
    setDirection(target > idx ? 1 : -1);
    setIdx(target);
    lock();
  };

  const current = examples[idx];

  return (
    <section id="examples" ref={ref} className="py-16 px-4 sm:px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
            Real output
          </p>
          <h2 className="text-4xl md:text-6xl text-white tracking-tight">
            See it{" "}
            <span
              className="italic"
              style={{
                fontFamily: "'Instrument Serif', serif",
                color: "var(--accent)",
              }}
            >
              generate
            </span>
          </h2>
          <p className="text-white/55 text-sm md:text-base max-w-xl mx-auto mt-5">
            Four real briefs. Sixteen AI-generated hooks. Zero blank pages,
            zero wasted hours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="liquid-glass rounded-3xl p-6 sm:p-8 md:p-12"
        >
          {/* Header row with brief + controls. Mobile reserves space for
              up to 2 rows of chips so the height never jumps between
              examples when a long brief wraps. */}
          <div className="flex items-start justify-between gap-4 mb-8 md:mb-10">
            <div className="flex items-start content-start gap-2 flex-wrap min-w-0 flex-1 min-h-[66px] sm:min-h-0">
              <span className="liquid-glass rounded-full px-3 py-1.5 text-[10px] sm:text-xs text-white/80 tracking-wide uppercase whitespace-nowrap">
                {current.brief}
              </span>
              <span className="liquid-glass rounded-full px-3 py-1.5 text-[10px] sm:text-xs text-white/80 tracking-wide uppercase whitespace-nowrap">
                {current.audience}
              </span>
              <span className="liquid-glass rounded-full px-3 py-1.5 text-[10px] sm:text-xs text-white/80 tracking-wide uppercase whitespace-nowrap">
                {current.tone}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                onClick={prev}
                aria-label="Previous example"
                className="liquid-glass rounded-full w-10 h-10 flex items-center justify-center text-white hover:bg-white/5 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                aria-label="Next example"
                className="liquid-glass rounded-full w-10 h-10 flex items-center justify-center text-white hover:bg-white/5 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Hooks list — each row is a fixed slot; the whole card slides.
              Direction-aware: next → new slides in from right, old leaves
              to left. Prev → reversed. */}
          <ul className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((row) => {
              const h = current.hooks[row];
              return (
                <li
                  key={row}
                  className="relative overflow-hidden rounded-2xl min-h-[80px] md:min-h-[92px]"
                >
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                      key={`${idx}-${row}`}
                      custom={direction}
                      variants={{
                        enter: (dir: 1 | -1) => ({
                          x: dir === 1 ? "110%" : "-110%",
                        }),
                        center: { x: 0 },
                        exit: (dir: 1 | -1) => ({
                          x: dir === 1 ? "-110%" : "110%",
                        }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        duration: 0.65,
                        delay: 0.05 + row * 0.09,
                        ease: [0.32, 0.72, 0, 1],
                      }}
                      className="liquid-glass absolute inset-0 rounded-2xl p-3.5 md:p-4 flex items-center gap-3 md:gap-4"
                    >
                      <span
                        className="text-2xl md:text-3xl italic shrink-0 w-8 md:w-10 leading-none"
                        style={{
                          fontFamily: "'Instrument Serif', serif",
                          color: "var(--accent)",
                        }}
                      >
                        {String(row + 1).padStart(2, "0")}
                      </span>
                      <p
                        className="flex-1 min-w-0 text-white text-base md:text-xl leading-snug tracking-tight line-clamp-2"
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                      >
                        "{h.line}"
                      </p>
                      <div className="shrink-0 liquid-glass rounded-full px-2.5 py-1.5 flex items-center gap-1.5 self-start">
                        <Flame
                          size={12}
                          className={
                            h.score >= 90
                              ? "text-accent"
                              : h.score >= 85
                              ? "text-white/70"
                              : "text-white/50"
                          }
                          fill="currentColor"
                        />
                        <span
                          className={`text-[10px] md:text-xs font-semibold tabular-nums ${
                            h.score >= 90 ? "text-accent" : "text-white"
                          }`}
                        >
                          {h.score}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* Footer: dots + CTA */}
          <div className="mt-8 md:mt-10 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              {examples.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Example ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx ? "w-8 bg-white" : "w-1.5 bg-white/30"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <Sparkles size={14} style={{ color: "var(--accent)" }} />
              <span>
                Average virality score:{" "}
                <span className="text-white font-semibold tabular-nums">
                  {Math.round(
                    current.hooks.reduce((a, h) => a + h.score, 0) /
                      current.hooks.length
                  )}
                </span>
              </span>
            </div>
          </div>

          {/* Mobile arrows */}
          <div className="flex sm:hidden items-center justify-center gap-3 mt-6">
            <button
              onClick={prev}
              aria-label="Previous example"
              className="liquid-glass rounded-full w-11 h-11 flex items-center justify-center text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next example"
              className="liquid-glass rounded-full w-11 h-11 flex items-center justify-center text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
