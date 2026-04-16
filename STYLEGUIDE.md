# Liquid Glass Landing — Styleguide & Prompt

A reusable styleguide for building dark, cinematic landing pages in the **Apple-style liquid glass** aesthetic. Use this as a prompt / reference when generating new landings with different content.

The goal: **every new landing should feel like part of the same family** — same dark canvas, same glass components, same Instrument Serif accent, same motion language — only the copy, sections, and video assets change.

---

## 1. Tech Stack (locked)

- **Vite + React 18 + TypeScript**
- **Tailwind CSS 3** (no v4)
- **framer-motion** for all animations (pull-ups, fades, scroll-linked, carousels)
- **lucide-react** for icons (check availability — some socials like `Twitter`/`Instagram` are **not** exported, use `Send`, `Link2`, `Globe`, etc.)
- **No** CSS-in-JS libraries, no component libraries (shadcn, radix, etc.) — everything is hand-built

### Project structure

```
src/
  App.tsx                         # Renders FixedBackground + <main> with sections
  index.css                       # Tailwind + @import font + .liquid-glass class
  main.tsx
  components/
    FixedBackground.tsx           # Fixed fullscreen video background (always present)
    Hero.tsx                      # First screen, navbar + headline + waitlist form
    LogoStrip.tsx                 # Brand logos strip
    ProblemSection.tsx            # "Why X fails" — 3 cards
    HowItWorks.tsx                # 3 numbered steps
    FeatureBento.tsx              # 6-cell bento grid (2×3)
    HookExamples.tsx              # Carousel of real examples (auto-play, 6s)
    SocialProof.tsx               # Testimonial carousel
    Pricing.tsx                   # 3 tiers + Monthly/Yearly toggle
    FAQ.tsx                       # Accordion
    FinalCTA.tsx                  # Repeat CTA with waitlist form
    Footer.tsx                    # 4-col footer inside glass card
    ui/
      GlareHover.tsx              # Reusable diagonal shine hover effect
      GlareHover.css              # Pseudo-element gradient sweep
```

---

## 2. Visual language

### 2.1 Palette

- Background: **pure black `#000`** — never gray, never near-black
- Text: **white** in 4 opacity tiers:
  - `text-white` — headings, primary actions
  - `text-white/70` — body paragraphs
  - `text-white/55` or `text-white/60` — secondary body
  - `text-white/40` — labels, eyebrows, muted meta
  - `text-white/25`–`/30` — decorative numerals, dots
- Accent color is **white + italic serif** — no coloured brand hues. The landing's "accent" is the video seen through the glass.
- Optional subtle overlay on video: `bg-black/55` + soft vertical gradient.

### 2.2 Typography

Two Google Fonts imported at the top of `index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
```

- **Default UI**: system sans / Inter-equivalent (browser default is fine — keep it clean, no custom sans required)
- **Instrument Serif**: used **only** for:
  - Italic accent words inside headings (`*viral*`, `*cook*`, `*inside*`, `*bomb*`, `*works*`)
  - Large prices (`$29`, `$99`) on pricing cards
  - Pull-quotes in testimonials
  - Ordinal numerals (`01`, `02`, `03`) inside step/feature cards
  - Hook-example quote lines inside the carousel

Usage pattern:

```tsx
<h2 className="text-4xl md:text-6xl text-white tracking-tight">
  Why great products{" "}
  <span
    className="italic text-white/60"
    style={{ fontFamily: "'Instrument Serif', serif" }}
  >
    bomb
  </span>{" "}
  in the feed
</h2>
```

**Rules:**
- Headings are **tight**: `tracking-tight` always, `leading-[1.02]` or `leading-snug` for display sizes
- Italic serif accent word is always `text-white/60` (not full white) — it recedes beautifully into the sentence
- Never style the whole heading in serif — only accent word(s)
- Body text is **always sans**, never serif (serif is for moments of weight)

### 2.3 Type scale

