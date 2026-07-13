# Agent notes — NetPlus Lab

When the user asks to open, pull up, launch, or start this Network+ training site:

## Prefer instant (study / view only)

```bash
open https://kriscybersec.github.io/netplus-lab/
```

No install, no dev server. Use this unless they need local code changes or offline work.

## Local dev (edit / debug)

From **this repo root only** (`~/projects/netplus-lab`):

```bash
npm run open
```

That script:

1. Reuses `http://127.0.0.1:5173` if already up (near-instant)
2. Otherwise starts Vite, waits until ready, opens the browser
3. Detaches the server so it keeps running

Do **not**:

- Run `npm` from `$HOME` or any parent of this project
- Start Vite with a short tool timeout (use background + unlimited timeout if you must manage the process yourself)
- Start a second server if port 5173 is already listening

## Paths

| Item | Path / URL |
|------|------------|
| Repo | `/Users/kristopher/projects/netplus-lab` |
| Live | https://kriscybersec.github.io/netplus-lab/ |
| Local | http://127.0.0.1:5173/ |
| Launcher | `scripts/open.sh` → `npm run open` |
