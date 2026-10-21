# Anya showcase site — design spec

Date: 2026-10-15 · Status: approved in chat, awaiting written-spec review

## Goal

A demo website for **Anya by Texnoid**, an outbound AI voice agent that calls leads,
qualifies them and books a demo. It must look distinctive (not a generic AI-startup page)
and show off what the product does. It is for viewing only: no backend, no real data.

Success = a deployed Vercel URL where someone can (1) understand what Anya does from the
landing page in under a minute, (2) watch a simulated call, and (3) click around a believable
dashboard.

## Constraints

- All files live in `uitest/`. Nothing outside it changes; `review_ui/` stays as it is.
- Deployed with the Vercel CLI, running `vercel` from `uitest/`.
- Non-functional: all data is mocked, and forms and buttons do nothing real.
- The mock data follows the real schema (`src/anya_core/call_record.py`): call outcomes
  `qualified | disqualified | callback_requested | no_answer | voicemail | transferred |
  abandoned | error`, agent path `Greeter → Qualifier → Scheduler → Fallback`, and the four
  qualification answers (which calls, calls per day, timeline, decision makers).

## Stack

- Vite + React 18 + TypeScript, static build (`dist/`).
- `react-router-dom`, with routes `/` (landing) and `/app/*` (dashboard).
- `three` + `@react-three/fiber` for the hero, lazy-loaded.
- `gsap` + `ScrollTrigger` for scroll and timeline animation; `lenis` for smooth scroll on the landing page.
- Plain CSS with custom properties (one global `tokens.css` plus a CSS file per section). No UI kit, no Tailwind.
- Fonts from Google Fonts: **Inter Tight** (display and body) and **JetBrains Mono** (labels and data).
- `vercel.json` rewrites every path to `/index.html` so SPA routes work.

## Visual language: "Signal / instrument"

Dark, precise and engineered, like audio test equipment.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0B0B0C` | page background |
| `--ink-2` | `#141416` | panels |
| `--rule` | `#26262A` | 1px hairlines and grids |
| `--bone` | `#ECE7DF` | primary text |
| `--dim` | `#8A867F` | secondary text |
| `--signal` | `#FF5A1F` | the one accent: CTAs, active agent, waveform peaks |
| `--phosphor` | `#7CFFB2` | only for "live" and positive outcomes |
| `--warn` / `--bad` | `#E8B04A` / `#FF5C5C` | callback/retry, error/DND |

- **Type:** display set huge (clamp to about 9vw), letter-spacing -0.04em, line-height 0.9. Labels in mono
  uppercase at 11–12px with +0.08em tracking.
- **Motifs:** tick-mark rulers on section edges, `[ 01 / 05 ]` section counters, corner
  grid coordinates, a crosshair cursor over the hero canvas, and live mono readouts (`T+00:12.4`,
  `LLM REQ 0`).
- **Never:** gradient blobs, glassmorphism, purple, emoji, stock 3D icons, rounded "AI cards"
  with glow.
- **Motion:** GSAP `power3/expo` eases with short durations and no bounce. Text reveals by line
  mask. Every animation is disabled or shown as its final state under `prefers-reduced-motion`.

## Landing page (`/`)

1. **Nav:** wordmark `ANYA` + `by Texnoid`, mono links (Call, Flow, Rules), and the CTA
   `Open dashboard →`.
2. **Hero:** a full-viewport three.js canvas with about 20k points in a horizontal ribbon,
   displaced by a vertex shader driven by a scripted "voice envelope" (amplitude over time) so it
   looks like it is speaking. Peaks are tinted `--signal`. The mouse bends the field slightly.
   Captions underneath type out the real opening line, synced to the envelope: "Hi, this is
   Anya from Texnoid. You recently enquired on our website about automating your business
   calls…". The headline sits over the canvas (e.g. "She makes the first call. / In under a minute.").
   CTAs: `Watch a call` (scrolls to §3) and `Open the dashboard`. Fallback: a static SVG
   waveform when WebGL is unavailable or reduced motion is on.