| Role | Mobile | Tablet | Desktop |
|---|---|---|---|
| Hero H1 | `text-5xl` | `text-7xl` (sm) | `text-7xl md:text-8xl lg:text-8xl` |
| Section H2 | `text-4xl` | `text-5xl` | `text-6xl` |
| Section H3 (card title) | `text-xl` | `text-xl` | `text-2xl` |
| Body (card) | `text-sm` | `text-sm` | `text-base` |
| Eyebrow / label | `text-xs tracking-widest uppercase` | same | same |
| Footer links | `text-sm` | | |

---

## 3. The `.liquid-glass` class (CORE, do not modify)

Paste this verbatim into `src/index.css` inside `@layer components`:

```css
@layer components {
  .liquid-glass {
    background: rgba(255, 255, 255, 0.01);
    background-blend-mode: luminosity;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: none;
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
  }

  .liquid-glass::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1.4px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.45) 0%,
      rgba(255, 255, 255, 0.15) 20%,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, 0) 60%,
      rgba(255, 255, 255, 0.15) 80%,
      rgba(255, 255, 255, 0.45) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
}
```

**What it does:**
- Near-transparent background (1% white) with `luminosity` blend — picks up the video colours behind
- `backdrop-filter: blur(4px)` — soft frosted feel, keeps the scene readable
- `::before` pseudo-element paints a **top-and-bottom lit bezel** (brighter at 0% and 100%, fading to 0 in the middle) — this is the key Apple-y detail
- `mask-composite: exclude` makes the gradient render only on the 1.4px border, not the fill

### Usage rules

- Every "panel" in the UI is `.liquid-glass` + a `rounded-*` class
- Buttons, pills, inputs, cards, nav, toggles — **all** use the same class
- **Always** pair with `rounded-full` or `rounded-2xl` / `rounded-3xl` so the bezel gradient follows the shape
- Do **not** add extra `bg-white/10` or coloured backgrounds — the glass is the background
- Nested glass is fine and encouraged (glass button inside a glass card inside another glass container)

### Variants by radius

| Element | Radius |
|---|---|
| Buttons, pills, tags, nav | `rounded-full` |
| Small cards (problem, features, steps) | `rounded-2xl` |
| Big content cards (testimonial, pricing, examples, footer) | `rounded-3xl` |
| Hero final-CTA mega card | `rounded-[2rem] md:rounded-[2.5rem]` |

---

## 3.5 GlareHover — the hover shine effect

Every card in the grids gets a soft diagonal **glare** that sweeps across on hover. It's the second signature detail after the liquid-glass bezel, and it's what makes the page feel alive without adding colour or motion that distracts from the fixed video.

The glare is a reusable, headless wrapper component — it only provides the sweeping highlight, it does **not** replace the `.liquid-glass` class. You always layer `GlareHover` *inside* a `.liquid-glass` card.

### 3.5.1 CSS — `src/components/ui/GlareHover.css`

```css
.glare-hover {
  width: var(--gh-width);
  height: var(--gh-height);
  background: var(--gh-bg);
  border-radius: var(--gh-br);
  border: 1px solid var(--gh-border);
  overflow: hidden;
  position: relative;
}

.glare-hover::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    var(--gh-angle),
    hsla(0, 0%, 0%, 0) 60%,
    var(--gh-rgba) 70%,
    hsla(0, 0%, 0%, 0),
    hsla(0, 0%, 0%, 0) 100%
  );
  transition: var(--gh-duration) ease;
  background-size:
    var(--gh-size) var(--gh-size),
    100% 100%;
  background-repeat: no-repeat;
  background-position:
    -100% -100%,
    0 0;
  pointer-events: none;
  z-index: 2;
}

.glare-hover:hover {
  cursor: pointer;
}

.glare-hover:hover::before {
  background-position:
    100% 100%,
    0 0;
}

.glare-hover--play-once::before {
  transition: none;
}

.glare-hover--play-once:hover::before {
  transition: var(--gh-duration) ease;
  background-position:
    100% 100%,
    0 0;
}
```

### 3.5.2 Component — `src/components/ui/GlareHover.tsx`

