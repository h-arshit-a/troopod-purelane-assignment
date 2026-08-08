# Prototype Technical Analysis Document
## Purelane Static Prototype (`purelane-homepage.html`) Analysis

---

### 1. Executive Summary & Page Architecture

The supplied prototype `purelane-homepage.html` is a high-fidelity single-page static prototype (148 KB, 1,716 lines) designed for **Purelane**, a plant-based homecare DTC brand. The visual style features modern dark glassmorphism, animated multi-layered SVG background water caustics, deterministic scene-crossfading scroll effects, and vibrant gold accent buttons (`#f0a03c`, `#c9761d`).

#### Complete Page Structure (Top-to-Bottom)
1. **Background Scene Stage (`#scenes`)**: Fixed background container with 4 crossfading gradient scene zones (`.scene.s1` to `.scene.s4`), 4 SVG animated water vector layers (`.wl-a`, `.wl-b`, `.wl-c`, `.wl-s`) using custom SVG turbulence/displacement filters (`#wf`, `#wf2`, `#sfw`), and rising ambient bubble particles (`.bub`).
2. **Top Announcement Ticker (`.ticker`)**: Sticky announcement bar with continuous CSS marquee loop (`tick` keyframe animation).
3. **Floating Header (`#hdr`)**: Fixed pill-shaped glass header (`.navpill.glass-2`) featuring brand logo (`.brand`), main navigation links (`.nav`), tool icons (`.navtools` for search, user, cart counter dot `.dot`), and mobile hamburger button (`.burger`). Smoothly transforms (`header.up`) on scroll `y > 90px`.
4. **Vertical Progress Rail (`.rail`)**: Fixed right navigation rail (visible on desktop `>=1180px`) tracking active scroll position across key sections (`#combos`, `#bundles`, `#shop`, `#reviews`).
5. **Section 1: Hero (`section.hero[data-scene="1"]`)**: Large split hero with eyebrow tag, display heading ("Clean That Lasts"), subtitle, CTA buttons ("Shop now", "How it works"), feature divider rule (`.rule`), right-side animated 3D product stage (`#heroProd`, `#hstage`), stage dot indicators (`#hdots`), right vertical badge rail (`.badges`), and mobile horizontal badge strip (`.badgestrip`).
6. **Section 2: Reviews Rail (`section#reviews[data-scene="1"]`)**: Social proof banner showing rating counter ("4.8 from 8,000+ reviews", "Loved by 12 lakh+ homes") and a horizontal marquee/scroll rail of 10 customer review cards (`article.glass-2.rcard`).
7. **Section 3: Ingredients (`section#ingredients[data-scene="2"]`)**: "Sourced from nature" 5-column grid detailing key plant ingredients (Coconut, Orange peel, Soap nut, Neem, Lemongrass) with SVG graphics and glass cards.
8. **Section 4: How It Works (`section#how[data-scene="2"]`)**: "Less scrubbing" 3-column feature grid explaining foaming formulation, clean ingredients, and safety.
9. **Section 5: Proof / Rotator (`section#proof[data-scene="3"]`)**: "Tough on grime. Gentle on everything else." 2-column layout with clinical proof statistics (99.9% Germ kill, 0% Sulphates, 100% Plant based) and an auto-rotating product showcase (`#rot.glass-2.rot`).
10. **Section 6: Best-Selling Combos (`section#combos[data-scene="3"]`)**: "Best selling combos" horizontal rail (`.comborail`) displaying 5 combo product cards (`article.glass.combo`) with savings badges ("You save ₹398", "Biggest saving"), product SVG composite images, item list inclusions, price comparisons, and Add to Cart buttons.
11. **Section 7: Bundles (`section#bundles[data-scene="3"]`)**: "One box. Every room." 3-card pricing tier section (Starter 2 products ₹349, Most popular 3 products ₹499, Family pack 5 products ₹799) with savings tags, bullet inclusions, and direct ATC buttons.
12. **Section 8: Shop / Product Grid (`section#shop[data-scene="3"]`)**: "Loved by 30,000 homes" main product catalog with category filter tabs (All, Kitchen, Bathroom, Laundry, Floor) and a 4-column responsive grid (`.grid-4`) of 8 individual product cards (`article.glass.card`).
13. **Section 9: Range Shelf (`section#range[data-scene="3"]`)**: "Every room, one shelf" 14-product horizontal shelf showcase (`.rangerow`).
14. **Section 10: Why Bundles (`section#whybundles[data-scene="4"]`)**: "Why bundles beat buying single" 4-column comparison feature grid.
15. **Section 11: Bundle Categories (`section#categories[data-scene="4"]`)**: "Find the right bundle for you" 4 category entry cards.
16. **Section 12: Trust & Guarantee Strip (`section[data-scene="4"]`)**: 4 brand reassurance badges (Plant derived formulas, Recyclable packaging, Safe for kids & pets, Made in India).
17. **Section 13: Newsletter CTA (`section[data-scene="4"]`)**: "Get ₹100 off your first bundle" email capture box.
18. **Footer (`footer[data-scene="4"]`)**: Brand logo, 4-column footer links (Shop, About, Support, Legal), social links, copyright notice.
19. **Mobile Bottom Sticky Bar (`.sticky`)**: Mobile-only fixed footer CTA bar.

