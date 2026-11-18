import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://gustavormartins.vercel.app'),
  title: { default: 'Gustavo Martins — Software & Creative Engineering', template: '%s | Gustavo Martins' },
  description: 'Projetos selecionados de engenharia de software, Linux e experiências digitais. Um portfólio com identidade Blohsh.',
  applicationName: 'BLOHSH / Gustavo Martins',
  keywords: ['desenvolvimento de software','Linux','Rust','JavaScript','Next.js','automação'],
  openGraph: { title: 'Gustavo Martins — Do problema ao código', description: 'Engenharia, software e experiências digitais em movimento.', locale: 'pt_BR', type: 'website' },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#050807' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
