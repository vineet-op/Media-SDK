'use client';

import { MediaProvider } from 'media-react';

const apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY ?? '';

export function Providers({ children }: { children: React.ReactNode }) {
  if (!apiKey) {
    return (
      <div style={{ padding: 32, color: 'red' }}>
        Missing NEXT_PUBLIC_PEXELS_API_KEY in .env.local
      </div>
    );
  }
  return <MediaProvider apiKey={apiKey}>{children}</MediaProvider>;
}
