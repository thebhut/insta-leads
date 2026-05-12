import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE_HERE", // Replace with your code from Search Console
  },
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
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-B3KLLNDEV8`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-B3KLLNDEV8');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
