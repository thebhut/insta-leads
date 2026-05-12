import { Metadata } from 'next';
import Link from 'next/link';
import { formatTitle, NICHES, CITIES } from '@/lib/pSEO';

type Props = {
  params: Promise<{ niche: string }>;
};

// Generate static routes at build time for FTP export
export async function generateStaticParams() {
  const crawlNiches = NICHES;
  return crawlNiches.map((niche) => ({ niche }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const niche = formatTitle(resolvedParams.niche);

  return {
    title: `Find ${niche} Without Websites: Lead Generation Database`,
    description: `Access our nationwide database of ${niche} that have active Instagram accounts but no website. High-converting leads for digital marketing agencies.`,
    alternates: {
      canonical: `https://instaleads.app/leads/niche/${resolvedParams.niche}`,
    }
  };
}

export default async function NicheHubPage({ params }: Props) {
  const resolvedParams = await params;
  const niche = formatTitle(resolvedParams.niche);
  
  // Sort cities alphabetically for the directory
  const sortedCities = [...CITIES].sort();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <nav className="text-sm text-slate-500 mb-8" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            <span className="mx-2">/</span>
          </li>
          <li className="text-slate-700 font-medium">{niche}</li>
        </ol>
      </nav>

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">
          Find <span className="text-indigo-600">{niche}</span> Without Websites
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Browse our nationwide directory of {niche} that rely on Instagram but lack a proper website. Select a city below to view highly-targeted local leads.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-16">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <span className="text-emerald-500 mr-2">📍</span> Select a City
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedCities.map(city => {
              const formattedCity = formatTitle(city);
              return (
                <Link 
                  key={city} 
                  href={`/leads/${city}/${resolvedParams.niche}`}
                  className="flex items-center p-4 border border-slate-100 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-sm transition-all group"
                >
                  <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-emerald-500 mr-3 transition-colors"></span>
                  <span className="font-medium text-slate-700 group-hover:text-emerald-800">{formattedCity}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-12 text-center">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Explore Other Industries</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {NICHES.slice(0, 15).map(n => n !== resolvedParams.niche && (
            <Link 
              key={n} 
              href={`/leads/niche/${n}`} 
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              {formatTitle(n)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
