# media-native

React Native wrapper around `media-core`. Mirrors the exact API contract of `media-react`.

## Scope cut (documented)

This package is intentionally stubbed. Under time constraints, the web platform was
prioritised as the primary deliverable. The stub is here to demonstrate the intended
architecture; a full implementation would be a straight port of `media-react` with
React Native-compatible idioms.

## Intended API (identical contract to `media-react`)

```tsx
// Provider — identical shape
import { MediaProvider } from 'media-native';

<MediaProvider apiKey="your-key">
  <App />
</MediaProvider>

// Hooks — identical return shapes
import {
  usePhotoSearch,
  useCuratedPhotos,
  usePhoto,
  useVideoSearch,
  useMediaEvents,
} from 'media-native';

const { photos, isLoading, error, hasMore, loadMore } = usePhotoSearch('mountains');
const { videos } = useVideoSearch('nature');
const { photo } = usePhoto(123);
useMediaEvents('view', (e) => console.log(e));
```

## What would differ from `media-react`

- No `window`, `document`, or DOM APIs
- Uses React Native `AsyncStorage` or `MMKV` for optional persistence (not in-memory only)
- Event listeners use React Native's `AppState` for background/foreground awareness
- Import paths resolve to RN-safe modules only

## Dependency direction

```
media-native → media-core   ✅ allowed
media-native → media-react  ❌ forbidden
media-native → media-ui-*   ❌ forbidden
```
