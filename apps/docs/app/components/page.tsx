import Link from 'next/link';

export default function ComponentsPage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ marginBottom: 8 }}>
        <Link href="/" style={{ fontSize: 13, color: '#555' }}>← Home</Link>
      </div>
      <h1 style={{ marginBottom: 6 }}>UI Components</h1>
      <p style={{ color: '#666', marginBottom: 40 }}>
        <code>media-ui-react</code> — headless hooks. Zero styles, zero SDK imports.
        Bring your own markup and CSS.
      </p>

      <div style={{ background: '#0f1a0f', border: '1px solid #1a3a1a', borderRadius: 8, padding: '12px 16px', marginBottom: 32 }}>
        <span style={{ color: '#4ade80', fontWeight: 600, fontSize: 13 }}>Design principle</span>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#666' }}>
          Headless hooks return <em>prop-getter functions</em> (e.g. <code>getOverlayProps()</code>, <code>getItemProps(i)</code>)
          that you spread onto your own JSX elements. The hook owns behaviour and accessibility; you own the look.
        </p>
      </div>

      {/* useGrid */}
      <h2>useGrid</h2>
      <p>Infinite-scroll grid using <code>IntersectionObserver</code> on a sentinel element.</p>
      <pre><code>{`import { useGrid } from 'media-ui-react';

const { sentinelRef, containerProps } = useGrid({
  itemCount: photos.length,
  hasMore,
  onLoadMore: loadMore,
});

return (
  <div {...containerProps} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
    {photos.map((p) => <img key={p.id} src={p.src.medium} alt={p.alt} />)}
    <div ref={sentinelRef} />   {/* ← triggers loadMore when visible */}
  </div>
);`}</code></pre>
      <h3>Options</h3>
      <table>
        <thead><tr><th>Prop</th><th>Type</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>itemCount</td><td>number</td><td>Total items currently rendered</td></tr>
          <tr><td>hasMore</td><td>boolean</td><td>Whether more items can be loaded</td></tr>
          <tr><td>onLoadMore</td><td>() =&gt; void</td><td>Called when sentinel enters the viewport</td></tr>
        </tbody>
      </table>
      <h3>Returns</h3>
      <table>
        <thead><tr><th>Value</th><th>Type</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>sentinelRef</td><td>RefObject</td><td>Attach to a bottom element to trigger load</td></tr>
          <tr><td>containerProps</td><td>object</td><td>Spread on the scroll container</td></tr>
        </tbody>
      </table>

      {/* useLightbox */}
      <h2>useLightbox</h2>
      <p>
        Keyboard-navigable, focus-trapped overlay. Handles open/close, prev/next, <code>Escape</code> key,
        and returns prop-getters for the overlay, previous button, and next button.
      </p>
      <pre><code>{`import { useLightbox } from 'media-ui-react';

const { isOpen, activeIndex, open, close, prev, next,
        getOverlayProps, getPrevProps, getNextProps } = useLightbox({ itemCount: photos.length });

// Open on image click
<img onClick={() => open(index)} src={p.src.medium} />

// Overlay
<div {...getOverlayProps()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)' }}>
  <button {...getPrevProps()}>←</button>
  <img src={photos[activeIndex]?.src.large} />
  <button {...getNextProps()}>→</button>
</div>`}</code></pre>
      <h3>Options</h3>
      <table>
        <thead><tr><th>Prop</th><th>Type</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>itemCount</td><td>number</td><td>Total navigable items</td></tr>
        </tbody>
      </table>
      <h3>Returns</h3>
      <table>
        <thead><tr><th>Value</th><th>Type</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>isOpen</td><td>boolean</td><td>Whether the lightbox is visible</td></tr>
          <tr><td>activeIndex</td><td>number</td><td>Currently displayed item index</td></tr>
          <tr><td>open(i)</td><td>fn</td><td>Open at index i</td></tr>
          <tr><td>close()</td><td>fn</td><td>Close lightbox</td></tr>
          <tr><td>prev()</td><td>fn</td><td>Go to previous item</td></tr>
          <tr><td>next()</td><td>fn</td><td>Go to next item</td></tr>
          <tr><td>getOverlayProps()</td><td>fn → obj</td><td>Spread on overlay div (onClick → close, role="dialog")</td></tr>
          <tr><td>getPrevProps()</td><td>fn → obj</td><td>Spread on prev button (onClick → prev, stops propagation)</td></tr>
          <tr><td>getNextProps()</td><td>fn → obj</td><td>Spread on next button (onClick → next, stops propagation)</td></tr>
        </tbody>
      </table>

      {/* useReelSwiper */}
      <h2>useReelSwiper</h2>
      <p>
        Vertical snap-paging reel (like TikTok / Instagram Reels). Uses CSS <code>scroll-snap</code> for native
        scroll physics and <code>IntersectionObserver</code> to detect the active item.
      </p>
      <pre><code>{`import { useReelSwiper } from 'media-ui-react';

const { activeIndex, containerRef, getItemRef } = useReelSwiper({ itemCount: videos.length });

return (
  <div
    ref={containerRef}
    style={{
      height: '100dvh',
      overflowY: 'scroll',
      scrollSnapType: 'y mandatory',
    }}
  >
    {videos.map((v, i) => (
      <div
        key={v.id}
        ref={getItemRef(i)}
        style={{ height: '100dvh', scrollSnapAlign: 'start' }}
      >
        <video
          src={v.video_files[0]?.link}
          autoPlay={activeIndex === i}   // play only the active reel
          loop muted playsInline
        />
      </div>
    ))}
  </div>
);`}</code></pre>
      <h3>Options</h3>
      <table>
        <thead><tr><th>Prop</th><th>Type</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>itemCount</td><td>number</td><td>Total reel items</td></tr>
        </tbody>
      </table>
      <h3>Returns</h3>
      <table>
        <thead><tr><th>Value</th><th>Type</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>activeIndex</td><td>number</td><td>Index of the item currently occupying the viewport</td></tr>
          <tr><td>containerRef</td><td>RefObject</td><td>Attach to the scroll container</td></tr>
          <tr><td>getItemRef(i)</td><td>fn → RefObject</td><td>Attach to each slide element</td></tr>
        </tbody>
      </table>

      {/* Layering rule */}
      <h2>Important: Layering Rule</h2>
      <div style={{ background: '#1a0f0f', border: '1px solid #3a1a1a', borderRadius: 8, padding: '12px 16px' }}>
        <p style={{ margin: 0, fontSize: 13.5, color: '#f87171' }}>
          <strong>media-ui-react has no dependency on media-core or media-react.</strong> It only knows about
          React. This makes it reusable with any data source — Unsplash, local files, etc. Always import
          data hooks from <code>media-react</code> and UI hooks from <code>media-ui-react</code> separately,
          then wire them together in your component.
        </p>
      </div>
    </main>
  );
}
