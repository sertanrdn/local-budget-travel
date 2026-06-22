@AGENTS.md
# Local Budget Travel — Project Guide for Claude Code

## What this project is
A budget-friendly local travel guide for people who want to explore cities like a local without spending much money. Target users: students, backpackers, unemployed travellers, and anyone who prefers outdoor/free experiences over expensive tourist traps. The focus is on hidden gems, free outdoor activities, local culture, and authentic experiences — not popular tourist spots.

## Current status
- Next.js 15 + TypeScript + Tailwind scaffolded
- Starting city: Istanbul (developer lived there 7 years — use this local knowledge)
- Expanding later to: Amsterdam, Berlin, and other cities

## Tech stack
- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Maps**: Leaflet.js (free, open source)
- **Photos**: Unsplash API (free tier)
- **Data source**: OpenStreetMap / Overpass API for POI data

## Pages to build (in order)
1. `/` — Landing page (warm, minimal design — Wanderlog simplicity but warmer feel)
2. `/cities` — All cities grid
3. `/cities/[city]` — City page with category cards
4. `/cities/[city]/[category]` — Activities list in a category
5. `/activity/[id]` — Activity detail page with map pin, photos, description, local tip

**Later (do not build yet):**
- Auth / signup / login
- User profiles
- Favorites
- User-submitted activities
- Map page (full city map view)
- About, Contact pages

## Database schema (Supabase)

### cities
```
id uuid primary key
name text (e.g. "Istanbul")
country text (e.g. "Turkey")
description text
cover_image_url text
slug text unique (e.g. "istanbul")
created_at timestamp
```

### categories
```
id uuid primary key
name text (e.g. "Parks", "Street Food", "Viewpoints", "Markets", "Hikes", "Free Museums")
icon text (emoji or icon name)
city_id uuid references cities(id)
created_at timestamp
```

### activities
```
id uuid primary key
title text
description text
category_id uuid references categories(id)
city_id uuid references cities(id)
address text
latitude float
longitude float
photo_url text
is_free boolean
estimated_cost text (e.g. "Free", "~€2", "Under €5")
local_tip text (the insider knowledge — most important field)
created_at timestamp
```

## Design direction
- **Tone**: Warm, human, approachable. Like a friend's travel journal, not a corporate app.
- **Colors**: Earthy tones — warm whites, terracotta, olive green. NOT corporate blue/grey.
- **Typography**: Clean, readable. Minimal hierarchy.
- **Inspiration**: Wanderlog (simplicity), Atlas Obscura (tone and hidden gems feel), Spotted by Locals (local focus)
- **No clutter**: Every page should feel calm and focused
- **Mobile first**: Most users will browse on phone

## Environment variables needed
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=
```
These live in `.env.local` — never commit this file.

## Key principles for this project
1. **Budget first**: Every activity should show clearly if it's free or how much it costs
2. **Local first**: Local tips are as important as descriptions — always include them
3. **Simple over complex**: Build the simplest version that works, then improve
4. **Mobile friendly**: Design for phone screens first
5. **Performance**: Use Next.js image optimization, lazy load maps

## What NOT to do
- Do not add auth/login until explicitly asked
- Do not add user submission features yet
- Do not use Google Maps API (expensive) — use Leaflet + OpenStreetMap
- Do not add complex animations or heavy libraries
- Do not hardcode any API keys

## File structure preference
```
app/
  page.tsx              (landing)
  cities/
    page.tsx            (all cities)
    [city]/
      page.tsx          (city page)
      [category]/
        page.tsx        (category activities)
  activity/
    [id]/
      page.tsx          (activity detail)
components/
  ui/                   (reusable UI: Button, Card, Badge)
  maps/                 (Leaflet components)
  layout/               (Header, Footer)
lib/
  supabase.ts           (Supabase client)
  types.ts              (TypeScript interfaces)
```

## Current task
Start with the landing page. It should:
- Explain what the app is in simple, warm language
- Have a city search bar
- Show a few featured cities (just Istanbul for now)
- Communicate the "local, budget, authentic" vibe visually
- Be fully responsive