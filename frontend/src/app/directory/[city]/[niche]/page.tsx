import { Metadata } from 'next';
import Link from 'next/link';
import { formatTitle, getNicheData, getMockLeads, getRandomItems, CITIES, NICHES } from '@/lib/pSEO';
import Script from 'next/script';

type Props = {
  params: Promise<{ city: string; niche: string }>;
};

// Generate static routes at build time for FTP export
export async function generateStaticParams() {
  const crawlCities = CITIES;
  const crawlNiches = NICHES;
  const paths = [];
  for (const city of crawlCities) {
    for (const niche of crawlNiches) {
      paths.push({ city, niche });
    }
  }
  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const city = formatTitle(resolvedParams.city);
  const niche = formatTitle(resolvedParams.niche);
  const data = getNicheData(resolvedParams.city, resolvedParams.niche);

  return {
    title: `Top ${data.totalFound} ${niche} in ${city} (2024 Instagram Rankings)`,
    description: `Discover the most popular ${niche} in ${city} ranked by Instagram followers and social growth. The top ${niche.toLowerCase()} has ${data.formattedTopFollowers} followers.`,
    keywords: [`best ${niche.toLowerCase()} in ${city}`, `top ${niche.toLowerCase()} ${city}`, `${niche.toLowerCase()} directory ${city}`, `most followed ${niche.toLowerCase()} ${city}`],
    alternates: {
      canonical: `https://instaleads.app/directory/${resolvedParams.city}/${resolvedParams.niche}`,
    }
  };
}

export default async function DirectoryPage({ params }: Props) {
  const resolvedParams = await params;
  const city = formatTitle(resolvedParams.city);
  const niche = formatTitle(resolvedParams.niche);
  
  const data = getNicheData(resolvedParams.city, resolvedParams.niche);
  const { isSimulated, leads } = getMockLeads(resolvedParams.city, resolvedParams.niche, 20, 'directory');
  
  const nearbyCities = getRandomItems(CITIES, 4, resolvedParams.city).map(formatTitle);
  const relatedNiches = getRandomItems(NICHES, 4, resolvedParams.niche).map(formatTitle);

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `Top ${niche} in ${city}`,
    "description": `A ranking of ${data.totalFound} ${niche} in ${city} based on Instagram followers and social growth.`,
    "license": "https://instaleads.app/terms",
    "creator": { "@type": "Organization", "name": "Insta Leads" }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Script id="dataset-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />

      {/* Breadcrumbs & Transparency Tag */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link href="/" className="hover:text-indigo-600">Home</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link href="/directory" className="hover:text-indigo-600">Directory</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link href={`/directory/${resolvedParams.city}`} className="hover:text-indigo-600">{city}</Link>
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

      {/* AI Summary Block */}
      <div className="bg-slate-50 border-l-4 border-emerald-500 p-6 mb-12 rounded-r-lg">
        <h2 className="sr-only">AI Search Summary</h2>
        <p className="text-slate-700 font-medium leading-relaxed">
          <strong>Directory Overview:</strong> We have indexed <span className="text-emerald-700 font-bold">{data.totalFound} {niche}</span> operating in {city}. 
          The average {niche.toLowerCase()} in {city} has an Instagram audience of {data.formattedFollowers} followers, while the top-ranked accounts reach up to {data.formattedTopFollowers} followers. 
          Currently, {data.noWebsitePercent}% of these businesses rely solely on social media and do not maintain a traditional website.
        </p>
      </div>

      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900 tracking-tight">
          Top {niche} in {city}
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl">
          Ranked by Instagram audience size, engagement, and digital presence. Updated {data.hoursAgo} hours ago.
        </p>
      </div>

      {/* SEO Discovery Links */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
        <Link href={`/trends/${resolvedParams.city}/${resolvedParams.niche}`} className="shrink-0 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors">
          🔥 Fastest Growing {niche} in {city}
        </Link>
        <Link href={`/leads/${resolvedParams.city}/${resolvedParams.niche}`} className="shrink-0 px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-sm font-medium hover:bg-rose-100 transition-colors">
          💻 {niche} Missing Websites ({data.missingWebsites})
        </Link>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-16">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Rankings 1 - 20</h2>
          <div className="text-sm text-slate-500 font-medium">Sorted by: Followers (High to Low)</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200">
                <th className="py-4 px-6 font-semibold text-slate-500 uppercase tracking-wider text-xs">Rank</th>
                <th className="py-4 px-6 font-semibold text-slate-500 uppercase tracking-wider text-xs">Business Name</th>
                <th className="py-4 px-6 font-semibold text-slate-500 uppercase tracking-wider text-xs">Instagram Followers</th>
                <th className="py-4 px-6 font-semibold text-slate-500 uppercase tracking-wider text-xs">Social Growth</th>
                <th className="py-4 px-6 font-semibold text-slate-500 uppercase tracking-wider text-xs text-right">Website Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead, i) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${i < 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 text-base">{lead.name}</div>
                    <a href={`https://instagram.com/${lead.handle.substring(1)}`} target="_blank" rel="nofollow noreferrer" className="text-xs text-indigo-600 hover:underline">{lead.handle}</a>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-800 text-lg">{lead.formattedFollowers}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded text-sm">
                      {lead.growth} MoM
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {lead.hasWebsite ? (
                      <span className="inline-flex items-center text-xs font-medium text-slate-500">
                        <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                        Active
                      </span>
                    ) : (
                      <Link href={`/leads/${resolvedParams.city}/${resolvedParams.niche}`} className="inline-flex items-center text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                        No Website
                      </Link>
                    )}
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
          <h3 className="text-lg font-bold text-slate-800 mb-4">Discover More in {city}</h3>
          <ul className="space-y-3">
            {relatedNiches.map(n => (
              <li key={n}>
                <Link href={`/directory/${resolvedParams.city}/${n.toLowerCase().replace(' ', '-')}`} className="text-indigo-600 hover:underline">
                  Top {n} in {city}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4">Compare {niche} Nationwide</h3>
          <ul className="space-y-3">
            {nearbyCities.map(c => (
              <li key={c}>
                <Link href={`/directory/${c.toLowerCase().replace(' ', '-')}/${resolvedParams.niche}`} className="text-indigo-600 hover:underline">
                  Top {niche} in {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
