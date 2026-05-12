import type { Metadata } from "next";
import { Hanken_Grotesk, Libre_Caslon_Text } from "next/font/google";
import AuthProvider from "@/components/providers/SessionProvider";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
});

const libreCaslon = Libre_Caslon_Text({
  variable: "--font-libre-caslon",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "2KCUT Salon By Kamal | Precision Grooming in Galle",
  description:
    "Premium hair styling, beard sculpting, and groom packages from 2KCUT Salon By Kamal in Galle, Sri Lanka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    "name": "2KCUT Salon By Kamal",
    "image": "https://2kcut.com/images/2kcut-logo.png",
    "@id": "https://2kcut.com",
    "url": "https://2kcut.com",
    "telephone": "0777603514",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "No: 25 B3 Richmond Hill Road",
      "addressLocality": "Galle",
      "postalCode": "80000",
      "addressCountry": "LK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 6.038332017049708,
      "longitude": 80.20869087550312
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:30",
        "closes": "21:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/p/2KCUT-SALON-BY-KAMAL-100063768745111/",
      "https://www.instagram.com/2kcut/"
    ]
  };

  return (
    <html
      lang="en"
      className={`${hankenGrotesk.variable} ${libreCaslon.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
