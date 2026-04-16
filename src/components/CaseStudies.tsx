import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Heart, Play } from "lucide-react";
import { useMediaQuery } from "../hooks/useMediaQuery";

// Shared across all cards: timestamp of the last window scroll event.
// If a mouseenter happens while the page is actively scrolling, we skip
// starting playback — otherwise videos under the cursor would start one
// after another as the user scrolls past, causing tiny layout jitters.
let lastScrollAt = 0;
if (typeof window !== "undefined") {
  window.addEventListener(
    "scroll",
    () => {
      lastScrollAt = Date.now();
    },
    { passive: true }
  );
}
const SCROLL_IDLE_MS = 150;

type Case = {
  id: string;
  brand: string;
  hook: string;
  views: string;
  likes: string;
  platform: string;
  video: string;
  poster?: string;
};

// Mock vertical Reels-style clips (public Mixkit stock, 720x1080).
const VIDEOS = [
  "https://assets.mixkit.co/videos/39878/39878-720.mp4",
  "https://assets.mixkit.co/videos/39874/39874-720.mp4",
  "https://assets.mixkit.co/videos/43321/43321-720.mp4",
  "https://assets.mixkit.co/videos/39886/39886-720.mp4",
  "https://assets.mixkit.co/videos/39838/39838-720.mp4",
  "https://assets.mixkit.co/videos/39806/39806-720.mp4",
  "https://assets.mixkit.co/videos/39815/39815-720.mp4",
  "https://assets.mixkit.co/videos/39817/39817-720.mp4",
  "https://assets.mixkit.co/videos/39825/39825-720.mp4",
  "https://assets.mixkit.co/videos/39866/39866-720.mp4",
  "https://assets.mixkit.co/videos/39884/39884-720.mp4",
  "https://assets.mixkit.co/videos/43326/43326-720.mp4",
  "https://assets.mixkit.co/videos/44614/44614-720.mp4",
  "https://assets.mixkit.co/videos/44606/44606-720.mp4",
];

const baseCases: Omit<Case, "video" | "poster">[] = [
  {
    id: "1",
    brand: "Glow Skincare",
    hook: "I spent $400 on serums before I realized the problem was inside, not outside.",
    views: "2.4M",
    likes: "184K",
    platform: "TikTok",
  },
  {
    id: "2",
    brand: "FitApp Pro",
    hook: "Your gym membership is about to feel unnecessary.",
    views: "1.1M",
    likes: "92K",
    platform: "Reels",
  },
  {
    id: "3",
    brand: "EduTech",
    hook: "My teacher quit assigning homework the day she saw this app.",
    views: "3.8M",
    likes: "267K",
    platform: "Shorts",
  },
  {
    id: "4",
    brand: "SaaS Toolkit",
    hook: "I replaced 7 tools with one dashboard. My team thinks I'm a genius.",
    views: "890K",
    likes: "71K",
    platform: "TikTok",
  },
  {
    id: "5",
    brand: "Beauty Lab",
    hook: "POV: your skin is so clear the camera thinks the filter is on.",
    views: "1.7M",
    likes: "128K",
    platform: "Reels",
  },
  {
    id: "6",
    brand: "Meal Prep Co",
    hook: "Three ingredients. Zero regret. One meal prep Sunday.",
    views: "640K",
    likes: "49K",
    platform: "Shorts",
  },
  {
    id: "7",
    brand: "Travel Nomad",
    hook: "I traveled 40 days with one backpack. Here's what was inside.",
    views: "2.1M",
    likes: "158K",
    platform: "TikTok",
  },
  {
    id: "8",
    brand: "Calm Audio",
    hook: "The silence after I pressed play changed my entire morning routine.",
    views: "1.4M",
    likes: "103K",
    platform: "Reels",
  },
  {
    id: "9",
    brand: "Style Studio",
    hook: "The one outfit my followers won't stop asking about.",
    views: "3.2M",
    likes: "241K",
    platform: "Shorts",
  },
  {
    id: "10",
    brand: "Home Craft",
    hook: "Every guest asks where this came from. Here's the secret.",
    views: "720K",
    likes: "58K",
    platform: "TikTok",
  },
  {
    id: "11",
    brand: "Plant Studio",
    hook: "I gave up watering 20 plants. One subscription replaced them all.",
    views: "1.9M",
    likes: "142K",
    platform: "Reels",
  },
  {
    id: "12",
    brand: "Watch Co",
    hook: "My luxury watch hasn't left the drawer since this arrived.",
    views: "2.8M",
    likes: "211K",
    platform: "Shorts",
  },
  {
    id: "13",
    brand: "Energy Tea",
    hook: "This is the drink that killed my afternoon slump.",
    views: "950K",
    likes: "76K",
    platform: "TikTok",
  },
  {
    id: "14",
    brand: "Denim House",
    hook: "The jeans everyone keeps asking about.",
    views: "1.3M",
    likes: "97K",
    platform: "Reels",
  },
];

