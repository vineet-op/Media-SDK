import Link from 'next/link';

export default function SkillsPage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ marginBottom: 8 }}>
        <Link href="/" style={{ fontSize: 13, color: '#555' }}>← Home</Link>
      </div>
      <h1 style={{ marginBottom: 6 }}>AI Skills</h1>
      <p style={{ color: '#666', marginBottom: 40 }}>
        Two <code>SKILL.md</code> documents that steer AI coding assistants (Cursor, Copilot, Claude) to use this SDK correctly without hand-holding.
      </p>

      <div style={{ background: '#0f0f1a', border: '1px solid #1a1a3a', borderRadius: 8, padding: '12px 16px', marginBottom: 32, fontSize: 13 }}>
        <span style={{ color: '#a78bfa', fontWeight: 600 }}>What is a SKILL.md?</span>
        <p style={{ margin: '4px 0 0', color: '#666' }}>
          A markdown file placed in <code>skills/</code> and referenced in <code>.cursor/rules/</code>.
          When the AI edits a file matching the glob pattern, it reads the skill first — giving it
          domain knowledge about your SDK before it writes a single line of code.
        </p>
      </div>

      {/* Skill 1 */}
      <h2>SKILL-data-wiring.md</h2>
      <p>Teaches AI how to wire data into components using <code>media-react</code> hooks.</p>

      <h3>What it covers</h3>
      <ul>
        <li>How to wrap the app with <code>MediaProvider</code> (one instance, at the root)</li>
        <li>Which hook to use for each use-case (search vs curated, photo vs video)</li>
        <li>How pagination + infinite scroll works (<code>loadMore</code> + <code>hasMore</code>)</li>
        <li>How to subscribe to SDK events with <code>useMediaEvents</code></li>
        <li>Common pitfalls — conditional hook calls, missing provider, wrong import path</li>
      </ul>

      <h3>Glob trigger</h3>
      <pre><code>{`# .cursor/rules/media-sdk.mdc
globs: apps/**/*.tsx, apps/**/*.ts`}</code></pre>

      <h3>Example prompt the skill changes</h3>
      <pre><code>{`// Without skill — AI might write:
const [photos, setPhotos] = useState([]);
useEffect(() => { fetch('https://api.pexels.com/...').then(...) }, []);

// With skill — AI writes:
const { photos, loading, hasMore, loadMore } = usePhotoSearch(query);`}</code></pre>

      {/* Skill 2 */}
      <h2 style={{ marginTop: 48 }}>SKILL-ui-components.md</h2>
      <p>Teaches AI how to use <code>media-ui-react</code> headless hooks — the prop-getter pattern.</p>

      <h3>What it covers</h3>
      <ul>
        <li>The prop-getter pattern: <em>spread the object returned by <code>getXxxProps()</code> onto your JSX</em></li>
        <li>How to build a lightbox with <code>useLightbox</code> — overlay, nav buttons, keyboard, focus</li>
        <li>How to build an infinite-scroll grid with <code>useGrid</code> + sentinel ref</li>
        <li>How to build a vertical reel with <code>useReelSwiper</code> + CSS scroll-snap</li>
        <li>Layering rule: <strong>never import from media-core/media-react inside media-ui-react</strong></li>
        <li>Accessibility: <code>role="dialog"</code>, <code>aria-modal</code>, keyboard nav all come from prop-getters</li>
      </ul>

      <h3>Prop-getter pattern at a glance</h3>
      <pre><code>{`// ✅ Correct — spread the prop-getter
<div {...getOverlayProps()}>
  <button {...getPrevProps()}>←</button>
  <button {...getNextProps()}>→</button>
</div>

// ❌ Wrong — wiring manually breaks keyboard/a11y
<div onClick={close}>
  <button onClick={(e) => { e.stopPropagation(); prev(); }}>←</button>
</div>`}</code></pre>

      {/* File locations */}
      <h2 style={{ marginTop: 48 }}>File Locations</h2>
      <pre><code>{`media-sdk/
├── skills/
│   ├── SKILL-data-wiring.md      ← SDK data hooks skill
│   └── SKILL-ui-components.md   ← headless UI hooks skill
└── .cursor/
    └── rules/
        └── media-sdk.mdc         ← activates both skills for apps/**`}</code></pre>

      <h2>Quality bar</h2>
      <p>
        Good skill docs change AI output on the first try — no generic advice like "use React hooks",
        but specific guidance like "call <code>usePhotoSearch(query)</code> and pass its <code>loadMore</code>
        directly to <code>useGrid</code>'s <code>onLoadMore</code> prop". The skills in this repo were written
        from actual bugs encountered during development (conditional hook calls, missing stopPropagation,
        wrong import paths) so they prevent real mistakes, not hypothetical ones.
      </p>
    </main>
  );
}
