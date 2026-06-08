# Grace Lee Portfolio — Shared Component Reference
> Use this as the source of truth when building any new page. All components below are extracted from the live files and must be reproduced exactly.

---

## 0. Design Tokens (CSS Variables)

Paste into every page's `:root`. Case study pages use a slightly expanded set.

```css
:root {
  --cream: #fdf9f5;
  --orange: #FF5500;
  --orange-light: #fff3e8;
  --text: #0a0a3a;
  --muted: #555;         /* case study pages use #555; homepage uses #888 */
  --rule: rgba(255,85,0,0.15);
  --black: #0a0a3a;
  --off-white: #fdf9f5;
  --accent: #FF5500;     /* alias of --orange, used interchangeably in case studies */
  --accent-light: #fff3e8;
  --warm-gray: #aaa;
  --white: #ffffff;
}
```

**Typography:**
- Body: `'DM Sans', sans-serif` — `font-weight: 300` on case study pages, `400` on homepage
- Headings / display: `'Instrument Serif', serif`
- Google Fonts import (paste in `<head>`):
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
  ```

**Grid background** (case study pages and visual-design page — not homepage, which manages its own):
```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(var(--orange) 1px, transparent 1px),
    linear-gradient(90deg, var(--orange) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.2;
  pointer-events: none;
}
```

---

## 1. Navigation

Sticky, full-width, cream background. "Grace Lee" in Instrument Serif links back to `index.html`. Two nav links: Work + Contact.

```css
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 60px;
  border-bottom: 1px solid rgba(255,85,0,0.2);
  position: sticky;
  top: 0;
  background: var(--cream);
  z-index: 100;
}
.nav-name {
  font-family: 'Instrument Serif', serif;
  font-size: 1.1rem;
  color: var(--orange);
  text-decoration: none;
}
.nav-links {
  display: flex;
  gap: 36px;
  list-style: none;
}
.nav-links a {
  font-size: 0.82rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--orange);
  opacity: 0.7;
  text-decoration: none;
  transition: opacity 0.2s;
}
.nav-links a:hover { opacity: 1; }
```

```html
<nav>
  <a href="index.html" class="nav-name">Grace Lee</a>
  <ul class="nav-links">
    <li><a href="index.html">Work</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
</nav>
```

> **Note:** The homepage (`index.html`) has `nav { display: none; }` because it uses the draggable desktop UI instead. All other pages use this standard nav.

---

## 2. Footer

Minimal, cream background. Left: name + title. Right: year.

```css
footer {
  border-top: 1px solid rgba(255,85,0,0.2);
  padding: 10px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--cream);
  position: relative;
  z-index: 1;
}
.footer-left {
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
}
.footer-right {
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
}
```

```html
<footer>
  <div class="footer-left">Grace Lee &nbsp;·&nbsp; Principal Product Designer</div>
  <div class="footer-right">2026</div>
</footer>
```

---

## 3. Page Layout — Two-Column Section Grid

The core layout pattern for ALL case study page sections. A narrow label column on the left, content on the right.

```css
.section {
  margin: 0 auto;
  padding: 80px 60px;
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 60px;
}
.section-label {
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
  padding-top: 6px;
  line-height: 1.4;
}
.section-content h2 {
  font-family: 'Instrument Serif', serif;
  font-size: 1.9rem;
  font-weight: 400;
  color: var(--black);
  margin-bottom: 20px;
  line-height: 1.2;
}
.section-content p {
  color: var(--muted);
  margin-bottom: 16px;
  font-size: 1rem;
  line-height: 1.75;
}
.section-content p:last-child { margin-bottom: 0; }
```

```html
<section class="section">
  <div class="section-label">Section Name</div>
  <div class="section-content">
    <h2>Section Heading</h2>
    <p>Body copy goes here.</p>
  </div>
