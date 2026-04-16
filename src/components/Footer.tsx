import { Sparkles } from "lucide-react";

const cols = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Roadmap", "Changelog"],
  },
  {
    title: "Use cases",
    links: ["Creators", "Brands", "Agencies", "Bloggers"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "DPA", "Cookies"],
  },
];

export default function Footer() {
  return (
    <footer className="px-6 pb-32 md:pb-40">
      <div className="max-w-6xl mx-auto">
        <div className="liquid-glass rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-white mb-4">
                <Sparkles size={18} className="text-accent" />
                <span className="font-semibold text-base">ContentForge</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed max-w-[220px]">
                AI-powered content production. Built for creators who dominate.
              </p>
            </div>
            {cols.map((c) => (
              <div key={c.title}>
                <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
                  {c.title}
                </p>
                <ul className="flex flex-col gap-3">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-white/70 hover:text-white text-sm transition-colors"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white/40 text-xs">
            <p>© {new Date().getFullYear()} ContentForge. All rights reserved.</p>
            <p>Infrastructure for social dominance.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
