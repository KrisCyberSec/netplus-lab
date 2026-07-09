# NetPlus Lab

**Free CompTIA Network+ (N10-009) practice drills in the browser.**

Interactive subnetting, port recall, OSI map, domain-tagged quizzes, fault scenarios, and a tool picker. Local-first progress. Open for community question PRs.

> Not affiliated with CompTIA. Network+ is a registered trademark of CompTIA. Always use the [official exam objectives](https://www.comptia.org/en-us/certifications/network/) as the source of truth.

---

## Live demo

After you enable GitHub Pages (or run locally):

```bash
npm install
npm run dev
# → http://localhost:5173
```

```bash
npm run build && npm run preview
```

---

## Features

| Drill | What it trains |
|-------|----------------|
| **Subnetting trainer** | Mask, broadcast, host range, usable hosts from CIDR |
| **Port lightning round** | High-yield TCP/UDP ports and services |
| **OSI map** | Interactive layers + quick layer ID quiz |
| **Practice quiz** | 90+ tagged questions across all 5 domains |
| **Mock exam** | Timed 20/40/60, domain-weighted, miss review |
| **Fault scenarios** | “What’s wrong?” troubleshooting cases |
| **Tool picker** | Match the job to CLI / hardware tools |
| **Cheatsheets** | Ports, subnet math, cabling, Wi-Fi, OSI, methodology |
| **Coverage page** | Honest domain status (strong / partial / thin) |

Progress is stored in `localStorage` only. Quiz/mock support keyboard **1–4** and **Enter**.

---

## Exam coverage (honest)

| Domain | Weight | Status |
|--------|--------|--------|
| 1. Networking Concepts | 23% | **Strong** |
| 2. Network Implementation | 20% | **Partial** |
| 3. Network Operations | 19% | **Partial** |
| 4. Network Security | 14% | **Partial** |
| 5. Network Troubleshooting | 24% | **Strong** |

Full matrix: [`docs/COVERAGE.md`](docs/COVERAGE.md).

This is **not** a claim of 100% objective coverage. MVP is exam-shaped (heavy on concepts + troubleshooting). Full coverage is a content roadmap.

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