```tsx
import React from "react";
import "./GlareHover.css";

interface GlareHoverProps {
  width?: string;
  height?: string;
  background?: string;
  borderRadius?: string;
  borderColor?: string;
  children?: React.ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Reusable glare / shine hover effect.
 * Can wrap any element. To overlay the effect on an existing styled
 * container (e.g. a `.liquid-glass` card) pass:
 *   background="transparent"
 *   borderColor="transparent"
 * and give it the same borderRadius as the child.
 */
const GlareHover: React.FC<GlareHoverProps> = ({
  width = "100%",
  height = "100%",
  background = "transparent",
  borderRadius = "0",
  borderColor = "transparent",
  children,
  glareColor = "#ffffff",
  glareOpacity = 0.35,
  glareAngle = -45,
  glareSize = 280,
  transitionDuration = 700,
  playOnce = false,
  className = "",
  style = {},
}) => {
  const hex = glareColor.replace("#", "");
  let rgba = glareColor;
  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  } else if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  }

  const vars: React.CSSProperties & { [k: string]: string } = {
    "--gh-width": width,
    "--gh-height": height,
    "--gh-bg": background,
    "--gh-br": borderRadius,
    "--gh-angle": `${glareAngle}deg`,
    "--gh-duration": `${transitionDuration}ms`,
    "--gh-size": `${glareSize}%`,
    "--gh-rgba": rgba,
    "--gh-border": borderColor,
  };

  return (
    <div
      className={`glare-hover ${
        playOnce ? "glare-hover--play-once" : ""
      } ${className}`}
      style={{ ...vars, ...style } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default GlareHover;
```

### 3.5.3 How it works internally

- The wrapper element has **transparent background and border by default** — it contributes nothing visually except the glare overlay, so it can be stacked on top of a `.liquid-glass` card without fighting its bezel.
- A `::before` pseudo-element paints a diagonal **linear-gradient strip** that is initially parked off-screen at `background-position: -100% -100%`.
- On `:hover`, the position transitions to `100% 100%` over the configured `transitionDuration` — the strip sweeps across the element.
- `background-size` controls how wide the sweep is (`var(--gh-size)`, given as a percentage) — bigger = softer and longer shine.
- `pointer-events: none` and `z-index: 2` on the `::before` keep the glare above content but non-interactive, so buttons and links inside the card keep working.
- The `playOnce` modifier disables the transition back to the off-screen position, so once you hover out the glare stays hidden until the next hover triggers the animation fresh.

### 3.5.4 Standard props (tokens)

Use these exact numbers across the whole site for consistency. Think of them as design tokens, not per-component choices.

| Prop | Standard card value | Notes |
|---|---|---|
| `glareColor` | `"#ffffff"` | Never use brand colours — glare is always white |
| `glareOpacity` | `0.28` | `0.25` for denser surfaces like FAQ items; `0.35` for featured / highlighted cards (e.g. Pricing "Most popular") |
| `glareAngle` | `-35` | Slightly steeper than 45° — feels more intentional on wide cards |
| `glareSize` | `280` | Percentage — the sweep spans nearly 3× the card width |
| `transitionDuration` | `900` | Milliseconds — slow enough to read, fast enough to feel responsive |
| `playOnce` | `false` | Leave default unless you have a reason |
| `borderRadius` | `"1rem"` (rounded-2xl) / `"1.5rem"` (rounded-3xl) | **Must exactly match** the parent card's Tailwind radius, or the glare will clip the wrong shape |
| `className` | `"h-full"` | Always — needed so the wrapper fills grid items with `items-stretch` |

### 3.5.5 Mounting pattern (the correct way to wrap a card)

You do **not** replace `.liquid-glass` with `GlareHover`. You layer them. The structure is always three nested elements:

```
motion.div               ← outer: liquid-glass + rounded + entrance animation (NO padding)
 └── GlareHover          ← middle: glare overlay, transparent, matching borderRadius, h-full
      └── div            ← inner: padding + layout + content, relative z-[1]
            ├── icon, title, body, etc.
```

