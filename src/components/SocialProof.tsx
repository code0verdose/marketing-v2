import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const quotes = [
  {
    body: "ContentForge replaced my 4-hour brainstorms with one coffee. My first Reel using it did 1.8M views in a week.",
    name: "Anna Petrova",
    role: "Creator · @anna.creates",
  },
  {
    body: "Feels like cheating. I paste a brief and get a full week of content before lunch. My agency is 3x faster now.",
    name: "Dmitry Volkov",
    role: "Founder · Digital Wave",
  },
  {
    body: "Our team ships 10x more concepts per client now. Juniors produce at senior level overnight.",
    name: "Katya Sokolova",
    role: "CD · Creative Lab",
  },
  {
    body: "I stopped dreading content days. Open ContentForge, set parameters — done. A full month planned in an hour.",
    name: "Mark Ivanov",
    role: "Creator · @marktalks",
  },
  {
    body: "The carousel architect alone is worth the subscription. Finally my saves went through the roof.",
    name: "Lena Chen",
    role: "SMM · Brand Studio",
  },
];

export default function SocialProof() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [idx, setIdx] = useState(0);
  const quote = quotes[idx];

  return (
    <section
      id="reviews"
      ref={ref}
      className="relative py-16 px-6 scroll-mt-20"
    >
      {/* Solid white panel that covers the group's dark/glow bg so this
          one section reads as a light, inverted block. */}
      <div aria-hidden className="absolute inset-0 bg-[#f5a27ccf]" />
      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-10 md:p-14 text-center relative border border-black/10 bg-black/[0.02]"
        >
          <Quote className="text-black mx-auto mb-6" size={32} />
          <p
            key={idx}
            className="text-2xl md:text-3xl lg:text-4xl text-black leading-snug tracking-tight mb-10"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            "{quote.body}"
          </p>
          <div className="mb-8">
            <p className="text-black font-medium text-base">{quote.name}</p>
            <p className="text-black/50 text-sm">{quote.role}</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIdx((i) => (i - 1 + quotes.length) % quotes.length)}
              className="rounded-full w-10 h-10 flex items-center justify-center text-black border border-black/15 hover:bg-black/5 transition-colors"
              aria-label="Previous quote"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Quote ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx ? "w-6 bg-black" : "w-1.5 bg-black/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setIdx((i) => (i + 1) % quotes.length)}
              className="rounded-full w-10 h-10 flex items-center justify-center text-black border border-black/15 hover:bg-black/5 transition-colors"
              aria-label="Next quote"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