const cases: Case[] = baseCases.map((c, i) => ({
  ...c,
  video: VIDEOS[i % VIDEOS.length],
}));

function CaseCard({ item, index }: { item: Case; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const hoveringRef = useRef(false);
  const pendingTimerRef = useRef<number | null>(null);

  const clearPending = () => {
    if (pendingTimerRef.current) {
      clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = null;
    }
  };

  const doPlay = () => {
    const v = videoRef.current;
    if (!v) return;
    // NOTE: no window.scrollTo restore here — while the pinned
    // horizontal carousel is being scrolled, new cards slide under the
    // cursor and fire mouseenter, which calls doPlay. A restore loop
    // would snap the page back to the snapshot position and fight the
    // user's scroll, causing the exact jitter we saw. play() cannot
    // shift layout because the <video> is already sized and laid out.
    const p = v.play();
    if (p && typeof p.then === "function") {
      p.then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      setPlaying(true);
    }
  };

  const tryPlay = () => {
    if (!hoveringRef.current) return;
    // If the page is actively scrolling, postpone — the cursor is likely
    // just passing over cards and any layout shift would jitter scroll.
    const sinceScroll = Date.now() - lastScrollAt;
    if (sinceScroll < SCROLL_IDLE_MS) {
      clearPending();
      pendingTimerRef.current = window.setTimeout(
        tryPlay,
        SCROLL_IDLE_MS - sinceScroll + 20
      );
      return;
    }
    doPlay();
  };

  const handleEnter = () => {
    hoveringRef.current = true;
    tryPlay();
  };

  const handleLeave = () => {
    hoveringRef.current = false;
    clearPending();
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setPlaying(false);
  };

  useEffect(() => {
    return () => clearPending();
  }, []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.055, 0.45),
        ease: [0.32, 0.72, 0, 1],
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      tabIndex={0}
      className="group relative shrink-0 w-[220px] sm:w-[260px] md:w-[280px] snap-start outline-none cursor-pointer"
    >
      <div className="liquid-glass rounded-3xl overflow-hidden relative aspect-[9/16] transition-transform duration-500 ease-out group-hover:-translate-y-2 group-focus-visible:-translate-y-2">
        <video
          ref={videoRef}
          // #t=0.001 forces iOS Safari to render the first frame as the
          // poster even without playback.
          src={`${item.video}#t=0.001`}
          poster={item.poster}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient overlay */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none"
        />

        {/* Play badge when idle */}
        <div
          aria-hidden
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            playing ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="liquid-glass rounded-full w-14 h-14 flex items-center justify-center">
            <Play
              size={22}
              className="text-white translate-x-[1px]"
              fill="currentColor"
            />
          </div>
        </div>

        {/* Platform pill */}
        <div className="absolute top-3 left-3">
          <div className="liquid-glass rounded-full h-6 px-2.5 flex items-center justify-center">
            <span className="text-white/90 text-[10px] font-medium tracking-wide uppercase leading-none">
              {item.platform}
            </span>
          </div>
        </div>

        {/* Metrics */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          <div className="liquid-glass rounded-full h-6 px-2.5 flex items-center justify-center gap-1.5">
            <Eye size={11} className="text-white/80" />
            <span className="text-white text-[10px] font-semibold tabular-nums leading-none">
              {item.views}
            </span>
          </div>
          <div className="liquid-glass rounded-full h-6 px-2.5 flex items-center justify-center gap-1.5">
            <Heart size={11} className="text-white/80" fill="currentColor" />
            <span className="text-white text-[10px] font-semibold tabular-nums leading-none">
              {item.likes}
            </span>
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-2">
          <span className="text-white/60 text-[10px] uppercase tracking-widest">
            {item.brand}
          </span>
          <p
            className="text-white text-[15px] md:text-base leading-snug tracking-tight line-clamp-3"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            "{item.hook}"
          </p>
        </div>
      </div>
    </motion.article>
  );
}

/* -------- Mobile carousel: 1 centered card with side peek -------- */

function MobileCaseCarousel({ items }: { items: Case[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [sectionInView, setSectionInView] = useState(false);

  // Track which card is centered in the scroller
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const compute = () => {
      const cards = el.querySelectorAll<HTMLElement>("[data-case-card]");
      if (!cards.length) return;
      const center = el.scrollLeft + el.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;
      cards.forEach((card, i) => {
        const c = card.offsetLeft + card.offsetWidth / 2;
        const d = Math.abs(c - center);
        if (d < best) {
          best = d;
          nearest = i;
        }
      });
      setActiveIdx((prev) => (prev === nearest ? prev : nearest));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    compute();
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Detect when the section is in the viewport (auto-play the active card)
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setSectionInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Play the active card when section is in view; pause the others.
  // IMPORTANT: no scroll-restore loop here — the previous implementation
  // snapshotted window.scrollY when this effect fired and then forced
  // window.scrollTo back to it on a rAF + 120ms timeout. If the effect
  // happened mid-scroll (exactly the boundary between HookExamples and
  // CaseStudies on mobile), that restore fought the user's gesture and
  // produced a visible upward jerk. We just call play()/pause() and
  // trust the browser — videos are already laid out so starting
  // playback cannot shift layout.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === activeIdx && sectionInView) {
        const p = v.play();
        if (p && typeof p.then === "function") {
          p.catch(() => {});
        }
      } else {
        v.pause();
      }
    });
  }, [activeIdx, sectionInView]);

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-case-card]");
    const card = cards[i];
    if (!card) return;
    const target =
      card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <div ref={sentinelRef} className="-mx-4">
      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar py-6"
        style={{
          scrollbarWidth: "none",
          overflowY: "clip",
          overscrollBehaviorX: "contain",
          overscrollBehaviorY: "auto",
          paddingInline: "9vw",
          // Allow BOTH horizontal (pan-x) gestures for the carousel
          // and vertical (pan-y) gestures so a touch that starts on a
          // video still scrolls the page down. The earlier jitter at
          // the HookExamples → CaseStudies boundary came from the
          // window.scrollTo restore loop (now removed), not from
          // touch-action, so re-enabling pan-y is safe here.
          touchAction: "pan-x pan-y",
        }}
      >
        {items.map((item, i) => {
          const isActive = i === activeIdx;
          return (
            <article
              key={item.id}
              data-case-card
              onClick={() => {
                if (!isActive) goTo(i);
              }}
              className="shrink-0 w-[82vw] snap-center transition-transform duration-500 ease-out cursor-pointer"
              style={{
                transform: isActive ? "scale(1)" : "scale(0.92)",
                opacity: isActive ? 1 : 0.65,
                transitionProperty: "transform, opacity",
              }}
            >
              <div
                className="liquid-glass rounded-3xl overflow-hidden relative aspect-[9/16]"
                style={{
                  // Dark fallback so the card is never a fully transparent
                  // hole when iOS Safari hasn't decoded the first frame yet.
                  backgroundColor: "#0b0b0e",
                  backgroundImage:
                    "radial-gradient(circle at 50% 30%, rgba(245,162,124,0.08), transparent 70%)",
                }}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  src={`${item.video}#t=0.05`}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  // eslint-disable-next-line react/no-unknown-property
                  webkit-playsinline="true"
                  // iOS Safari ignores `#t=` fragment on some encodings;
                  // force a seek once metadata is ready so the first frame
                  // gets painted as the poster.
                  onLoadedMetadata={(e) => {
                    const el = e.currentTarget;
                    try {
                      if (el.readyState >= 1 && el.currentTime === 0) {
                        el.currentTime = 0.05;
                      }
                    } catch {
                      /* ignore */
                    }
                  }}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none"
                />

                {/* Platform pill */}
                <div className="absolute top-3 left-3">
                  <div className="liquid-glass rounded-full h-6 px-2.5 flex items-center justify-center">
                    <span className="text-white/90 text-[10px] font-medium tracking-wide uppercase leading-none">
                      {item.platform}
                    </span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                  <div className="liquid-glass rounded-full h-6 px-2.5 flex items-center justify-center gap-1.5">
                    <Eye size={11} className="text-white/80" />
                    <span className="text-white text-[10px] font-semibold tabular-nums leading-none">
                      {item.views}
                    </span>
                  </div>
                  <div className="liquid-glass rounded-full h-6 px-2.5 flex items-center justify-center gap-1.5">
                    <Heart
                      size={11}
                      className="text-white/80"
                      fill="currentColor"
                    />
                    <span className="text-white text-[10px] font-semibold tabular-nums leading-none">
                      {item.likes}
                    </span>
                  </div>
                </div>

                {/* Bottom content */}
                <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-2">
                  <span className="text-white/60 text-[10px] uppercase tracking-widest">
                    {item.brand}
                  </span>
                  <p
                    className="text-white text-[15px] leading-snug tracking-tight line-clamp-3"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    "{item.hook}"
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-5">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to case ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIdx ? 20 : 6,
              height: 6,
              backgroundColor:
                i === activeIdx ? "var(--accent)" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* -------- Main section -------- */

export default function CaseStudies() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-120px" });
  const [edge, setEdge] = useState(24);
  const [horizontalDist, setHorizontalDist] = useState(0);
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Scroll-pinned horizontal carousel (desktop only). The pin container
  // is sized = 100vh + horizontalDist, so while the user scrolls that
  // extra height, the sticky inner stays pinned and the strip is
  // translated horizontally proportionally. When horizontalDist scroll
  // is exhausted, vertical scroll resumes normally into the next
  // section.
  const { scrollYProgress: pinProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(pinProgress, [0, 1], [0, -horizontalDist]);

  useLayoutEffect(() => {
    if (isMobile) return;
    const compute = () => {
      const el = stripRef.current;
      if (!el) return;
      const dist = Math.max(0, el.scrollWidth - window.innerWidth);
      setHorizontalDist(dist);
    };
    compute();
    const t = window.setTimeout(compute, 120);
    window.addEventListener("resize", compute);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", compute);
    };
  }, [isMobile, edge]);

  useLayoutEffect(() => {
    const compute = () => {
      const el = headerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setEdge(Math.max(0, Math.round(rect.left)));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // Recompute after fonts load too (layout can shift)
  useEffect(() => {
    const t = setTimeout(() => {
      const el = headerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setEdge(Math.max(0, Math.round(rect.left)));
    }, 100);
    return () => clearTimeout(t);
  }, []);

  // Buttons scroll the *page* (not the strip) by card-width-equivalent
  // pixels. Since horizontal offset inside the pin is 1:1 with page
  // scroll while pinned, moving the page by cardWidth advances the
  // carousel by one card.
  const scrollBy = (dir: 1 | -1) => {
    const el = stripRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("article");
    const step = card ? card.offsetWidth + 20 : 300;
    window.scrollBy({ top: dir * step * 2, behavior: "smooth" });
  };

  const header = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="flex flex-col md:flex-row md:items-end justify-between gap-6"
    >
      <div>
        <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
          Case studies
        </p>
        <h2 className="text-4xl md:text-6xl text-white tracking-tight leading-[1.05]">
          Content that{" "}
          <span
            className="italic"
            style={{
              fontFamily: "'Instrument Serif', serif",
              color: "var(--accent)",
            }}
          >
            stopped
          </span>{" "}
          the scroll.
        </h2>
        <p className="text-white/55 text-sm md:text-base max-w-xl mt-5">
          Real campaigns powered by AI-generated scripts. Hover any card to play the clip.
        </p>
      </div>

      <div className="hidden md:flex items-center gap-2 shrink-0">
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Previous cases"
          className="liquid-glass rounded-full w-11 h-11 flex items-center justify-center text-white hover:bg-white/5 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => scrollBy(1)}
          aria-label="Next cases"
          className="liquid-glass rounded-full w-11 h-11 flex items-center justify-center text-white hover:bg-white/5 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );

  return (
    <section
      id="cases"
      ref={sectionRef}
      className="relative scroll-mt-20"
    >
      {isMobile ? (
        <div className="py-24 md:py-32 px-4 sm:px-6">
          <div ref={headerRef} className="max-w-6xl mx-auto mb-10 md:mb-14">
            {header}
          </div>
          <MobileCaseCarousel items={cases} />
        </div>
      ) : (
        /* Desktop: sticky pin holds BOTH header and horizontal strip so
           the heading stays visible through the entire carousel scroll. */
        <div
          ref={pinRef}
          className="relative"
          style={{ height: `calc(100vh + ${horizontalDist}px)` }}
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            <div className="h-full flex flex-col justify-center gap-10 md:gap-14 py-16">
              <div className="px-4 sm:px-6">
                <div ref={headerRef} className="max-w-6xl mx-auto">
                  {header}
                </div>
              </div>
              <motion.div
                ref={stripRef}
                style={{ x }}
                className="flex gap-4 md:gap-5 will-change-transform"
              >
                <div
                  aria-hidden
                  className="shrink-0"
                  style={{ width: `${edge}px` }}
                />
                {cases.map((c, i) => (
                  <CaseCard key={c.id} item={c} index={i} />
                ))}
                <div
                  aria-hidden
                  className="shrink-0"
                  style={{ width: `${edge}px` }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