**Reference implementation (from `ProblemSection.tsx`):**

```tsx
import GlareHover from "./ui/GlareHover";

<motion.div
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
    transitionDuration={900}
    className="h-full"
  >
    <div className="relative z-[1] p-8 md:p-10 h-full">
      <div className="liquid-glass rounded-full w-12 h-12 flex items-center justify-center mb-6 text-white">
        <Icon size={20} />
      </div>
      <h3 className="text-white text-xl md:text-2xl tracking-tight mb-3">
        {title}
      </h3>
      <p className="text-white/55 text-sm md:text-base leading-relaxed">
        {body}
      </p>
    </div>
  </GlareHover>
</motion.div>
```

**Critical rules:**

1. **Padding moves to the inner div**, never on the outer `motion.div` (otherwise the glare is clipped by padding) and never on `GlareHover` itself (which has no padding prop).
2. **`relative z-[1]` on the inner div** — content sits above the glare's `z-index: 2` only because inside `GlareHover` the stacking context is local; the inner div with `z-[1]` + position:relative ensures text/icons render above the pseudo-element. Always include both.
3. **`className="h-full"` on `GlareHover`** — required for grids with `items-stretch` so the glare spans the full card height.
4. **Match radii exactly** — `rounded-2xl` on the outer → `borderRadius="1rem"` on GlareHover; `rounded-3xl` → `borderRadius="1.5rem"`. Tailwind's scale:
   - `rounded-xl` = `0.75rem`
   - `rounded-2xl` = `1rem`
   - `rounded-3xl` = `1.5rem`
5. **Keep existing entrance animation on the outer `motion.div`** — do not move `initial`/`animate` to the inner div or the glare wrapper will unmount on remount.
6. **Nest inside FAQ buttons carefully** — if the card itself is a `<button>`, wrap inside it, otherwise the glare breaks the click target. See FAQ reference below.

### 3.5.6 Where to apply it

Apply GlareHover to **every card in a grid layout**. Skip single hero/feature elements that are already the focal point of the section.

| Section | Apply? | Notes |
|---|---|---|
| ProblemSection (3 cards) | ✅ yes | `rounded-2xl` → `borderRadius="1rem"` |
| HowItWorks (3 steps) | ✅ yes | `rounded-3xl` → `borderRadius="1.5rem"` |
| FeatureBento (6 cells) | ✅ yes | `rounded-3xl` → `borderRadius="1.5rem"` |
| Pricing (3 tiers) | ✅ yes | Featured tier uses `glareOpacity={0.35}`, others `0.28` |
| FAQ (8 items) | ✅ yes | Slightly lower opacity `0.25`; wrap *inside* the outer item div, outside the `<button>` |
| SocialProof (single carousel card) | ❌ no | Already has its own transition between quotes — adding glare competes with it |
| HookExamples (carousel wrapper) | ❌ no | Same reason — the inner hook lines already animate on carousel change |
| Footer (single card) | ❌ no | Not interactive in a hover-card way |
| Hero (waitlist form, nav pill, eyebrow) | ❌ no | These are interactive controls, not cards |

### 3.5.7 When to tweak the tokens

- **Denser content** (FAQ items with a lot of text already visible): lower `glareOpacity` to `0.22–0.25` so the sweep doesn't distract from reading.
- **Highlighted / featured cards** (the "Most popular" pricing tier): bump `glareOpacity` to `0.35` and leave everything else identical — it makes the featured card subtly more alive than the siblings.
- **Play-once moments** (a card that should shine exactly once per page load to draw the eye): set `playOnce={true}` and trigger hover programmatically if needed. Use sparingly.
- **Do not** change `glareColor` away from white. Do not introduce multiple glare colours in one page.

---

## 4. Fixed video background (global)

The single most distinctive thing about these landings: **the hero video is a `position: fixed` background for the entire page**. Every section scrolls over it while it stays locked.

### `FixedBackground.tsx`

