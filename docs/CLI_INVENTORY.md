# Machine CLI + account inventory

**Purpose:** Give the next AI session (this repo or a new project) a map of which CLIs and accounts Mitchell already has, without copying secrets.

**Living document.** Re-run the “How to verify” commands if login state looks stale.

**Never put in this file:** API keys, service-role keys, database passwords, `.env.local` values, OAuth client secrets, DNS API tokens.

---

## Snapshot (2026-10-14)

Git identity: **mitchellnkeo** / `mitchellnkeo@gmail.com`  
Node: **v24.11.0** (nvm) · npm **11.6.2** · Homebrew **6.0.20**

| Tool | Installed? | Logged in? | How this machine uses it |
|------|------------|------------|--------------------------|
| **Supabase CLI** | Yes (`/opt/homebrew/bin/supabase`, v2.101.0) | **Yes** | Org + project list below. Preferred for `db push` / `link`. |
| **Vercel CLI** | Yes (`vercel` 54.4.1, brew `vercel` + `vercel-cli`) | **No** (`vercel whoami` → Not authorized) | Deploys still work via **GitHub → Vercel**. Cursor **Vercel MCP** is authenticated. |
| **Cursor Vercel MCP** | Plugin | **Yes** | Team `Mitchell's projects`. Use MCP for project/env/deploy work when the CLI is logged out. |
| **Figma** | No Figma CLI | **Yes (Cursor Figma MCP)** | Handle **Mitchell Keo**, `mitchellnkeo@gmail.com`. |
| **Git / GitHub** | `git` yes · **`gh` not installed** | Git HTTPS remotes work | GitHub user **mitchellnkeo**. Install `gh` if the next project needs PRs from the agent. |
| **Cursor Origin** | `origin` CLI not installed | MCP ready, **no Origin repos** | GitHub is the git host, not Origin. |
| **Fly.io** | Yes (`flyctl` 0.4.94) | **No** | Run `flyctl auth login` only if a project needs Fly. |
| **npm registry** | npm/pnpm/yarn yes | **No** (`npm whoami` needs auth) | Public installs work. Login only to publish packages. |
| **Porkbun** | No CLI | Web account (DNS) | Used for **freqnt.club** DNS → Vercel. Not scriptable from this machine. |
| **Google Cloud** | `gcloud` not installed | OAuth client used by this app | Google SSO is configured in Supabase, not via gcloud CLI. |
| **Resend** | No CLI | Docs-only | SMTP for auth email is planned; not confirmed as a logged-in CLI. |

---

## Logged-in accounts (safe IDs only)

### Supabase

- **Org:** `mitchellnkeo` · org id `ziagmwpevnulofwynqkq`
- **Projects:**

| Linked here? | Ref | Name | Region |
|--------------|-----|------|--------|
| Yes | `bvsneqsgbefuguajsait` | PopupConnect | East US (Ohio) |
| No | `rjoboclkrvxamcvjxytu` | LearnWashington | East US (North Virginia) |

- Dashboard URL pattern: `https://supabase.com/dashboard/project/<ref>`
- API URL pattern: `https://<ref>.supabase.co`
- **Rule:** never `supabase config push` this repo’s `supabase/config.toml` (local `site_url` is `http://127.0.0.1:3000`). Change Site URL / Redirect URLs in the **dashboard**.

### Vercel (Cursor MCP)

- **Team:** Mitchell's projects  
  - slug `mitchells-projects-0cca3edd`  
  - id `team_CcAjZRxe45206bDnhnZKOOYE`
