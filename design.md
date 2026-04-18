# Design System — QAV250 Digital Twin Project

## Aesthetic
Dark tech meets minimal engineering. Inspired by HUD interfaces, aerospace dashboards, and editorial design with big numerals as section markers. Think: deep black with surgical neon accents. No noise, no clutter — just intentional data.

## Colors
- Background: `#080808` (near-black)
- Surface: `#0f0f0f`, `#141414`
- Border/divider: `#1f1f1f`, `rgba(255,255,255,0.08)`
- Neon cyan (primary accent): `#00F5FF`
- Electric blue (secondary accent): `#4D9FFF`
- White: `#F0F0F0`
- Muted text: `#6b7280`
- Neon green (data/success): `#39FF14`

## Fonts
- Display / Hero: `Bebas Neue` — all caps, massive, editorial
- Headings: `Space Grotesk` — bold, geometric
- Body / Data: `IBM Plex Mono` — code-like, precise
- Import from Google Fonts

## Layout
- Full-width sections with generous padding
- Asymmetric column layouts (not centered card grids)
- Big section numerals (`01`, `02`...) as HUD markers
- Horizontal rule dividers styled as HUD scan lines
- Overlapping elements, z-index layering
- Sticky top nav with blur backdrop

## Motion
- Intersection Observer for staggered section reveals
- Fade-up on scroll entrance
- Glitch effect on hero title
- Animated grid/dot pattern background on hero

## Typography Scale
- Hero: 10–14vw (Bebas Neue)
- Section title: 4–6rem (Space Grotesk bold)
- Section number: 8rem (Bebas Neue, low opacity)
- Body: 1rem (IBM Plex Mono)
- Label/caption: 0.75rem uppercase tracking-widest
