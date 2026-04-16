import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { useRef, useEffect, useCallback } from "react";
import {
  Wand2,
  Layers,
  TrendingUp,
  MessageSquare,
  Palette,
  Library,
} from "lucide-react";
import GlareHover from "./ui/GlareHover";

const cells = [
  {
    icon: Wand2,
    title: "Viral Hooks Generator",
    body: "Headlines and first 3 seconds of video that make people tap 'more'. Scroll-stopping openers on demand.",
    span: "md:col-span-2",
  },
  {
    icon: Layers,
    title: "Scripts Engine",
    body: "Full scripts for Reels/Shorts/TikTok with pacing and dynamics built in.",
    span: "",
  },
  {
    icon: TrendingUp,
    title: "Smart Content Plan",
    body: "Publication strategy for a week or a month — generated in minutes, not days.",
    span: "",
  },
  {
    icon: MessageSquare,
    title: "Carousel Architect",
    body: "Ready structure and copy for carousels that get saved and shared.",
    span: "md:col-span-2",
  },
  {
    icon: Palette,
    title: "Post Matrix",
    body: "Post copy adapted to your brand's tone of voice. Consistent messaging across all platforms.",
    span: "md:col-span-2",
  },
  {
    icon: Library,
    title: "Template library",
    body: "200+ proven content frameworks: storytelling, educational, promotional, engagement-driven.",
    span: "",
  },
];

export default function FeatureBento() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const templateCardRef = useRef<HTMLDivElement>(null);

  // ── Measure "Template library" card position → starting cutout insets ──
  // Defaults tuned for a ~1280×800 viewport (card final position after
  // entrance animation completes — the y:30 offset is already removed).
  const insetsRef = useRef({ t: 73, l: 65, b: 8, r: 7 });

  const measure = useCallback(() => {
    const card = templateCardRef.current;
    const sticky = stickyRef.current;
    if (!card || !sticky) return;
    const cr = card.getBoundingClientRect();
    const sr = sticky.getBoundingClientRect();
    if (sr.width === 0 || sr.height === 0) return;

    // The card has initial={{ y: 30 }} from framer-motion. If the
    // entrance animation hasn't fired yet, the card sits 30px below
    // its final position. Detect this by checking the computed
    // transform and compensate so the cutout targets the final spot.
    let yOffset = 0;
    const t = getComputedStyle(card).transform;
    if (t && t !== "none") {
      const m = t.match(/matrix\(.+,\s*(.+)\)$/);
      if (m) yOffset = parseFloat(m[1]) || 0;
    }

    insetsRef.current = {
      t: Math.max(0, ((cr.top - yOffset - sr.top) / sr.height) * 100),
      l: Math.max(0, ((cr.left - sr.left) / sr.width) * 100),
      b: Math.max(0, ((sr.bottom - (cr.bottom - yOffset)) / sr.height) * 100),
      r: Math.max(0, ((sr.right - cr.right) / sr.width) * 100),
    };
  }, []);

  useEffect(() => {
    const raf = () => requestAnimationFrame(measure);
    raf();
    document.fonts.ready.then(raf);
    // Extra delayed measurements to catch late layout shifts
    const t1 = setTimeout(raf, 200);
    const t2 = setTimeout(raf, 800);
    const ro = new ResizeObserver(raf);
    if (stickyRef.current) ro.observe(stickyRef.current);
    if (templateCardRef.current) ro.observe(templateCardRef.current);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ro.disconnect();
    };
  }, [measure]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Lerp measured inset → 0 over the scroll range
  const lerp = (key: "t" | "l" | "b" | "r") => (v: number) => {
    const p = Math.min(1, Math.max(0, (v - 0.1) / 0.65));
    return insetsRef.current[key] * (1 - p);
  };

  const topPct = useTransform(scrollYProgress, lerp("t"));
  const bottomPct = useTransform(scrollYProgress, lerp("b"));
  const leftPct = useTransform(scrollYProgress, lerp("l"));
  const rightPct = useTransform(scrollYProgress, lerp("r"));

  const topStr = useMotionTemplate`${topPct}%`;
  const bottomStr = useMotionTemplate`${bottomPct}%`;
  const leftStr = useMotionTemplate`${leftPct}%`;
  const rightStr = useMotionTemplate`${rightPct}%`;

  // Rounded corners on the cutout — starts matching card radius, goes to 0
  const radiusPx = useTransform(scrollYProgress, [0.1, 0.7], [24, 0]);
  const radiusStr = useMotionTemplate`${radiusPx}px`;

  // Content fades out as the cutout takes over the viewport
  const contentOpacity = useTransform(scrollYProgress, [0.45, 0.7], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0.45, 0.8], [1, 0.94]);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative scroll-mt-20 md:h-[180vh]"
    >
      {/* Desktop: sticky pin container that holds the dark frame + bento
          content. On mobile we just render content inline. */}
      <div ref={stickyRef} className="md:sticky md:top-0 md:h-screen md:w-full md:overflow-hidden">
        {/* Rounded-rectangle cutout over the shared group video bg.
            Implemented as a single element whose box-shadow floods the
            surrounding area with black; the element itself is transparent
            with an animated border-radius so corners round while the
            cutout is small and flatten to 0 as it reaches fullscreen.
            Mobile keeps the simple dark fill. */}
        <div
          aria-hidden
          className="md:hidden absolute inset-0 bg-black"
        />
        <motion.div
          aria-hidden
          style={{
            top: topStr,
            bottom: bottomStr,
            left: leftStr,
            right: rightStr,
            borderRadius: radiusStr,
            boxShadow: "0 0 0 100vmax #000",
          }}
          className="hidden md:block absolute pointer-events-none"
        />

        {/* Bento content — pinned below the cutout on desktop, normal
            flow on mobile. */}
        <motion.div
          style={{
            opacity: contentOpacity,
            scale: contentScale,
          }}
          className="relative md:absolute md:left-0 md:right-0 md:bottom-0 md:top-[26%] md:flex md:items-start md:justify-center py-16 md:py-2 px-6"
        >
          <div ref={ref} className="max-w-6xl w-full mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row md:items-end md:justify-between mb-6 md:mb-4 gap-3"
            >
              <h2 className="text-4xl md:text-4xl lg:text-5xl text-white tracking-tight max-w-2xl">
                Tools for{" "}
                <span
                  className="italic"
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    color: "var(--accent)",
                  }}
                >
                  traffic
                </span>{" "}
                capture
              </h2>
              <p className="text-white/60 text-xs md:text-sm max-w-sm">
                Everything you need to dominate the feed — nothing you don't.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {cells.map((c, i) => {
                const Icon = c.icon;
                const isTemplateCard = c.title === "Template library";
                return (
                  <motion.div
                    key={c.title}
                    ref={isTemplateCard ? templateCardRef : undefined}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: i * 0.08 }}
                    className={`liquid-glass rounded-3xl ${c.span}`}
                  >
                    <GlareHover
                      borderRadius="1.5rem"
                      glareColor="#ffffff"
                      glareOpacity={0.28}
                      glareAngle={-35}
                      glareSize={280}
                      transitionDuration={1500}
                      className="h-full"
                    >
                      <div className="relative z-[1] p-4 md:p-5 h-full">
                        <div className="liquid-glass rounded-full w-9 h-9 flex items-center justify-center mb-3 text-accent">
                          <Icon size={16} />
                        </div>
                        <h3 className="text-white text-base md:text-lg tracking-tight mb-1.5">
                          {c.title}
                        </h3>
                        <p className="text-white/55 text-xs md:text-sm leading-relaxed">
                          {c.body}
                        </p>
                      </div>
                    </GlareHover>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
