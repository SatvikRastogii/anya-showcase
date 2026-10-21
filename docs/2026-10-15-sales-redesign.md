# Sales redesign: spec + plan

Date: 2026-10-15 · Status: design approved in chat. Supersedes the landing sections of `2026-10-15-showcase-site-design.md`. The dashboard is unchanged apart from the login gate.

## Goal
Turn the landing page into a sales pitch for **Anya by Texnoid: "Hire AI voice employees in 2 minutes"**. Employees are the main selling point; real voices can be heard; pricing shows we're cheap. No internal workflow or technical detail on the landing page.

## Constraints
- Only `uitest/` changes. GSAP and Lenis only (no Anime.js, Motion or react-spring; GSAP covers them).
- Audio: real clips from `data/tts_cache/`, matched by `sha256(voice_key\ntext)` and encoded to 64 kbps MP3 in `public/voices/` (15 clips, 472 KB). They load only on play.
- Light and dark theme: follow `prefers-color-scheme` first, then use the stored choice (`localStorage`, wrapped in try/catch). Tokens get redefined under `[data-theme="light"]`.
- No fabricated customers or testimonials. Employees without real audio are labelled as templates.
- Every price lives in `src/data/pricing.ts` and is marked as a draft for the owner to adjust.

## Sections (`/`)
1. **Nav:** wordmark; links Employees · Voices · Pricing · FAQ; theme toggle; `Log in`; `Start free`.
2. **Hero:** headline "Hire AI voice employees in 2 minutes." Language switch EN / हिन्दी / தமிழ். `Hear her` plays the clip; a Web Audio `AnalyserNode` RMS drives the wave envelope (it idles when nothing is playing), and the caption shows the spoken line.
3. **Languages marquee:** the 11 languages in native script (CSS animation, paused under reduced motion).
4. **Build in 2 minutes:** a pinned, scroll-scrubbed product walkthrough with a clock from 0:00 to 1:52. Steps: describe the job → it reads your website → pick a voice and languages → test call rings your phone → live. On screens under 900px it isn't pinned; the steps stack.
5. **Meet the team:** six employee role cards. Anya and Kavya have play buttons; the other four are marked "Template".
6. **Sounds like a person:** a board of short real lines with a Voice A (Sarvam) / Voice B (ElevenLabs) switch. Lines with only one voice show that one.
7. **Why teams hire her:** six benefits in plain language.
8. **Pricing:** Trial / Growth / Scale / Enterprise; a savings slider (calls a day → our cost vs a human telecaller); a per-minute comparison with Bolna, Ringg and Retell/Vapi/Bland, marked "approx public list prices, Oct 2026".
9. **FAQ** (`<details>`), closing CTA, footer.

## Login
`/login` is a demo sign-in: any email and password work, or `Continue with demo account`. It sets `sessionStorage.anya_demo_auth`. `/app/*` without that flag redirects to `/login?next=…`. Dashboard links on the landing page go to `/login`.

## Plan
- [x] 1. Match clips and encode MP3 → `public/voices/`.
- [ ] 2. Theme: light tokens, `ThemeToggle`, a pre-paint script in `index.html`, wave colours from CSS vars.
- [ ] 3. Data: `voices.ts`, `employees.ts`, `pricing.ts`.
- [ ] 4. `lib/audio.ts`: a shared player with an analyser (`play(src)`, `level()`, `stop()`, subscribe).
- [ ] 5. Hero rewrite plus the WaveField reading level and theme.
- [ ] 6. Marquee, Build walkthrough, Team, Phrases, Benefits, Pricing, FAQ, Closing.
- [ ] 7. Login page and `RequireAuth` around `/app`.
- [ ] 8. Delete CallSim, AgentFlow, Rules, callScript and their CSS.
- [ ] 9. `npm run build`; check `/`, `/login` and `/app` in Chrome in both themes at 1440 and 390; redeploy with `vercel --prod`.

## Review focus
1. Pressing play twice or switching language mid-clip: the previous clip stops; one clip plays at a time.
2. The browser blocks autoplay: audio only starts on a click, never on load.
3. Deep link to `/app/leads` without logging in: redirected to login, then returned to `/app/leads`.
4. Theme flash on load: the pre-paint script sets `data-theme` before React runs.
5. Reduced motion: the marquee stops, the walkthrough shows every step statically, and the wave is static, but audio still plays.
