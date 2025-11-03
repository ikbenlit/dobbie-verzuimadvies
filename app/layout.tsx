import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'DOBbie | 24/7 AI Verzuimadvies voor Leidinggevenden',
  description: 'Direct verzuimadvies voor leidinggevenden. DOBbie AI-assistent gebaseerd op WVP & NVAB richtlijnen. ✓ 24/7 beschikbaar ✓ Juridisch onderbouwd ✓ Probeer gratis',
  keywords: ['verzuimbegeleiding', 'leidinggevenden', 'AI verzuimadvies', 'WVP proces', 'NVAB richtlijnen', 'bedrijfsarts', 're-integratie', 'verzuimgesprek'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'DOBbie | 24/7 AI Verzuimadvies voor Leidinggevenden',
    description: 'Direct verzuimadvies voor leidinggevenden. Gebaseerd op WVP & NVAB richtlijnen. Probeer gratis.',
    type: 'website',
    locale: 'nl_NL',
  },
};

export const viewport: Viewport = {
  themeColor: '#771138',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
                document.documentElement.classList.toggle('dark', theme === 'dark');
              })();
            `,
          }}
        />
      </head>
      <body className="bg-cream" data-sveltekit-preload-data="hover">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
