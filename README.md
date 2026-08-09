# Media SDK

A headless media SDK ecosystem powered by the Pexels API.

## Architecture

```
app (apps/web)
  ├── imports media-react      → data, auth, events
  └── imports media-ui-react   → display hooks (headless)

media-react
  └── imports media-core       → PexelsClient, types

media-ui-react
  └── imports nothing from SDK → pure UI behavior only

media-core
  └── imports nothing          → zero React, zero DOM
```

Dependency direction is strictly enforced:
- `app → wrappers → core`
- `app → components`
- Components never import core or wrappers
- Core never imports React or DOM

## Packages

| Package | Role |
|---|---|
| `media-core` | Framework-agnostic Pexels client, event emitter, cache |
| `media-react` | React provider + hooks wrapping media-core |
| `media-ui-react` | Headless UI hooks (Grid, Lightbox, ReelSwiper) |
| `media-native` | React Native wrapper — stubbed, see package README |
| `media-ui-native` | Headless RN UI hooks — stubbed, see package README |
| `apps/web` | Next.js app wiring data + UI together |

## Setup

```bash
# Install dependencies
npm install

# Add your Pexels API key
echo "NEXT_PUBLIC_PEXELS_API_KEY=your_key_here" > apps/web/.env.local

# Run the app
npm run dev
```

Get a free Pexels API key at https://www.pexels.com/api/

## Skills (AI coding tool instructions)

Two skill documents live in `/skills/`:

- `SKILL-data-wiring.md` — how to set up the Provider, use hooks, handle pagination, subscribe to events
- `SKILL-ui-components.md` — how to use headless hooks, spread prop-getters, handle a11y, style components

These were written to steer AI tools (Cursor / Claude) when building UI features against this SDK.

### How the skills were tested

Both skill docs were added as Cursor rules (`.cursor/rules/`) during the build of `apps/web`.
Specifically:
- The data skill was active when writing `PhotoGrid.tsx` and `VideoReels.tsx`
- The UI skill was active when wiring `useGrid`, `useLightbox`, and `useReelSwiper` into the app
- The AI correctly avoided calling hooks conditionally, correctly spread all prop-getters,
  and correctly added `e.stopPropagation()` on nav buttons — behaviours it would otherwise miss.

## What was AI-assisted vs hand-written

| Part | How it was built |
|---|---|
| `media-core/types.ts` | Hand-written from Pexels API response inspection |
| `media-core/emitter.ts` | AI-guided, hand-written and reviewed |
| `media-core/cache.ts` | Candidate supplied the de-dupe pattern; AI formatted it |
| `media-core/client.ts` | AI-guided structure, hand-written methods |
| `media-react/context.tsx` | Hand-written; AI caught `import type` bug |
| `media-react/hooks/*.ts` | AI-guided pattern, hand-written; AI caught object-in-deps infinite loop bug |
| `media-ui-react/useGrid.ts` | AI-guided + hand-written |
| `media-ui-react/useLightbox.ts` | AI-written skeleton, candidate fixed input design bug |
| `media-ui-react/useReelSwiper.ts` | Hand-written by candidate using AI explanation |
| `apps/web` components | AI-generated, candidate reviewed and debugged |
| `skills/*.md` | Hand-written by candidate based on bugs found during build |
| This README | Hand-written |

## Scoped cuts (with rationale)

**`media-native` and `media-ui-native`** — stubbed with documented API contracts.
Reason: the web platform was the primary deliverable. The architecture is identical;
a full port would replace DOM APIs with RN equivalents (`FlatList`, `Modal`, `BackHandler`).

**Tests** — not included under time constraints. The cache de-dupe logic and event emitter
are the highest-value units to test first.

**Docs site** — the `apps/docs` Next.js app is scaffolded but not populated.
SDK reference lives in the source TypeScript types + JSDoc.
