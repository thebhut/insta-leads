import { Metadata } from 'next';
import Link from 'next/link';
import { formatTitle, getNicheData, getRandomItems, getMockLeads, CITIES, NICHES } from '@/lib/pSEO';
import Script from 'next/script';

type Props = {
  params: Promise<{ city: string; niche: string }>;
};

// Generate static routes at build time for FTP export
export async function generateStaticParams() {
  // Only build the top 10x10 combinations initially to keep build times low for GitHub Actions
  const crawlCities = CITIES.slice(0, 3);
  const crawlNiches = NICHES.slice(0, 3);
  
  const paths = [];
  for (const city of crawlCities) {
    for (const niche of crawlNiches) {
      paths.push({ city, niche });
    }
  }
  return paths;
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const city = formatTitle(resolvedParams.city);
  const niche = formatTitle(resolvedParams.niche);
  const data = getNicheData(resolvedParams.city, resolvedParams.niche);

  return {
    title: `${data.missingWebsites} ${niche} in ${city} Missing Websites (Live Data)`,
    description: `We found ${data.missingWebsites} ${niche} in ${city} active on Instagram but missing a website. Average audience: ${data.formattedFollowers} followers. Last updated ${data.hoursAgo} hours ago.`,
    keywords: [`${niche.toLowerCase()} leads ${city.toLowerCase()}`, `businesses without websites in ${city}`, `web design clients ${city}`, `instagram scraper`],
    alternates: {
      canonical: `https://instaleads.app/leads/${resolvedParams.city}/${resolvedParams.niche}`,
    },
    openGraph: {
      title: `${data.missingWebsites} ${niche} in ${city} Missing Websites`,
      description: `Unlock our exclusive list of ${niche} in ${city} with Instagram followers but no functional website.`,
      type: 'article',
    }
  };
}

