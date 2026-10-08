import type { Metadata } from 'next';
import { Playfair_Display, EB_Garamond, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
});

const garamond = EB_Garamond({
  variable: '--font-garamond',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Menfess Studio — Buat Gambar Menfess Profesional',
  description:
    'Aplikasi online untuk membuat gambar menfess berkualitas tinggi dengan berbagai template desain. Pilih template, tulis pesan, dan download PNG 1080×1080 secara gratis.',
  keywords: ['menfess', 'menfess generator', 'buat menfess', 'gambar menfess', 'menfess studio'],
  openGraph: {
    title: 'Menfess Studio',
    description: 'Buat gambar menfess profesional dengan mudah dan cepat.',
    type: 'website',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${garamond.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
