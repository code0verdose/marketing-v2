import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Star } from "lucide-react";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Navbar */}
      <nav className="relative z-20 px-4 md:px-6 py-5">
        <div className="liquid-glass rounded-full max-w-6xl mx-auto px-5 py-3 grid grid-cols-[auto_1fr_auto] items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 text-white">
            <Sparkles size={20} style={{ color: "var(--accent)" }} />
            <span className="font-semibold text-base md:text-lg">ContentForge</span>
          </div>

          {/* Center nav */}
          <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-7">
            {[
              { label: "Problem", href: "#problem" },
              { label: "How", href: "#how" },
              { label: "Features", href: "#features" },
              { label: "Examples", href: "#examples" },
              { label: "Cases", href: "#cases" },
              { label: "Reviews", href: "#reviews" },
              { label: "Pricing", href: "#pricing" },
              { label: "FAQ", href: "#faq" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-white/75 hover:text-white text-sm font-medium transition-colors whitespace-nowrap"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Login */}
          <button className="liquid-glass rounded-full px-5 py-2 text-white text-sm font-medium justify-self-end">
            Login
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-6 pb-10 pt-1 text-center gap-7 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="liquid-glass rounded-full px-4 py-2 inline-flex items-center gap-2"
        >
          <Sparkles size={14} className="text-accent" />
          <span className="text-white/80 text-xs md:text-sm font-medium tracking-wide">
            ContentForge — Infrastructure for Social Dominance
          </span>
        </motion.div>

        {/* 3D social icons — overlapping trio under the badge */}
        <div className="relative flex items-center justify-center -mt-2 sm:-mt-3 md:-mt-4 h-20 sm:h-24 md:h-28 lg:h-32">
          {/* Instagram — left, rotated CCW, front */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -22, scale: 0.7 }}
            animate={{ opacity: 1, y: [0, -6, 0], rotate: -14, scale: 1 }}
            transition={{
              opacity: { duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] },
              rotate: { duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] },
              y: {
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.35,
              },
            }}
            className="relative pointer-events-none select-none w-20 sm:w-24 md:w-28 lg:w-32 aspect-square"
            style={{ zIndex: 1 }}
          >
            <img
              src="/3d-socials/Instagram-256.png"
              srcSet="/3d-socials/Instagram-256.png 1x, /3d-socials/Instagram-512.png 2x, /3d-socials/Instagram-768.png 3x"
              alt=""
              aria-hidden
              width={176}
              height={176}
              decoding="async"
              className="block w-full h-full hires-img"
            />
          </motion.div>

          {/* YouTube — centre, almost upright, tucked behind the other two */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 0, scale: 0.7 }}
            animate={{ opacity: 1, y: [0, -10, 0], rotate: -3, scale: 1 }}
            transition={{
              opacity: { duration: 0.9, delay: 0.42, ease: [0.16, 1, 0.3, 1] },
              rotate: { duration: 0.9, delay: 0.42, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 0.9, delay: 0.42, ease: [0.16, 1, 0.3, 1] },
              y: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              },
            }}
            className="relative pointer-events-none select-none w-28 sm:w-32 md:w-36 lg:w-40 aspect-square -ml-8 sm:-ml-10 md:-ml-12"
            style={{ zIndex: 3 }}
          >
            <img
              src="/3d-socials/Youtube-256.png"
              srcSet="/3d-socials/Youtube-256.png 1x, /3d-socials/Youtube-512.png 2x, /3d-socials/Youtube-768.png 3x"
              alt=""
              aria-hidden
              width={176}
              height={176}
              decoding="async"
              className="block w-full h-full hires-img"
            />
          </motion.div>

          {/* TikTok — right, rotated CW, front */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 22, scale: 0.7 }}
            animate={{ opacity: 1, y: [0, -8, 0], rotate: 12, scale: 1 }}
            transition={{
              opacity: { duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] },
              rotate: { duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] },
              y: {
                duration: 6.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.1,
              },
            }}
            className="relative pointer-events-none select-none w-20 sm:w-24 md:w-28 lg:w-32 aspect-square -ml-8 sm:-ml-10 md:-ml-12"
            style={{ zIndex: 2 }}
          >
            <img
              src="/3d-socials/Tiktok-256.png"
              srcSet="/3d-socials/Tiktok-256.png 1x, /3d-socials/Tiktok-512.png 2x, /3d-socials/Tiktok-768.png 3x"
              alt=""
              aria-hidden
              width={176}
              height={176}
              decoding="async"
              className="block w-full h-full hires-img"
            />
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[1.02] max-w-5xl"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Create{" "}
          <em className="italic" style={{ color: "var(--accent)" }}>
            viral
          </em>{" "}
          content.
          <br />
          Automatically.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/70 text-base md:text-lg max-w-xl leading-relaxed"
        >
          AI-powered system generates scripts, viral hooks and content plans
          based on your goals. No more blank page — just ready-to-ship ideas
          for Reels, YouTube & Telegram.
        </motion.p>

        {/* Waitlist form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) setSubmitted(true);
          }}
          className="liquid-glass rounded-full w-full max-w-lg pl-4 sm:pl-5 pr-1.5 py-1.5 flex items-center gap-1.5 sm:gap-2"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={submitted ? "You're on the list " : "Your email"}
            disabled={submitted}
            className="flex-1 min-w-0 w-0 bg-transparent outline-none text-white placeholder:text-white/40 text-sm md:text-base py-2"
          />
          <button
            type="submit"
            aria-label={submitted ? "Submitted" : "Join Priority List"}
            className="shrink-0 rounded-full h-10 sm:h-11 px-3 sm:px-5 flex items-center justify-center gap-1.5 sm:gap-2 text-black text-xs sm:text-sm font-semibold hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] transition-all whitespace-nowrap"
            style={{
              backgroundColor: "var(--accent)",
              boxShadow: "0 10px 30px -10px var(--accent-glow)",
            }}
          >
            {submitted ? "Thanks" : "Join Priority List"}
            <ArrowRight size={14} className="sm:hidden" />
            <ArrowRight size={16} className="hidden sm:block" />
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex items-center gap-5 flex-wrap justify-center"
        >
          <button className="group liquid-glass rounded-full px-5 py-2.5 text-white text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-colors">
            <Play
              size={14}
              fill="currentColor"
              className="transition-all duration-200 ease-out group-hover:text-accent group-hover:scale-125 group-active:scale-100"
            />
            Watch demo (0:42)
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  style={{ color: "var(--accent)" }}
                  fill="currentColor"
                />
              ))}
            </div>
            <span className="text-white/70 text-xs md:text-sm">
              4.9 · 8,000+ creators
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
