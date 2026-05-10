import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Insta Leads - Find Local Businesses Without Websites",
    template: "%s | Insta Leads"
  },
  description: "Generate highly-qualified local business leads. Find businesses like restaurants and salons that have an active Instagram presence but no website. Perfect for web design agencies.",
  keywords: ["web design leads", "local business leads", "businesses without websites", "instagram scraper", "lead generation"],
  openGraph: {
    title: "Insta Leads - Local Leads for Web Designers",
    description: "Find local businesses that need websites. Automated lead generation from Google Maps and Instagram.",
    type: "website",
  }
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
