# Anoma Analytics Dashboard (Real Data, Production-Ready)

This repo contains:
- **server/** — Node.js (Express + TypeScript) API that reads **real** data from your Anoma node via CLI, streams **real logs** (journalctl/tail), and queries CometBFT RPC.
- **web/** — Next.js + Tailwind dark UI that visualizes intents, solvers, status, and live logs.

## Prereqs
- Node.js 18+
- Anoma node available locally **or** reachable via SSH (for Remote mode)
- Optional: `systemd` for `journalctl`, otherwise set `LOG_MODE=file`

## Configure server/.env
Copy `.env.example` to `.env` and set values:
```
PORT=4000
COMET_RPC=http://localhost:26657

ANOMA_BIN=anoma           # or `ssh user@host anoma` for remote
ANOMA_HOME=               # if needed

LOG_MODE=journal          # journal | file | ssh-journal
JOURNAL_UNIT=anomad
LOG_FILE=                 # required if LOG_MODE=file
SSH_HOST=                 # required if LOG_MODE=ssh-journal
```

## Run (two terminals)
```bash
# API
cd server
pnpm i || npm i
pnpm dev || npm run dev

# Web
cd ../web
pnpm i || npm i
pnpm dev || npm run dev
```

Open the web app (defaults to http://localhost:5173). The web app calls the API on the same origin (`/api/...`), so either proxy or open from the same domain/port in production.

## Real data sources
- **CLI**: `anoma client query intent --all --json`, `anoma client balance --owner <alias>`
- **Logs**: `journalctl -u anomad -f -o cat` or `tail -F <path>`
- **CometBFT**: `GET /status`, `/net_info`, `/validators`

## Deploy notes
- Place **server** and **web** behind one domain; add a reverse proxy (nginx) so `/api/*` routes to the API.
- Add rate limiting to `/api/*` if you expose it publicly.
- For Remote mode, use SSH tunneling for CometBFT RPC (or secure it via firewall/VPN).
