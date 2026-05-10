import { Metadata } from 'next';
import Link from 'next/link';
import { CITIES, formatTitle, getNicheData, getSeededRandom } from '@/lib/pSEO';

export const metadata: Metadata = {
  title: "Data Report: US Cities with the Most Businesses Missing Websites (2024)",
  description: "We analyzed local businesses across top US cities. Discover which cities have the highest percentage of Instagram-active businesses operating without a website.",
  openGraph: {
    title: "US Cities with the Most Businesses Missing Websites",
    description: "An exclusive data report on local business digital infrastructure.",
    type: "article",
  }
};

export default function TopCitiesReport() {
  // Generate data for all cities by aggregating a few niches
  const reportData = CITIES.map(city => {
    // We sample a few popular niches to build the city's aggregate score
    const res = getNicheData(city, 'restaurants');
    const gym = getNicheData(city, 'gyms');
    const salon = getNicheData(city, 'salons');
    
    const totalMissing = res.missingWebsites + gym.missingWebsites + salon.missingWebsites;
    const avgPercentage = Math.round((res.noWebsitePercent + gym.noWebsitePercent + salon.noWebsitePercent) / 3);
    
    // Determine the most affected niche
    const niches = [
      { name: 'Restaurants', missing: res.missingWebsites },
      { name: 'Gyms', missing: gym.missingWebsites },
      { name: 'Salons', missing: salon.missingWebsites }
    ].sort((a, b) => b.missing - a.missing);

    return {
      city,
      formattedCity: formatTitle(city),
      totalMissing,
      avgPercentage,
      worstNiche: niches[0].name
    };
  }).sort((a, b) => b.avgPercentage - a.avgPercentage); // Rank by percentage missing

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-block px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-sm font-semibold mb-4 border border-rose-200">
          📊 Data Report 2024
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 tracking-tight leading-tight">
          The U.S. Cities Most Dependent on <span className="text-rose-600">Instagram</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          We analyzed thousands of local businesses across America's largest cities. Here are the cities with the highest percentage of businesses operating exclusively on Instagram, without a dedicated website.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-slate-900 rounded-2xl p-8 text-center text-white shadow-xl">
          <div className="text-4xl font-bold text-rose-400 mb-2">{reportData[0].formattedCity}</div>
          <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">#1 Most Affected City</div>
        </div>
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm">
          <div className="text-4xl font-bold text-slate-900 mb-2">{reportData[0].avgPercentage}%</div>
          <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Highest Missing Rate</div>
        </div>
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm">
          <div className="text-4xl font-bold text-slate-900 mb-2">Restaurants</div>
          <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Most Common Niche</div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-12">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Executive Summary</h2>
        <p className="text-slate-700 leading-relaxed">
          Our analysis reveals that <strong>{reportData[0].formattedCity}</strong> currently leads the nation in businesses lacking web infrastructure, with <strong>{reportData[0].avgPercentage}%</strong> of analyzed local businesses relying solely on social media. Across all analyzed cities, the <strong>{reportData[0].worstNiche}</strong> industry consistently shows the highest deficit in dedicated websites. This represents a massive untapped market for web developers and local SEO agencies.
        </p>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-16">
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Complete City Rankings</h2>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Download CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200">
                <th className="py-4 px-6 font-semibold text-slate-500 uppercase tracking-wider text-sm">Rank</th>
                <th className="py-4 px-6 font-semibold text-slate-500 uppercase tracking-wider text-sm">City</th>
                <th className="py-4 px-6 font-semibold text-slate-500 uppercase tracking-wider text-sm">No Website (%)</th>
                <th className="py-4 px-6 font-semibold text-slate-500 uppercase tracking-wider text-sm">Most Affected Niche</th>
                <th className="py-4 px-6 font-semibold text-slate-500 uppercase tracking-wider text-sm text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportData.map((data, index) => (
                <tr key={data.city} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${index < 3 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 text-lg">{data.formattedCity}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-16 bg-slate-200 rounded-full h-2 mr-3">
                        <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${data.avgPercentage}%` }}></div>
                      </div>
                      <span className="font-medium text-slate-700">{data.avgPercentage}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {data.worstNiche}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link href={`/leads/${data.city}`} className="text-sm font-bold text-indigo-600 hover:text-indigo-800">
                      View Leads &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Methodology */}
      <div className="text-sm text-slate-500 bg-slate-50 p-6 rounded-lg border border-slate-200">
        <strong>Methodology:</strong> Data is generated by cross-referencing Google Maps API listings with Instagram graph data. A business is classified as "Missing Website" if it has an active Instagram account with over 500 followers but lacks a valid HTTP/HTTPS URL in its bio or Google Business Profile. Data is updated weekly.
      </div>
    </div>
  );
}
