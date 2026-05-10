import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "About Insta Leads | Local Digital Economy Intelligence",
  description: "Learn about our mission to map the local digital economy. We provide transparent, real-time data on local business adoption of digital infrastructure.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">
          Mapping the Local Digital Economy
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Insta Leads is the definitive intelligence platform tracking how local businesses adopt, utilize, and grow through digital infrastructure.
        </p>
      </div>

      <div className="prose prose-lg prose-slate max-w-none">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
        <p>
          We believe that understanding the local digital economy shouldn't require expensive enterprise software. Our mission is to democratize business intelligence by mapping the digital footprint of millions of local businesses across the United States. 
        </p>
        <p>
          Whether you are a journalist looking for data on Instagram dependency, an agency analyzing local market gaps, or a researcher studying digital adoption, our datasets provide a real-time pulse on the state of local commerce.
        </p>

        <div className="bg-slate-50 border-l-4 border-indigo-500 p-8 my-12 rounded-r-2xl">
          <h3 className="text-2xl font-bold text-slate-900 mt-0 mb-4">Editorial & Data Standards</h3>
          <ul className="space-y-4 m-0 p-0 list-none">
            <li className="flex items-start">
              <span className="text-indigo-500 mr-3 text-xl">✓</span>
              <span><strong>Transparency:</strong> We clearly document how our data is collected, parsed, and updated. See our <Link href="/methodology" className="text-indigo-600 font-semibold hover:underline">Methodology page</Link>.</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-3 text-xl">✓</span>
              <span><strong>Accuracy over Scale:</strong> We prioritize accurate, live data over generating millions of low-quality pages. Our data pipelines run weekly rolling updates.</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-3 text-xl">✓</span>
              <span><strong>Privacy First:</strong> We only track publicly available, commercial business data. We do not track private individual accounts or personal metrics.</span>
            </li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-6">Who Uses Our Data?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2">Web & Digital Agencies</h4>
            <p className="text-slate-600 text-sm m-0">Agencies use our "Digital Deficit" datasets to identify local businesses that have massive social followings but lack critical web infrastructure like proper websites.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2">Local Researchers</h4>
            <p className="text-slate-600 text-sm m-0">Economic researchers and journalists use our geographic trend data to understand which cities and industries are leading the shift to social-first commerce.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-6">Contact & Accountability</h2>
        <p>
          We are committed to maintaining the highest standards of data integrity. If you are a journalist looking for specific datasets, or a user who has spotted an anomaly in our rankings, please reach out to our data operations team.
        </p>
        <p className="font-semibold text-slate-900">
          Email: <a href="mailto:data@instaleads.app" className="text-indigo-600 hover:underline">data@instaleads.app</a><br/>
          HQ: Austin, Texas
        </p>
      </div>
    </div>
  );
}
