import Link from 'next/link';

export default function SDKPage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ marginBottom: 8 }}>
        <Link href="/" style={{ fontSize: 13, color: '#555' }}>← Home</Link>
      </div>
      <h1 style={{ marginBottom: 6 }}>SDK Reference</h1>
      <p style={{ color: '#666', marginBottom: 40 }}>
        <code>media-core</code> &amp; <code>media-react</code> — data layer, API client, hooks.
      </p>

      {/* Packages overview */}
      <h2>Packages</h2>
      <table>
        <thead><tr><th>Package</th><th>Role</th><th>Depends on</th></tr></thead>
        <tbody>
          <tr><td><code>media-core</code></td><td>Framework-agnostic Pexels client, emitter, cache</td><td>—</td></tr>
          <tr><td><code>media-react</code></td><td>React Context + hooks wrapping media-core</td><td>media-core, react</td></tr>
          <tr><td><code>media-native</code></td><td>React Native wrapper (stub, mirrors media-react API)</td><td>media-core, react-native</td></tr>
        </tbody>
      </table>

      {/* PexelsClient */}
      <h2>PexelsClient</h2>
      <p>The core client. Handles auth headers, in-memory caching (TTL 5 min), request de-duplication, and event emission.</p>
      <pre><code>{`import { PexelsClient } from 'media-core';

const client = new PexelsClient({ apiKey: 'YOUR_KEY' });

// Photos
const photos = await client.searchPhotos('nature', { page: 1, perPage: 15 });
const curated = await client.getCuratedPhotos({ page: 1, perPage: 15 });
const photo   = await client.getPhoto(12345);

// Videos
const videos = await client.searchVideos('ocean', { page: 1, perPage: 10 });
const video  = await client.getVideo(67890);

// Events
client.trackDownload(photo.id, 'photo', photo.src.original);

// Housekeeping
client.clearCache();`}</code></pre>

      <h3>Constructor</h3>
      <table>
        <thead><tr><th>Option</th><th>Type</th><th>Required</th></tr></thead>
        <tbody>
          <tr><td>apiKey</td><td>string</td><td>Yes</td></tr>
          <tr><td>cacheTtlMs</td><td>number</td><td>No (default 300 000)</td></tr>
        </tbody>
      </table>

      {/* Caching */}
      <h2>Cache &amp; De-duplication</h2>
      <p>
        Every API response is stored in a <code>Map</code> keyed by URL + params. Identical in-flight requests are
        collapsed into one — the second caller awaits the same <code>Promise</code>. Cached entries expire after
        5 minutes by default.
      </p>

      {/* EventEmitter */}
      <h2>EventEmitter</h2>
      <p>A tiny typed pub/sub that lives inside <code>PexelsClient</code>. Two events are defined:</p>
      <table>
        <thead><tr><th>Event</th><th>Payload</th><th>When fired</th></tr></thead>
        <tbody>
          <tr><td><code>view</code></td><td><code>{'{ id, type }'}</code></td><td>Automatically on photo/video fetch</td></tr>
          <tr><td><code>download</code></td><td><code>{'{ id, type, url }'}</code></td><td>Manually via <code>trackDownload()</code></td></tr>
        </tbody>
      </table>

      {/* React hooks */}
      <h2>React Hooks (media-react)</h2>
      <p>Wrap your app with <code>MediaProvider</code> once, then use hooks anywhere inside.</p>
      <pre><code>{`// app/providers.tsx
'use client';
import { MediaProvider } from 'media-react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MediaProvider apiKey={process.env.NEXT_PUBLIC_PEXELS_API_KEY!}>
      {children}
    </MediaProvider>
  );
}`}</code></pre>

      <h3>usePhotoSearch</h3>
      <pre><code>{`const { photos, loading, error, hasMore, loadMore } = usePhotoSearch(query);`}</code></pre>
      <table>
        <thead><tr><th>Return</th><th>Type</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>photos</td><td>Photo[]</td><td>Accumulated results (all pages loaded so far)</td></tr>
          <tr><td>loading</td><td>boolean</td><td>True while a page is being fetched</td></tr>
          <tr><td>error</td><td>string | null</td><td>Last error message, if any</td></tr>
          <tr><td>hasMore</td><td>boolean</td><td>False when Pexels has no more pages</td></tr>
          <tr><td>loadMore</td><td>() =&gt; void</td><td>Fetch the next page; pass to useGrid</td></tr>
        </tbody>
      </table>

      <h3>useCuratedPhotos</h3>
      <pre><code>{`const { photos, loading, error, hasMore, loadMore } = useCuratedPhotos();`}</code></pre>
      <p>Same shape as <code>usePhotoSearch</code>. No query argument needed.</p>

      <h3>useVideoSearch</h3>
      <pre><code>{`const { videos, loading, error, hasMore, loadMore } = useVideoSearch(query);`}</code></pre>

      <h3>usePhoto</h3>
      <pre><code>{`const { photo, loading, error } = usePhoto(id);`}</code></pre>

      <h3>useMediaEvents</h3>
      <pre><code>{`import { useMediaEvents } from 'media-react';

useMediaEvents('download', ({ id, type, url }) => {
  console.log(\`Downloaded \${type} #\${id}\`);
});`}</code></pre>
      <p>Subscribe to SDK events inside any component. Listener is automatically removed on unmount.</p>

      <h2>Types</h2>
      <pre><code>{`interface Photo {
  id: number;
  width: number;
  height: number;
  url: string;           // Pexels page URL
  photographer: string;
  photographer_url: string;
  src: PhotoSrc;         // .original | .large | .medium | .small | .tiny
  alt: string;
}

interface Video {
  id: number;
  width: number;
  height: number;
  url: string;
  video_files: VideoFile[];
  video_pictures: VideoPicture[];
  user: { name: string; url: string };
}

type SDKEventMap = {
  view:     { id: number; type: 'photo' | 'video' };
  download: { id: number; type: 'photo' | 'video'; url: string };
};`}</code></pre>
    </main>
  );
}
