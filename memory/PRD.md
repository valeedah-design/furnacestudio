# FURNACE — PRD

## Original problem statement
Build a complete, production-quality website for **Furnace**, a design and marketing studio for local businesses (restaurants, cafés, salons, barbers, trades, shops, clinics). The site itself must demonstrate the brand idea: "Take something raw. Apply pressure and heat. Remove what doesn't matter. Shape it into something that performs." Core concept: RAW → HEAT → SORT → SHAPE → TEMPER → RESULT as a scroll-driven transformation from chaos to calm. Exact brand system: #0A0A0A base black, #16161A off-black, #FFFFFF white, #FF4A1C Ember Orange (heat / in-progress), #4A5FE8 Temper Blue-Violet (resolved / finished). Manrope only, oversized typography, editorial + industrial + minimal. Blunt, confident copy. No cards, no blobs, no SaaS look, no literal flames.

## User personas
- Local business owner (restaurant, barbershop, clinic) who needs customers, not compliments
- Visitor evaluating Furnace's craft through the website itself

## Architecture
- Frontend: React 19 + Tailwind + framer-motion 11 + Lenis smooth scroll. Single-page immersive experience, components in /app/frontend/src/components/.
- Backend: FastAPI + MongoDB (motor). Enquiry model with PyObjectId/BaseDocument pattern.
- API: GET /api/ (health), POST /api/enquiries, GET /api/enquiries.

## Implemented (2026-09-06)
- Sticky minimal nav with scroll-spy, FURNACE wordmark, persistent START A PROJECT CTA
- Kinetic hero: masked line-by-line reveal ("RAW BUSINESSES. / SHARP IDENTITIES."), 16 cursor-reactive UI fragments that drift, repel, and organize into a grid on scroll; subtle 3D tilt on the type; parallax exit
- THE PROBLEM section: giant statement + staggered blunt statements
- WHY FURNACE: BRAND→WEBSITE→SEARCH→CONTENT→CUSTOMER→REVENUE chain, nodes slide in and connectors physically draw on scroll (ember lines, temper for REVENUE)
- PROCESS centerpiece: 640vh pinned scroll-driven transformation — 14 blocks morph RAW (chaos) → HEAT (jitter, 1100°C) → SORT (noise burns off) → SHAPE (snap to wireframe + browser frame fades in) → TEMPER (blue-violet stabilizes) → RESULT (solid interface). Live temperature readout (20°C→1100°C→SET), clickable stage rail, per-stage narrative
- FURNACE PRINCIPLE manifesto: 3 numbered chapters + one slow editorial marquee (RAW→…→RESULT)
- SERVICES: interactive expanding list (6 services, hover/click expand, heat services = ember, performance services = temper, others recede)
- CASE STUDIES: 3 fictional local-business projects (Ember & Oak, Coldwell Barbers, Northline Dental) with hover-to-forge BEFORE→AFTER morphing panels, count-up metrics (temper), expandable PROBLEM→INSIGHT→BUILD→RESULT story
- FURNACE VS TYPICAL AGENCY: five people vs one team
- TEAM: minimal typographic roster (3 people)
- FINAL CTA + footer: temper-dominant "GOT A GOOD BUSINESS? LET'S MAKE IT LOOK LIKE ONE.", giant outline FURNACE wordmark
- Contact modal: project enquiry form → POST /api/enquiries → success state + sonner toast
- SEO meta, Manrope via Google Fonts, film grain overlay, ember selection color, custom scrollbar, prefers-reduced-motion handling for hero/forge fields

## Verified
- POST/GET /api/enquiries via curl (2 test enquiries in DB)
- Full-page screenshot walkthrough: hero, problem, why, all process stages, manifesto, marquee, services hover, case morph before/after, final CTA
- Contact form submitted through the UI; success screen + toast; enquiry persisted in MongoDB

## Not yet done / backlog
- P1: Real case-study content + real client metrics (structure is ready, placeholder data drops out)
- P1: Email notification on new enquiry (e.g. Resend)
- P2: Admin view for enquiries (GET endpoint exists, no UI)
- P2: Mobile-specific reinterpretation pass of hero/process (current responsive layout works; desktop is the primary experience)
- P2: OG share image / favicon set

## Next tasks
1. Swap placeholder case studies for real projects
2. Resend email on enquiry
3. Enquiries admin page