</section>
```

**Hero section** uses the same 420px / 1fr grid but with different padding and an `h1`:

```css
.hero {
  padding: 100px 60px 80px;
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 60px;
  align-items: start;
}
h1 {
  font-family: 'Instrument Serif', serif;
  font-size: clamp(2.8rem, 5vw, 4.2rem);
  line-height: 1.1;
  color: var(--black);
  font-weight: 400;
}
h1 em {
  font-style: italic;
  color: var(--accent);
}
```

---

## 4. Three-Column Grid (Screenshot reference: the "For Agents / For Managers / For the Platform" card block)

Used to present parallel concepts or pillars. Cells are separated by 1px gaps using a background trick on the container.

```html
<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1px; background: var(--rule); border: 1px solid var(--rule); margin-top: 32px;">

  <div style="background: var(--off-white); padding: 32px 28px;">
    <p style="font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); margin-bottom: 14px;">Category Label</p>
    <p style="font-weight: 500; color: var(--black); margin-bottom: 10px; font-size: 0.95rem;">Card Title</p>
    <p style="font-size: 0.88rem; color: var(--muted); line-height: 1.6;">Card body copy goes here.</p>
  </div>

  <div style="background: var(--off-white); padding: 32px 28px;">
    <!-- repeat for each column -->
  </div>

  <div style="background: var(--off-white); padding: 32px 28px;">
    <!-- repeat for each column -->
  </div>

</div>
```

> Also available as a named class `.insights-grid` / `.insight-card` in ai-agent-builder-debase.html when the number of cards is variable:
> ```css
> .insights-grid {
>   display: grid;
>   grid-template-columns: 1fr 1fr 1fr;
>   gap: 1px;
>   background: var(--rule);
>   border: 1px solid var(--rule);
>   margin-top: 32px;
> }
> .insight-card {
>   background: var(--off-white);
>   padding: 32px 28px;
> }
> .insight-card h4 {
>   font-size: 0.75rem;
>   letter-spacing: 0.12em;
>   text-transform: uppercase;
>   color: var(--accent);
>   margin-bottom: 12px;
> }
> .insight-card p {
>   font-size: 0.9rem;
>   color: var(--text);
>   margin: 0;
> }
> ```

---

## 5. Takeaway Box

A lightly tinted call-out box used to summarize a key insight at the end of a section. Always placed inside `.section-content`.

```css
.tradeoff-box {
  background: #f5f3ef;
  border: 1px solid var(--rule);
  padding: 36px;
}
.tradeoff-box h4 {
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 14px;
}
.tradeoff-box p {
  font-size: 0.92rem;
  color: var(--text);
  margin: 0;
}
```

```html
<div class="tradeoff-box">
  <h4>Takeaway</h4>
  <p>Summary of the key insight or design decision from this section.</p>
</div>
```

---

## 6. Quote Box (Inline)

Used inside a section's content column for a user research quote or testimonial. Left orange border, white background, italic serif text.

```html
<blockquote style="margin-top: 32px; padding: 28px 32px; background: white; border-left: 3px solid var(--orange); border-radius: 0;">
  <p style="font-family: 'Instrument Serif', serif; font-size: 1.15rem; color: var(--black); line-height: 1.5; margin-bottom: 12px;">"Quote text goes here."</p>
  <cite style="font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); font-style: normal;">Attribution, Context</cite>
</blockquote>
```

---

## 7. Pull Quote (Full-Width Orange Block)

A full-bleed orange section used for a prominent quote or statement — breaks the cream page rhythm. Used in ai-agent-builder-debase.html.

```css
.pull-quote {
  background: var(--orange);
  color: white;
  padding: 56px 60px;
  margin: 0;
}
.pull-quote blockquote {
  max-width: 820px;
  margin: 0 auto;
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  line-height: 1.45;
  color: white;
}
.pull-quote cite {
  display: block;
  margin-top: 20px;
  font-family: 'DM Sans', sans-serif;
  font-style: normal;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.7);
}
```

```html
<div class="pull-quote">
  <blockquote>
    "Quote text here."
    <cite>Attribution, Context</cite>
  </blockquote>
