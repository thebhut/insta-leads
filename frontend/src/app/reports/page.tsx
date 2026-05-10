import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Data Reports & Statistics | Local Digital Economy",
  description: "Explore our published reports and datasets analyzing Instagram adoption, digital deficits, and local business trends across the United States.",
};

export default function ReportsIndexPage() {
  const reports = [
    {
      title: "US Cities with the Most Businesses Missing Websites",
      slug: "top-us-cities-without-websites",
      date: "May 2026",
      category: "Digital Deficit",
      description: "We analyzed local businesses across top US cities to discover which cities have the highest percentage of Instagram-active businesses operating without a dedicated website.",
      isNew: true
    },
    {
      title: "2026 Restaurant Instagram Adoption Report",
      slug: "#", // Placeholder for future report
      date: "April 2026",
      category: "Industry Analysis",
      description: "An in-depth look at how the food and beverage industry has shifted almost entirely to visual social media for customer acquisition.",
      isNew: false
    },
    {
      title: "The Rise of Social-First Salons & Spas",
      slug: "#", // Placeholder for future report
      date: "March 2026",
      category: "Industry Analysis",
      description: "Why health and beauty businesses are abandoning traditional websites in favor of Instagram booking integrations.",
      isNew: false
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">
          Data Reports & Statistics
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Authoritative research, datasets, and industry analysis on the state of the local digital economy. Built for researchers, agencies, and journalists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reports.map((report, idx) => (
          <Link 
            key={idx} 
            href={report.slug !== '#' ? `/reports/${report.slug}` : '#'}
            className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative"
          >
            {report.isNew && (
              <div className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                New
              </div>
            )}
            <div className="p-8 flex flex-col h-full">
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">
                {report.category} • {report.date}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                {report.title}
              </h2>
              <p className="text-slate-600 text-sm flex-grow mb-6">
                {report.description}
              </p>
              <div className="text-sm font-semibold text-slate-900 flex items-center mt-auto">
                Read Report <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-20 bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Need a Custom Dataset?</h3>
        <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
          We provide custom data exports for journalists, researchers, and enterprise teams. If you need specific geographic or niche cuts of our database, please contact our data team.
        </p>
        <a href="mailto:data@instaleads.app" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          Contact Data Team
        </a>
      </div>
    </div>
  );
}
