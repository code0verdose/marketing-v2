import { useEffect, useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import GradualBlur from "./components/ui/GradualBlur";
import Hero from "./components/Hero";
import LogoStrip from "./components/LogoStrip";
import ProblemSection from "./components/ProblemSection";
import HowItWorks from "./components/HowItWorks";
import FeatureBento from "./components/FeatureBento";
import HookExamples from "./components/HookExamples";
import CaseStudies from "./components/CaseStudies";
import SocialProof from "./components/SocialProof";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import VisionRoadmap from "./components/VisionRoadmap";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import { useMediaQuery } from "./hooks/useMediaQuery";

export const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4";

// Module-level shared currentTime for the hero video so every <video>
// element rendered for that source stays in lockstep — when one video
// scrolls into view it picks up exactly where the previously playing
// instance left off, instead of restarting or showing a different
// frame. Without this, two adjacent video sections look like two
// different clips even though the source URL is identical.
export const sharedVideoTime = { current: 0 };

export function VideoBg({ src = HERO_VIDEO }: { src?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const isHero = src === HERO_VIDEO;
  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const onTimeUpdate = () => {
      if (isHero) sharedVideoTime.current = v.currentTime;
    };
    v.addEventListener("timeupdate", onTimeUpdate);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Sync to the shared timeline before resuming playback so the
          // user doesn't see a jump between adjacent video sections.
          if (isHero && Math.abs(v.currentTime - sharedVideoTime.current) > 0.2) {
            v.currentTime = sharedVideoTime.current;
          }
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(v);

    return () => {
      io.disconnect();
      v.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [isHero]);
  return (
    <div
      aria-hidden
      className="absolute inset-0 w-full h-full overflow-hidden"
    >
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
    </div>
  );
}

function DarkBg() {
  // Accent glow blobs drawn on solid black. The gradients are tiled
  // vertically with a 200vh period so each "tile" contains multiple
  // blobs; blobs are placed and faded so that each tile fades fully to
  // pure black at y=0% and y=100%, which means the seam between tiles
  // is invisible (both sides are #000). Sizes use % of the tile so the
  // pattern is self-contained — no gradient escapes its tile.
  return (
    <div
      aria-hidden
      className="absolute inset-0 w-full h-full"
      style={{
        backgroundColor: "#000",
        backgroundImage: `
          radial-gradient(ellipse 55% 18% at 15% 18%, rgba(245,162,124,0.22), transparent 70%),
          radial-gradient(ellipse 50% 16% at 85% 42%, rgba(245,162,124,0.17), transparent 70%),
          radial-gradient(ellipse 55% 18% at 30% 68%, rgba(245,162,124,0.14), transparent 70%),
          radial-gradient(ellipse 50% 16% at 75% 88%, rgba(245,162,124,0.16), transparent 70%)
        `,
        backgroundRepeat: "repeat-y",
        backgroundSize: "100% 200vh",
        backgroundPosition: "0 0",
      }}
    />
  );
}

type Variant = "video" | "dark";
type SlideDef = { node: ReactNode; variant: Variant; noRise?: boolean; videoSrc?: string };
type GroupDef = { variant: Variant; nodes: ReactNode[]; noRise?: boolean; videoSrc?: string };

/**
 * A Group wraps consecutive same-variant sections with a single shared
 * background. Inside the group, content scrolls naturally over a
 * sticky-pinned background. Between groups of differing variants, the
 * new group's background performs a "rise from below" cover animation:
 * its sticky background is translated downward when the section is
 * about to enter the viewport, then animates up to its natural pinned
 * position as the user scrolls. This is what produces the visible
 * dark-covers-video / video-covers-dark effect at variant boundaries.
 */
function Group({
  group,
  index,
  riseUp,
}: {
  group: GroupDef;
  index: number;
  riseUp: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  // Rise-from-below cover, only for video groups: the sticky bg is
  // translated down and animated back up as the group enters view.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    riseUp ? ["100%", "0%"] : ["0%", "0%"],
  );

  // Video groups keep the original sticky-pinned background with a
  // 100vh content overlap so the hero clip stays visible through the
  // whole group. Dark groups use a plain absolute-positioned bg that
  // spans the section's natural height so the accent glows scroll with
  // the content rather than being pinned to the viewport.
  if (group.variant === "video") {
    return (
      <section
        ref={ref}
        className="relative"
        style={{ zIndex: index + 1 }}
      >
        <motion.div
          aria-hidden
          style={{ y: bgY }}
          className="hidden md:block md:sticky md:top-0 md:h-screen md:w-full md:overflow-hidden pointer-events-none"
        >
          <VideoBg src={group.videoSrc} />
        </motion.div>
        <div
          aria-hidden
          className="md:hidden absolute inset-0 w-full h-full pointer-events-none"
        >
          <VideoBg src={group.videoSrc} />
        </div>
        <div className="relative md:-mt-[100vh]">
          {group.nodes.map((node, i) => (
            <div key={i} className="relative">
              {node}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Dark group: bg scrolls with the content.
  return (
    <section ref={ref} className="relative" style={{ zIndex: index + 1 }}>
      <div
        aria-hidden
        className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      >
        <DarkBg />
      </div>
      <div className="relative">
        {group.nodes.map((node, i) => (
          <div key={i} className="relative">
            {node}
          </div>
        ))}
      </div>
    </section>
  );
}

function App() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const slides: SlideDef[] = [
    { node: <Hero />, variant: "video" },
    { node: <LogoStrip />, variant: "video" },
    { node: <ProblemSection />, variant: "dark" },
    { node: <HowItWorks />, variant: "dark" },
    { node: <FeatureBento />, variant: "video" },
    { node: <HookExamples />, variant: "video" },
    { node: <CaseStudies />, variant: "video" },
    { node: <SocialProof />, variant: "dark" },
    { node: <Pricing />, variant: "dark" },
    { node: <FAQ />, variant: "dark" },
    { node: <VisionRoadmap />, variant: "dark" },
    { node: <FinalCTA />, variant: "video", noRise: true, videoSrc: "/720.webm" },
    { node: <Footer />, variant: "video", videoSrc: "/720.webm" },
  ];

  // Merge consecutive same-variant slides into groups.
  const groups: GroupDef[] = [];
  for (const s of slides) {
    const last = groups[groups.length - 1];
    if (last && last.variant === s.variant && last.videoSrc === s.videoSrc) {
      last.nodes.push(s.node);
      if (s.noRise) last.noRise = true;
    } else {
      groups.push({ variant: s.variant, nodes: [s.node], noRise: s.noRise, videoSrc: s.videoSrc });
    }
  }

  return (
    <>
      <main className="relative" style={{ zIndex: 1 }}>
        {groups.map((g, i) => {
          const prev = groups[i - 1];
          const riseUp = !!prev && prev.variant !== g.variant && !g.noRise;
          return <Group key={i} group={g} index={i} riseUp={riseUp} />;
        })}
      </main>
      <GradualBlur
        target="page"
        position="bottom"
        height={isMobile ? "3rem" : "6rem"}
        strength={2}
        divCount={6}
        curve="bezier"
        exponential
        opacity={1}
      />
    </>
  );
}

export default App;
