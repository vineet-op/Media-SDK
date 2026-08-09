# SKILL: Using `media-ui-react` Headless Components

Use this skill when building display UI with the headless hooks from `media-ui-react`.
These hooks have zero styles and zero knowledge of Pexels — you supply all markup and CSS.

---

## Core concept: prop-getters

Every hook returns **prop-getter functions** — functions that return props to spread
onto your own HTML elements. You own the markup; the hook owns the behavior.

```tsx
// Pattern
const { getContainerProps, getItemProps } = useGrid(...);

// Usage — you write the element, you spread the props
<div {...getContainerProps()} className="my-grid">
  {items.map((item, i) => (
    <div {...getItemProps(i)} key={item.id}>
      {/* your content */}
    </div>
  ))}
</div>
```

**Rules:**
- Always spread prop-getter results — they include ARIA and ref wiring.
- You can add your own props alongside: `{...getItemProps(i)} onClick={...}` is fine.
- Never import `media-core` or `media-react` inside a component that uses these hooks.
- These hooks take plain data (counts, callbacks) — not SDK objects.

---

## 1. `useGrid` — infinite scroll grid

```tsx
import { useGrid } from 'media-ui-react';

const { getContainerProps, getItemProps, sentinelRef } = useGrid({
  itemCount: photos.length,   // how many items currently loaded
  onLoadMore: loadMore,       // called when sentinel enters viewport
  hasMore: hasMore,           // false = stop observing
});
```

### Full example

```tsx
function PhotoGrid({ photos, isLoading, hasMore, loadMore }) {
  const { getContainerProps, getItemProps, sentinelRef } = useGrid({
    itemCount: photos.length,
    onLoadMore: loadMore,
    hasMore,
  });

  return (
    <div {...getContainerProps()} className="columns-3 gap-3 p-4">
      {photos.map((photo, i) => (
        <div
          key={photo.id}
          {...getItemProps(i)}
          className="mb-3 rounded-xl overflow-hidden cursor-pointer"
        >
          <img src={photo.src.medium} alt={photo.alt} className="w-full block" />
        </div>
      ))}

      {/* Sentinel — attach sentinelRef here, not on a grid item */}
      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
}
```

**Rules:**
- `sentinelRef` must be on a DOM element that appears AFTER all items.
- `onLoadMore` must be stable (wrap with `useCallback`) to avoid rebuilding the observer.
- `hasMore: false` disconnects the observer — always pass it to avoid phantom fetches.
- `getContainerProps()` adds `role="list"`. Items get `role="listitem"` + ARIA position.

---

## 2. `useLightbox` — fullscreen overlay

```tsx
import { useLightbox } from 'media-ui-react';

const {
  isOpen, activeIndex,
  open, close, next, prev,
  getOverlayProps, getContentProps,
} = useLightbox({ itemCount: photos.length });
```

### Full example

```tsx
function Gallery({ photos }) {
  const {
    isOpen, activeIndex, open, close, next, prev,
    getOverlayProps, getContentProps,
  } = useLightbox({ itemCount: photos.length });

  return (
    <>
      {/* Grid — clicking opens lightbox at that index */}
      {photos.map((photo, i) => (
        <img
          key={photo.id}
          src={photo.src.medium}
          onClick={() => open(i)}
          style={{ cursor: 'pointer' }}
        />
      ))}

      {/* Overlay — only rendered when open */}
      {isOpen && (
        <div
          {...getOverlayProps()}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* Content — stopPropagation prevents backdrop click from closing */}
          <div {...getContentProps()}>
            <img src={photos[activeIndex]?.src.large} />
          </div>

          {/* Nav — stopPropagation required on prev/next buttons */}
          <button onClick={(e) => { e.stopPropagation(); prev(); }}>←</button>
          <button onClick={(e) => { e.stopPropagation(); next(); }}>→</button>
          <button onClick={close}>✕</button>
        </div>
      )}
    </>
  );
}
```

**Rules:**
- `getOverlayProps()` sets `onClick: close` (click backdrop = close). Always spread it.
- `getContentProps()` sets `onClick: stopPropagation`. Always spread it on the inner content div.
- Nav buttons need their own `e.stopPropagation()` — they are siblings of the content, not children.
- Keyboard (Escape closes, ←→ navigates) is wired automatically when the overlay is open.
- `tabIndex={-1}` is set by `getOverlayProps` so the overlay receives focus and keyboard events work.
- `activeIndex` wraps — next() on the last item goes to 0; prev() on 0 goes to last.

---

## 3. `useReelSwiper` — vertical snap scroll

```tsx
import { useReelSwiper } from 'media-ui-react';

const { activeIndex, getContainerProps, getItemProps } = useReelSwiper({
  itemCount: videos.length,
});
```

### Full example

```tsx
function VideoReels({ videos }) {
  const { activeIndex, getContainerProps, getItemProps } = useReelSwiper({
    itemCount: videos.length,
  });

  return (
    <div {...getContainerProps()}>
      {videos.map((video, i) => (
        <div key={video.id} {...getItemProps(i)}>
          <video
            src={video.video_files[0]?.link}
            autoPlay={i === activeIndex}   // only the active item plays
            muted loop playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  );
}
```

**Rules:**
- `getContainerProps()` injects scroll-snap CSS (`overflow-y: scroll`, `scroll-snap-type: y mandatory`, `height: 100vh`). Do not override these.
- `getItemProps(i)` injects `scroll-snap-align: start`, `height: 100vh`, `flex-shrink: 0`.
- Use `i === activeIndex` to conditionally autoplay video or apply active styles.
- `data-active="true"` is also set on the active item — usable for CSS selectors.
- Detection fires when an item is ≥ 50% visible (`threshold: 0.5`).

---

## 4. Accessibility checklist

| Hook | Built-in | You must add |
|---|---|---|
| `useGrid` | `role="list"` on container, `role="listitem"` + `aria-posinset` + `aria-setsize` on items | `alt` text on images |
| `useLightbox` | `role="dialog"`, `aria-modal`, `aria-label`, `tabIndex=-1`, Escape key | `aria-label` on nav buttons, `alt` on displayed image |
| `useReelSwiper` | `data-active`, `data-index` | `aria-label` on each reel item |

---

## 5. Styling contract

These hooks ship **zero CSS**. You are expected to provide all visual styles.
The hooks inject only functional inline styles required for behavior (scroll snap, height).
Everything else — colors, fonts, spacing, transitions — is yours.

```tsx
// Correct — you add your styles, hooks add behavior
<div {...getContainerProps()} className="my-grid-styles">

// Wrong — do not rely on any shipped visual styles
<div {...getContainerProps()}>  {/* assuming it looks good */}
```

---

## 6. Common mistakes

| Mistake | Fix |
|---|---|
| Forgetting `sentinelRef` in the grid | Infinite scroll never fires without it |
| Not spreading `getContentProps()` | Clicks on content propagate to backdrop and close the lightbox |
| Not adding `e.stopPropagation()` to prev/next buttons | Buttons close the lightbox instead of navigating |
| Overriding scroll-snap styles on the reels container | Breaks snapping behavior |
| Using `activeIndex` before `photos[activeIndex]` exists | Guard with `photos[activeIndex]?.src.large` |
| Passing `onLoadMore` without `useCallback` | Rebuilds observer on every render |
