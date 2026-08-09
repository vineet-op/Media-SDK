# media-ui-native

Headless React Native UI component library. Mirrors the exact API contract of `media-ui-react`.

**Zero imports from `media-core` or `media-native`.** Takes data and callbacks as props only.

## Scope cut (documented)

Intentionally stubbed under time constraints. The web components were prioritised.
The architecture is identical — only the underlying primitives differ (RN `ScrollView`,
`FlatList`, `Pressable` instead of DOM elements).

## Intended API (identical contract to `media-ui-react`)

```tsx
// useGrid — FlatList-based with onEndReached
import { useGrid } from 'media-ui-native';

const { getListProps, getItemProps } = useGrid({
  itemCount: photos.length,
  onLoadMore: loadMore,
  hasMore,
});

<FlatList {...getListProps()} ... />

// useLightbox — Modal-based, hardware back button support
import { useLightbox } from 'media-ui-native';

const { isOpen, activeIndex, open, close, next, prev } = useLightbox({ itemCount: photos.length });

// useReelSwiper — FlatList pagingEnabled vertical
import { useReelSwiper } from 'media-ui-native';

const { activeIndex, getContainerProps, getItemProps } = useReelSwiper({ itemCount: videos.length });
```

## What would differ from `media-ui-react`

- `useGrid` uses `FlatList` `onEndReached` instead of `IntersectionObserver`
- `useLightbox` uses `Modal` + Android `BackHandler` instead of `keydown`
- `useReelSwiper` uses `FlatList` with `pagingEnabled` + `onViewableItemsChanged`
- No CSS — style props and `StyleSheet` only

## Dependency direction

```
media-ui-native → media-core    ❌ forbidden
media-ui-native → media-native  ❌ forbidden
media-ui-native → media-react   ❌ forbidden
```
