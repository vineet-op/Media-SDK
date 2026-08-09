import Link from 'next/link';

const NAV = [
  { href: '/sdk', label: 'SDK Reference', desc: 'media-core — PexelsClient, events, cache, types', badge: 'Core' },
  { href: '/components', label: 'Components', desc: 'media-ui-react — useGrid, useLightbox, useReelSwiper (headless)', badge: 'UI' },
  { href: '/skills', label: 'AI Skills', desc: 'Skill docs that steer AI tools to use this SDK correctly', badge: 'Skills' },
];

export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}>
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 32 }}>📦</span>
          <h1>Media SDK</h1>
        </div>
        <p style={{ fontSize: 17, color: '#888', maxWidth: 520 }}>
          A headless media SDK ecosystem. Framework-agnostic core, thin React wrappers,
          and a pure headless UI component library — all powered by Pexels.
        </p>
      </div>

      {/* Architecture diagram */}
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: 24, marginBottom: 48, fontFamily: 'monospace', fontSize: 13, color: '#777', lineHeight: 2 }}>
        <div style={{ color: '#aaa' }}>app (apps/web)</div>
        <div style={{ paddingLeft: 16 }}>├── <span style={{ color: '#7dd3fc' }}>media-react</span> <span style={{ color: '#555' }}>→ data, auth, events</span></div>
        <div style={{ paddingLeft: 16 }}>└── <span style={{ color: '#a78bfa' }}>media-ui-react</span> <span style={{ color: '#555' }}>→ headless UI hooks</span></div>
        <div style={{ marginTop: 8, color: '#aaa' }}>media-react</div>
        <div style={{ paddingLeft: 16 }}>└── <span style={{ color: '#4ade80' }}>media-core</span> <span style={{ color: '#555' }}>→ PexelsClient, emitter, cache</span></div>
        <div style={{ marginTop: 8, color: '#aaa' }}>media-ui-react</div>
        <div style={{ paddingLeft: 16 }}>└── <span style={{ color: '#555' }}>no SDK imports — pure UI behavior</span></div>
      </div>

      {/* Nav cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {NAV.map(({ href, label, desc, badge }) => (
          <Link key={href} href={href} style={{
            display: 'block', padding: '20px 24px',
            background: '#111', border: '1px solid #222', borderRadius: 12,
            transition: 'border-color 0.15s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontWeight: 600, color: '#fff', fontSize: 16 }}>{label}</span>
              <span className="badge">{badge}</span>
            </div>
            <p style={{ margin: 0, fontSize: 13.5, color: '#666' }}>{desc}</p>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #1e1e1e', display: 'flex', gap: 24, fontSize: 13, color: '#555' }}>
        <a href="https://github.com/vineet-op/Media-SDK" target="_blank" rel="noopener">GitHub</a>
        <a href="https://www.pexels.com/api/" target="_blank" rel="noopener">Pexels API</a>
      </div>
    </main>
  );
}