---

### 2. Design System & Style Specifications

#### Typography Token System
- **Display Headings**: Font `'Outfit', system-ui, sans-serif` (Weights: 500, 600, 700, 800; uppercase; letter-spacing: -0.018em).
  - `.d1`: `clamp(48px, 8.6vw, 112px)`, line-height: 0.87
  - `.d2`: `clamp(30px, 4.6vw, 54px)`, line-height: 0.94
  - `.d3`: `clamp(21px, 2.5vw, 30px)`, line-height: 1.04
  - `.d4`: `clamp(16px, 1.6vw, 19px)`, line-height: 1.14
- **Body & Subtitles**: Font `'Inter', system-ui, -apple-system, sans-serif` (Weights: 400, 500, 600, 700; line-height: 1.62).
  - `.lede`: `clamp(15px, 1.35vw, 17.5px)`
  - `.body-s`: `14.5px`, line-height: 1.66
  - `.kicker`: `11px`, font-weight: 700, letter-spacing: 0.22em, uppercase

#### Color Palette & CSS Variables

| CSS Variable | Value | Usage |
| :--- | :--- | :--- |
| `--ink` | `#17102b` | Deep dark purple page background |
| `--deep` | `#241a3d` | Dark violet card depth fill |
| `--brand` | `#4b3a8f` | Primary brand purple |
| `--brand-lt` | `#6b55b8` | Light brand purple highlight |
| `--paper` | `#ece6f7` | Main text & surface light tint |
| `--paper-2` | `rgba(236,230,247,.74)` | Muted body text |
| `--paper-3` | `rgba(236,230,247,.52)` | Low-contrast text / captions |
| `--accent` | `#f0a03c` | Warm gold / yellow primary accent & stars |
| `--accent-2` | `#c9761d` | Deep gold button target & border stroke |
| `--surface` | `#faf7fd` | Clean crisp heading white-violet |
| `--g-bg` | `linear-gradient(158deg, rgba(236,230,247,.15), rgba(75,58,143,.20) 58%, rgba(23,16,43,.28))` | Standard glass fill |
| `--g-line` | `rgba(236,230,247,.22)` | Glass card border outline |
| `--g-shadow` | `0 26px 74px rgba(18,12,34,.44)` | Main component depth shadow |
| `--g-inset` | `inset 0 1px 0 rgba(255,255,255,.24)` | Glass top reflection highlight |
| `--r` | `26px` | Standard border radius |
| `--r-sm` | `16px` | Small container border radius |
| `--maxw` | `1180px` | Maximum container width |
| `--sec-y` | `34px` | Vertical spacing between sections |

#### Glassmorphism Components
- `.glass`: `background: var(--g-bg); backdrop-filter: blur(24px) saturate(150%); border: 1px solid var(--g-line); border-radius: var(--r); box-shadow: var(--g-shadow), var(--g-inset);`
- `.glass-2`: `background: linear-gradient(158deg, rgba(236,230,247,.10), rgba(0,48,46,.22)); backdrop-filter: blur(18px) saturate(135%); border: 1px solid rgba(236,230,247,.16); box-shadow: 0 18px 48px rgba(18,12,34,.36), inset 0 1px 0 rgba(255,255,255,.16);`

#### Buttons & Micro-Interactions
- `.btn-primary`: Pill button with gradient `linear-gradient(135deg, var(--accent-2), #5d8d1c)`, text `#08211a`, box-shadow `0 12px 30px rgba(201,118,29,.34)`. On hover: `transform: translateY(-2px)`.
- `.btn-ghost`: Translucent glass button with border `rgba(236,230,247,.30)`. On hover: `background: rgba(236,230,247,.18); transform: translateY(-2px)`.

---

### 3. Responsive Breakpoints & Layout Matrix

