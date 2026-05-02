import './globals.css';
import type { Metadata } from 'next';
import { Archivo_Black, Space_Grotesk, Playfair_Display, Inter, JetBrains_Mono, DM_Sans, Fraunces } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';

const archivo = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-archivo-black',
  display: 'swap',
});
const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});
const dmsans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmsans',
  display: 'swap',
});
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BioFlowzy — Sua bio, seu link, seu universo',
  description: 'Plataforma brutalista de bio links. Compartilhe tudo em um só lugar.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${grotesk.variable} ${playfair.variable} ${inter.variable} ${jetbrains.variable} ${dmsans.variable} ${fraunces.variable}`}>
      <body className="antialiased bg-white text-black"><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
