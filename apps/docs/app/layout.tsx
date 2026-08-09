import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Media SDK Docs',
  description: 'Documentation for media-core, media-react, and media-ui-react',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