export default async function ProgrammaticSEOLandingPage({ params }: Props) {
  const resolvedParams = await params;
  const city = formatTitle(resolvedParams.city);
  const niche = formatTitle(resolvedParams.niche);
  
  const data = getNicheData(resolvedParams.city, resolvedParams.niche);
  const { isSimulated, leads } = getMockLeads(resolvedParams.city, resolvedParams.niche, 8, 'missing-website'); // Generate 8 leads for table
  
  const nearbyCities = getRandomItems(CITIES, 4, resolvedParams.city).map(formatTitle);
  const relatedNiches = getRandomItems(NICHES, 4, resolvedParams.niche).map(formatTitle);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Why do ${niche} in ${city} need websites?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Many ${niche} in ${city} rely solely on Instagram for marketing. However, without a dedicated website, they lose out on local Google Search traffic and have no centralized place to convert visitors into paying customers.`
        }
      },
      {
        "@type": "Question",
        "name": `How many ${niche} in ${city} don't have a website?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `According to our latest scan, approximately ${data.missingWebsites} ${niche} in ${city} have an active Instagram profile but do not have a functional website linked.`
        }
      }
    ]
  };

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `${niche} in ${city} Without Websites`,
    "description": `A dataset of ${data.missingWebsites} ${niche} in ${city} that have an Instagram presence but no website.`,
    "license": "https://instaleads.app/terms",
    "creator": {
      "@type": "Organization",
      "name": "Insta Leads"
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="dataset-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />

      {/* Breadcrumbs & Freshness Signals */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link href="/" className="hover:text-indigo-600">Home</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link href={`/leads/${resolvedParams.city}`} className="hover:text-indigo-600">{city}</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-slate-700 font-medium">{niche}</li>
          </ol>
        </nav>
        
        <div className="flex gap-2">
          {isSimulated && (
            <div className="flex items-center text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 w-fit">
              <span className="mr-1">⚠️</span> Sample Dataset
            </div>
          )}
          <div className="flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 w-fit">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Last scanned {data.hoursAgo} hours ago
          </div>
        </div>
      </div>

      {/* AI-Friendly Summary Block (Helps with Google AI Overviews & Perplexity) */}
      <div className="bg-slate-50 border-l-4 border-indigo-500 p-6 mb-8 rounded-r-lg">
        <h2 className="sr-only">AI Search Summary</h2>
        <p className="text-slate-700 font-medium leading-relaxed">
          <strong>Summary:</strong> We identified <span className="text-indigo-600">{data.missingWebsites} {niche}</span> in {city} that are actively marketing on Instagram but currently lack a dedicated website. 
          The average audience size for these businesses is {data.formattedFollowers} followers. {data.microContent}
          This dataset was updated {data.hoursAgo} hours ago and includes {data.newThisWeek} newly discovered businesses this week.
        </p>
      </div>

      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">
          <span className="text-indigo-600">{data.missingWebsites} {niche}</span> in {city} Missing Websites
        </h1>
        
        {/* Social Share Hooks */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="flex items-center text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg shadow-sm transition-colors">
            <svg className="w-4 h-4 mr-2 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            Share Stat
          </button>
          <button className="flex items-center text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg shadow-sm transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
            Save Report
          </button>
        </div>
      </div>

      {/* REAL DATA TABLE - Interactive Element */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Live Leads Preview</h2>
          <div className="text-sm font-medium text-slate-500">Showing {leads.length} of {data.missingWebsites}</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Interactive Filters (Visual only for SEO Behavioral tracking) */}
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex gap-3 overflow-x-auto">
            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 shadow-sm">Filter by Followers ▼</button>
            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 shadow-sm">Verified Accounts Only</button>
            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 shadow-sm ml-auto">Export CSV</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200">
                  <th className="py-4 px-6 font-semibold text-slate-800">Business Name</th>
                  <th className="py-4 px-6 font-semibold text-slate-800">Instagram Handle</th>
                  <th className="py-4 px-6 font-semibold text-slate-800">Followers</th>
                  <th className="py-4 px-6 font-semibold text-slate-800 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 relative">
                {leads.map((lead, i) => (
                  <tr key={lead.id} className={`hover:bg-slate-50 transition-colors ${lead.isBlurred ? 'select-none' : ''}`}>
                    <td className="py-4 px-6">
                      <div className={`font-medium text-slate-900 ${lead.isBlurred ? 'blur-sm' : ''}`}>{lead.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{city}, USA</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className={`text-indigo-600 font-medium ${lead.isBlurred ? 'blur-sm' : ''}`}>{lead.handle}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 ${lead.isBlurred ? 'blur-sm' : ''}`}>
                        {lead.formattedFollowers}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {lead.isBlurred ? (
                        <span className="text-xs font-semibold text-slate-400">Locked</span>
                      ) : (
                        <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">Analyze</button>
                      )}
                    </td>
                  </tr>
                ))}
                
                {/* Overlay for blurred rows */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent flex flex-col items-center justify-end pb-8">
                  <p className="font-bold text-slate-900 mb-4 text-lg">Unlock {data.missingWebsites - 2} more {niche} leads in {city}</p>
                  <Link href={`/?q=${resolvedParams.niche}+in+${resolvedParams.city}`} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105">
                    View Full Dataset
                  </Link>
                </div>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* EEAT Methodology Section */}
      <div className="bg-slate-50 rounded-xl p-8 mb-16 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Data Methodology & Trust</h2>
        <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-600">
          <div>
            <strong className="block text-slate-800 mb-1">How we collect this data</strong>
            We cross-reference Google Maps business listings in {city} with Instagram graph data to find active businesses that do not have a valid URL in their profile or GMB listing.
          </div>
          <div>
            <strong className="block text-slate-800 mb-1">Update Frequency</strong>
            The {niche} database for {city} is re-scanned weekly. We detected {data.newThisWeek} new {niche} in the last 7 days.
          </div>
          <div>
            <strong className="block text-slate-800 mb-1">Why this matters</strong>
            Businesses without websites rely heavily on third-party platforms. They are highly motivated buyers for web design, local SEO, and digital infrastructure services.
          </div>
        </div>
      </div>

      {/* Semantic Hub Clustering (Internal Linking) */}
      <div className="border-t border-slate-200 pt-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Explore More Growth Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <span className="text-indigo-500 mr-2">📍</span> Other Niches in {city}
            </h3>
            <ul className="space-y-3">
              {relatedNiches.map(n => (
                <li key={n}>
                  <Link href={`/leads/${resolvedParams.city}/${n.toLowerCase().replace(' ', '-')}`} className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2"></span>
                    {n} in {city} without websites
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <span className="text-emerald-500 mr-2">📈</span> {niche} in Other Cities
            </h3>
            <ul className="space-y-3">
              {nearbyCities.map(c => (
                <li key={c}>
                  <Link href={`/leads/${c.toLowerCase().replace(' ', '-')}/${resolvedParams.niche}`} className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2"></span>
                    {niche} in {c} without websites
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
