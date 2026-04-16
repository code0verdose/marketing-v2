import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Rocket, Image, Video, Sparkles } from "lucide-react";
import GlareHover from "./ui/GlareHover";

const upcoming = [
  {
    icon: Image,
    title: "AI Image Generation",
    body: "Unique visuals generated to match your content — no stock photos, no designers needed.",
  },
  {
    icon: Video,
    title: "Video Avatars",
    body: "AI-powered talking-head videos created right inside your dashboard. One click to record.",
  },
  {
    icon: Sparkles,
    title: "Full-cycle Ecosystem",
    body: "One entry point — infinite content flow. From idea to published post, all in one place.",
  },
];

export default function VisionRoadmap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="vision" ref={ref} className="py-24 md:py-32 px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
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
            We're building a full-cycle ecosystem. Soon: unique image generation
            and video avatars right inside your personal dashboard. One entry
            point — infinite content flow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcoming.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className="liquid-glass rounded-2xl"
              >
                <GlareHover
                  borderRadius="1rem"
                  glareColor="#ffffff"
                  glareOpacity={0.28}
                  glareAngle={-35}
                  glareSize={280}
                  transitionDuration={1500}
                  className="h-full"
                >
                  <div className="relative z-[1] p-8 md:p-10 h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="liquid-glass rounded-full w-12 h-12 flex items-center justify-center text-accent">
                        <Icon size={20} />
                      </div>
                      <div className="liquid-glass rounded-full px-3 py-1 text-[10px] tracking-widest uppercase text-accent font-semibold">
                        Coming soon
                      </div>
                    </div>
                    <h3 className="text-white text-xl md:text-2xl tracking-tight mb-3">
                      {item.title}
                    </h3>
                    <p className="text-white/55 text-sm md:text-base leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </GlareHover>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 flex items-center justify-center gap-3"
        >
          <Rocket size={16} className="text-accent" />
          <p className="text-white/40 text-sm">
            Priority list members get first access to every new feature.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
