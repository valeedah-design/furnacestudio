# FURNACE — PRD

## Original problem statement
Build a complete, production-quality website for **Furnace**, a design and marketing studio for local businesses (restaurants, cafés, salons, barbers, trades, shops, clinics, studios). The site is built around the baking metaphor: **RAW INGREDIENTS → RECIPE → HEAT → BAKE → RESULT**. Furnace takes what a business already has (product, reputation, location, story, customers, ambition) and turns it into a brand and digital presence that performs. Baking logic, not literal fire: ingredients, recipe, temperature, timing, refinement. Exact brand system: #0A0A0A black (raw/unheated), #16161A off-black, #FFFFFF white, #FF4A1C Ember Orange (in the oven / in progress), #4A5FE8 Temper Blue-Violet (out of the oven / finished). Manrope only, huge type, negative space, blunt copy. (Note: this baking-metaphor version supersedes the earlier forge-metaphor brief.)

## User personas
- Local business owner who needs customers, not compliments
- Visitor evaluating Furnace's craft through the site itself

## Architecture
- Frontend: React 19 + Tailwind + framer-motion 11 + Lenis. Single-page immersive experience, /app/frontend/src/components/.
- Backend: FastAPI + MongoDB (motor). Enquiry model, PyObjectId/BaseDocument pattern.
- API: GET /api/ (health), POST /api/enquiries, GET /api/enquiries.

## Implemented
2026-09-06 (v1, forge metaphor): initial build.
2026-09-06 (v2, baking metaphor — current):
- Hero: "GOOD INGREDIENTS. BAD RECIPE." masked line reveal, 16 cursor-reactive ingredient fragments that drift/repel and organize on scroll, 3D tilt, sub "We build brands, websites and marketing that get local businesses noticed.", CTAs START A PROJECT / SEE WHAT WE DO
- 02 THE INGREDIENTS: "YOU ALREADY HAVE MOST OF IT." + six rotated ingredient panels + "SO WHY DOES IT STILL FEEL HARD?"
- 03 THE RECIPE: "FIRST, WE FIND THE RECIPE." 8 nodes (POSITIONING→…→WEBSITE) connect on scroll with drawn ember lines; noise chips (GUT FEEL / TRENDS / GUESSWORK) strike out and vanish; "Not everything belongs in the final mix."
- 04 THE MIX (pinned 420vh): "GOOD DESIGN ISN'T ADDING MORE. IT'S KNOWING WHAT TO KEEP." 100-cell field reduces 100 SIGNALS → 40 → 12 → 5 → 1 CLEAR DIRECTION, giant live counter, last cells turn ember
- 05 INTO THE HEAT: "NOW WE TURN UP THE HEAT." six execution chips ignite with accelerating stagger, oven bar fills to 180°C
- 06 THE BAKE (pinned 820vh, centerpiece): RAW MATERIAL → SKETCH (dashed borders) → STRUCTURE → WIREFRAME → DESIGN (colour/identity applied) → DEVELOPMENT (browser frame, build vibration) → TEST (button/layout visibly changes) → LAUNCH (temper blue, "PASSED — HOLDS ITS SHAPE"). Live oven readout 18°C→180°C→OUT, clickable 8-stage rail, per-stage narrative
- 07 DON'T JUST PUT IT IN THE OVEN: "HEAT ALONE DOESN'T MAKE GOOD WORK." auto-cycling variant card (A/B/C: headline, layout, CTA and reviews strip morph; booking-rate bar 2.1%→3.4%→4.8%, labelled example figures)
- 08 TEMPER: "NOW IT HOLDS ITS SHAPE." calm BRAND→WEBSITE→SEARCH→CONTENT→CUSTOMER chain, temper connectors
- 09 WHAT COMES OUT: "WHAT COMES OUT MATTERS." five outcome rows (VISIBILITY/TRUST/BOOKINGS/CUSTOMERS/PERFORMANCE), no invented numbers
- SERVICES: "WHAT WE PUT IN THE MIX." interactive expanding list (6 services, ember for make-services, temper for performance-services)
- CASE STUDIES: 3 fictional projects with draggable BEFORE/AFTER slider (raw ingredients vs finished product, keyboard accessible), count-up metrics (temper), expandable recipe story (INGREDIENTS/PROBLEM/RECIPE/BAKE/RESULT)
- THE FURNACE DIFFERENCE: "YOU DON'T NEED FIVE FREELANCERS." → "YOU NEED THE PIECES TO WORK TOGETHER. That's Furnace."
- MANIFESTO: six huge one-sentence lines ("GOOD INGREDIENTS MATTER." … "SO DOES THE RESULT."), alternating alignment/outline, ember HEAT + temper RESULT, slow marquee RAW INGREDIENTS→…→RESULT
- TEAM: "SMALL TEAM. BIG RESPONSIBILITY." editorial roster
- FINAL CTA: "GOT GOOD INGREDIENTS? LET'S MAKE SOMETHING PEOPLE WANT." temper-dominant, label "OUT OF THE OVEN", giant outline FURNACE footer
- Contact modal enquiry form → POST /api/enquiries → success + toast; SEO meta; grain; reduced-motion handling

## Verified
- curl POST/GET /api/enquiries OK; UI form submission persisted
- Screenshot walkthrough: hero, ingredients, recipe chain, mix reduction (5 ESSENTIAL captured), heat chips + oven bar, bake DESIGN (152°C) and LAUNCH (OUT) stages, iterate variant cycling (A and C captured), temper chain, outcomes, manifesto, case slider drag to 25% revealing AFTER, story expansion

## Backlog
- P1: Real case studies + real client metrics
- P1: Email notification on new enquiry (Resend)
- P2: Enquiries admin page
- P2: Mobile animation polish pass (desktop is the primary experience)
- P2: OG share image / favicon

## Next tasks
1. Swap placeholder case studies for real projects
2. Resend email on enquiry
3. Enquiries admin page
