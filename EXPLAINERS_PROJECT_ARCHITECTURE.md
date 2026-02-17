# How to Build an "Interactive Explainers" Project Like paraschopra/explainers

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & File Structure](#2-architecture--file-structure)
3. [The Core Design Philosophy](#3-the-core-design-philosophy)
4. [Technology Stack (Surprisingly Simple)](#4-technology-stack-surprisingly-simple)
5. [Anatomy of a Single Explainer Page](#5-anatomy-of-a-single-explainer-page)
6. [Step-by-Step: How to Build Your Own](#6-step-by-step-how-to-build-your-own)
7. [The AI-Assisted Workflow](#7-the-ai-assisted-workflow)
8. [Deployment with GitHub Pages](#8-deployment-with-github-pages)
9. [Design Patterns & Techniques Used](#9-design-patterns--techniques-used)
10. [Building Your First Explainer (Tutorial)](#10-building-your-first-explainer-tutorial)

---

## 1. Project Overview

Paras Chopra's [explainers](https://paraschopra.github.io/explainers/) project is a collection of **beautiful, interactive, long-form articles** that teach complex topics (Fourier Transforms, LLMs, Cellular Automata, Scaling Laws) through hands-on interactive widgets embedded directly in the page.

From his LinkedIn post, the key insight is:

> "Generating interactive explainers on interesting topics **using AI**, inspired by the beautiful [explainers.blog](https://explainers.blog/posts/why-is-the-sky-blue/). Because you don't really understand something until you can play with it."

This means the explainers are **AI-generated** (likely using Claude or GPT-4) and then refined/published. The approach is to use AI to produce complete, self-contained HTML files with embedded CSS and JavaScript.

---

## 2. Architecture & File Structure

The project is strikingly simple. Here is the **entire** file tree:

```
explainers/
├── .github/
│   └── workflows/
│       └── static.yml          # GitHub Actions: auto-deploy to GitHub Pages
├── README.md                   # One line: link to the live site
├── src/
│   ├── index.html              # Landing page with card links to each explainer
│   ├── fourier-transform/
│   │   └── index.html          # ~2,080 lines - single self-contained HTML file
│   ├── biology-scaling/
│   │   └── index.html          # ~98K - single self-contained HTML file
│   ├── cellular-automata/
│   │   └── index.html          # ~97K - single self-contained HTML file
│   └── llm/
│       └── index.html          # ~2,489 lines - single self-contained HTML file
```

**Key architectural insight**: Each explainer is a **single, self-contained HTML file**. No build step. No bundler. No React. No npm packages. Just plain HTML + CSS + JavaScript in one file.

This is not a coincidence -- it's a deliberate design choice that makes AI generation much easier and deployment trivially simple.

---

## 3. The Core Design Philosophy

### 3.1 Single-File Architecture

Each explainer is one `.html` file containing:
- All CSS in a `<style>` tag in the `<head>`
- All HTML content in the `<body>`
- All JavaScript in a `<script>` tag at the bottom

This means:
- **No dependencies to manage** (except CDN-loaded fonts and KaTeX for math)
- **No build process** -- just save the file and push
- **Perfect for AI generation** -- you can give an AI a single prompt and get a complete page
- **Easy to version control** -- one file = one commit

### 3.2 Interactive First

Every explainer follows the same pattern:
1. **Hook** the reader with a relatable question ("How does Shazam work?")
2. **Explain** a concept in plain, witty prose
3. **Demonstrate** with an interactive widget where you can play with the concept
4. **Build** on that understanding to introduce the next concept
5. **Repeat** until the full topic is covered

### 3.3 Editorial Quality

The writing style is conversational, witty, and opinionated -- not dry textbook prose. For example:

> "Phase is the awkward third wheel of wave parameters. Nobody talks about phase at parties. Nobody puts 'phase enthusiast' in their dating bio."

---

## 4. Technology Stack (Surprisingly Simple)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Structure** | Plain HTML5 | Page structure and content |
| **Styling** | Vanilla CSS (CSS Variables) | Consistent design system |
| **Interactivity** | Vanilla JavaScript (ES6+) | Interactive widgets, demos, animations |
| **Math rendering** | KaTeX (CDN) | LaTeX-style math equations |
| **Typography** | Google Fonts (Newsreader + Figtree) | Serif body + sans-serif headings |
| **Charts/Visuals** | Inline SVG + Canvas API | Waveforms, bar charts, visualizations |
| **Audio** | Web Audio API | Sound playback for audio demos |
| **Deployment** | GitHub Pages + GitHub Actions | Free static hosting, auto-deploy on push |

### What's NOT used (and why that matters):
- No React/Vue/Svelte -- no framework overhead
- No npm/yarn -- no `node_modules`
- No Webpack/Vite/Rollup -- no build step
- No Tailwind -- CSS variables provide the design system
- No D3.js -- SVG is manipulated directly with vanilla JS
- No external charting libraries -- everything is hand-rolled

This simplicity is **the entire point**. It makes each page:
- Instantly loadable (no JS bundle to download/parse)
- Completely self-contained (works offline if you save the HTML)
- Trivially deployable (just serve static files)
- Easy for AI to generate in a single pass

---

## 5. Anatomy of a Single Explainer Page

Let's break down the Fourier Transform explainer (~2,080 lines) to understand the pattern:

### 5.1 Head Section (~16 lines)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>How Does Shazam Know What Song is Playing?</title>

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Newsreader...&family=Figtree...&display=swap" rel="stylesheet">

  <!-- KaTeX for math (only if the explainer uses equations) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
    onload="renderMathInElement(document.body, {delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}]});">
  </script>
```

### 5.2 CSS Design System (~590 lines)

A CSS variables-based design system that provides:

```css
:root {
  --bg:           #FAF9F7;    /* Warm off-white background */
  --demo-bg:      #F3F2EE;    /* Slightly darker for demo containers */
  --text:         #2D2D2D;    /* Near-black for body text */
  --text-secondary:#666;      /* Gray for secondary text */
  --accent:       #2563EB;    /* Blue accent color */
  --border:       #E5E5E0;    /* Subtle borders */
  --radius:       12px;       /* Consistent corner rounding */
  --max-w:        680px;      /* Content width (optimal reading) */
  --font-serif:   'Newsreader', Georgia, serif;      /* Body text */
  --font-sans:    'Figtree', system-ui, sans-serif;  /* Headings, UI */
  --font-mono:    'Source Code Pro', monospace;       /* Code, values */
}
```

The CSS includes styles for:
- **Layout**: article container, max-width, padding
- **Hero header**: gradient background, large title, subtitle
- **Section headings**: Roman numeral style (I. II. III.)
- **Callout boxes**: blue info boxes, yellow fun-fact boxes, math boxes
- **Demo containers**: gray background containers for interactive widgets
- **Controls**: styled range sliders, buttons, button groups
- **Responsive**: mobile breakpoints at 768px and 480px
- **Scroll animations**: fade-in reveals as sections enter viewport

### 5.3 HTML Content (~600 lines)

The content follows a clear structure:

```html
<!-- Hero Header -->
<div class="hero reveal">
  <div class="hero-inner">
    <h1>How Does Shazam Know What Song is Playing?</h1>
    <p class="subtitle">And how do JPEGs shrink photos?...</p>
  </div>
</div>

<!-- Table of Contents -->
<nav class="toc reveal">
  <h3>Contents</h3>
  <ol>
    <li><a href="#sec-sound">What even IS a sound?</a></li>
    <!-- ... -->
  </ol>
</nav>

<article>
  <!-- Each section follows this pattern: -->
  <section id="sec-sound" class="reveal">
    <div class="section-heading">
      <span class="section-number">I.</span>
      <h2>What Even IS a Sound?</h2>
    </div>

    <p>Prose explaining the concept...</p>

    <!-- Interactive Demo embedded inline -->
    <div class="demo" id="demo-waveform">
      <div class="demo-title">Demo 1 · Waveform Viewer</div>
      <!-- SVG for visualization -->
      <svg id="waveform-svg" viewBox="0 0 632 160">
        <path id="waveform-path" d="" fill="none" stroke="var(--blue)" stroke-width="2" />
      </svg>
      <!-- Controls -->
      <div class="controls">
        <button class="btn btn-primary" id="waveform-play">▶ Play</button>
      </div>
    </div>

    <p>More prose building on what the demo showed...</p>

    <!-- Callout boxes for key insights -->
    <div class="callout">
      <strong>Key insight:</strong> Important takeaway here.
    </div>
  </section>

  <!-- Next section... -->
</article>
```

### 5.4 JavaScript (~880 lines)

The JavaScript section at the bottom contains:

#### A. Utility Functions (~80 lines)

```javascript
// Build an SVG path from sample data
function buildWavePath(samples, svgWidth, svgHeight, yPad = 10) { ... }

// Generate sine wave samples
function generateSine(freq, amp, phase, n, periods) { ... }

// Add multiple arrays element-wise
function addArrays(...arrs) { ... }

// Normalize array to fit within bounds
function clampArray(arr, maxAmp) { ... }

// Discrete Fourier Transform
function dft(samples) { ... }

// Inverse DFT
function idft(spectrum) { ... }
```

#### B. Audio Engine (~80 lines)

A reusable `AudioEngine` class wrapping the Web Audio API:

```javascript
class AudioEngine {
  init() { /* lazy-init AudioContext */ }
  stopAll() { /* stop all playing sounds */ }
  playSine(freq, duration, amp) { /* play a single sine tone */ }
  playFreqs(freqAmps, duration) { /* play multiple frequencies */ }
  playSamples(samples, sampleRate, duration) { /* play arbitrary waveform */ }
}
```

#### C. Scroll Reveal Animation (~10 lines)

```javascript
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
```

#### D. Interactive Demos (~700 lines)

Each demo is wrapped in an **IIFE** (Immediately Invoked Function Expression) to avoid variable name collisions:

```javascript
// DEMO 1: WAVEFORM VIEWER
(function() {
  const path = document.getElementById('waveform-path');
  const btns = document.querySelectorAll('#waveform-selector .btn-secondary');

  // Generate signal data
  function getSignal(type) { ... }

  // Render to SVG
  function update() {
    path.setAttribute('d', buildWavePath(getSignal(currentType), 632, 160));
  }

  // Wire up event listeners
  btns.forEach(btn => {
    btn.addEventListener('click', () => { ... update(); });
  });

  // Wire up audio playback
  setupPlayButton(document.getElementById('waveform-play'), () => {
    audio.playFreqs(freqMap[currentType]);
  });

  update(); // Initial render
})();
```

Each demo follows the same pattern:
1. **Select DOM elements** by ID
2. **Define data/state** (arrays of samples, frequencies, amplitudes)
3. **Define render function** that updates SVG paths or Canvas
4. **Wire up event listeners** for sliders, buttons, etc.
5. **Initial render** call

---

## 6. Step-by-Step: How to Build Your Own

### Step 1: Set Up the Repository

```bash
mkdir my-explainers
cd my-explainers
git init
mkdir -p src
```

### Step 2: Create the Landing Page

Create `src/index.html` -- a simple page with cards linking to each explainer. Use the same design system (Newsreader + Figtree fonts, warm off-white background, card layout).

Key elements:
- Title and intro paragraph
- Card grid where each card links to an explainer
- Each card has a gradient hero, title, description, and date
- Footer with your social links

### Step 3: Create Your First Explainer

Create `src/my-topic/index.html` with this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Explainer Title</title>

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- KaTeX (if you need math) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
    onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}]});">
  </script>

  <style>
    /* Paste the full CSS design system here */
    /* (~300-600 lines depending on complexity) */
  </style>
</head>
<body>

  <!-- Hero header with gradient -->
  <div class="hero reveal">
    <div class="hero-inner">
      <h1>Your Catchy Title Here</h1>
      <p class="subtitle">A compelling one-line subtitle</p>
    </div>
  </div>

  <!-- Table of contents -->
  <nav class="toc reveal">...</nav>

  <article>
    <!-- Section 1 -->
    <section id="sec-1" class="reveal">
      <div class="section-heading">
        <span class="section-number">I.</span>
        <h2>Section Title</h2>
      </div>
      <p>Engaging prose...</p>

      <!-- Interactive Demo -->
      <div class="demo" id="demo-1">
        <div class="demo-title">Demo 1 · Widget Name</div>
        <svg id="viz-1" viewBox="0 0 632 200">
          <!-- SVG elements that JS will manipulate -->
        </svg>
        <div class="controls">
          <!-- Sliders, buttons -->
        </div>
      </div>

      <p>Explanation of what the demo shows...</p>
      <div class="callout"><strong>Key insight:</strong> ...</div>
    </section>

    <!-- More sections... -->
  </article>

  <script>
    // Utility functions
    // Audio engine (if needed)
    // Scroll reveal
    // Demo 1 logic (IIFE)
    // Demo 2 logic (IIFE)
    // ...
  </script>
</body>
</html>
```

### Step 4: Set Up GitHub Pages Deployment

Create `.github/workflows/static.yml`:

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
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'src'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Step 5: Enable GitHub Pages

1. Go to your repo Settings > Pages
2. Set Source to "GitHub Actions"
3. Push to `main` -- the workflow will deploy automatically

---

## 7. The AI-Assisted Workflow

This is the most important section. Based on analyzing the project, here is the likely workflow Paras Chopra uses:

### 7.1 The Prompt Strategy

You give an AI (Claude, GPT-4, etc.) a detailed prompt like:

> "Create a complete, self-contained HTML page that is an interactive explainer about [TOPIC]. The page should:
>
> 1. Use a warm off-white background (#FAF9F7) with Newsreader serif font for body text and Figtree sans-serif for headings
> 2. Have a hero header with a gradient background
> 3. Include a table of contents with Roman numeral sections
> 4. Write in an engaging, witty, conversational tone -- not dry textbook style
> 5. Include 5-8 interactive demos using inline SVG and vanilla JavaScript
> 6. Each demo should have sliders, buttons, or other controls that update visualizations in real-time
> 7. Use CSS variables for the design system
> 8. Make it responsive for mobile
> 9. Include scroll-reveal animations
> 10. Use KaTeX for any math equations
> 11. Wrap each demo's JavaScript in an IIFE to avoid variable collisions
> 12. Everything must be in a single HTML file -- no external dependencies except Google Fonts and KaTeX CDN
>
> Here's an example of the CSS design system to follow: [paste the CSS]
>
> The topic is: [YOUR TOPIC]"

### 7.2 Iterative Refinement

After the AI generates the initial page:
1. **Review the prose** -- edit for accuracy, tone, and flow
2. **Test each demo** -- make sure sliders work, SVGs render correctly, etc.
3. **Fix bugs** -- AI-generated JS sometimes has issues with SVG coordinate math
4. **Polish the design** -- adjust spacing, colors, responsive breakpoints
5. **Add/remove sections** -- the AI might include too much or too little

### 7.3 Key Tips for AI Generation

- **Give examples**: Paste an existing explainer's code as reference
- **Be specific about demos**: Describe what each interactive widget should do
- **Use one-shot generation**: Ask for the complete file in one go, not incremental pieces
- **Test in browser immediately**: Copy the HTML output, save to a file, open in browser
- **Iterate on individual sections**: If a demo is buggy, ask the AI to fix just that section

---

## 8. Deployment with GitHub Pages

The deployment is about as simple as it gets:

1. **Push to `main`** branch
2. GitHub Actions workflow triggers automatically
3. It uploads the `src/` directory as a static site artifact
4. GitHub Pages serves it at `https://yourusername.github.io/repo-name/`

There is **no build step**. The HTML files are served exactly as-is. This means:
- Zero build time
- No dependency management
- No version conflicts
- No "it works on my machine" issues

---

## 9. Design Patterns & Techniques Used

### 9.1 Visualization: SVG vs Canvas

The project uses two approaches for visuals:

**Inline SVG** (most demos):
- Waveforms are `<path>` elements with dynamically generated `d` attributes
- Bar charts are `<rect>` elements created via `document.createElementNS`
- Great for clean, scalable graphics
- Easy to style with CSS variables

**Canvas API** (drawing demos):
- Used for the "Draw Your Own" waveform feature
- Better for freeform drawing with mouse/touch input
- Handles `mousedown`, `mousemove`, `touchstart`, `touchmove` events

### 9.2 The buildWavePath Pattern

This utility function is the backbone of all waveform visualizations:

```javascript
function buildWavePath(samples, svgWidth, svgHeight, yPad = 10) {
  const n = samples.length;
  const yMid = svgHeight / 2;
  const yScale = (svgHeight / 2) - yPad;
  let d = '';
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * svgWidth;
    const y = yMid - samples[i] * yScale;
    d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
  }
  return d;
}
```

It takes an array of sample values (-1 to 1) and converts them to an SVG path string. This pattern is reused for every waveform in every demo.

### 9.3 IIFE Pattern for Demo Isolation

Each demo's code is wrapped in an Immediately Invoked Function Expression:

```javascript
(function() {
  // All variables are scoped to this function
  const slider = document.getElementById('demo-1-slider');
  // ...
})();
```

This prevents variable name collisions between demos -- critical when you have 8+ demos on one page, all with variables like `N`, `samples`, `path`, etc.

### 9.4 IntersectionObserver for Scroll Reveal

Sections fade in as they enter the viewport:

```javascript
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
```

Combined with CSS transitions:

```css
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### 9.5 Web Audio API for Sound

The `AudioEngine` class provides three ways to produce sound:
1. **`playSine(freq, duration, amp)`** -- single oscillator tone
2. **`playFreqs(freqAmps)`** -- multiple oscillators combined (for chords)
3. **`playSamples(samples, sampleRate)`** -- arbitrary waveform from sample data

It lazy-initializes the `AudioContext` on first interaction (required by browsers) and manages cleanup of audio nodes.

### 9.6 DFT/IDFT Implementation

The Fourier Transform explainer includes a from-scratch implementation of the Discrete Fourier Transform:

```javascript
function dft(samples) {
  const N = samples.length;
  const result = [];
  for (let k = 0; k < N; k++) {
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) {
      const angle = (2 * Math.PI * k * n) / N;
      re += samples[n] * Math.cos(angle);
      im -= samples[n] * Math.sin(angle);
    }
    re /= N; im /= N;
    result.push({ freq: k, re, im, amp: Math.sqrt(re*re + im*im), phase: Math.atan2(im, re) });
  }
  return result;
}
```

This is O(N^2) -- not efficient, but perfectly fine for the small sample sizes (256-512) used in the demos.

---

## 10. Building Your First Explainer (Tutorial)

Here is a concrete plan to build your own version:

### Phase 1: Scaffold (30 minutes)

1. Create a GitHub repo
2. Set up the `src/` directory structure
3. Copy the landing page template (or create your own)
4. Set up the GitHub Actions workflow for auto-deployment
5. Push and verify the landing page loads

### Phase 2: Pick a Topic (1 hour)

Choose a topic you want to explain. Good candidates:
- Have visual/mathematical components that benefit from interactivity
- Can be broken into 5-8 progressive sections
- Have a relatable "hook" question

Examples:
- "How does GPS know where you are?" (trilateration, satellite signals)
- "Why do neural networks dream?" (gradient descent, activation functions)
- "How does a QR code actually work?" (error correction, encoding)
- "Why is the sky blue?" (Rayleigh scattering -- this is what explainers.blog did)

### Phase 3: Generate with AI (2-3 hours)

1. Write a detailed prompt describing your topic, the sections, and what each demo should do
2. Include the CSS design system as reference
3. Generate the complete HTML file
4. Save it and open in browser
5. Iterate: fix bugs, improve prose, adjust demos
6. Each iteration, ask the AI to fix specific issues

### Phase 4: Polish & Publish (1-2 hours)

1. Test on mobile (responsive)
2. Test all interactive elements
3. Proofread the text
4. Add the card to your landing page
5. Push to main -- it auto-deploys

### Phase 5: Repeat

Each new explainer gets easier as you:
- Reuse the CSS design system
- Reuse utility functions (buildWavePath, AudioEngine, etc.)
- Develop a better sense of what prompts work well
- Build a library of demo patterns

---

## Summary

The genius of this project is in its **simplicity**:

| Aspect | Approach |
|--------|----------|
| Architecture | Single self-contained HTML files |
| Styling | CSS variables, no framework |
| Interactivity | Vanilla JS, SVG, Canvas, Web Audio |
| Math | KaTeX CDN |
| Content generation | AI-assisted (Claude/GPT-4) |
| Deployment | GitHub Pages (free, zero-config) |
| Build process | None |

The formula is: **Great writing + Interactive demos + Simple tech + AI generation = Beautiful explainers**

You don't need React. You don't need a build system. You don't need a CMS. You need:
1. A topic you want to explain
2. An AI to help you generate the initial HTML
3. The taste to iterate until it's polished
4. A GitHub repo with Pages enabled

That's it. Start building.
