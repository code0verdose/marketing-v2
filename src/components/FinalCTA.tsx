import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inView = useInView(contentRef, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ── Measure card position relative to sticky container ──────────
  // Stored in a ref so the useTransform callbacks always read fresh
  // values without needing to re-create the hooks.
  const insetsRef = useRef({ t: 19, l: 10, b: 19, r: 10 });

  const measure = useCallback(() => {
    const card = cardRef.current;
    const sticky = stickyRef.current;
    if (!card || !sticky) return;
    const cr = card.getBoundingClientRect();
    const sr = sticky.getBoundingClientRect();
    if (sr.width === 0 || sr.height === 0) return; // not laid out
    insetsRef.current = {
      t: Math.max(0, ((cr.top - sr.top) / sr.height) * 100),
      l: Math.max(0, ((cr.left - sr.left) / sr.width) * 100),
      b: Math.max(0, ((sr.bottom - cr.bottom) / sr.height) * 100),
      r: Math.max(0, ((sr.right - cr.right) / sr.width) * 100),
    };
  }, []);

  useEffect(() => {
    // Measure after layout + fonts settle
    const raf = () => requestAnimationFrame(measure);
    raf();
    document.fonts.ready.then(raf);

    const ro = new ResizeObserver(raf);
    if (stickyRef.current) ro.observe(stickyRef.current);
    if (cardRef.current) ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, [measure]);

  // ── Scroll-driven animation ─────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Lerp from measured inset → 0 over scroll range 0.15–0.55
  const lerp = (key: "t" | "l" | "b" | "r") => (v: number) => {
    const p = Math.min(1, Math.max(0, (v - 0.15) / 0.4));
    return insetsRef.current[key] * (1 - p);
  };

  const top = useTransform(scrollYProgress, lerp("t"));
  const left = useTransform(scrollYProgress, lerp("l"));
  const bottom = useTransform(scrollYProgress, lerp("b"));
  const right = useTransform(scrollYProgress, lerp("r"));
  const radius = useTransform(scrollYProgress, [0.15, 0.55], [40, 0]);
  const cardOpacity = useTransform(scrollYProgress, [0.15, 0.4], [1, 0]);

  // Motion templates (must be top-level — Rules of Hooks)
  const topStyle = useMotionTemplate`${top}%`;
  const leftStyle = useMotionTemplate`${left}%`;
  const rightStyle = useMotionTemplate`${right}%`;
  const bottomStyle = useMotionTemplate`${bottom}%`;
  const radiusStyle = useMotionTemplate`${radius}px`;

  return (
    <section ref={sectionRef} className="relative md:h-[280vh]">
      <div
        ref={stickyRef}
        className="md:sticky md:top-0 md:h-screen relative overflow-hidden flex items-center justify-center"
      >
        {/* Black frame with expanding cutout (desktop only) */}
        <div
          aria-hidden
          className="hidden md:block absolute inset-0 z-[5] pointer-events-none overflow-hidden"
        >
          <motion.div
            className="absolute"
            style={{
              top: topStyle,
              left: leftStyle,
              right: rightStyle,
              bottom: bottomStyle,
              borderRadius: radiusStyle,
              boxShadow: "0 0 0 200vmax black",
            }}
          />
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="px-6 py-24 md:py-0 relative z-10 w-full"
        >
          <div className="relative max-w-5xl mx-auto">
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.9 }}
              className="px-6 md:px-16 py-16 md:py-24 text-center overflow-hidden relative"
            >
              {/* Card glass border + glow — fades as video expands (desktop) */}
              <motion.div
                aria-hidden
                className="hidden md:block absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] liquid-glass pointer-events-none"
                style={{ opacity: cardOpacity }}
              />
              <motion.div
                aria-hidden
                className="hidden md:block absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] bg-[radial-gradient(ellipse_at_center,_rgba(245,162,124,0.16),_transparent_65%)] pointer-events-none"
                style={{ opacity: cardOpacity }}
              />
              {/* Mobile: static card styling */}
              <div
                aria-hidden
                className="md:hidden absolute inset-0 rounded-[2rem] liquid-glass pointer-events-none"
              />
              <div
                aria-hidden
                className="md:hidden absolute inset-0 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,_rgba(245,162,124,0.16),_transparent_65%)] pointer-events-none"
              />

              <div className="relative">
                <div className="liquid-glass inline-flex rounded-full px-4 py-2 items-center gap-2 mb-8">
                  <Sparkles size={14} className="text-accent" />
                  <span className="text-white/80 text-xs font-medium tracking-wide">
                    Early Access — Limited Spots
                  </span>
                </div>

                <h2
                  className="text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-6 leading-[1.02]"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Be first to access{" "}
                  <em className="italic" style={{ color: "var(--accent)" }}>
                    ContentForge.
                  </em>
                </h2>
                <p className="text-white/65 text-base md:text-lg max-w-xl mx-auto mb-10">
                  We're opening access in stages. Waitlist members get early entry
                  and special subscription terms not available publicly.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email.trim()) setSubmitted(true);
                  }}
                  className="liquid-glass rounded-full w-full max-w-lg mx-auto pl-4 sm:pl-5 pr-1.5 py-1.5 flex items-center gap-1.5 sm:gap-2"
                >
                  <input
                    type="email"
                    required
                    disabled={submitted}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      submitted ? "You're on the list " : "Your email"
                    }
                    className="flex-1 min-w-0 w-0 bg-transparent outline-none text-white placeholder:text-white/40 text-sm md:text-base py-2"
                  />
                  <button
                    type="submit"
                    aria-label={submitted ? "Submitted" : "Reserve my spot"}
                    className="shrink-0 rounded-full h-10 sm:h-11 px-3 sm:px-5 flex items-center justify-center gap-1.5 sm:gap-2 text-black text-xs sm:text-sm font-semibold hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] transition-all whitespace-nowrap"
                    style={{
                      backgroundColor: "var(--accent)",
                      boxShadow: "0 10px 30px -10px var(--accent-glow)",
                    }}
                  >
                    {submitted ? "Thanks" : "Reserve my spot"}
                    <ArrowRight size={14} className="sm:hidden" />
                    <ArrowRight size={16} className="hidden sm:block" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
