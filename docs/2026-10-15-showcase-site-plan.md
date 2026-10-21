# Anya showcase site — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static Vite/React showcase site for Anya by Texnoid (cinematic landing page plus a mock dashboard), deployable from `uitest/` with the Vercel CLI.

**Architecture:** A single SPA with `react-router-dom`. The landing page (`/`) is built from section components: a lazy three.js hero, a GSAP-timed call simulation, a ScrollTrigger-pinned agent flow and the rules strip. The dashboard (`/app/*`) is a shell with nested routes reading typed mock data from `src/data/`. No backend.

**Tech Stack:** Vite 5, React 18, TypeScript 5, react-router-dom 6, three + @react-three/fiber 8, gsap 3 (ScrollTrigger), lenis 1.

**Spec:** `uitest/docs/2026-10-15-showcase-site-design.md`

## Global Constraints

- Only `uitest/` is touched.
- Tokens: `--ink #0B0B0C`, `--ink-2 #141416`, `--rule #26262A`, `--bone #ECE7DF`, `--dim #8A867F`, `--signal #FF5A1F`, `--phosphor #7CFFB2`, `--warn #E8B04A`, `--bad #FF5C5C`.
- Fonts: Inter Tight and JetBrains Mono, from Google Fonts.
- Never: gradient blobs, glassmorphism, purple, emoji, glowing rounded "AI cards".
- `prefers-reduced-motion` means content is shown static in its final state.
- Mock outcomes are limited to `qualified | disqualified | callback_requested | no_answer | voicemail | transferred | abandoned | error`.
- Gate: `npm run build` (runs `tsc -b && vite build`) must pass.

## Review Focus

1. **No WebGL or reduced motion:** the hero must still render a static SVG waveform and the headline, not a blank black box. *(Task 3: `canWebGL()` guard plus reduced-motion check.)*
2. **Deep link or refresh on `/app/calls/:id` on Vercel:** must load, not 404. *(Task 1: `vercel.json` rewrite.)* An unknown call id shows "Call not found". *(Task 7.)*
3. **390px phone width:** no horizontal scroll, the agent flow isn't pinned, and the sidebar becomes a bottom bar. *(Tasks 5 and 6: media queries; verified in Task 9.)*
4. **Leaving the landing page mid-animation:** GSAP contexts, Lenis and the call-sim timers are cleaned up, so going back doesn't duplicate triggers. *(Every effect returns cleanup via `gsap.context().revert()` or `clearTimeout`.)*
5. **⌘K/Ctrl+K pressed while typing in the Hire form:** opens the palette, Esc closes it, and focus returns. *(Task 6.)*

---

### Task 1: Scaffold, tokens, routing, Vercel config
**Files:** `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `vercel.json`, `.gitignore`, `public/favicon.svg`, `src/main.tsx`, `src/App.tsx`, `src/styles/tokens.css`, `src/vite-env.d.ts`
**Produces:** routes `/` → `Landing`, `/app/*` → `Shell` (lazy), `*` → `NotFound`. Global classes `.mono`, `.label`, `.wrap`, `.btn`, `.btn--signal`, `.rule`.
- [ ] Write the config files; `vercel.json` = `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`.
- [ ] `npm install`, then `npm run build`. Expected: PASS.

### Task 2: Mock data
**Files:** `src/data/calls.ts`, `leads.ts`, `team.ts`, `callScript.ts`
**Produces:** `type Outcome`, `interface Call { id; startedAt; durationS; company; lead; phone; outcome; path: AgentTurn[]; answers; summary; sentiment; transcript: Line[]; errors: string[] }`, `calls: Call[]` (12 entries), `findCall(id): Call | undefined`, `leads: Lead[]`, `team: Employee[]`, `script: ScriptEvent[]` (`{ t: number; kind: 'say'|'agent'|'chip'|'booked'; who?; text; key? }`).
- [ ] Write the data files; `npm run build` passes.

### Task 3: Hero (three.js wave field + captions)
**Files:** `src/landing/Hero.tsx`, `WaveField.tsx`, `StaticWave.tsx`, `hero.css`, `src/lib/motion.ts` (`useReducedMotion`, `canWebGL`)
- [ ] Points geometry of about 160×120. A vertex shader displaces by `sin(x*f + t) * envelope(t)` plus mouse bend, and the fragment shader mixes bone to signal by height.
- [ ] Captions type the opening line on a loop; the envelope is driven by the same clock.
- [ ] Fallback to `StaticWave` when reduced motion is on or WebGL is missing. Build passes.

### Task 4: Call simulation
**Files:** `src/landing/CallSim.tsx`, `callsim.css`
- [ ] Plays `script` with a timer started by an IntersectionObserver. Controls: play/pause, replay, skip. State: visible lines, active agent, chips, booked flag. Clean up timers on unmount.

### Task 5: Agent flow + rules + closing + nav
**Files:** `src/landing/AgentFlow.tsx`, `flow.css`, `Rules.tsx`, `Closing.tsx`, `Nav.tsx`, `landing.css`, `Landing.tsx`, `src/lib/useLenis.ts`
- [ ] An SVG graph whose paths are drawn with `strokeDashoffset`. On ≥900px it pins with ScrollTrigger scrub through 5 steps (the voicemail step flat-lines the wave with `LLM REQ 0`). Below 900px the steps stack with simple reveals (`gsap.matchMedia`).

### Task 6: Dashboard shell + command palette
**Files:** `src/app/Shell.tsx`, `CommandPalette.tsx`, `app.css`
- [ ] Sidebar NavLinks, top bar with the calling-window pill (computed from the current IST time), and a ⌘K palette (Esc closes it, arrow keys plus Enter navigate). Below 760px the sidebar becomes a bottom bar.

### Task 7: Calls list + detail
**Files:** `src/app/Calls.tsx`, `CallDetail.tsx`, `components/Badge.tsx`, `components/Scrubber.tsx`
- [ ] A list/detail layout. The detail view shows the summary, answers, agent timeline, scrubber (seeded bars, rAF playhead) and transcript. An unknown id shows "Call not found".

### Task 8: Leads, Team, Hire, NotFound
**Files:** `src/app/Leads.tsx`, `Team.tsx`, `Hire.tsx`, `src/NotFound.tsx`
- [ ] Leads table with filter chips; Team cards; the Hire form with a fake drafting state (1.6 s) that reveals the plan card.

### Task 9: Verify
- [ ] `npm run build` passes. `npm run preview`, then in Chrome check `/`, `/app/calls`, `/app/calls/<id>`, `/app/leads`, `/app/team`, `/app/team/new` and a bad route at 1440 and 390 widths: no console errors, no horizontal scroll.