</div>
```

---

## 8. Scrollytelling Section

Sticky image on the right, scrolling text steps on the left. On mobile, collapses to a flat list of text + image pairs stacked vertically.

**Desktop structure:**
- Left column: scroll steps, each `min-height: 100vh`, text centered vertically
- Right column: `position: sticky; top: 80px`, images absolutely stacked, opacity toggled by JS

**CSS:**
```css
/* Step label (e.g. "01 — Facelift") */
/* font-size: 0.72rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); */

/* Step heading */
/* font-family: 'Instrument Serif', serif; font-size: 1.6rem; font-weight: 400; */
```

**HTML — Desktop:**
```html
<div id="SECTION-scrolly" style="display: grid; grid-template-columns: 420px 1fr; gap: 60px; padding: 60px 60px 0; position: relative;">

  <!-- LEFT: scroll steps -->
  <div id="SECTION-scrolly-text" style="position: relative;">

    <div class="SECTION-step" data-index="0" style="min-height: 100vh; display: flex; align-items: center; padding: 24px 0 80px;">
      <div>
        <p style="font-size: 0.72rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); margin-bottom: 16px;">01 — Step Label</p>
        <h3 style="font-family: 'Instrument Serif', serif; font-size: 1.6rem; font-weight: 400; color: var(--black); margin-bottom: 16px; line-height: 1.3;">Step Heading</h3>
        <p style="color: var(--muted); font-size: 0.95rem; line-height: 1.7;">Step body copy.</p>
      </div>
    </div>

    <!-- Repeat .SECTION-step for each step, incrementing data-index -->

  </div>

  <!-- RIGHT: sticky image stack -->
  <div id="SECTION-scrolly-sticky" style="position: sticky; top: 80px; height: calc(100vh - 160px); display: flex; align-items: center; align-self: start;">
    <div style="position: relative; width: 100%;">
      <img id="SECTION-img-0" src="images/step-1.png" alt="" style="width: 100%; border-radius: 8px; display: block; position: absolute; top: 0; left: 0; opacity: 1; transition: opacity 0.4s ease;" />
      <img id="SECTION-img-1" src="images/step-2.png" alt="" style="width: 100%; border-radius: 8px; display: block; position: absolute; top: 0; left: 0; opacity: 0; transition: opacity 0.4s ease;" />
      <!-- Repeat for each image; last one sets layout height -->
      <img src="images/step-1.png" style="width: 100%; border-radius: 8px; display: block; visibility: hidden;" />
    </div>
  </div>

</div>
```

**HTML — Mobile fallback** (shown only on mobile, hidden on desktop via JS/CSS):
```html
<div id="SECTION-scrolly-mobile" style="display: none; flex-direction: column; gap: 60px; padding: 60px 24px;">
  <div>
    <p style="font-size: 0.72rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); margin-bottom: 16px;">01 — Step Label</p>
    <h3 style="font-family: 'Instrument Serif', serif; font-size: 1.6rem; font-weight: 400; color: var(--black); margin-bottom: 16px; line-height: 1.3;">Step Heading</h3>
    <p style="color: var(--muted); font-size: 0.95rem; line-height: 1.7; margin-bottom: 24px;">Step body copy.</p>
    <img src="images/step-1.png" alt="" style="width: 100%; border-radius: 8px;" />
  </div>
  <!-- Repeat for each step -->
</div>
```

**JavaScript:**
```js
const SECTION_steps = document.querySelectorAll('.SECTION-step');
const SECTION_imgs = [
  document.getElementById('SECTION-img-0'),
  document.getElementById('SECTION-img-1'),
  // ... etc
];

function updateSECTIONScrolly() {
  let active = 0;
  SECTION_steps.forEach((step) => {
    const rect = step.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.55) {
      active = parseInt(step.dataset.index);
    }
  });
  SECTION_imgs.forEach((img, i) => {
    if (img) img.style.opacity = i === active ? '1' : '0';
  });
}

