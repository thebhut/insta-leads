import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Privacy Policy | Insta Leads",
  description: "Privacy policy and data collection guidelines for Insta Leads.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 text-slate-900">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none">
        <p><strong>Effective Date:</strong> May 10, 2026</p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
        <p>At Insta Leads, our primary function is aggregating publicly available commercial data. We do not scrape, index, or store personal, private data. All data displayed on this platform (including business names, follower counts, and public social media handles) is sourced from publicly accessible business profiles and APIs.</p>
        <p>For visitors to our website, we may collect standard analytics data (such as IP addresses, browser types, and pages visited) to improve our platform and serve relevant advertisements via Google AdSense.</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">2. Use of Cookies and Advertising</h2>
        <p>We use third-party advertising companies, including Google AdSense, to serve ads when you visit our website. These companies may use cookies (like the DoubleClick cookie) to serve ads based on your prior visits to our website or other websites on the internet.</p>
        <p>Users may opt-out of personalized advertising by visiting Google's <a href="https://www.google.com/settings/ads" target="_blank" rel="nofollow">Ads Settings</a>.</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Transparency & Removal</h2>
        <p>If you are the owner of a local business listed in our directory and wish to have your public commercial data updated or removed from our dataset, please contact our data team. We honor all verified removal requests within 7 business days.</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">4. Contact Us</h2>
        <p>For any questions regarding this privacy policy or our data practices, please contact us at <a href="mailto:privacy@instaleads.app">privacy@instaleads.app</a>.</p>
      </div>
    </div>
  );
}
