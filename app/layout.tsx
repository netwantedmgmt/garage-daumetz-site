import type { Metadata } from "next";
import { Anton, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = Space_Mono({
  variable: "--font-mono-src",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Garage D'Aumetz — Mécanique & entretien à Aumetz (57)",
  description:
    "Garage automobile indépendant à Aumetz, Moselle. Devis clair, réservation en ligne, travail garanti. Toutes marques.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${anton.variable} ${grotesk.variable} ${mono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