- **MCP-visible projects (recent):** `rynn-web` (`prj_mHNaB9C3KGgj21lkNgcp4915ww6f`), `backend` (`prj_z6RrUPq3huXStE3Bxee2n4OxG6WM`)
- **This repo’s Git link** (`.vercel/repo.json`): project `popup-connect` · `prj_DmKmN0E7OjLUGdF141fPy5eEq1OI` · same team id · production [https://freqnt.club](https://freqnt.club)
- Local CLI is logged out. To use `vercel` in a terminal: `vercel login`, then `vercel whoami`.

### Figma (Cursor MCP)

- **Mitchell Keo** · `mitchellnkeo@gmail.com`
- **Mitchell Keo's team** — starter, admin, Figma AI on
- **Amy's team** — pro, guest, Figma AI off
- Design files used by freqnt:
  - [Catalyst Design System](https://www.figma.com/design/Rr4R0eC6SzVheNO8Nlgxty/Catalyst-Design-System)
  - [v.01_sandbox](https://www.figma.com/design/xR1Xp9QmdUVHj55DmQFnO4/v.01_sandbox)

### GitHub

- User **mitchellnkeo**
- This repo: `https://github.com/mitchellnkeo/PopupConnect.git`
- Agent GitHub work: use `git` over HTTPS. For `gh pr create` / issues, install GitHub CLI (`brew install gh && gh auth login`).

---

## How to verify (copy into a new session)

```bash
supabase orgs list
supabase projects list
vercel whoami          # currently expected: Not authorized until vercel login
flyctl auth whoami     # currently expected: no access token
npm whoami             # currently expected: ENEEDAUTH
git config --global --get user.name
git config --global --get user.email
command -v gh vercel supabase flyctl gcloud wrangler netlify
```

Cursor MCP: Figma `whoami`, Vercel `get_auth_user` / `list_teams` / `list_projects`.

---

## Installed but not signed in

Use these only after an explicit login:

| CLI | Login |
|-----|--------|
| Vercel | `vercel login` |
| Fly.io | `flyctl auth login` |
| npm publish | `npm adduser` |

---

## Not on this machine

No binary / not logged in: `gh`, `origin`, `wrangler`, `netlify`, `firebase`, `stripe`, `aws`, `gcloud`, `az`, `heroku`, `railway`, `doppler`, `infisical`, `linear`.

If a new project needs one, install + login first, then add a row to the snapshot table.

---

## Secrets live here (do not paste them into chat or docs)

| Kind | Where |
|------|--------|
| Vite public Supabase URL + anon key | `.env.local` (`VITE_SUPABASE_*`) |
| DB password for CLI push | `.env.local` (`SUPABASE_DB_PASSWORD`) — never `VITE_` |
| Service role | `.env.local` only if needed — never `VITE_` |
| Vercel env | Vercel dashboard / MCP `get_project_env`, not the repo |

Template: `.env.example`.

---

## New-project bootstrap for the next AI

Copy this block into a new repo’s `docs/HANDOFF.md` or `AGENTS.md` and fill the blanks.

```md
## Mitchell machine — reuse these accounts

- Git: mitchellnkeo / mitchellnkeo@gmail.com
- GitHub: github.com/mitchellnkeo/<repo> (no gh CLI unless installed later)
- Supabase CLI: logged in as org mitchellnkeo (ziagmwpevnulofwynqkq)
  - Existing projects: PopupConnect (bvsneqsgbefuguajsait), LearnWashington (rjoboclkrvxamcvjxytu)
  - New project: create in that org, then `supabase link --project-ref <ref>`
- Vercel: Cursor MCP team Mitchell's projects (team_CcAjZRxe45206bDnhnZKOOYE)
  - Local `vercel` CLI may be logged out — prefer MCP or `vercel login`
- Figma: Cursor MCP as Mitchell Keo (mitchellnkeo@gmail.com)
- DNS: Porkbun web UI (no CLI)
- Do not commit .env.local. Do not supabase config push local toml to prod.
```

---

## This repo (freqnt) — extra context

See [HANDOFF.md](./HANDOFF.md) for product/architecture. Short deploy notes:

- SPA on Vercel (`vercel.json` rewrites all paths to `index.html`)
- Auth Site URL: `https://freqnt.club`
- Local Vite: `npm run dev` (often `:5173` or `:5174`)
- Admin allowlist includes `mitchellnkeo@gmail.com`
