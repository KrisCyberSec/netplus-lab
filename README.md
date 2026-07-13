# NetPlus Lab

**Free CompTIA Network+ (N10-009) practice drills in the browser.**

Guided study path, coach suggestions, subnetting, ports, OSI, quizzes, mock exams, scenarios, and a miss-bank review loop. Progress stays in your browser (local-first).

> Not affiliated with CompTIA. Network+ is a registered trademark of CompTIA. Always use the [official exam objectives](https://www.comptia.org/en-us/certifications/network/) as the source of truth.

---

## Live demo

**https://kriscybersec.github.io/netplus-lab/**

(GitHub Pages — deploys automatically from `main`.)

### Run locally

Fastest local path (idempotent — reuses a running server if already up, then opens the browser):

```bash
npm run open
# → http://127.0.0.1:5173
```

Or the classic Vite workflow:

```bash
npm install
npm run dev
# → http://127.0.0.1:5173 (browser opens automatically)
```

```bash
npm run build && npm run preview
```

**Just want to study?** Use the live demo above — no install, no wait.

---

## Features

| Drill | What it trains |
|-------|----------------|
| **Subnetting trainer** | Mask, broadcast, host range, usable hosts from CIDR |
| **Port lightning round** | High-yield TCP/UDP ports and services |
| **OSI map** | Interactive layers + quick layer ID quiz |
| **Practice quiz** | 200+ questions mapped to N10-009 topic areas |
| **Study loop / Review misses** | Wrong answers saved; re-drill until mastered (2 in a row) |
| **Mock exam** | Timed 20/40/60, domain-weighted, then review misses |
| **Fault scenarios** | “What’s wrong?” troubleshooting cases |
| **Tool picker** | Match the job to CLI / hardware tools |
| **Cheatsheets** | Ports, subnet math, cabling, Wi-Fi, OSI, methodology |
| **Subnet timed mode** | 10 problems / 5 minutes challenge |
| **Coverage page** | Honest domain status (strong / partial / thin) |

Progress is stored in `localStorage` only. Quiz/mock support keyboard **1–4** and **Enter**.

### How the study loop works

1. Take a **practice quiz** or **mock exam**.
2. Every wrong answer is saved to your **miss bank** (local only).
3. Open **Review misses** — or use the post-session “Review these misses” button.
4. Get an item **right twice in a row** to mark it **mastered**.
5. Dashboard shows active misses by domain and deep-links to ` /quiz?domain=N `.

---

## Exam coverage (N10-009)

Aligned to CompTIA Network+ **N10-009 / V9** public objectives summary (concepts, implementation, operations, security, troubleshooting). Live topic map: in-app **Coverage** page and [`docs/COVERAGE.md`](docs/COVERAGE.md).

| Domain | Weight | Lab depth |
|--------|--------|-----------|
| 1. Networking Concepts | 23% | Strong |
| 2. Network Implementation | 20% | Strong |
| 3. Network Operations | 19% | Strong |
| 4. Network Security | 14% | Strong |
| 5. Network Troubleshooting | 24% | Strong |

**Not** a substitute for CompTIA’s official PDF, hands-on labs, or PBQs. Content is factual networking study material — not a brain dump.

---

## Stack

- Vite + React 19
- React Router (HashRouter in production for easy GitHub Pages)
- Pure client-side data in `src/data/`

## Project layout

```
src/
  data/          # ports, questions, scenarios, tools, OSI, domains
  lib/           # subnet engine, progress, shuffle
  pages/         # drills + dashboard
  components/    # layout / nav
docs/
  COVERAGE.md    # domain → feature matrix
```

## Contribute questions

1. Add items to `src/data/questions.js` (or scenarios/ports).
2. Tag `domain` (1–5) and optional `objective` (e.g. `1.4`).
3. Include a short `explain` string.
4. Open a PR.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run open` | Start (or reuse) dev server and open browser |
| `npm run dev` | Local dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |

## GitHub Pages

1. Push this repo to GitHub.
2. Settings → Pages → Deploy from branch `gh-pages` **or** use Actions / `dist` on `main`.
3. If the site is at `https://<user>.github.io/netplus-lab/`, set Vite base:

```js
// vite.config.js
export default defineConfig({
  base: '/netplus-lab/',
  plugins: [react()],
})
```

HashRouter is already used in production so deep links work without a custom 404.

## License

MIT — study freely, contribute freely.

## Disclaimer

Study aid only. Not a substitute for hands-on labs, official materials, or the CompTIA exam. No warranty of exam success.
