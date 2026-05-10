import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Data Methodology | How We Track the Local Digital Economy",
  description: "Read our comprehensive data collection methodology. Learn how we scrape, verify, and rank local businesses using Google Maps and Instagram Graph APIs.",
};

export default function MethodologyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <nav className="text-sm text-slate-500 mb-8" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            <span className="mx-2">/</span>
          </li>
          <li className="text-slate-700 font-medium">Methodology</li>
        </ol>
      </nav>

      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">
          Data Methodology
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
          Transparency is a core tenet of our platform. Below is a detailed breakdown of how we aggregate, clean, and rank the data presented across our directory, trends, and lead generation pages.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b pb-2">1. Data Sourcing & Collection</h2>
          <p className="text-slate-700 mb-4">
            Our data pipelines utilize rolling scheduled scraping jobs to aggregate local business information from two primary sources:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li><strong>Location & Entity Verification:</strong> We query mapping APIs (including Google Maps endpoints) to establish a baseline of verified, physical local businesses operating within specific city parameters.</li>
            <li><strong>Social Graph Integration:</strong> We utilize social data scrapers and the Instagram API to cross-reference the physical entities with their digital footprint. We extract follower counts, engagement metrics, and bio links.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b pb-2">2. The "Digital Deficit" Classification</h2>
          <p className="text-slate-700 mb-4">
            A key metric on our platform is tracking businesses that are "Missing Websites." A business is flagged under this classification if it meets the following strict criteria:
          </p>
          <div className="bg-rose-50 p-6 rounded-lg border border-rose-100 mb-4 text-slate-800">
            <strong>Criteria for "Missing Website":</strong>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>The entity has an active, public Instagram profile.</li>
              <li>The entity has over 500 followers (proving active marketing intent).</li>
              <li>The Instagram bio URL is empty, points to a broken link, or points to a non-owned third-party aggregator (like Linktree without a primary domain).</li>
              <li>The verified Google Business Profile does not contain a valid HTTP/HTTPS web address.</li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b pb-2">3. Trending & Growth Algorithms</h2>
          <p className="text-slate-700 mb-4">
            Our <Link href="/trends" className="text-indigo-600 hover:underline">Trends</Link> pages highlight businesses experiencing explosive local growth. We calculate growth by taking automated snapshots of follower counts on a rolling 7-day and 30-day basis.
          </p>
          <p className="text-slate-700">
            <strong>Momentum Score:</strong> We use a proprietary momentum formula that heavily weights <em>recent percentage growth</em> over total historical followers. This allows newer, highly-viral local businesses to surface above older, stagnant legacy accounts.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b pb-2">4. Crawl & Update Frequency</h2>
          <p className="text-slate-700 mb-4">
            To ensure Google Discover, AI search tools, and human researchers have access to fresh data, our update system operates on a staggered schedule:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li><strong>Top 50 Cities (Tier 1):</strong> Rescanned every 48-72 hours.</li>
            <li><strong>Niche Rankings:</strong> Follower metrics are updated weekly.</li>
            <li><strong>Viral/Trending Flags:</strong> Updated daily based on our momentum sampling jobs.</li>
          </ul>
          <p className="text-slate-700 mt-4 text-sm italic">
            Note: Every data table on our platform features a "Last Updated" timestamp indicating exactly when that specific dataset was last verified against our backend.
          </p>
        </section>
      </div>
    </div>
  );
}
