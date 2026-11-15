import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://lanka-meet1.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lanka Meet | Sri Lanka Personal Ads & Friendship",
    template: "%s | Lanka Meet",
  },
  description:
    "Discover personal ads, friendship connections, marriage ads and social connections across Sri Lanka on Lanka Meet. Browse listings and connect responsibly.",
  applicationName: "Lanka Meet",
  keywords: [
    "Lanka Meet",
    "Sri Lanka personal ads",
    "Sri Lanka friendship ads",
    "Sri Lanka marriage ads",
    "personal ads Sri Lanka",
    "friendship Sri Lanka",
    "Sri Lanka social connections",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_LK",
    url: siteUrl,
    siteName: "Lanka Meet",
    title: "Lanka Meet | Sri Lanka Personal Ads & Friendship",
    description:
      "Explore personal ads, friendship listings and social connections across Sri Lanka.",
  },
  twitter: {
    card: "summary",
    title: "Lanka Meet | Sri Lanka Personal Ads & Friendship",
    description:
      "Explore personal ads, friendship listings and social connections across Sri Lanka.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