```tsx
import { useEffect, useRef } from "react";

const HERO_VIDEO = "https://.../your-video.mp4";

export default function FixedBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);
  return (
    <div
      aria-hidden
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <video
        ref={videoRef}
        src={HERO_VIDEO}
        muted autoPlay loop playsInline preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
    </div>
  );
}
```

### `App.tsx` wrapping

```tsx
<>
  <FixedBackground />
  <main className="relative min-h-screen" style={{ zIndex: 1 }}>
    {/* sections */}
  </main>
</>
```

### `index.css` must have

```css
html, body {
  background: #000;
  overflow-x: hidden;
  width: 100%;
}
#root {
  background: transparent; /* critical — do not let #root cover the fixed video */
}
```

**⚠️ Z-index gotcha:** never use `-z-10` on the FixedBackground — Safari/iOS will hide it behind the body background. Use `zIndex: 0` on the background and `zIndex: 1` on `<main>`.

### Section backgrounds

**Every section must be transparent** — no `bg-black`, no radial overlays, no tints on the section level. Only glass cards inside. Otherwise visible horizontal seams appear between sections when the fixed video shows through.

```tsx
// GOOD
<section className="py-24 md:py-32 px-6">…</section>

// BAD — creates a visible border/seam
<section className="bg-black py-24 md:py-32 px-6">…</section>
```

---

## 5. Motion language

All motion uses **framer-motion**. Consistent feel across the whole page.

### 5.1 Primary easing

```ts
ease: [0.16, 1, 0.3, 1]  // "expo-out" feel, use for entrances and large movements
ease: [0.32, 0.72, 0, 1] // Apple's standard, use for UI transitions (accordion, carousel)
```

### 5.2 Entrance patterns

**Section scroll-into-view** — `useInView({ once: true, margin: "-100px" })`

```tsx
const ref = useRef<HTMLDivElement>(null);
const inView = useInView(ref, { once: true, margin: "-100px" });
// ...
<motion.h2
  initial={{ opacity: 0, y: 24 }}
  animate={inView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.8 }}
/>
```

**Staggered children** (cards in a grid):

```tsx
transition={{ duration: 0.7, delay: i * 0.12 }}
```

Use `0.08s` for lightweight items (individual hook lines), `0.12s–0.15s` for heavier cards.

