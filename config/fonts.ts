import {
  Cinzel,
  Fira_Code as FontMono,
  Inter as FontSans,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

/** Fonte temática Kingdom Hearts - estilo medieval/fantasia */
export const fontKH = Cinzel({
  subsets: ["latin"],
  variable: "--font-kh",
  weight: ["400", "600", "700"],
});
