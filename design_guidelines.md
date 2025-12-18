# Design Guidelines: Kroman Jibhar Samuel Portfolio

## Design Approach
**Reference-Based Approach** drawing from modern portfolio and agency websites (Linear's clarity, Stripe's professionalism, Awwwards-featured portfolios). This design balances technical credibility with creative personality, emphasizing data visualization aesthetics and clean tech interfaces.

## Core Design Principles
- **Professional Authority**: Establish immediate trust through polished, sophisticated design
- **Data-Driven Aesthetic**: Incorporate subtle grid patterns, clean lines, and structured layouts reflecting analytical expertise
- **Progressive Disclosure**: Lead with impact, reveal details through interaction
- **Bilingual-Ready**: Design with French primary, English toggle consideration

## Typography

**Font System** (Google Fonts):
- Primary: Inter (headings, UI) - weights 400, 500, 600, 700
- Secondary: Space Grotesk (display, accents) - weights 500, 700
- Body: Inter - weight 400

**Hierarchy**:
- Hero Title: text-5xl lg:text-7xl, font-bold, Space Grotesk
- Section Headers: text-3xl lg:text-5xl, font-semibold, Space Grotesk
- Subsection Titles: text-xl lg:text-2xl, font-semibold, Inter
- Body Text: text-base lg:text-lg, leading-relaxed, Inter
- Labels/Meta: text-sm, font-medium, uppercase tracking-wide

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24
- Section Padding: py-16 lg:py-24
- Component Spacing: gap-8 lg:gap-12
- Card Padding: p-6 lg:p-8
- Button Padding: px-6 py-3

**Container Strategy**:
- Full-width sections with inner max-w-7xl mx-auto px-6
- Content sections: max-w-6xl
- Text content: max-w-4xl for readability

## Hero Section

**Layout**: Full viewport height (min-h-screen) split design
- Left 40%: Professional headshot (from provided image) with subtle gradient overlay
- Right 60%: Content stack with name, title, intro paragraph, dual CTA buttons

**Elements**:
- Professional photo: rounded-2xl border with subtle shadow
- Name: Extra large, bold, Space Grotesk
- Title badge: "Logisticien & Data Analyst" in pill-shaped container with icon
- Introduction: 2-3 lines max, emphasizing "Solutions digitales et applications web"
- CTA Buttons: Primary "📊 Voir mes projets" + Secondary "📩 Me contacter" side-by-side
- CV Download: Outlined button with download icon, positioned top-right of hero or below CTAs
- Background: Subtle animated grid pattern or dot matrix reflecting data/tech focus

## Navigation

**Fixed Header** (backdrop-blur, shadow on scroll):
- Logo/Name (left): "KJS" monogram + full name on desktop
- Menu items (center/right): Accueil, Mes Services, Mes Projets, À propos, Contact
- CV Download button (right, desktop only)
- Mobile: Hamburger menu with full-screen overlay

## Services Section

**Layout**: 2-column grid (lg:grid-cols-2) for main services, then 4-column grid for technical skills

**Service Cards**:
- Large icons (custom or from Heroicons)
- Service title in bold
- 2-3 line description
- Hover effect: subtle lift and glow
- Featured card: "Pack spécial 50 min" with distinctive treatment (border accent, badge)

**Technical Skills Grid**:
- Icon + skill category title + bulleted list
- 4 categories: Web Dev, Data/BI, IA/Automation, Supply Chain
- Each in card format with hover state

## Project Gallery

**Layout**: Masonry-style grid or Pinterest-inspired staggered cards (2-3 columns on desktop)

**Project Cards**:
- Featured image/thumbnail
- Project title overlay on hover
- Tech stack badges visible
- Click opens detailed modal/page

**Project Detail Modal/Page**:
- Hero image/demo
- Problem → Solution → Result structure
- Technologies: badge pills
- Download/Demo buttons
- "Next Project" navigation

## About Section

**Layout**: Side-by-side on desktop (image + content), stacked mobile

**Elements**:
- Secondary professional photo or workspace image
- Education highlight (INPHB badge/logo)
- Story in 3-4 short paragraphs
- "Autodidacte déterminé" as pull-quote with accent styling
- Nexalion Digital Store mention with link
- Team collaboration emphasis

## Contact Section

**Layout**: Centered content with icon grid

**Contact Cards**:
- 4 contact methods in grid: Email, LinkedIn, WhatsApp, GitHub
- Each card: Large icon, label, clickable link
- Email card featured/primary
- Background: Subtle pattern or gradient

## Component Library

**Buttons**:
- Primary: Solid fill, rounded-lg, shadow-lg, px-6 py-3
- Secondary: Border style, same dimensions
- Blurred backgrounds when over images (backdrop-blur-sm bg-white/20)

**Cards**:
- rounded-xl border shadow-md
- Hover: shadow-xl transform scale-[1.02]
- Padding: p-6 lg:p-8

**Badges/Pills**:
- Technology tags: rounded-full px-3 py-1 text-sm
- Service categories: rounded-lg px-4 py-2

**Icons**: Heroicons via CDN

## Images

**Required Images**:
1. **Hero Section**: Professional headshot (provided) - Large, prominent, left side of hero split layout
2. **About Section**: Workspace/secondary professional photo showing work environment
3. **Project Cards**: Each project needs thumbnail/preview image
4. **Service Icons**: Large illustrative icons for each service category

**Image Treatment**:
- Consistent rounded corners (rounded-xl)
- Subtle shadows for depth
- Hover state: slight zoom (scale-105)

## Animations

**Minimal & Purposeful**:
- Scroll-triggered fade-ins for sections
- Hover states on cards (lift + glow)
- Button hover/active states (built-in)
- Page transitions (fade)
- Hero background: Subtle animated grid/particles

**Explicitly Avoid**: Excessive parallax, distracting scroll animations, autoplay carousels