| Breakpoint | Target Devices | Critical Layout Changes |
| :--- | :--- | :--- |
| `>= 1180px` | Large Desktop | Displays fixed side progress rail (`.rail`). Full `--maxw: 1180px` container. |
| `< 1200px` | Standard Desktop | Scales Hero copy (`max-width: 470px`), hero product width (`min(44vw, 440px)`). |
| `< 1024px` | Laptops / Tablets | Hides main text menu in header (`.nav`), displays mobile burger menu button (`.burger`). Disables mousemove parallax effect. |
| `< 960px` | Tablets | Hides vertical badge rail (`.badges`), reveals horizontal mobile badge strip (`.badgestrip`). |
| `< 900px` | Portrait Tablets | Hero layout transforms from 2-column flex to single column stack. Background gradient overlay transforms to vertical stack. |
| `< 880px / 820px` | Small Tablets | Product grids adjust from 4 columns to 2 columns or horizontal scroll rails. |
| `< 600px / 420px` | Mobile Phones | Compact nav pill (`padding: 8px 10px`), reduced display font sizes via clamp, single column cards, full-width CTA buttons. |

---

### 4. Interactive Elements & JavaScript Architecture

The prototype contains 146 lines of vanilla JavaScript (`<script>` before `</body>`):

1. **Reveal on Scroll (`.rv`)**:
   - Uses `IntersectionObserver` (`threshold: 0.12`, `rootMargin: '0px 0px -12% 0px'`).
   - Adds `.in` class to elements with `.rv`, applying smooth CSS transition (`opacity: 1`, `transform: none`, `filter: none`).
   - Supports staggered delays via `.rv-d1` (+0.09s), `.rv-d2` (+0.18s), `.rv-d3` (+0.27s), `.rv-d4` (+0.36s), `.rv-d5` (+0.45s).
2. **Deterministic Background Scene Crossfade (`pickScene()`)**:
   - Calculates current scroll midpoint (`window.scrollY + window.innerHeight * 0.5`).
   - Evaluates sections with `data-scene="1|2|3|4"` attributes.
   - Sets attribute `data-d` on `#scenes` and toggles `.on` class on active `.scene` element.
3. **Water Parallax & Mouse Tracking (`frame()`)**:
   - Uses `requestAnimationFrame` on scroll/resize.
   - Calculates normalized mouse offset (`mx`, `my`) on desktop (`min-width: 1024px`).
   - Updates `--px` and `--py` properties on water layers (`.wl-a` to `.wl-s`) and translates hero product (`#heroProd`).
4. **Hero Product Stage Carousel (`#hstage`, `#hdots`)**:
   - Cycles through 3 slides (`.hslide`) every 3,800ms.
   - Pauses on `mouseenter` or when out of viewport (`IntersectionObserver`).
5. **Product Rotator (`#rot`)**:
   - In Section `#proof`, rotates product frames (`.pimg`) and updates text captions (`data-name`, `data-note`) every 2,900ms when visible (`IntersectionObserver threshold: 0.25`).
6. **Progress Rail Indicator (`syncRail()`)**:
   - Calculates scroll position relative to `#combos`, `#bundles`, `#shop`, `#reviews`.
   - Sets class `.on` on matching dot anchor in `.rail a`.
7. **Sticky Header Transition (`#hdr`)**:
   - Listens to scroll events; adds class `.up` when `window.scrollY > 90px`.

---

### 5. Data Architecture & Shopify Mapping

To convert this static prototype into a flexible Online Store 2.0 theme, content will be decoupled into native Shopify objects, section settings, blocks, and metafields:

```
+-----------------------------------------------------------------------------------+
|                              SHOPIFY ARCHITECTURE                                  |
+-----------------------------------------------------------------------------------+
|  1. SECTION SETTINGS (Merchant Editable via Theme Editor)                         |
|     - Section Headings, Subtitles, Eyebrows                                       |
|     - Layout padding, colors, section scene background target                     |
|     - CTA Button Labels & Target URLs                                             |
+-----------------------------------------------------------------------------------+
|  2. SECTION BLOCKS (Merchant Reorderable / Configurable Items)                   |
|     - Hero Slides & Badges                                                        |
|     - Bundle Tier Cards (Starter, Most Popular, Family Pack)                      |
|     - Customer Review Cards (Rating, Author, Quote, Product Tag)                  |
|     - Ingredient & Feature Cards                                                  |
+-----------------------------------------------------------------------------------+
|  3. NATIVE SHOPIFY DATA (Products, Collections, Metafields)                       |
|     - Single Products (#shop): Product Title, Price, Compare At Price, Images    |
|     - Combo Products (#combos): Products/Collections with Savings Metafield       |
|     - Product Rating Metafields: `reviews.rating` / `reviews.rating_count`        |
|     - Product Subtitle / Badge Metafields: `custom.subtitle`, `custom.badge_tag`  |
+-----------------------------------------------------------------------------------+
```

#### Detailed Component Mapping Table

