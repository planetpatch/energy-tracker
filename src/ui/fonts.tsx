import { Gemunu_Libre, Press_Start_2P } from 'next/font/google';

export const gemunuLibre = Gemunu_Libre({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-gemunu-libre',
  display: 'swap',
});

// --- ADDITION FOR PIXEL FONT ---
export const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: ['400'], // This font only has one weight
  variable: '--font-press-start-2p',
  display: 'swap',
});