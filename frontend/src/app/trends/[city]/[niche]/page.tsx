import { Metadata } from 'next';
import Link from 'next/link';
import { formatTitle, getNicheData, getMockLeads, getRandomItems, CITIES, NICHES } from '@/lib/pSEO';
import Script from 'next/script';

type Props = {
  params: Promise<{ city: string; niche: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const city = formatTitle(resolvedParams.city);
  const niche = formatTitle(resolvedParams.niche);

  return {
    title: `Trending ${niche} in ${city}: Fastest Growing on Instagram`,
    description: `Track the fastest growing local ${niche} in ${city}. See which businesses are going viral on social media and driving local trends this week.`,
    keywords: [`trending ${niche.toLowerCase()} ${city}`, `viral ${niche.toLowerCase()} ${city}`, `fastest growing ${niche.toLowerCase()} ${city}`, `instagram trends ${city}`],
    alternates: {
      canonical: `https://instaleads.app/trends/${resolvedParams.city}/${resolvedParams.niche}`,
    }
  };
}

export default async function TrendsPage({ params }: Props) {
  const resolvedParams = await params;
  const city = formatTitle(resolvedParams.city);
  const niche = formatTitle(resolvedParams.niche);
  
  const data = getNicheData(resolvedParams.city, resolvedParams.niche);
  
  // Get trending specific leads (high growth rates)
  const { isSimulated, leads } = getMockLeads(resolvedParams.city, resolvedParams.niche, 10, 'trending');
  
  const nearbyCities = getRandomItems(CITIES, 4, resolvedParams.city).map(formatTitle);
  const relatedNiches = getRandomItems(NICHES, 4, resolvedParams.niche).map(formatTitle);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Breadcrumbs & Transparency Tag */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link href="/" className="hover:text-indigo-600">Home</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link href="/trends" className="hover:text-indigo-600">Trends</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link href={`/trends/${resolvedParams.city}`} className="hover:text-indigo-600">{city}</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-slate-700 font-medium">{niche}</li>
          </ol>
        </nav>
        {isSimulated && (
          <div className="flex items-center text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 w-fit">
            <span className="mr-1">⚠️</span> Demo Preview
          </div>
        )}
      </div>

      {/* Google Discover Optimized Header */}
      <div className="mb-16 text-center md:text-left">
        <div className="inline-flex items-center px-4 py-1.5 bg-rose-100 text-rose-800 rounded-full text-sm font-black tracking-wide mb-6 uppercase border border-rose-200 shadow-sm">
          <span className="mr-2 animate-pulse text-rose-500">🔴</span> Live Local Trend
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 text-slate-900 tracking-tighter leading-[1.1]">
          These {city} {niche} are <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-600">Exploding</span> on Instagram
        </h1>
        <p className="text-2xl text-slate-600 max-w-3xl font-medium leading-relaxed">
          Forget legacy websites. The local economy in {city} is shifting rapidly. Here are the top {leads.length} {niche.toLowerCase()} experiencing massive social growth right now.
        </p>
      </div>

      {/* Visual Discover Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          </div>
          <div className="relative z-10">
            <div className="text-indigo-400 font-bold uppercase tracking-widest mb-4">Market Shift</div>
            <div className="text-5xl font-black mb-4 tracking-tight">+{data.growthRate}% Growth</div>
            <p className="text-xl text-slate-300 leading-relaxed font-medium">The most viral {niche.toLowerCase()} in {city} are growing their digital audience far faster than the national average.</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-600 to-orange-500 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-rose-200 font-bold uppercase tracking-widest mb-4">The Digital Deficit</div>
            <div className="text-5xl font-black mb-4 tracking-tight">{data.noWebsitePercent}% Lack Websites</div>
            <p className="text-xl text-rose-50 leading-relaxed font-medium">Despite reaching thousands locally, a shocking {data.noWebsitePercent}% of these viral businesses don't have a functional website to capture traffic.</p>
            <div className="mt-8">
              <Link href={`/leads/${resolvedParams.city}/${resolvedParams.niche}`} className="inline-flex items-center px-6 py-3 bg-white text-rose-600 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                View Deficit Dataset &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-16">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Viral Rankings (Updated {data.hoursAgo} hours ago)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200">
                <th className="py-4 px-6 font-semibold text-slate-500 uppercase tracking-wider text-xs">Trending</th>
                <th className="py-4 px-6 font-semibold text-slate-500 uppercase tracking-wider text-xs">Business</th>
                <th className="py-4 px-6 font-semibold text-slate-500 uppercase tracking-wider text-xs">Current Audience</th>
                <th className="py-4 px-6 font-semibold text-slate-500 uppercase tracking-wider text-xs">Momentum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead, i) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="text-2xl">{i === 0 ? '🔥' : i === 1 ? '🚀' : i === 2 ? '⭐' : '📈'}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 text-lg">{lead.name}</div>
                    <div className="text-sm text-indigo-600">{lead.handle}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-800 text-xl">{lead.formattedFollowers}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-emerald-600 font-black text-lg">
                        {lead.growth}
                      </span>
                      <span className="text-xs text-slate-500 font-medium uppercase">Last 30 Days</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Internal Linking Clustering */}
      <div className="border-t border-slate-200 pt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4">Trending in {city}</h3>
          <ul className="space-y-3">
            {relatedNiches.map(n => (
              <li key={n}>
                <Link href={`/trends/${resolvedParams.city}/${n.toLowerCase().replace(' ', '-')}`} className="text-indigo-600 hover:underline font-medium">
                  Fastest Growing {n} in {city}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4">Trending {niche} Nationwide</h3>
          <ul className="space-y-3">
            {nearbyCities.map(c => (
              <li key={c}>
                <Link href={`/trends/${c.toLowerCase().replace(' ', '-')}/${resolvedParams.niche}`} className="text-indigo-600 hover:underline font-medium">
                  Fastest Growing {niche} in {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