| Section Name | Prototype ID/Class | Shopify Architecture Strategy | Merchant Controls / Schema Settings |
| :--- | :--- | :--- | :--- |
| **01 Hero** | `.hero` | Custom Section (`sections/hero-purelane.liquid`) | Heading, Subheading, Primary CTA text/link, Secondary CTA text/link, Slide Blocks, Badge Blocks |
| **02 Reviews Rail** | `#reviews` | Custom Section (`sections/reviews-rail.liquid`) | Heading text, Counter badge text ("4.8 from 8000+ reviews"), Review Blocks (Rating, Title, Quote, Author, Product) |
| **03 Best-Selling Combos** | `#combos` | Custom Section (`sections/combos-purelane.liquid`) | Heading, Subtitle, Featured Collection or Selected Products, Savings Badge Settings, Included Products Metafield/Blocks |
| **04 Bundles** | `#bundles` | Custom Section (`sections/bundles-purelane.liquid`) | Heading, Subtitle, 3 Pricing Card Blocks (Tier Name, Item Count, Price, Price per Unit, Bullet Features, Discount Badge, Product/ATC Link) |
| **05 Shop / Grid** | `#shop` | Custom Section (`sections/shop-grid.liquid`) | Heading, Subtitle, Category Tabs (Collections), Selected Collection, Products Limit, Card Layout Settings |

---

### 6. Technical Flaws & Production Requirements

During inspection of `purelane-homepage.html`, the following technical issues in the prototype were identified and will be resolved in the Shopify theme implementation:

1. **Embedded Base64 Data URIs in CSS**:
   - *Issue*: 14 product images are embedded as massive base64 SVG data URIs inside CSS custom properties (`--p-tap`, `--p-kitchen`, etc.), bloating the file size to 148 KB and preventing image caching, responsive lazy loading, and dynamic merchant edits.
   - *Fix*: Replace CSS data URIs with native Shopify `image_url`Liquid filters, `srcset`, dynamic responsive `<img>` tags with `loading="lazy"`.
2. **Accessibility (a11y) Violations**:
   - *Issue*: Interactive buttons (dots, sliders, tab filters, burger menu) lack `aria-label`, `aria-expanded`, or `aria-selected` attributes; decorative SVGs lack `aria-hidden="true"`; focus outlines are missing contrast in light mode.
   - *Fix*: Implement accessible HTML5 markup with explicit ARIA roles, labels, live regions, keyboard navigation support (`tabindex`), and distinct `:focus-visible` styles.
3. **Hardcoded Currency & Static Content**:
   - *Issue*: INR currency symbol (`₹`) and prices are hardcoded in static HTML strings, preventing Shopify multi-currency conversion, local taxes, or price updates.
   - *Fix*: Use standard Liquid price formatting filters (`product.price | money`) adhering to store currency settings.
4. **Unthrottled Scroll Event Handlers**:
   - *Issue*: `window.addEventListener('scroll', ...)` fires unthrottled calculations on every frame, impacting Core Web Vitals (CLS/INP).
   - *Fix*: Optimize scroll handling using passive listeners, efficient `requestAnimationFrame` batching, and `IntersectionObserver`.
5. **Theme Editor Compatibility**:
   - *Issue*: Static JS relies on fixed DOM IDs (`#hstage`, `#rot`, `#hdots`), which break when Shopify Theme Editor dynamically re-renders or duplicates sections.
   - *Fix*: Scrape elements using section-scoped attributes (`section.id`), and initialize JS using Shopify Theme Editor events (`shopify:section:load`, `shopify:section:select`).

---

### 7. File Structure & Verification Plan

```
c:\Users\harsh\OneDrive\Desktop\Troopod assignment\
├── docs/
│   └── prototype-analysis.md       <-- (This document)
├── purelane-homepage.html          <-- (Original Prototype)
└── [Shopify Theme Files]
    ├── assets/                     <-- Theme CSS, JS, SVGs
    ├── config/                     <-- Theme settings schema
    ├── layout/                     <-- theme.liquid layout
    ├── locallization/              <-- en.default.json
    ├── snippets/                   <-- Product cards, reviews, icons
    └── sections/                   <-- 5 core sections + layout sections
```

#### Verification Protocol
- **Pixel-Match Visual QA**: Side-by-side browser preview comparison between `purelane-homepage.html` and Shopify theme preview at `375px`, `768px`, `1024px`, and `1440px` viewports.
- **Theme Editor Test**: Verify that all section settings (titles, images, products, colors, blocks) can be updated live without JS errors or broken transitions.
- **Performance & Core Web Vitals**: Audit using Lighthouse / DevTools (Target: 90+ performance score, 0 CLS).
