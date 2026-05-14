# Paper Cutout UI Redesign — IELTS Master

Redesign the entire visible UI of the IELTS Master website to a **Paper Cutout / Collage** aesthetic — warm, handmade, playful, with layered paper effects, soft shadows, torn edges, and slight rotations.

## Scope

The redesign covers **presentational / chrome pages only** — the pages users land on and browse. It does **not** touch the actual test-taking components (`ReadingTest.tsx`, `IetlsTest.tsx`, `ListeningTest.tsx`) since those are functional exam interfaces that need clean, undistorted readability.

### Files to modify

| File | Change |
|------|--------|
| `app/globals.css` | New Paper Cutout design system (colors, shadows, textures, animations, torn-edge clip-paths, font imports) |
| `app/layout.tsx` | Import handwriting Google Font (Patrick Hand / Caveat), update metadata |
| `app/components/Navbar.tsx` | Paper-strip navbar with tape/pin decorations, slight rotation, craft feel |
| `app/page.tsx` | Full Paper Cutout hero, collage skill cards, feature cutout strips, CTA paper layer |
| `app/reading/page.tsx` | Paper-layered test list, kraft-paper stats cards, torn-edge info section |
| `app/listening/page.tsx` | Same paper treatment as reading, purple-tinted paper accents |

### Files NOT modified
- `app/reading/[id]/ReadingTest.tsx` — exam interface, keep clean
- `app/reading/[id]/IetlsTest.tsx` — exam interface, keep clean
- `app/listening/ListeningTest.tsx` — exam interface, keep clean
- `app/speaking/page.tsx` — placeholder, skip
- `app/writing/page.tsx` — placeholder, skip
- `app/profile/page.tsx` — dev test page, skip
- `app/components/figma/ImageWithFallback.tsx` — utility, no visual change
- `app/components/ui/*` — shadcn primitives, untouched

---

## Proposed Changes

### Design System — `globals.css`

#### [MODIFY] [globals.css](file:///g:/road_to_web/NextJS/ai_eo/app/globals.css)

Complete overhaul of the design tokens:

- **Color palette**: Replace current blue corporate scheme with warm paper palette
  - `--paper-cream: #fffbeb` (bg-amber-50)
  - `--paper-pink: #fce7f3` (bg-pink-100)
  - `--paper-sky: #eff6ff` (bg-blue-50)
  - `--paper-green: #f0fdf4` (bg-green-50)
  - `--paper-kraft: #fef3c7` (bg-amber-100)
  - `--paper-white: #ffffff`
  - Background becomes cream/kraft textured

- **Shadows**: Paper-specific offset shadows
  - `--shadow-paper-sm: 2px 2px 6px rgba(0,0,0,0.1)`
  - `--shadow-paper-md: 4px 4px 12px rgba(0,0,0,0.15)`
  - `--shadow-paper-lg: 6px 6px 16px rgba(0,0,0,0.12)`
  - `--shadow-paper-xl: 8px 8px 20px rgba(0,0,0,0.12)`

- **Paper texture**: Subtle noise background via CSS (repeating tiny dot pattern or SVG data-uri)

- **Torn edge clip-paths**: CSS classes for jagged/torn top and bottom edges using `clip-path: polygon()`

- **Animations**:
  - `paper-lift`: hover lifts card slightly + deeper shadow (150-220ms)
  - `paper-settle`: initial entrance animation
  - `tape-wiggle`: subtle tape decoration wiggle

- **Utility classes**: `.paper-card`, `.paper-strip`, `.paper-tag`, `.torn-top`, `.torn-bottom`, `.tape-decoration`

---

### Layout & Fonts — `layout.tsx`

#### [MODIFY] [layout.tsx](file:///g:/road_to_web/NextJS/ai_eo/app/layout.tsx)

- Import **Patrick Hand** (handwriting) + **Nunito** (body) from Google Fonts
- Update metadata: `title: "IELTS Master"`, proper description
- Apply font variables to body
- Set overall background to cream paper

---

### Navbar — `Navbar.tsx`

#### [MODIFY] [Navbar.tsx](file:///g:/road_to_web/NextJS/ai_eo/app/components/Navbar.tsx)

