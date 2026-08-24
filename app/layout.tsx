import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE, FAQ, RATING, REVIEWS } from "./site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Garage D'Aumetz — Garage & mécanique auto à Aumetz (57)",
  description:
    "Garage automobile indépendant à Aumetz (Moselle). Devis clair en 2 minutes, prix respecté, travail garanti 1 an. Toutes marques : vidange, freinage, distribution, diagnostic, pneus.",
  keywords: [
    "garage Aumetz", "mécanique Aumetz", "garage automobile 57710", "vidange Aumetz",
    "freinage Aumetz", "diagnostic auto Moselle", "pneus Aumetz", "garage indépendant Moselle",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE.url,
    siteName: SITE.name,
    title: "Garage D'Aumetz — Garage & mécanique auto à Aumetz (57)",
    description:
      "Devis clair en 2 minutes, prix respecté, travail garanti 1 an. Toutes marques, à Aumetz (Moselle).",
    images: [{ url: "/photos/hero.jpg", width: 1100, height: 1320, alt: "Garage D'Aumetz" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AutoRepair",
      "@id": `${SITE.url}/#business`,
      name: SITE.name,
      image: `${SITE.url}/photos/hero.jpg`,
      url: SITE.url,
      telephone: SITE.phoneTel,
      email: SITE.email,
      priceRange: "€€",
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.street,
        postalCode: SITE.postalCode,
        addressLocality: SITE.city,
        addressRegion: SITE.region,
        addressCountry: SITE.country,
      },
      geo: { "@type": "GeoCoordinates", latitude: SITE.lat, longitude: SITE.lng },
      areaServed: [SITE.city, "Moselle", "Audun-le-Tiche", "Boulange", "Fontoy"],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: RATING.value,
        reviewCount: RATING.count,
        bestRating: 5,
        worstRating: 1,
      },
      review: REVIEWS.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.name },
        reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
        reviewBody: r.text,
      })),
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:30", closes: "12:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "14:00", closes: "18:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "12:00" },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE.url}/#faq`,
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
