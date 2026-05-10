import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service & Disclaimer | Insta Leads",
  description: "Terms of service and data accuracy disclaimer for Insta Leads platform.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 text-slate-900">Terms & Disclaimer</h1>
      <div className="prose prose-slate max-w-none">
        
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Data Accuracy Disclaimer</h2>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8 rounded-r-lg text-amber-900">
          <p className="m-0 font-medium">Insta Leads aggregates data from third-party APIs (including mapping services and social networks). While we strive for high accuracy through our scheduled rolling updates, <strong>we cannot guarantee the real-time accuracy, completeness, or reliability of follower counts, business statuses, or digital infrastructure metrics.</strong></p>
          <p className="mt-4 mb-0 font-medium">Datasets marked as "Sample Dataset" or "Demo Preview" utilize algorithmic modeling for UI demonstration purposes while our backend scrapers queue real data. Do not use sample datasets for financial or investment decisions.</p>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">2. Acceptable Use</h2>
        <p>You agree to use the data provided by Insta Leads solely for lawful B2B research, marketing analysis, and local search discovery. You may not use automated scrapers to mass-download our datasets. For bulk data access, please contact our data team.</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">3. Third-Party Links & Ads</h2>
        <p>Our platform contains links to third-party websites (e.g., Instagram profiles) and serves advertisements via Google AdSense. We do not endorse the businesses listed in our directory, nor are we responsible for the content of external websites or advertisements.</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">4. Limitation of Liability</h2>
        <p>Insta Leads shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of our datasets.</p>
      </div>
    </div>
  );
}
