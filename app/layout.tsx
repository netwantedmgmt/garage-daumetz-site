import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Garage D'Aumetz — Mécanique & entretien à Aumetz (57)",
  description:
    "Garage automobile indépendant à Aumetz, Moselle. Devis clair, réservation en ligne, travail garanti. Toutes marques.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${archivo.variable} ${inter.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
