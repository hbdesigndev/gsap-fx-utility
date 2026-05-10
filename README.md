# HB GSAP FX

A lightweight, class-driven GSAP animation utility for scroll-triggered effects. Add a class and a data attribute — no JS required per element.

**Requires:** [GSAP](https://gsap.com) with ScrollTrigger and SplitText plugins.

---

## Setup

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/SplitText.min.js"></script>
<script src="hb-gsap-fx-1.js"></script>
```

> SplitText is a GSAP Club plugin — requires a GSAP Club or Business license.

Auto-initializes on `DOMContentLoaded`. No manual setup needed.

---

## Basic Usage

Add `.hb-gsap-trigger` to any element, then set the effect via `data-style` or a preset class:

```html
<!-- via data attribute -->
<div class="hb-gsap-trigger" data-style="fade-in">Hello</div>

<!-- via class -->
<div class="hb-gsap-trigger hb-fade-in">Hello</div>

<!-- combine effects -->
<div class="hb-gsap-trigger" data-style="fade-in slide-in-up">Hello</div>
```

---

## Animation Presets

| Class / data-style value | Effect |
|---|---|
| `fade-in` | Fade from 0 to full opacity |
| `scale-up` | Scale from 0.6 to 1 |
| `scale-down` | Scale from 1.4 to 1 |
| `slide-in-left` | Slide in from the left |
| `slide-in-right` | Slide in from the right |
| `slide-in-up` | Slide in from below |
| `slide-in-down` | Slide in from above |
| `rotate` | Rotate from -90° with fade |
| `blur-in` | Blur fade from 8px to sharp |

---

## Data Attribute Options

| Attribute | Default | Description |
|---|---|---|
| `data-style` | — | Space-separated list of effects |
| `data-duration` | `0.6` | Animation duration in seconds |
| `data-delay` | `0` | Delay before animation starts |
| `data-stagger` | `0.05` | Stagger between split targets |
| `data-ease` | `power2.out` | GSAP easing string |
| `data-start` | `top 90%` | ScrollTrigger start position |
| `data-toggle` | `play none none reverse` | ScrollTrigger toggleActions |
| `data-distance` | preset default | Slide distance in px (both axes) |
| `data-distance-x` | — | Slide distance override for X axis |
| `data-distance-y` | — | Slide distance override for Y axis |
| `data-scale` | preset default | Custom scale value for scale presets |
| `data-blur` | `8` | Blur amount in px for `blur-in` |
| `data-split` | — | Split type: `chars`, `words`, or `lines` |

### Easing via class

```html
<div class="hb-gsap-trigger hb-fade-in hb-ease-elastic-out">...</div>
```

Dots in GSAP ease names become hyphens: `elastic.out` → `hb-ease-elastic-out`.

### Slide distance via class

```html
<div class="hb-gsap-trigger hb-slide-in-up hb-slide-distance-40">...</div>
<div class="hb-gsap-trigger hb-slide-in-left hb-slide-distance-x-60">...</div>
```

---

## SplitText

Animate text character by character, word by word, or line by line.

```html
<!-- via data attribute -->
<h1 class="hb-gsap-trigger" data-style="fade-in slide-in-up" data-split="words">
  Animate each word
</h1>

<!-- via class -->
<h1 class="hb-gsap-trigger hb-fade-in hb-split-chars">
  Animate each character
</h1>
```

Split types: `chars`, `words`, `lines`.

To exclude a nested element from splitting:

```html
<h1 class="hb-gsap-trigger hb-split-words" data-style="fade-in">
  Hello <span class="hb-no-split">World</span>
</h1>
```

---

## Pinning

```html
<section class="hb-pin" data-pin-start="top top" data-pin-end="+=200%">
  Pinned content
</section>
```

| Attribute | Default | Description |
|---|---|---|
| `data-pin-start` | `top top` | ScrollTrigger start |
| `data-pin-end` | `+=100%` | ScrollTrigger end |
| `data-pin-scrub` | `false` | Set `true` to enable scrub |

---

## Mobile

Add `mobile:off` to `data-style` to skip the animation on screens ≤ 768px:

```html
<div class="hb-gsap-trigger" data-style="fade-in slide-in-up mobile:off">...</div>
```

---

## JavaScript API

```js
HBGSAPFX.init()           // init on a root element (default: document)
HBGSAPFX.init(myContainer) // scope to a container (useful for dynamic content)
HBGSAPFX.animate(el)      // animate a single element
HBGSAPFX.initPin(root)    // initialize pins only
HBGSAPFX.reset()          // kill all triggers and re-init (use on resize/route change)
```

---

## License

MIT
