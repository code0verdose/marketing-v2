import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, MessageCircleQuestion, Sparkles } from "lucide-react";
import GlareHover from "./ui/GlareHover";

const steps = [
  {
    n: "01",
    icon: FileText,
    title: "Parameters.",
    body: "Pick your goal (sales, reach, loyalty) and platform. No 40-field forms — just the essentials.",
  },
  {
    n: "02",
    icon: MessageCircleQuestion,
    title: "Context.",
    body: "Answer a few precise questions about your product, audience, and tone. The AI needs your context to nail the output.",
  },
  {
    n: "03",
    icon: Sparkles,
    title: "Result.",
    body: "AI delivers packaged content: from the initial idea to the final script with hooks. Ready to publish.",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="how"
      ref={ref}
      className="relative py-8 px-6 overflow-hidden scroll-mt-20"
    >
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
            Workflow
          </p>
          <h2 className="text-4xl md:text-6xl text-white tracking-tight">
            Your personal{" "}
            <span
              className="italic"
              style={{
                fontFamily: "'Instrument Serif', serif",
                color: "var(--accent)",
              }}
            >
              production
            </span>{" "}
            team in one interface
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="liquid-glass rounded-3xl"
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
                  <div className="relative z-[1] p-8 md:p-10 flex flex-col gap-6 h-full">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-5xl md:text-6xl italic"
                        style={{
                          fontFamily: "'Instrument Serif', serif",
                          color: "var(--accent)",
                        }}
                      >
                        {s.n}
                      </span>
                      <div className="liquid-glass rounded-full w-11 h-11 flex items-center justify-center text-accent">
                        <Icon size={18} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white text-xl md:text-2xl tracking-tight mb-3">
                        {s.title}
                      </h3>
                      <p className="text-white/55 text-sm md:text-base leading-relaxed">
                        {s.body}
                      </p>
                    </div>
                  </div>
                </GlareHover>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