window.addEventListener('scroll', updateSECTIONScrolly, { passive: true });
updateSECTIONScrolly();
```

**Mobile toggle** (inside the existing resize listener or on load):
```js
function handleScrollyMobile() {
  const isMobile = window.innerWidth <= 860;
  const desktop = document.getElementById('SECTION-scrolly');
  const mobile = document.getElementById('SECTION-scrolly-mobile');
  if (desktop) desktop.style.display = isMobile ? 'none' : 'grid';
  if (mobile) mobile.style.display = isMobile ? 'flex' : 'none';
}
window.addEventListener('resize', handleScrollyMobile);
handleScrollyMobile();
```

---

## 9. Divider

A hairline rule between sections, inset to match the horizontal padding.

```css
.divider {
  height: 1px;
  background: var(--rule);
  margin: 0 60px;
}
```

```html
<div class="divider"></div>
```

---

## 10. Image Break

Full-width image with consistent horizontal padding and rounded corners. Used between sections.

```css
.img-break {
  padding: 0 60px;
}
.img-break img {
  width: 100%;
  display: block;
  border-radius: 8px;
}
```

```html
<div class="img-break">
  <img src="images/your-image.png" alt="Description" />
</div>
```

---

## 11. Hero Meta Block (Case Study Pages)

Right column of the hero — structured metadata: Overview, Role, Scope (tags), Timeline, Outcome.

```css
.hero-meta {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.meta-item label {
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  display: block;
  margin-bottom: 6px;
}
.meta-item p {
  font-size: 0.95rem;
  color: var(--text);
}
.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}
.tag {
  background: var(--orange);
  color: white;
  padding: 5px 14px;
  border-radius: 99px;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  font-weight: 500;
}
```

```html
<div class="hero-meta">
  <div class="meta-item">
    <label>Overview</label>
    <p style="font-size: 0.88rem; color: var(--muted); line-height: 1.6;">Short project overview.</p>
  </div>
  <div class="meta-item">
    <label>Role</label>
    <p>Role Title</p>
  </div>
  <div class="meta-item">
    <label>Scope</label>
    <div class="tag-row">
      <span class="tag">Tag 1</span>
      <span class="tag">Tag 2</span>
    </div>
  </div>
  <div class="meta-item">
    <label>Timeline</label>
    <p>2023–2024</p>
  </div>
  <div class="meta-item">
    <label>Outcome</label>
    <p>Key result here</p>
  </div>