3. **Live call simulation:** a two-column instrument panel.
   - Left: a call console with the number `+91 98•• ••210`, a running timer, an agent strip
     `GREETER · QUALIFIER · SCHEDULER · FALLBACK` whose active segment glows, and data chips that
     fill in as answers come (`CALLS: inbound support`, `VOLUME: ~50/day`, `TIMELINE: this month`,
     `DECIDER: founder`).
   - Right: transcript bubbles typing in (Anya and caller), including a read-back ("So around
     fifty calls a day, got it.") and the booking confirmation ("So that's Thursday the 8th
     at 5 pm, and the invite goes to priya at gmail dot com. Is that right?").
   - Ends on a `BOOKED · THU 8 · 17:00 IST` card. Controls: play/pause, replay, skip.
     It starts automatically when scrolled into view.
   - The script is a typed array of timed events in `src/data/callScript.ts`.
4. **Agent flow (pinned, scroll-scrubbed):** an SVG graph that draws as you scroll, with a short
   caption for each step:
   1. Greeter: "Identity confirmed."
   2. Qualifier: "Four questions, one at a time."
   3. Scheduler: "Two real dates. Read back before booking."
   4. Fallback catches every exit (wrong person, busy, not interested, human requested).
   5. Voicemail beat: the waveform flat-lines, a red cut mark appears, and the readout shows `LLM REQ 0`
      for "Carrier and voicemail messages are detected and hung up without any LLM request."
   On mobile it isn't pinned; the steps stack and reveal as you scroll.
5. **Rules strip:** a grid of 4–6 numbered facts in mono and display type:
   - "The script runs in code, not in the AI."
   - "Calls only go out 09:00–20:30 IST."
   - "Retry ladder: 2h → 1 day → DND."
   - "'Remove my number' means never called again."
   - "Never says the lead's name. Never 'sir' or 'ma'am'."
   - "Asks for a person? Escalates to a human or a callback."
6. **Closing CTA:** an oversized line ("Let her make the next call.") and the dashboard button. Footer
   with the wordmark, © Texnoid, and a demo disclaimer.

## Dashboard (`/app`)

The same tokens, quieter: more `--ink-2` panels, motion only on transitions.

- **Shell:** a left sidebar (Calls, Leads, Team, and Hire at the bottom), a top bar with a "Calling window
  OPEN · closes 20:30 IST" pill and a `⌘K` button. The command palette opens on ⌘K/Ctrl+K and filters
  nav items (visual only). The sidebar becomes a bottom tab bar on mobile.
- **Calls (`/app/calls`, `/app/calls/:id`):** a list of about 12 mock calls (time, masked number,
  company, outcome badge, duration). The detail view has:
  - an AI summary card (sentiment and next step)
  - outcome and qualification answers
  - an agent-path timeline (agent, entered/exited times, handoff reason)
  - a fake audio waveform scrubber (bars from a seeded random, a playhead that animates on play)
  - the transcript
  - errors, if any
- **Leads (`/app/leads`):** a table with name, company, source (website / Meta), status (`due`, `retry
  2h`, `retry 1d`, `callback 11:00`, `booked`, `dnd_blocked`, `do_not_call`), attempts and next call. Filter chips
  at the top. A visual-only "Add lead" button.
- **Team (`/app/team`):** cards for AI employees (Anya – Sales, plus one or two others such as a "Receptionist"),
  showing voice, languages and status. A "Hire" page (`/app/team/new`) shows the describe-an-employee form
  with a fake "drafting…" state that reveals a pre-written plan card.
- Unknown routes go to a minimal 404 in the same style.

## Code structure

```
uitest/
  index.html  package.json  tsconfig.json  vite.config.ts  vercel.json
  docs/                      this spec and the plan
  public/                    favicon
  src/
    main.tsx  App.tsx        router
    styles/tokens.css        tokens, reset, type, utilities
    data/                    calls.ts, leads.ts, team.ts, callScript.ts (typed mocks)
    lib/                     useReducedMotion.ts, useLenis.ts
    landing/                 Nav, Hero (+ WaveField.tsx three.js), CallSim, AgentFlow, Rules, Closing
    app/                     Shell, CommandPalette, Calls, CallDetail, Leads, Team, Hire, components/
```

Each section is one component with its own CSS file. The mock data lives in `data/`
and nothing else.

## Verification

- `npm run build` passes, with `tsc` errors failing the build.
- Every route checked in Chrome at 1440px and 390px: no console errors, no horizontal scroll.
- Reduced motion checked: content is visible and static.
- The hero three.js chunk is lazy-loaded, and the first load with no 3D is under about 250 KB gzipped.

## Out of scope

The cost/pricing section, a real API, auth, persistence, i18n, and unit tests (the build
and type check are the gate for a static demo).
