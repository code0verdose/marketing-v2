import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import GlareHover from "./ui/GlareHover";

const faqs = [
  {
    q: "What exactly does ContentForge do?",
    a: "You describe your product and goals — we generate complete content packages: viral hooks, video scripts, content plans, carousel structures, and post copy for any platform.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. ContentForge is web-based. Set your parameters, generate content, and export directly to your workflow.",
  },
  {
    q: "How is the content generated?",
    a: "Every piece of content is generated specifically for your brief using frontier AI models, then optimized based on engagement patterns from millions of posts.",
  },
  {
    q: "Can I use my own brand voice?",
    a: "Yes. Set up your brand profile once — tone of voice, key messages, audience — and every output speaks your language automatically.",
  },
  {
    q: "How is this different from ChatGPT?",
    a: "ChatGPT gives you generic text. ContentForge gives you platform-optimized content with proven structures, hooks, and scripts designed to perform.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — join the waitlist above and you'll get 7-day full access when we open the doors.",
  },
  {
    q: "What about image and video generation?",
    a: "Coming soon. We're building a full-cycle ecosystem — unique image generation and video avatars are on the roadmap for your personal dashboard.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Anytime, one click. Your content library stays accessible for 90 days after cancellation.",
  },
];

function Item({ q, a, i, open, onToggle }: { q: string; a: string; i: number; open: boolean; onToggle: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: i * 0.05 }}
      className="liquid-glass rounded-2xl overflow-hidden"
    >
      <GlareHover
        borderRadius="1rem"
        glareColor="#ffffff"
        glareOpacity={0.25}
        glareAngle={-35}
        glareSize={280}
        transitionDuration={1500}
        className="h-full"
      >
        <div className="relative z-[1]">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-between gap-4 text-left px-6 md:px-8 py-5 md:py-6"
          >
            <span className="text-white text-base md:text-lg">{q}</span>
            <Plus
              size={20}
              className={`shrink-0 transition-all ${
                open ? "rotate-45 text-accent" : "text-white/70"
              }`}
            />
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              >
                <div className="px-6 md:px-8 pb-5 md:pb-6 text-white/60 text-sm md:text-base leading-relaxed">
                  {a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlareHover>
    </motion.div>
  );
}

export default function FAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" ref={ref} className="py-16 px-6 scroll-mt-20">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl text-white tracking-tight text-center mb-12 md:mb-16"
        >
          Frequently{" "}
          <span
            className="italic"
            style={{
              fontFamily: "'Instrument Serif', serif",
              color: "var(--accent)",
            }}
          >
            asked
          </span>
        </motion.h2>
        <div className="flex flex-col gap-3">
          {faqs.map((f, i) => (
            <Item
              key={f.q}
              i={i}
              q={f.q}
              a={f.a}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
