import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Check,
  Wand2,
  FileText,
  BarChart3,
  Image,
  Video,
  Globe,
} from "lucide-react";

type Phase = {
  quarter: string;
  title: string;
  status: "done" | "current" | "upcoming";
  items: { icon: typeof Check; text: string }[];
};

const phases: Phase[] = [
  {
    quarter: "Q1 2025",
    title: "Foundation",
    status: "done",
    items: [
      { icon: Wand2, text: "Viral Hooks Generator" },
      { icon: FileText, text: "Scripts Engine for Reels / Shorts / TikTok" },
      { icon: BarChart3, text: "Smart Content Plan (week & month)" },
    ],
  },
  {
    quarter: "Q2 2025",
    title: "Content Suite",
    status: "current",
    items: [
      { icon: FileText, text: "Carousel Architect — structure & copy" },
      { icon: FileText, text: "Post Matrix — tone-of-voice adaptation" },
      { icon: BarChart3, text: "Analytics dashboard & engagement prediction" },
    ],
  },
  {
    quarter: "Q3 2025",
    title: "Visual AI",
    status: "upcoming",
    items: [
      { icon: Image, text: "AI image generation matched to your content" },
      { icon: Video, text: "Video avatars — talking-head clips from text" },
      { icon: Image, text: "Auto-thumbnails & story covers" },
    ],
  },
  {
    quarter: "Q4 2025",
    title: "Full Ecosystem",
    status: "upcoming",
    items: [
      { icon: Globe, text: "One-click multi-platform publishing" },
      { icon: BarChart3, text: "Real-time performance tracking & A/B testing" },
      { icon: Globe, text: "Team workspaces & client portals" },
    ],
  },
];

function statusColor(s: Phase["status"]) {
  if (s === "done") return "var(--accent)";
  if (s === "current") return "var(--accent)";
  return "rgba(255,255,255,0.25)";
}

function statusLabel(s: Phase["status"]) {
  if (s === "done") return "Launched";
  if (s === "current") return "In progress";
  return "Upcoming";
}

export default function VisionRoadmap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="vision"
      ref={ref}
      className="py-24 md:py-32 px-6 scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
            Roadmap
          </p>
          <h2 className="text-4xl md:text-6xl text-white tracking-tight mb-6">
            This is just the{" "}
            <span
              className="italic"
              style={{
                fontFamily: "'Instrument Serif', serif",
                color: "var(--accent)",
              }}
            >
              beginning
            </span>
          </h2>
          <p className="text-white/55 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            We're building a full-cycle ecosystem. One entry point — infinite
            content flow.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — centered on the 40px dot container (left-0, w-40px → center at 20px minus half the 1px line) */}
          <div
            aria-hidden
            className="absolute left-[19.5px] top-[24px] bottom-0 w-px"
            style={{
              background:
                "linear-gradient(to bottom, var(--accent), rgba(255,255,255,0.08) 70%)",
            }}
          />

          <div className="flex flex-col gap-12 md:gap-14">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.quarter}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
                className="relative pl-14 md:pl-16"
              >
                {/* Dot on the timeline */}
                <div
                  className="absolute left-0 top-1 flex items-center justify-center"
                  style={{ width: 40, height: 40 }}
                >
                  <div
                    className="rounded-full flex items-center justify-center"
                    style={{
                      width: phase.status === "current" ? 18 : 12,
                      height: phase.status === "current" ? 18 : 12,
                      backgroundColor: statusColor(phase.status),
                      boxShadow:
                        phase.status === "current"
                          ? "0 0 16px var(--accent-glow), 0 0 4px var(--accent)"
                          : phase.status === "done"
                          ? "0 0 8px var(--accent-glow)"
                          : "none",
                    }}
                  >
                    {phase.status === "done" && (
                      <Check size={8} className="text-black" strokeWidth={3} />
                    )}
                  </div>
                  {/* Pulse ring for current */}
                  {phase.status === "current" && (
                    <div
                      className="absolute rounded-full animate-ping"
                      style={{
                        width: 18,
                        height: 18,
                        backgroundColor: "var(--accent)",
                        opacity: 0.3,
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div>
                  {/* Quarter + status */}
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span
                      className="text-sm font-semibold tabular-nums"
                      style={{
                        color:
                          phase.status === "upcoming"
                            ? "rgba(255,255,255,0.35)"
                            : "var(--accent)",
                      }}
                    >
                      {phase.quarter}
                    </span>
                    <span
                      className="liquid-glass rounded-full px-2.5 py-0.5 text-[10px] tracking-widest uppercase font-medium"
                      style={{
                        color:
                          phase.status === "done"
                            ? "var(--accent)"
                            : phase.status === "current"
                            ? "#fff"
                            : "rgba(255,255,255,0.4)",
                        borderColor:
                          phase.status === "current"
                            ? "var(--accent)"
                            : undefined,
                        borderWidth:
                          phase.status === "current" ? 1 : undefined,
                      }}
                    >
                      {statusLabel(phase.status)}
                    </span>
                  </div>

                  {/* Phase title */}
                  <h3
                    className="text-2xl md:text-3xl tracking-tight mb-4"
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      color:
                        phase.status === "upcoming"
                          ? "rgba(255,255,255,0.4)"
                          : "#fff",
                    }}
                  >
                    {phase.title}
                  </h3>

                  {/* Bullet items */}
                  <ul className="flex flex-col gap-2.5">
                    {phase.items.map((item, j) => {
                      const Icon = item.icon;
                      const dim = phase.status === "upcoming";
                      return (
                        <li
                          key={j}
                          className="flex items-start gap-3"
                        >
                          <div
                            className="shrink-0 mt-0.5 rounded-md w-6 h-6 flex items-center justify-center"
                            style={{
                              backgroundColor: dim
                                ? "rgba(255,255,255,0.04)"
                                : "var(--accent-soft)",
                            }}
                          >
                            {phase.status === "done" ? (
                              <Check
                                size={12}
                                className="text-accent"
                                strokeWidth={2.5}
                              />
                            ) : (
                              <Icon
                                size={12}
                                style={{
                                  color: dim
                                    ? "rgba(255,255,255,0.3)"
                                    : "var(--accent)",
                                }}
                              />
                            )}
                          </div>
                          <span
                            className="text-sm md:text-base leading-relaxed"
                            style={{
                              color: dim
                                ? "rgba(255,255,255,0.35)"
                                : "rgba(255,255,255,0.65)",
                              textDecoration:
                                phase.status === "done"
                                  ? "line-through"
                                  : undefined,
                              textDecorationColor:
                                phase.status === "done"
                                  ? "rgba(245,162,124,0.4)"
                                  : undefined,
                            }}
                          >
                            {item.text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
