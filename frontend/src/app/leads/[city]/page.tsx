import { Metadata } from 'next';
import Link from 'next/link';
import { formatTitle, NICHES, CITIES } from '@/lib/pSEO';

type Props = {
  params: Promise<{ city: string }>;
};

// Generate static routes at build time for FTP export
export async function generateStaticParams() {
  const crawlCities = CITIES.slice(0, 1);
  return crawlCities.map((city) => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const city = formatTitle(resolvedParams.city);

  return {
    title: `Lead Generation in ${city}: Find Businesses Without Websites`,
    description: `Access our complete database of local businesses in ${city} that are growing on Instagram but don't have a website. Perfect web design leads.`,
    alternates: {
      canonical: `https://instaleads.app/leads/${resolvedParams.city}`,
    }
  };
}

export default async function CityHubPage({ params }: Props) {
  const resolvedParams = await params;
  const city = formatTitle(resolvedParams.city);
  
  // Sort niches alphabetically for the directory
  const sortedNiches = [...NICHES].sort();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <nav className="text-sm text-slate-500 mb-8" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            <span className="mx-2">/</span>
          </li>
          <li className="text-slate-700 font-medium">{city}</li>
        </ol>
      </nav>

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">
          Local Leads in <span className="text-indigo-600">{city}</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Browse our directory of businesses in {city} that have an active Instagram presence but no functional website. Select a niche below to view the data.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-16">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <span className="text-indigo-500 mr-2">🎯</span> Select an Industry
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedNiches.map(niche => {
              const formattedNiche = formatTitle(niche);
              return (
                <Link 
                  key={niche} 
                  href={`/leads/${resolvedParams.city}/${niche}`}
                  className="flex items-center p-4 border border-slate-100 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm transition-all group"
                >
                  <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-indigo-500 mr-3 transition-colors"></span>
                  <span className="font-medium text-slate-700 group-hover:text-indigo-700">{formattedNiche}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-12 text-center">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Explore Other Cities</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {CITIES.slice(0, 15).map(c => c !== resolvedParams.city && (
            <Link 
              key={c} 
              href={`/leads/${c}`} 
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              {formatTitle(c)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