**Hero** — fade-in, no scroll-trigger (it's the first paint):

```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
```

### 5.3 Carousel transitions

Use `AnimatePresence mode="wait"`:

```tsx
<AnimatePresence mode="wait">
  <motion.ul
    key={idx}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
  >
    {/* items */}
  </motion.ul>
</AnimatePresence>
```

### 5.4 Button micro-interactions

```tsx
className="hover:scale-[1.02] active:scale-[0.98] transition-transform"
```

Or for framer-motion:

```tsx
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

---

## 6. Standard section anatomy

Every content section follows this skeleton:

```tsx
export default function SomeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 md:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14 md:mb-20"
        >
          <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
            Eyebrow
          </p>
          <h2 className="text-4xl md:text-6xl text-white tracking-tight">
            Main heading with{" "}
            <span className="italic text-white/60" style={{ fontFamily: "'Instrument Serif', serif" }}>
              accent
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="liquid-glass rounded-2xl p-8 md:p-10"
            >
              {/* card content */}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Vertical rhythm

- Section vertical padding: `py-24 md:py-32` (always this, never less — it gives the page breathing room)
- Section horizontal padding: `px-4 sm:px-6`
- Content container: `max-w-6xl mx-auto` (testimonials/FAQ use `max-w-4xl` / `max-w-3xl`)
- Heading → grid gap: `mb-14 md:mb-20`
- Grid internal gap: `gap-5 md:gap-6`

### Card anatomy (the default)

```
┌──────────────────────────────────────┐
│  [glass icon circle]                 │  ← liquid-glass rounded-full w-11 h-11
│                                      │
│  Title                               │  ← text-xl md:text-2xl text-white tracking-tight
│  Body paragraph in 2–3 lines on      │  ← text-sm md:text-base text-white/55 leading-relaxed
│  lighter white, calm and short.      │
│                                      │
└──────────────────────────────────────┘
```

Icons are `lucide-react` 18–20px, inside a glass circle.

---

## 7. Forms (waitlist / email capture)

All email forms use this exact structure. Waitlist is the primary conversion — always include at least two forms (Hero + Final CTA).

```tsx
<form
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
    className="shrink-0 bg-white rounded-full h-10 sm:h-11 px-3 sm:px-5 flex items-center gap-1.5 sm:gap-2 text-black text-xs sm:text-sm font-medium hover:scale-[1.02] active:scale-[0.98] transition-transform whitespace-nowrap"
  >
    {submitted ? "Thanks" : "Join waitlist"}
    <ArrowRight size={14} className="sm:hidden" />
    <ArrowRight size={16} className="hidden sm:block" />
  </button>
</form>
```

**Critical rules:**
- `flex-1 min-w-0 w-0` on `<input>` — without these the button overflows on mobile
- `shrink-0` on `<button>`
- Button is **white** `bg-white text-black` — this is the only non-glass interactive element on the whole page, it earns attention by contrast
- Short placeholder (`Your email` not `Enter your email`) — mobile space is precious
- Button text stays compact: `text-xs sm:text-sm`, `px-3 sm:px-5`, `h-10 sm:h-11`

---

## 8. Buttons reference

| Use | Style |
|---|---|
| **Primary CTA** (submit, convert) | `bg-white text-black rounded-full h-10 sm:h-11 px-3 sm:px-5` |
| **Secondary CTA** (Watch demo, Learn more) | `liquid-glass rounded-full px-5 py-2.5 text-white text-sm` |
| **Nav login** | `liquid-glass rounded-full px-5 py-2 text-white text-sm` |
| **Icon-only** (prev/next, socials) | `liquid-glass rounded-full w-10 h-10 flex items-center justify-center` |
| **Tag / chip** | `liquid-glass rounded-full px-3 py-1.5 text-[10px] sm:text-xs uppercase tracking-wide` |

Never:
- ~~Solid brand colours~~
- ~~Gradient backgrounds on buttons~~ (gradient is reserved for the video)
- ~~Hard borders~~ (use the glass bezel instead)
- ~~Drop shadows on glass elements~~ (the `::before` handles the edge)

---

## 9. Standard page layout (section order)

For any landing page, ship these sections in this order unless there's a clear reason to deviate:

1. **Hero** — navbar + eyebrow pill + H1 with italic accent + subtitle + waitlist form + secondary CTA + social proof mini row
2. **LogoStrip** — 6 brand names/logos, text-only is fine
3. **ProblemSection** — 3-card grid ("why X fails")
4. **HowItWorks** — 3 numbered steps, large `01` `02` `03` in Instrument Serif italic
5. **FeatureBento** — 6 cells (2 rows × 3 cols), 2 cells can span `md:col-span-2` for bento feel
6. **HookExamples** (carousel) — real examples of the output, auto-playing carousel every 6s, pause on hover
7. **SocialProof** — testimonial carousel in a single big glass card with pull-quote in serif
8. **Pricing** — 3 tiers, middle one "Most popular" with slightly stronger border, monthly/yearly toggle
9. **FAQ** — accordion, 8 items, first one open by default
10. **FinalCTA** — big glass card with repeat waitlist form and "Stop staring at a *blank doc*." style heading
11. **Footer** — 4 columns inside a big glass card, micro-legal row at bottom

Total page length ~10–11 sections. Don't shrink below 8.

---

## 10. Nav (Hero navbar)

```tsx
<nav className="relative z-20 px-4 md:px-6 py-5">
  <div className="liquid-glass rounded-full max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
    <div className="flex items-center">
      <div className="flex items-center gap-2 text-white">
        <Sparkles size={20} />
        <span className="font-semibold text-base md:text-lg">BrandName</span>
      </div>
      <div className="hidden md:flex items-center gap-7 ml-8">
        {["Features", "Templates", "Pricing", "For Brands"].map((l) => (
          <a key={l} href="#" className="text-white/75 hover:text-white text-sm font-medium transition-colors">
            {l}
          </a>
        ))}
      </div>
    </div>
    <button className="liquid-glass rounded-full px-5 py-2 text-white text-sm font-medium">
      Login
    </button>
  </div>
</nav>
```

**Rules:**
- Navbar is **a floating glass pill** (`rounded-full max-w-5xl mx-auto`), not full-width
- Nav links hidden below `md:` — only logo + Login stays
- Logo is always `<Sparkles size={20}>` + brand name unless you have a better mark
- No dropdown menus, no hamburger menu (we keep it radically simple)

---

## 11. Responsive rules

- Mobile first — every utility must have a mobile base + `sm:`/`md:`/`lg:` modifiers
- `md:` breakpoint is 768px — this is where navbars expand, headings step up, grids become multi-column
- **Horizontal scroll bug**: always set `overflow-x: hidden; width: 100%` on `html, body` in `index.css`
- Forms must use `min-w-0 w-0` on inputs (see §7) — critical
- Hide long button text on mobile if needed: `hidden sm:inline` — but prefer compact sizes over icon-only
- Section paddings halve is OPTIONAL — default `py-24 md:py-32` works fine down to 375px
- Headings drop: `text-7xl` → `text-5xl` on mobile

---

## 12. Accessibility

- Exactly one `<h1>` on the page (in Hero)
- Sections use `<h2>`, cards use `<h3>`
- All decorative gradients, backgrounds, and `FixedBackground` must have `aria-hidden` or `aria-hidden="true"`
- Every icon-only button needs `aria-label`
- Carousels need previous/next buttons + dot pagination; dots are `<button>` with `aria-label={`Slide ${i+1}`}`
- Forms: `<input required>`, `type="email"`, visible `placeholder` (not relied on as label — add `aria-label` if you hide the label)

---

## 13. Do / Don't cheat-sheet

### ✅ Do

- Use `.liquid-glass` everywhere an element needs visual weight
- Wrap every card in a grid with `<GlareHover>` using the standard tokens (see §3.5.4)
- Use Instrument Serif italic sparingly for 1–3 word accents
- Keep headings tight (`tracking-tight`, `leading-[1.02]`)
- Make the video fixed and transparent through all sections
- Use white + opacity tiers for text hierarchy — never introduce new colours
- Stagger card grid entrances with `delay: i * 0.12`
- Use `rounded-full` for all interactive elements
- Pair every glass container with a rounded class so the bezel follows
- Match `GlareHover`'s `borderRadius` to the card's Tailwind radius exactly
- Max-width content: `max-w-6xl` for grids, `max-w-4xl` for prose, `max-w-3xl` for FAQs

### ❌ Don't

- Don't add `bg-black` to sections — it breaks the fixed background
- Don't use coloured accents (purple, pink, cyan, etc.) — the palette is strictly black + white
- Don't mix other font families — Instrument Serif is the *only* display exception
- Don't use hard borders on glass — the `::before` bezel handles it
- Don't use drop shadows on glass — the `::before` and the backdrop-blur are enough
- Don't overdo motion — 200ms–900ms, nothing longer, and never bouncy
- Don't nest more than 2 levels of glass — it starts looking muddy
- Don't use card `border` or `outline` — use the `::before` gradient bezel only
- Don't centre long paragraphs — left-align body text, centre only headlines and eyebrows
- Don't write more than 3 sentences in a card body — trim, trim, trim
- Don't put padding on the `<GlareHover>` wrapper or the outer `.liquid-glass` card — padding goes on the **inner** div with `relative z-[1]`
- Don't use `GlareHover` on single hero elements, carousels, or the footer — it's for grid cards only
- Don't change `glareColor` away from white or introduce multiple glare colours on the same page

---

## 14. Content voice (copy direction)

The visual language is cinematic and minimal — the copy should match.

- Short, punchy sentences. One idea per line.
- Use **italic accents** to mark the word that carries the meaning: *viral*, *cook*, *bomb*, *ship*, *inside*, *works*, *at scale*.
- Avoid jargon, avoid marketing speak, avoid superlatives.
- Speak to the reader directly ("you", not "users", not "customers").
- Every heading is ideally ≤ 8 words. Hero H1 can be 2 lines but each line ≤ 6 words.
- Every card body is ≤ 3 sentences, ideally 2.
- Buttons use **verbs**: "Start cooking", "Join waitlist", "Watch demo", "See it cook", "Get pricing".

---

## 15. New-landing prompt template

When building a new landing in this style, feed the LLM:

```
Build a landing page using the liquid glass styleguide in STYLEGUIDE.md.

Product: <NAME>
One-line positioning: <POSITIONING>
Target user: <AUDIENCE>
Hero video URL: <MP4_URL>
Brand mark icon (lucide-react): <ICON_NAME>

Sections (in order):
1. Hero — H1 "<HEADING with *italic* accent>", subtitle "<SUB>", waitlist email form ("Join waitlist"), secondary "Watch demo" button, rating/social-proof row
2. LogoStrip — 6 brand names: <...>
3. ProblemSection — title "Why <X> <*italic*> in the <Y>", 3 cards: <titles + bodies>
4. HowItWorks — "How it *works*", 3 steps: <step titles + bodies>
5. FeatureBento — "What's *inside*", 6 features: <titles + bodies> (first and fifth span 2 cols)
6. HookExamples — carousel of 4 real examples with brief tags + 4 lines per example
7. SocialProof — 5 testimonials
8. Pricing — 3 tiers ($A / $B "most popular" / $C) with monthly/yearly toggle
9. FAQ — 8 questions
10. FinalCTA — heading "Stop <X>. Start <Y>." with repeat waitlist form
11. Footer — 4 columns of links

Follow STYLEGUIDE.md exactly:
- Keep the fixed video background
- Use .liquid-glass on every surface
- Wrap every grid card in <GlareHover> with the standard tokens (§3.5.4, §3.5.5)
- Italic Instrument Serif only on accent words
- Palette is strictly black + white + white opacity tiers
- Mobile-safe forms with min-w-0 w-0 on inputs
- py-24 md:py-32 section rhythm
- framer-motion useInView entrances with stagger
```

This gives a reliable, consistent result every time.

---

## 16. File-by-file checklist before shipping

- [ ] `index.css`: has `@import` for Instrument Serif, Tailwind directives, `html/body { background: #000; overflow-x: hidden }`, `#root { background: transparent }`, `.liquid-glass` class inside `@layer components`
- [ ] `tailwind.config.js`: `content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']`
- [ ] `App.tsx`: renders `<FixedBackground />` then `<main className="relative min-h-screen" style={{ zIndex: 1 }}>` containing all sections
- [ ] All sections are transparent (no `bg-black`, no `bg-*` on section level)
- [ ] Hero video URL set in `FixedBackground.tsx`
- [ ] `src/components/ui/GlareHover.tsx` + `GlareHover.css` present and used on every grid card (ProblemSection, HowItWorks, FeatureBento, Pricing, FAQ)
- [ ] Every `GlareHover` uses the standard tokens and matches its parent's `borderRadius`
- [ ] Inner card content is wrapped in `<div className="relative z-[1] p-* h-full">` inside `<GlareHover>`
- [ ] At least 2 waitlist email forms (Hero + FinalCTA)
- [ ] Pricing has 3 tiers with featured middle tier and monthly/yearly toggle
- [ ] FAQ first item opens by default
- [ ] Footer has copyright and a micro tagline
- [ ] Dockerfile + nginx.conf for deploy (multi-stage Node → nginx, SPA fallback, gzip)
- [ ] `npx vite build` passes with no TypeScript errors

---

*Last updated: 2026-04-08.*
*Reference implementation: this repo's commit on `main`.*
