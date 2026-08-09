# SKILL: Wiring Data with `media-react`

Use this skill when building any UI feature that needs photos or videos from Pexels.
It teaches you how to set up auth, access data, handle pagination, and subscribe to events.

---

## 1. Provider setup (do this once at the app root)

Always wrap the app in `<MediaProvider>`. It creates the `PexelsClient` instance and
puts it in React Context. Every hook below requires it to be present.

```tsx
// app/layout.tsx or app/providers.tsx — must be a Client Component
'use client';
import { MediaProvider } from 'media-react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MediaProvider apiKey={process.env.NEXT_PUBLIC_PEXELS_API_KEY ?? ''}>
      {children}
    </MediaProvider>
  );
}
```

**Rules:**
- API key comes from an environment variable — never hardcode it.
- `MediaProvider` is a Client Component (uses React Context). Wrap it in `'use client'`.
- Only one `MediaProvider` per app. Do not nest them.

---

## 2. Available hooks

| Hook | Purpose | Returns |
|---|---|---|
| `usePhotoSearch(query, perPage?)` | Search photos by keyword | `{ photos, isLoading, error, hasMore, loadMore }` |
| `useCuratedPhotos(perPage?)` | Trending/curated photo feed | `{ photos, isLoading, error, hasMore, loadMore }` |
| `usePhoto(id)` | Single photo by ID | `{ photo, isLoading, error }` |
| `useVideoSearch(query, perPage?)` | Search videos by keyword | `{ videos, isLoading, error, hasMore, loadMore }` |
| `useMediaEvents(event, listener)` | Subscribe to SDK events | `void` |
| `useMediaClient()` | Direct access to PexelsClient | `PexelsClient` |

---

## 3. Searching photos

```tsx
'use client';
import { usePhotoSearch } from 'media-react';

export function PhotoResults({ query }: { query: string }) {
  const { photos, isLoading, error, hasMore, loadMore } = usePhotoSearch(query);

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {photos.map((photo) => (
        <img key={photo.id} src={photo.src.medium} alt={photo.alt} />
      ))}
      {isLoading && <p>Loading...</p>}
      {hasMore && <button onClick={loadMore}>Load more</button>}
    </>
  );
}
```

**Rules:**
- `photos` is always an array (never null/undefined). Safe to map immediately.
- `loadMore` appends to the existing list — it does NOT replace it.
- When `query` changes, the hook resets to page 1 automatically.
- `hasMore` is false when all results are loaded — stop showing load-more UI.

---

## 4. Curated / trending feed (no query needed)

```tsx
import { useCuratedPhotos } from 'media-react';

const { photos, loadMore, hasMore } = useCuratedPhotos();
```

Same shape as `usePhotoSearch`. No query argument. Pagination works identically.

---

## 5. Single photo (for detail view / lightbox data)

```tsx
import { usePhoto } from 'media-react';

export function PhotoDetail({ id }: { id: number }) {
  const { photo, isLoading } = usePhoto(id);
  if (!photo) return null;
  return <img src={photo.src.large} alt={photo.alt} />;
}
```

**Note:** `usePhoto` emits a `'view'` event automatically on success.

---

## 6. Video search

```tsx
import { useVideoSearch } from 'media-react';

const { videos, isLoading, error, hasMore, loadMore } = useVideoSearch('nature');
```

Each `video` has a `video_files` array. Pick the right file:

```tsx
const mp4 = video.video_files.find(
  (f) => f.file_type === 'video/mp4' && f.quality === 'sd' && f.width
);
// mp4.link is the playable URL
```

---

## 7. Subscribing to SDK events

The SDK emits `'view'` and `'download'` events. Use `useMediaEvents` to react to them.
It auto-unsubscribes when the component unmounts — no cleanup needed.

```tsx
import { useMediaEvents } from 'media-react';

function ActivityTracker() {
  const [last, setLast] = useState<string | null>(null);

  useMediaEvents('view', (e) => {
    setLast(`Viewed ${e.type} #${e.id}`);
  });

  useMediaEvents('download', (e) => {
    setLast(`Downloaded ${e.type} #${e.id}`);
  });

  return last ? <div>{last}</div> : null;
}
```

**Rules:**
- Do not call `useMediaEvents` conditionally — it is a hook.
- The listener must be stable (use `useCallback` if defined outside the hook call).
- A default console listener is always active in `media-core` — yours is additive.

---

## 8. Emitting a download event manually

When the user clicks a download link, call `trackDownload` via `useMediaClient`:

```tsx
import { useMediaClient } from 'media-react';

function DownloadButton({ photo }: { photo: Photo }) {
  const client = useMediaClient();

  return (
    <a
      href={photo.src.original}
      download
      onClick={() => client.trackDownload(photo.id, 'photo', photo.src.original)}
    >
      Download
    </a>
  );
}
```

---

## 9. Common mistakes to avoid

| Mistake | Fix |
|---|---|
| Calling `usePhotoSearch` conditionally | Always call both hooks; pick the result with a ternary |
| Passing an object as a hook param that changes every render | Destructure to primitives; never pass `{}` directly |
| Using `useMediaClient` outside `<MediaProvider>` | Will throw — ensure Provider wraps the component tree |
| Importing from `media-core` directly in a component | Only `media-react` and `media-ui-react` belong in components |
| Hardcoding the API key | Use `NEXT_PUBLIC_PEXELS_API_KEY` env var |

---

## 10. Type reference

```ts
import type { Photo, Video, VideoFile, SDKEventMap } from 'media-core';

// Photo.src keys: original, large2x, large, medium, small, portrait, landscape, tiny
// Video.video_files[n]: { quality: 'hd'|'sd'|'hls', file_type, width, height, link }
// SDKEventMap: { view: { id, type }, download: { id, type, url } }
```
