import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EyeOff, Clock, TrendingDown, DollarSign } from "lucide-react";
import GlareHover from "./ui/GlareHover";

const cards = [
  {
    icon: EyeOff,
    title: "Creative block",
    body: "Hours spent searching for an idea that will take off. The blank page wins every time.",
  },
  {
    icon: Clock,
    title: "Weak reach",
    body: "Scripts with no structure that nobody watches to the end. The algorithm buries you.",
  },
  {
    icon: TrendingDown,
    title: "Total chaos",
    body: "No clear plan, no promotion strategy. Content without a system is content without results.",
  },
  {
    icon: DollarSign,
    title: "Wasted budget",
    body: "Spending on copywriters who don't understand your product. Generic output, zero ROI.",
  },
];

export default function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="problem" ref={ref} className="py-16 md:py-28 px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl text-white tracking-tight text-center mb-16 md:mb-20"
        >
          Content production became a{" "}
          <span
            className="italic"
            style={{
              fontFamily: "'Instrument Serif', serif",
              color: "var(--accent)",
            }}
          >
            grind
          </span>
          ?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
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
                    <div className="liquid-glass rounded-full w-12 h-12 flex items-center justify-center mb-6 text-accent">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-white text-xl md:text-2xl tracking-tight mb-3">
                      {c.title}
                    </h3>
                    <p className="text-white/55 text-sm md:text-base leading-relaxed">
                      {c.body}
                    </p>
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