</div>
```

---

## 12. Metrics Bar

Dark (near-black) full-bleed section with large serif numbers. Used at the end of case studies.

```css
.metrics-bar {
  background: #1c1a17;
  padding: 64px 0;
}
.metrics-inner {
  padding: 0 60px;
}
.metrics-label {
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 40px;
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}
.metric h3 {
  font-family: 'Instrument Serif', serif;
  font-size: 3rem;
  font-weight: 400;
  color: #fdf9f5;
  line-height: 1;
  margin-bottom: 8px;
}
.metric p {
  font-size: 0.88rem;
  color: #7a7670;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

```html
<div class="metrics-bar">
  <div class="metrics-inner">
    <div class="metrics-label">Outcomes</div>
    <div class="metrics-grid">
      <div class="metric">
        <h3>547%</h3>
        <p>ROI</p>
      </div>
      <div class="metric">
        <h3>10M+</h3>
        <p>Conversations / mo</p>
      </div>
      <div class="metric">
        <h3>2×</h3>
        <p>Agent efficiency</p>
      </div>
    </div>
  </div>
</div>
```

---

## 13. Responsive Behavior

All case study pages use these two breakpoints. Never add a third.

```css
/* ── MEDIUM — collapse label column ── */
@media (max-width: 1200px) and (min-width: 861px) {
  .section { grid-template-columns: 200px 1fr; }
  .hero    { grid-template-columns: 200px 1fr; }
  .section-label { font-size: 0.65rem; }
}

/* ── MOBILE — full stack ── */
@media (max-width: 860px) {
  nav { padding: 20px 24px; }
  .hero, .section { padding: 60px 24px; grid-template-columns: 1fr; gap: 32px; }
  .divider { margin: 0 24px; }
  .img-break { padding: 0 24px; }
  .metrics-inner { padding: 0 24px; }
  .metrics-grid { grid-template-columns: 1fr; gap: 32px; }
  /* three-col grid: */
  .solution-grid, .insights-grid { grid-template-columns: 1fr !important; }
  footer { padding: 32px 24px; flex-direction: column; gap: 20px; text-align: center; }
  .pull-quote { padding: 40px 24px; }
}
```

**Key rules:**
- At medium widths (861–1200px): the left label column shrinks from `420px` → `200px`, label font-size drops from `0.72rem` → `0.65rem`. Everything else stays two-column.
- On mobile (≤860px): ALL two-column grids collapse to `1fr`. Horizontal padding drops from `60px` → `24px` everywhere. Footer stacks vertically and centers. Three-col grids also collapse to `1fr`.
- The scrollytelling section hides the sticky desktop version and shows the flat mobile version at the same 860px breakpoint.

---

## 14. Section Step Label Pattern

Used consistently inside scrollytelling steps AND standalone sections to introduce a numbered or named sub-point.

```html
<p style="font-size: 0.72rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); margin-bottom: 16px;">01 — Label</p>
```

Also appears as a subtitle below `h1` in hero sections:
```html
<p style="font-size: 0.82rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-top: 16px;">Subtitle here</p>
```

---

## File Structure Reference

```
portfolio/
├── index.html              ← homepage (draggable desktop, no nav)
├── contact.html
├── regal-platform.html
├── ai-agent-builder-debase.html
├── visual-design.html
├── vibecoding-intro.html   (not yet built)
├── vibecoding4dummies.html (not yet built)
├── images/
│   ├── homepage-logo.png
│   ├── rp-intro.gif
│   ├── ai-agents-hero.png
│   └── (all other case study images)
└── files/
    ├── resume_gracelee.pdf
    └── Handy-Service-Discovery.pdf
```

**Image paths** are always relative: `src="images/filename.ext"` — never absolute.
**File paths** are always: `href="files/filename.pdf"`.

---

## 15. Homepage (index.html) — Responsive Architecture

> ⚠️ The homepage uses a completely different responsive system from all other pages. It was hard to get right — do not modify it without reading this section fully.

### The two-world model

The homepage has **two entirely separate UIs** — one for desktop, one for mobile — that are toggled via CSS at `768px`:

```css
/* Desktop: show canvas, hide mobile view */
.canvas      { display: block; }  /* default */
.mobile-view { display: none; }   /* default */

/* Mobile: hide canvas, show mobile view */
@media (max-width: 768px) {
  .canvas      { display: none !important; }
  .mobile-view { display: flex !important; position: relative !important; z-index: 10 !important; }
  .pixel-object   { display: none !important; }
  #reset-btn      { display: none !important; }
  .cherry-stamp   { display: none !important; }
  #blimp-rig      { display: none !important; }
}
```

These two worlds do NOT share layout. The desktop canvas uses `position: absolute` for everything. The mobile view uses normal document flow. They are completely independent — changing one does not affect the other.

---

### Desktop world — how cards are positioned

Every card on the desktop canvas is a `.retro-window.card-window` with `position: absolute` and an inline `style="top: Xpx; left: Ypx;"`. The position system converts these to viewport fractions on load so they scale proportionally on resize. **See the golden rules in the position system notes at the top of this file — they must not be broken.**

Current desktop cards and their IDs:
- `#win-ai` — AI Agent Builder
- `#win-regal` — Regal Platform
- `#win-handy` — Handy
- `#win-vibe` — Vibecoding

Each card is `width: 300px` with a `card-image-area` (200px tall) and a hover reveal overlay (`.card-hover-reveal`). The hover state rotates the card `-2deg` and scales it `1.03`. Clicking the card navigates; dragging does not navigate (handled by the `moved` flag in the drag logic).

---

### Mobile world — the carousel

The mobile view is a vertical flex column with these elements in order:
1. `.mobile-hero-window` — the greeting window with ticker
2. `.carousel-label` — "Selected Work" label
3. `.carousel-track-wrap#carousel` — the horizontal scrollable card row
4. A row of icon shortcuts (Resume, Contact, Visual Design)

The carousel is a **horizontally scrollable flex row**, not a paginated slider. Cards have `flex-shrink: 0` and `width: 260px`. It supports both touch swipe and mouse drag (handled by the carousel JS at the bottom of the script block).

```css
.carousel-track-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  cursor: grab;
}
.carousel-track-wrap::-webkit-scrollbar { display: none; }
.carousel-track {
  display: flex;
  gap: 16px;
  padding-bottom: 8px;
  width: max-content;
}
.mobile-card {
  width: 260px;
  border: 2px solid var(--orange);
  background: var(--white);
  flex-shrink: 0;
  text-decoration: none;
  color: inherit;
  display: block;
}
```

---

### How to add a new card

You must add the card in **both worlds** independently.

#### 1. Desktop canvas — add a `.retro-window.card-window`

Copy an existing card block and give it a new `id`. Set a position via inline style that doesn't overlap existing cards. The position system picks it up automatically.

```html
<a href="your-page.html" class="retro-window card-window" id="win-NEW" style="top:400px;left:500px;z-index:8;transform:rotate(1deg);text-decoration:none;color:inherit;">
  <div class="window-titlebar">
    <span class="window-title">case-study &nbsp;·&nbsp; 2025</span>
    <span class="window-close">×</span>
  </div>
  <div class="card-image-area">
    <img src="images/your-image.png" alt="Project Name" style="width:100%;height:100%;object-fit:cover;display:block;">
    <div class="card-hover-reveal">
      <div>
        <div class="card-hover-label">Tag 1 · Tag 2 · Tag 3</div>
        <div class="card-hover-name">Company Name</div>
        <div class="card-hover-type">Year</div>
        <div class="card-hover-title">Project Title</div>
      </div>
      <div class="card-hover-footer">
        <span></span>
        <span class="card-hover-arrow">→</span>
      </div>
    </div>
    <span class="card-pill">Read Case Study</span>
  </div>
</a>
```

No other JS changes needed — `document.querySelectorAll('.retro-window').forEach(makeDraggable)` picks it up automatically.

#### 2. Mobile carousel — add a `.mobile-card`

Add a new `<a class="mobile-card">` inside `.carousel-track`. Order matters — cards appear left to right in the order they appear in the HTML. Mirror the same project as the desktop card you just added.

```html
<a href="your-page.html" class="mobile-card">
  <div class="window-titlebar">
    <span class="window-title">case-study</span>
    <span class="window-close">×</span>
  </div>
  <div class="mobile-card-image">
    <img src="images/your-image.png" alt="Project Name" style="width:100%;height:100%;object-fit:cover;display:block;">
  </div>
  <div class="mobile-card-body">
    <div class="mobile-card-name">Project Title</div>
    <div class="mobile-card-type">Type · Company</div>
    <span class="mobile-card-arrow">→</span>
  </div>
</a>
```

No JS changes needed — the carousel drag listener targets `#carousel` which already wraps all `.mobile-card` elements.

---

### What NOT to do on the homepage

- **Never add a second `window.addEventListener('resize', ...)`** — there is already one. Use the existing one.
- **Never move `initPositions`, `applyPositions`, or `updateFractions` inside the `if (window.innerWidth > 768)` block** — they must stay globally accessible.
- **Never try to make desktop cards stack vertically on mobile** — the correct pattern is a separate `.mobile-card` in the carousel. The two worlds are intentionally separate.
- **Never give a new card a `position: fixed`** — desktop cards must be `position: absolute` children of `.canvas`.
- **Never add CSS that targets `.card-window` without checking it won't affect `.mobile-card`** — they are different classes but both represent the same projects.
- **Never remove the `display: none !important` / `display: flex !important` on the media query** — the `!important` is intentional and load-order dependent.
