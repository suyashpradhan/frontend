# How to Build an "Interactive Explainers" Site Like paraschopra/explainers

## A Complete Breakdown for Learning

---

## Table of Contents

1. [What the Project Is](#1-what-the-project-is)
2. [Project Architecture (Surprisingly Simple)](#2-project-architecture)
3. [Tech Stack Deep Dive](#3-tech-stack-deep-dive)
4. [File Structure Explained](#4-file-structure-explained)
5. [The Design System](#5-the-design-system)
6. [Anatomy of a Single Explainer Page](#6-anatomy-of-a-single-explainer-page)
7. [How the Interactive Widgets Work](#7-how-the-interactive-widgets-work)
8. [Deployment: GitHub Pages](#8-deployment)
9. [Step-by-Step: Build Your Own](#9-step-by-step-build-your-own)
10. [The AI-Assisted Workflow](#10-the-ai-assisted-workflow)
11. [Key Takeaways](#11-key-takeaways)

---

## 1. What the Project Is

Paras Chopra's "Interactive Explainers" is a collection of **self-contained, single-page interactive articles** that explain complex topics (Fourier Transform, Scaling Laws, Cellular Automata, LLMs) through:

- Beautiful, magazine-quality typography
- Interactive visualizations (sliders, animated canvases, SVG charts)
- A narrative structure that progressively builds understanding

Think of it as "a textbook chapter meets an interactive web app" -- each page is a standalone learning experience.

**Live site:** https://paraschopra.github.io/explainers/
**Source repo:** https://github.com/paraschopra/explainers

---

## 2. Project Architecture (Surprisingly Simple)

This is the key insight: **the project uses NO build tools, NO frameworks, NO bundlers**. It's pure static HTML.

```
paraschopra/explainers/
├── .github/
│   └── workflows/
│       └── static.yml          # GitHub Actions to deploy to Pages
├── README.md
└── src/
    ├── index.html              # Homepage (landing page with card links)
    ├── fourier-transform/
    │   └── index.html          # ~82 KB single-file explainer
    ├── biology-scaling/
    │   └── index.html          # ~98 KB single-file explainer
    ├── cellular-automata/
    │   └── index.html          # ~98 KB single-file explainer
    └── llm/
        └── index.html          # ~122 KB single-file explainer
```

**That's it.** 6 HTML files. No `package.json`, no `node_modules`, no React, no build step.

Each explainer is a **single self-contained HTML file** (~80-120 KB) that includes:
- All CSS in a `<style>` tag
- All JavaScript in a `<script>` tag
- All HTML content inline
- External dependencies loaded from CDNs (Google Fonts, KaTeX for math)

### Why This Architecture Works

| Benefit | Explanation |
|---------|-------------|
| **Zero dependencies** | No npm install, no breaking changes, no security patches |
| **Instant loading** | No JavaScript framework overhead -- just HTML |
| **Easy to deploy** | Just push HTML files to GitHub Pages |
| **AI-friendly** | Each file is self-contained, making it easy for AI to generate/edit |
| **No build step** | Edit HTML, push, done. No compilation needed |
| **Permanent** | These files will work in 10 years without maintenance |

---

## 3. Tech Stack Deep Dive

### What's Used

| Technology | Purpose | How It's Included |
|-----------|---------|-------------------|
| **HTML5** | Page structure and content | The core of everything |
| **CSS3** (inline) | Styling, layout, animations | `<style>` tag in each file |
| **Vanilla JavaScript** (inline) | Interactive widgets, visualizations | `<script>` tag at the bottom |
| **SVG** (inline) | Charts, waveforms, diagrams | Generated in JS, rendered in HTML |
| **Canvas API** | Complex visualizations (cellular automata grid) | `<canvas>` elements controlled by JS |
| **Google Fonts** | Typography (Newsreader serif + Figtree sans) | CDN link in `<head>` |
| **KaTeX** | Math equation rendering | CDN link in `<head>` (used in Fourier page) |
| **Web Audio API** | Playing generated sounds | Native browser API (Fourier page) |
| **GitHub Pages** | Hosting | GitHub Actions workflow |

### What's NOT Used

- No React, Vue, Svelte, or any framework
- No Tailwind CSS or CSS frameworks
- No Webpack, Vite, or bundlers
- No npm packages or node_modules
- No database or backend
- No build process at all

---

## 4. File Structure Explained

### The Landing Page (`src/index.html`)

This is a simple page with:
- A title "Interactive Explainers"
- An intro paragraph
- A card for each explainer (with gradient hero backgrounds)
- A footer

Each card links to its respective explainer:

```html
<a class="card card--fourier" href="fourier-transform/index.html">
  <div class="card-hero">
    <h2>How Does Shazam Know What Song is Playing?</h2>
  </div>
  <div class="card-body">
    <p>Explore the Fourier Transform...</p>
    <div class="card-date">Feb 17, 2026</div>
  </div>
</a>
```

Each card gets a unique gradient:

```css
.card--fourier .card-hero {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 40%, #60a5fa 70%, #93c5fd 100%);
}
.card--scaling .card-hero {
  background: linear-gradient(135deg, #7f1d1d 0%, #b91c1c 30%, #ef4444 60%, #fca5a5 100%);
}
```

### Each Explainer (`src/<topic>/index.html`)

Every explainer page follows the same structural pattern:

```
┌─────────────────────────────────────┐
│           HERO SECTION              │  ← Gradient background, title, subtitle
├─────────────────────────────────────┤
│      TABLE OF CONTENTS              │  ← Roman numeral numbered list
├─────────────────────────────────────┤
│  I. Section Heading                 │  ← Roman numeral + title
│     Prose paragraphs...             │  ← Serif body text
│     ┌─────────────────────┐         │
│     │  INTERACTIVE WIDGET │         │  ← Gray box with visualization
│     │  [slider] [buttons] │         │  ← Controls for interactivity
│     └─────────────────────┘         │
│     More prose...                   │
│     ┌─────────────────────┐         │
│     │  CALLOUT BOX        │         │  ← Highlighted info box
│     └─────────────────────┘         │
│                                     │
│  II. Next Section...                │
│     ...                             │
├─────────────────────────────────────┤
│           FOOTER                    │
└─────────────────────────────────────┘
```

### The Deployment Workflow (`.github/workflows/static.yml`)

```yaml
name: Deploy static content to Pages
on:
  push:
    branches: ["main"]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: 'src'              # Just upload the src/ folder as-is
      - uses: actions/deploy-pages@v4
```

No build step -- it just uploads the raw `src/` directory to GitHub Pages.

---

## 5. The Design System

Every explainer follows a consistent, elegant design language. Here are the key principles:

### Typography

```css
:root {
  --font-serif: 'Newsreader', Georgia, serif;    /* Body text, headings */
  --font-sans:  'Figtree', system-ui, sans-serif; /* UI labels, section headings */
  --font-mono:  'Source Code Pro', monospace;      /* Code snippets, data labels */
}

body {
  font-family: var(--font-serif);
  font-size: 21px;        /* Generous body text size */
  line-height: 1.4;       /* Tight but readable */
}
```

**Why these fonts matter:**
- **Newsreader** (serif): A beautiful, readable serif font for long-form text -- gives it a "published article" feel
- **Figtree** (sans-serif): Clean, modern sans for UI elements, labels, and section headings
- The combination creates a "magazine meets dashboard" aesthetic

### Color Palette

```css
:root {
  --bg:             #FAF9F7;   /* Warm off-white (NOT pure white) */
  --text:           #2D2D2D;   /* Soft black (NOT pure black) */
  --text-secondary: #666;      /* Gray for supporting text */
  --border:         #E5E5E0;   /* Subtle warm gray borders */
  --demo-bg:        #F3F2EE;   /* Slightly darker bg for widgets */
  --accent:         #2563EB;   /* Blue accent (varies per explainer) */
}
```

**Key design choice:** The warm off-white background (#FAF9F7) instead of pure white (#FFFFFF) makes the page easier on the eyes and more "premium" feeling.

### Section Headings with Roman Numerals

```html
<div class="section-heading">
  <span class="section-number">I.</span>
  <h2>Sound Is Just Vibrations</h2>
</div>
```

This gives each section a scholarly, textbook-like feel while remaining modern.

### Interactive Widget Containers

```css
.demo {
  background: var(--demo-bg);    /* Slightly darker than page bg */
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 28px;
  margin: 32px 0;
}
```

Every interactive element is contained in a clearly-defined gray box, visually separating "reading content" from "interactive content."

### Slider Styling

```css
input[type="range"]::-webkit-slider-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent);    /* Accent color thumb */
  border: 2px solid white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}
```

Custom-styled sliders replace the default browser appearance for a polished look.

---

## 6. Anatomy of a Single Explainer Page

Let's break down the Fourier Transform page as an example (~82 KB, ~2000+ lines):

### Structure Overview

```
<html>
  <head>
    ├── Google Fonts (CDN links)
    ├── KaTeX for math (CDN links)
    └── <style> ... 400+ lines of CSS ... </style>
  </head>
  <body>
    ├── Hero section (gradient + title)
    ├── <article>
    │   ├── Intro paragraph
    │   ├── Table of Contents
    │   ├── Section I: narrative + widgets
    │   ├── Section II: narrative + widgets
    │   ├── ... more sections ...
    │   └── Final section
    ├── Footer
    └── <script> ... 800+ lines of JavaScript ... </script>
  </body>
</html>
```

### The Three Layers

**Layer 1: HTML (~800 lines)** -- The content and structure

```html
<section id="sec-sound">
  <div class="section-heading">
    <span class="section-number">I.</span>
    <h2>Sound Is Just Vibrations</h2>
  </div>
  <p>Every sound you hear...</p>

  <div class="demo">
    <div class="demo-title">Interactive: Build a sound wave</div>
    <svg id="wave-svg" viewBox="0 0 680 200">
      <path id="wave-path" fill="none" stroke="var(--blue)" stroke-width="2"/>
    </svg>
    <div class="controls">
      <div class="control-group">
        <div class="label-row">
          <label>Frequency</label>
          <span class="value-display" id="freq-val">2.0 Hz</span>
        </div>
        <input type="range" id="freq-slider" min="0.5" max="10" step="0.1" value="2">
      </div>
    </div>
  </div>
</section>
```

**Layer 2: CSS (~400 lines)** -- The visual design (see Section 5 above)

**Layer 3: JavaScript (~800 lines)** -- The interactivity

```javascript
// Each demo is wrapped in an IIFE to avoid variable conflicts
(function() {
  const slider = document.getElementById('freq-slider');
  const pathEl = document.getElementById('wave-path');

  function draw() {
    const freq = parseFloat(slider.value);
    // Generate SVG path data for a sine wave
    let d = '';
    for (let x = 0; x < 680; x++) {
      const t = x / 680;
      const y = 100 - 80 * Math.sin(2 * Math.PI * freq * t * 4);
      d += (x === 0 ? 'M' : 'L') + x + ',' + y;
    }
    pathEl.setAttribute('d', d);
  }

  slider.addEventListener('input', draw);
  draw(); // initial render
})();
```

---

## 7. How the Interactive Widgets Work

### Pattern: SVG Waveform Visualization

Most charts are **inline SVG** with paths generated by JavaScript:

```javascript
function buildWavePath(samples, width, height) {
  const N = samples.length;
  let d = '';
  for (let i = 0; i < N; i++) {
    const x = (i / (N - 1)) * width;
    const y = height / 2 - samples[i] * (height / 2);
    d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
  }
  return d;
}
```

This creates smooth waveforms by:
1. Computing sample values (e.g., `Math.sin(...)`)
2. Mapping them to SVG coordinates
3. Building an SVG path string (`M0,100 L1,98 L2,95...`)
4. Setting it on a `<path>` element

### Pattern: Canvas Grid (Cellular Automata)

For complex visualizations (like the cellular automata grid), `<canvas>` is used:

```javascript
const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');

function drawGrid(grid, cellSize) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      ctx.fillStyle = grid[y][x] ? '#2D6A4F' : '#FFFFFF';
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}
```

### Pattern: Slider + Reactive Update

Every slider follows this pattern:

```javascript
const slider = document.getElementById('my-slider');
const display = document.getElementById('my-value');

function update() {
  const value = parseFloat(slider.value);
  display.textContent = value.toFixed(1);
  // Re-render the visualization with the new value
  redrawVisualization(value);
}

slider.addEventListener('input', update);
update(); // Draw initial state
```

### Pattern: DFT (Discrete Fourier Transform)

The Fourier page implements its own DFT in pure JavaScript:

```javascript
function dft(signal) {
  const N = signal.length;
  const result = [];
  for (let k = 0; k < N; k++) {
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) {
      const angle = (2 * Math.PI * k * n) / N;
      re += signal[n] * Math.cos(angle);
      im -= signal[n] * Math.sin(angle);
    }
    result.push({
      re: re / N,
      im: im / N,
      amp: Math.sqrt(re*re + im*im) / N
    });
  }
  return result;
}
```

### Pattern: Web Audio API (Playing Sounds)

```javascript
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSamples(samples, sampleRate, duration) {
  const buffer = audioCtx.createBuffer(1, samples.length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < samples.length; i++) data[i] = samples[i];

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start();
}
```

### Pattern: IIFE Encapsulation

Each demo is wrapped in an **Immediately Invoked Function Expression** to prevent variable name collisions:

```javascript
// Demo 1
(function() {
  const slider = document.getElementById('demo1-slider');
  // ... all demo 1 code ...
})();

// Demo 2
(function() {
  const slider = document.getElementById('demo2-slider');
  // ... all demo 2 code (can reuse variable names safely) ...
})();
```

---

## 8. Deployment: GitHub Pages

### How It Works

1. Code lives in `src/` directory
2. On push to `main`, GitHub Actions triggers
3. The workflow uploads the `src/` folder directly to GitHub Pages
4. GitHub serves it at `https://<username>.github.io/<repo>/`

### Setting It Up for Your Own Repo

1. Create a repo on GitHub
2. Go to **Settings > Pages**
3. Set source to "GitHub Actions"
4. Add the workflow file at `.github/workflows/static.yml`:

```yaml
name: Deploy static content to Pages
on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: 'src'
      - uses: actions/deploy-pages@v4
```

5. Push your code. The site deploys automatically.

---

## 9. Step-by-Step: Build Your Own

### Phase 1: Set Up the Repository

```bash
mkdir my-explainers
cd my-explainers
git init

# Create the folder structure
mkdir -p src/.github/workflows
mkdir -p src/my-first-topic
```

Create `src/index.html` (the landing page) and `.github/workflows/static.yml` (the deployment).

### Phase 2: Create the Landing Page

Start with a minimal version of the landing page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Interactive Explainers</title>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:wght@400;700&family=Figtree:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #FAF9F7;
      --text: #2D2D2D;
      --border: #E5E5E0;
      --font-serif: 'Newsreader', Georgia, serif;
      --font-sans: 'Figtree', system-ui, sans-serif;
    }
    body {
      font-family: var(--font-serif);
      font-size: 21px;
      line-height: 1.4;
      color: var(--text);
      background: var(--bg);
    }
    .page {
      max-width: 680px;
      margin: 0 auto;
      padding: 80px 24px 120px;
    }
    h1 { font-size: 54px; font-weight: 700; line-height: 1; margin-bottom: 24px; }
    .cards { display: flex; flex-direction: column; gap: 20px; }
    .card {
      display: block;
      text-decoration: none;
      color: inherit;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
    .card-hero {
      height: 140px;
      display: flex;
      align-items: flex-end;
      padding: 20px 24px;
      background: linear-gradient(135deg, #1e40af, #60a5fa);
    }
    .card-hero h2 { font-size: 28px; color: #fff; }
    .card-body {
      background: #fff;
      padding: 18px 24px;
      border: 1px solid var(--border);
      border-top: none;
      border-radius: 0 0 12px 12px;
    }
    .card-body p { font-family: var(--font-sans); font-size: 15px; color: #666; }
  </style>
</head>
<body>
  <div class="page">
    <h1>My Interactive Explainers</h1>
    <div class="cards">
      <a class="card" href="my-first-topic/index.html">
        <div class="card-hero"><h2>My First Explainer Topic</h2></div>
        <div class="card-body"><p>A brief description of what this explainer covers.</p></div>
      </a>
    </div>
  </div>
</body>
</html>
```

### Phase 3: Create Your First Explainer

Here's a minimal template for an explainer page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Explainer Topic</title>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,700;1,400&family=Figtree:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #FAF9F7;
      --text: #2D2D2D;
      --text-secondary: #666;
      --accent: #2563EB;
      --border: #E5E5E0;
      --demo-bg: #F3F2EE;
      --font-serif: 'Newsreader', Georgia, serif;
      --font-sans: 'Figtree', system-ui, sans-serif;
    }
    body { font-family: var(--font-serif); font-size: 21px; line-height: 1.4; color: var(--text); background: var(--bg); }
    article { max-width: 680px; margin: 0 auto; padding: 0 24px 120px; }

    /* Hero */
    .hero {
      background: linear-gradient(135deg, #1e40af, #60a5fa);
      padding: 80px 24px 60px;
      margin-bottom: 48px;
      border-radius: 0 0 16px 16px;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
    }
    .hero-inner { max-width: 680px; margin: 0 auto; }
    .hero h1 { font-size: clamp(36px, 6vw, 70px); font-weight: 700; line-height: 0.94; color: white; margin-bottom: 12px; }
    .hero .subtitle { font-family: var(--font-sans); font-size: 22px; color: rgba(255,255,255,0.85); }

    /* Sections */
    .section-heading { display: flex; align-items: baseline; gap: 16px; margin-bottom: 28px; padding-top: 32px; border-top: 1px solid var(--border); }
    .section-number { font-size: 30px; font-weight: 400; white-space: nowrap; }
    .section-heading h2 { font-family: var(--font-sans); font-size: 34px; font-weight: 700; line-height: 1.15; }
    p { margin-bottom: 12px; }

    /* Interactive Demo Container */
    .demo { background: var(--demo-bg); border: 1px solid var(--border); border-radius: 12px; padding: 28px; margin: 32px 0; }
    .demo-title { font-family: var(--font-sans); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); margin-bottom: 18px; }

    /* Controls */
    .controls { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 18px; }
    .control-group { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 140px; }
    .control-group label { font-family: var(--font-sans); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-secondary); }
    input[type="range"] { -webkit-appearance: none; width: 100%; height: 6px; border-radius: 3px; background: #D4D4D0; }
    input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--accent); border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }

    /* Callout */
    .callout { background: #DBEAFE; border-left: 4px solid var(--accent); padding: 18px 22px; margin: 28px 0; border-radius: 0 12px 12px 0; font-size: 19px; }

    /* Caption */
    .caption { text-align: center; font-style: italic; font-size: 17px; color: var(--text-secondary); margin-top: 12px; }
  </style>
</head>
<body>

  <div class="hero">
    <div class="hero-inner">
      <h1>Your Explainer Title</h1>
      <div class="subtitle">A subtitle explaining the hook</div>
    </div>
  </div>

  <article>
    <p><em>An italicized intro paragraph that sets the stage for the reader...</em></p>

    <section>
      <div class="section-heading">
        <span class="section-number">I.</span>
        <h2>Your First Section</h2>
      </div>
      <p>Write your narrative here. Explain the concept in plain language.</p>

      <div class="demo">
        <div class="demo-title">Interactive: Explore the concept</div>
        <svg id="my-chart" viewBox="0 0 632 200">
          <path id="my-path" fill="none" stroke="#2563EB" stroke-width="2"/>
        </svg>
        <div class="controls">
          <div class="control-group">
            <label>Parameter</label>
            <input type="range" id="my-slider" min="1" max="10" step="0.1" value="3">
          </div>
        </div>
      </div>
      <div class="caption">Drag the slider to see how the parameter affects the output.</div>

      <p>Continue your explanation after the interactive element...</p>

      <div class="callout">
        <strong>Key Insight:</strong> Highlight the important takeaway here.
      </div>
    </section>

    <section>
      <div class="section-heading">
        <span class="section-number">II.</span>
        <h2>Your Second Section</h2>
      </div>
      <p>Build on the previous section...</p>
    </section>
  </article>

  <script>
  // === Interactive Demo ===
  (function() {
    const slider = document.getElementById('my-slider');
    const pathEl = document.getElementById('my-path');

    function draw() {
      const param = parseFloat(slider.value);
      const width = 632, height = 200;
      let d = '';
      for (let i = 0; i <= width; i++) {
        const t = (i / width) * 4 * Math.PI;
        const y = height / 2 - (height / 2 - 20) * Math.sin(param * t) * Math.exp(-t * 0.1);
        d += (i === 0 ? 'M' : 'L') + i + ',' + y.toFixed(1);
      }
      pathEl.setAttribute('d', d);
    }

    slider.addEventListener('input', draw);
    draw();
  })();
  </script>

</body>
</html>
```

### Phase 4: Add More Explainers

For each new topic:
1. Create `src/new-topic/index.html`
2. Copy the template, customize content + widgets
3. Add a card to `src/index.html`
4. Push to main -- auto-deploys

### Phase 5: Deploy

```bash
git add .
git commit -m "Add my first explainer"
git push origin main
```

GitHub Actions handles the rest.

---

## 10. The AI-Assisted Workflow

Paras Chopra mentions in his LinkedIn post that these are **generated using AI**. Here's how that likely works:

### The Workflow

1. **Pick a topic** you want to explain (e.g., "How does GPS work?")
2. **Prompt an AI** (like Claude or ChatGPT) with something like:

   > "Create a beautiful, interactive HTML explainer about [topic]. Use the following design system: Newsreader serif font for body text, Figtree sans for headings, warm off-white background (#FAF9F7), inline SVG for charts, vanilla JavaScript for interactivity. Structure it with Roman numeral sections, interactive demos in gray boxes with sliders, and callout boxes for key insights. Make it a single self-contained HTML file with all CSS and JS inline."

3. **Iterate** on the output -- ask for refinements, additional widgets, better explanations
4. **Review and polish** -- check the visualizations work, fix any issues
5. **Add it to your collection** and push

### Why Single-File HTML is Perfect for AI

- AI can generate the entire file in one response
- No need to manage multiple files or imports
- Easy to review the complete output
- No build step means no "it compiles but doesn't work" issues
- CSS + JS + HTML in one place means the AI has full context

### Prompt Tips for Generating Explainers

- Reference the design system explicitly (fonts, colors, spacing)
- Ask for specific interactive elements: "Add a slider that controls X"
- Request progressive disclosure: "Start simple, then build complexity"
- Specify the audience: "Explain this for someone with no math background"
- Ask for multiple demos per section to make it truly interactive

---

## 11. Key Takeaways

### What Makes This Project Brilliant

1. **Simplicity of architecture**: No frameworks, no build tools. Just HTML files. This is the ultimate "it just works" approach.

2. **Design consistency**: A well-defined design system (fonts, colors, spacing) applied across all pages creates a cohesive, professional feel.

3. **Single-file encapsulation**: Each explainer is 100% self-contained. You can literally download one HTML file and it works offline (except for fonts).

4. **Progressive interactivity**: The narrative guides you through concepts, and interactive elements appear at exactly the right moment to reinforce understanding.

5. **AI-leveraged creation**: Using AI to generate the content and code massively accelerates production while maintaining quality.

### For Your Learning

If you want to build something like this:

1. **Start with ONE explainer** on a topic you understand well
2. **Use the template** from Phase 3 above as your starting point
3. **Focus on the narrative first** -- what's the story you're telling?
4. **Add interactivity gradually** -- start with one slider + one SVG chart
5. **Use AI to help** -- paste the template and ask it to fill in your topic
6. **Deploy early** -- get it on GitHub Pages so you can share it
7. **Iterate** -- add more explainers over time

### Skills You'll Practice

| Skill | How |
|-------|-----|
| HTML/CSS fundamentals | Structuring content, custom styling |
| CSS variables & design systems | Consistent theming across pages |
| SVG graphics | Dynamic charts and visualizations |
| Canvas API | Complex real-time rendering |
| Vanilla JavaScript | DOM manipulation without frameworks |
| Math visualization | Translating formulas to visual output |
| Web Audio API | Generating and playing sounds |
| GitHub Pages deployment | CI/CD with GitHub Actions |
| Technical writing | Explaining complex topics clearly |

---

## Quick Reference: File Sizes

| File | Size | What's Inside |
|------|------|---------------|
| `src/index.html` | 6.6 KB | Landing page with cards |
| `src/fourier-transform/index.html` | 82 KB | Fourier Transform + 9 interactive demos |
| `src/biology-scaling/index.html` | 98 KB | Scaling Laws + interactive charts |
| `src/cellular-automata/index.html` | 98 KB | Cellular Automata + canvas simulations |
| `src/llm/index.html` | 122 KB | LLM internals + attention visualizations |

Each explainer is roughly equivalent to a 2000-3000 line single-file web app.
