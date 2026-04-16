import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check } from "lucide-react";
import GlareHover from "./ui/GlareHover";

const tiers = [
  {
    name: "Creator",
    monthly: 29,
    yearly: 24,
    tagline: "For solo creators posting weekly.",
    features: [
      "50 content generations / month",
      "Hooks + scripts + carousels",
      "1 brand profile",
      "Content plan generator",
    ],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Brand",
    monthly: 99,
    yearly: 82,
    tagline: "For teams shipping daily content.",
    features: [
      "Unlimited generations",
      "Brand voice profiles",
      "3 workspace seats",
      "Multi-platform export",
      "Priority generation speed",
    ],
    cta: "Get started",
    featured: true,
  },
  {
    name: "Agency",
    monthly: 249,
    yearly: 207,
    tagline: "White-label content at scale.",
    features: [
      "Everything in Brand",
      "10 client workspaces",
      "White-label exports",
      "Dedicated strategist",
      "SSO + audit log",
    ],
    cta: "Get agency pricing",
    featured: false,
  },
];

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" ref={ref} className="py-24 md:py-32 px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14 md:mb-16"
        >
          <h2 className="text-4xl md:text-6xl text-white tracking-tight mb-5">
            Pricing that scales
            <br className="hidden md:block" /> with your{" "}
            <span
              className="italic"
              style={{
                fontFamily: "'Instrument Serif', serif",
                color: "var(--accent)",
              }}
            >
              content
            </span>
          </h2>
          <div className="liquid-glass inline-flex rounded-full p-1 mt-6">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                !yearly ? "bg-white text-black" : "text-white/70"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                yearly ? "bg-white text-black" : "text-white/70"
              }`}
            >
              Yearly · -15%
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.12 }}
              className={`liquid-glass rounded-3xl ${
                t.featured ? "md:-mt-4 md:mb-0" : ""
              }`}
              style={
                t.featured
                  ? {
                      boxShadow:
                        "0 0 0 1px rgba(245,162,124,0.45), 0 20px 80px -20px rgba(245,162,124,0.3), inset 0 1px 1px rgba(255,255,255,0.15)",
                    }
                  : undefined
              }
            >
              <GlareHover
                borderRadius="1.5rem"
                glareColor={t.featured ? "#F5A27C" : "#ffffff"}
                glareOpacity={t.featured ? 0.45 : 0.28}
                glareAngle={-35}
                glareSize={280}
                transitionDuration={1500}
                className="h-full"
              >
                <div className="relative z-[1] p-8 md:p-9 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white text-lg font-medium">{t.name}</p>
                    {t.featured && (
                      <span
                        className="rounded-full px-3 py-1 text-[10px] tracking-widest uppercase font-semibold"
                        style={{
                          backgroundColor: "var(--accent)",
                          color: "#0a0a0a",
                        }}
                      >
                        Most popular
                      </span>
                    )}
                  </div>
                  <p className="text-white/50 text-sm mb-6">{t.tagline}</p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span
                      className="text-5xl md:text-6xl"
                      style={{
                        fontFamily: "'Instrument Serif', serif",
                        color: t.featured ? "var(--accent)" : "#fff",
                      }}
                    >
                      ${yearly ? t.yearly : t.monthly}
                    </span>
                    <span className="text-white/50 text-sm">/mo</span>
                  </div>
                  <ul className="flex flex-col gap-3 flex-1 mb-8">
                    {t.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-3 text-white/70 text-sm"
                      >
                        <Check
                          size={16}
                          className="text-white mt-0.5 shrink-0"
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`rounded-full h-11 font-semibold text-sm transition-all ${
                      t.featured
                        ? "text-black hover:brightness-110"
                        : "liquid-glass text-white hover:bg-white/5"
                    }`}
                    style={
                      t.featured
                        ? {
                            backgroundColor: "var(--accent)",
                            boxShadow: "0 10px 30px -10px var(--accent-glow)",
                          }
                        : undefined
                    }
                  >
                    {t.cta}
                  </button>
                </div>
              </GlareHover>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
