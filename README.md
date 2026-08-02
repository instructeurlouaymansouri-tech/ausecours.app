# AUSECOURS

**Every Second Saves a Life.**

An AI emergency first-aid assistant built for Tunisia — multilingual (Tunisian Derja first, then
Standard Arabic, French, English), voice-enabled, and focused on first-aid education, CPR
training, nearby-hospital lookup, and quick access to emergency numbers.

> ⚠️ AUSECOURS provides educational first-aid guidance only. It is **not** a substitute for
> professional emergency services. In Tunisia, always call **190** (SAMU/Ambulance), **197**
> (Police), **198** (Civil Protection/Fire), or **193** (Garde Nationale) for real emergencies.

---

## Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Next.js Route Handlers (`src/app/api/*`)
- **Database / Auth:** Supabase (Postgres + Auth) — schema in `supabase/schema.sql`
- **Maps:** Leaflet + OpenStreetMap tiles (no API key required)
- **AI:** Google Gemini, called **server-side only** from `src/app/api/chat/route.ts` so the key
  is never exposed to the browser
- **Speech:** Browser Web Speech API (SpeechRecognition + speechSynthesis), abstracted behind
  `src/components/useVoice.ts` so a cloud provider can be swapped in later
- **PWA:** `public/manifest.json` + `public/sw.js` (offline caching for static pages only — the
  AI chat always requires a live connection)

## Project layout

```
src/
  app/                 Route Handler + page routes (home, chat, hospitals, cpr, awareness, numbers)
  components/          UI components (Nav, ChatWindow, HospitalMap, CprLibrary, ...)
  lib/                 i18n dictionary, Supabase clients, safety prompt, sample data
supabase/schema.sql     Postgres schema + RLS policies + seed data
public/                 manifest.json, sw.js, avatar image, icons
```

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

Open http://localhost:3000.

### Required environment variables (`.env.local`)

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API (**server-only**, never expose to the client) |
| `GEMINI_API_KEY` | Google AI Studio → API keys (**server-only** — used only inside the `/api/chat` route) |
| `GEMINI_MODEL` | Defaults to `gemini-2.5-flash`; change if you want a different model |

### Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run `supabase/schema.sql` — it creates `profiles`, `facilities`,
   `cpr_videos`, `cpr_progress`, `chat_messages`, and `awareness_tips`, each with row-level
   security policies, plus seeds a handful of sample facilities.
3. Copy the project URL and anon/service keys into `.env.local`.
4. To move the Hospitals page off the hard-coded sample list, replace `getFacilities()` in
   `src/lib/facilities.ts` with a Supabase query against the `facilities` table.

### Swapping in real CPR videos

Edit `src/lib/cprData.ts` — every entry with `embedUrl: null` is a placeholder slot. Replace it
with any embeddable video URL (YouTube, Vimeo, or your own CDN/HLS player) once you have
locally-produced or licensed content.

### Maps

The Hospitals page uses Leaflet with OpenStreetMap tiles, so no API key is required out of the
box. `NEXT_PUBLIC_MAP_TILE_URL` in `.env.example` lets you point at a different tile provider
later without touching component code.

### PWA / offline support

The service worker (`public/sw.js`) caches the app shell and static pages (Daily Awareness, CPR
library listing, Emergency Numbers) so they remain viewable offline. The AI chat endpoint is
explicitly excluded from caching since answers must always come from a live model call.

## Safety design notes

- The Gemini system prompt (`src/lib/safetyPrompt.ts`) instructs the assistant to always lead
  with the relevant Tunisian emergency number, avoid diagnosing or prescribing medication, and
  state uncertainty rather than invent facts. Update this file if your legal/medical reviewers
  want to adjust wording.
- The chat UI ships with a scripted, fully offline fallback (`src/components/ChatWindow.tsx`) so
  the interface remains useful (with a visible warning) even if `GEMINI_API_KEY` isn't configured
  or the API call fails.
- Before a real launch, have a licensed medical professional review both the system prompt and
  the CPR/first-aid content, and confirm the emergency numbers are current for your region.

## Deploying

Any Next.js-compatible host works (Vercel, Netlify, self-hosted Node). Set the same environment
variables in your hosting provider's dashboard, then `npm run build && npm run start`, or connect
the repo for automatic builds.

---

Powered By Mansouri Louay
