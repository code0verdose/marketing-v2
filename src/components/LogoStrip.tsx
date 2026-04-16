const brands = [
  "Reels",
  "YouTube",
  "TikTok",
  "Telegram",
  "Shorts",
  "Stories",
];

export default function LogoStrip() {
  return (
    <section className="py-8 px-6 overflow-hidden">
      <p className="text-center text-white/40 text-xs tracking-widest uppercase mb-8">
        Content for every platform
      </p>
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-10 md:gap-x-16 gap-y-6">
        {brands.map((b) => (
          <span
            key={b}
            className="text-white/50 hover:text-accent transition-colors text-xl md:text-2xl font-semibold tracking-tight"
          >
            {b}
          </span>
        ))}
      </div>
    </section>
  );
}