Complete redesign as a **paper strip** pinned to top:

- Kraft paper background with subtle paper texture
- Slight rotation (-0.5deg) on the strip
- "Tape" decorations (colored rectangles with transparency) at corners
- Navigation links styled as handwritten labels
- Active link highlighted with colored paper tag behind it
- Paper shadow underneath
- Mobile responsive hamburger menu

---

### Home Page — `page.tsx`

#### [MODIFY] [page.tsx](file:///g:/road_to_web/NextJS/ai_eo/app/page.tsx)

Full Paper Cutout collage redesign:

**Hero Section**:
- Large cream paper layer as background with torn bottom edge
- Heading in handwriting font with slight rotation (-1deg)
- Decorative colored paper circles/shapes behind text (absolute positioned)
- CTA buttons styled as paper cutout buttons with `shadow-[4px_4px_0px]` + hover press effect
- Hero image in white-bordered frame (like a photo glued to paper) with rotation

**Features Section**:
- Kraft paper background
- Feature items as small paper strips/notes with different pastel backgrounds
- Slight random rotations on each card (-2deg to 2deg)
- Pin/tape decoration on each
- CheckCircle replaced with hand-drawn style checkmark

**Skill Cards Section**:
- Collage layout — cards with intentional overlap and rotation
- Each card is a paper cutout with thick white border on images
- Different pastel paper backgrounds per skill
- Shadow layering to show depth
- Hover lifts the card with deeper shadow

**CTA Section**:
- Large colored paper layer (pink or green) with torn top edge
- Text centered, handwriting font
- Button as paper cutout style

---

### Reading Tests Page — `reading/page.tsx`

#### [MODIFY] [page.tsx](file:///g:/road_to_web/NextJS/ai_eo/app/reading/page.tsx)

- Overall cream paper background
- Page header on a paper strip with slight rotation
- Stats cards as colored paper cutouts (blue-50, pink-100, green-50) with different shadows
- Test list items as stacked paper sheets with paper-lift hover animation
- Icon containers as colored paper circles
- Pagination buttons as paper cutout buttons
- Info section as a torn-edge note on kraft paper
- Decorative elements: paper clips, tape strips at edges

---

### Listening Tests Page — `listening/page.tsx`

#### [MODIFY] [page.tsx](file:///g:/road_to_web/NextJS/ai_eo/app/listening/page.tsx)

Same paper treatment as reading but with purple-tinted accents:
- Stats cards in purple pastel paper tones
- Test items with purple-tinted icon backgrounds
- Difficulty tags as colored paper labels
- Info section on purple-tinted paper note

---

## Design Decisions

1. **Handwriting font**: Using **Patrick Hand** for headings and decorative text, **Nunito** for body text — both from Google Fonts, ensuring readability while maintaining the handmade feel.

2. **Torn edges via CSS clip-path**: Using polygon clip-paths rather than SVG masks to keep the implementation simple and performant. The jagged patterns are subtle enough to suggest torn paper without being distracting.

3. **Rotation strategy**: Cards use small rotations (-2° to 2°) deterministically based on index (not random) to ensure consistent SSR output and avoid layout shift.

4. **Shadow layering**: Three depth levels of paper shadow to create visual hierarchy — close (sm), medium (md), and lifted (lg/xl).

5. **Framer Motion**: Already installed in the project. Will use it for entrance animations (`paper-settle`) and hover interactions (`paper-lift`) with 150–220ms duration to match the paper metaphor.

6. **Scope boundary**: Test-taking interfaces remain untouched because distorted alignment or decorative elements would hurt exam usability.

## Verification Plan

### Automated Tests
```bash
npm run build
```
Ensure no TypeScript or build errors.

### Visual Verification
- Launch `npm run dev` and open in browser
- Verify all 4 target pages render correctly with Paper Cutout aesthetic
- Check hover interactions (paper-lift on cards, button press effects)
- Verify responsive behavior at mobile/tablet/desktop breakpoints
- Confirm test-taking pages are unaffected

### Browser Recording
- Record browser walkthrough of all redesigned pages
