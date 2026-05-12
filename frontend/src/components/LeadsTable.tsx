"use client";

import { useState } from 'react';

type Lead = {
  id: string;
  name: string;
  handle: string;
  followers: string;
  formattedFollowers: string;
  hasWebsite: boolean;
  isTrending: boolean;
};

type LeadsTableProps = {
  leads: Lead[];
  city: string;
  niche: string;
};

export default function LeadsTable({ leads: initialLeads, city, niche }: LeadsTableProps) {
  const [filter, setFilter] = useState<'all' | 'verified'>('all');
  const [minFollowers, setMinFollowers] = useState<number>(0);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Clean handles (Fix double @@ issue)
  const cleanedLeads = initialLeads.map(lead => ({
    ...lead,
    handle: lead.handle.startsWith('@@') ? lead.handle.substring(1) : (lead.handle === 'N/A' ? 'N/A' : (lead.handle.startsWith('@') ? lead.handle : `@${lead.handle}`))
  }));

  const filteredLeads = cleanedLeads.filter(lead => {
    if (filter === 'verified' && lead.handle === 'N/A') return false;
    
    if (minFollowers > 0) {
      if (lead.followers === 'N/A') return false;
      const numFollowers = parseInt(lead.followers.replace(/[KkMm]/g, '')) * (lead.followers.toLowerCase().includes('k') ? 1000 : lead.followers.toLowerCase().includes('m') ? 1000000 : 1);
      if (numFollowers < minFollowers) return false;
    }
    
    return true;
  });

  const exportCSV = () => {
    const headers = ['Business Name', 'Instagram Handle', 'Followers', 'Location'];
    const rows = filteredLeads.map(l => [l.name, l.handle, l.followers, `${city}, India`]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${niche.toLowerCase()}_leads_${city.toLowerCase()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Interactive Filters */}
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap gap-3 items-center">
        <div className="relative">
          <button 
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors flex items-center"
          >
            {minFollowers > 0 ? `> ${minFollowers / 1000}k Followers` : 'Filter by Followers'} <span className="ml-2">▼</span>
          </button>
          
          {showFilterDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-20 p-2">
              {[0, 1000, 5000, 10000, 50000].map(val => (
                <button
                  key={val}
                  onClick={() => {
                    setMinFollowers(val);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${minFollowers === val ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'}`}
                >
                  {val === 0 ? 'All' : `More than ${val / 1000}k`}
                </button>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={() => setFilter(filter === 'all' ? 'verified' : 'all')}
          className={`px-3 py-1.5 border rounded-md text-sm font-medium shadow-sm transition-colors ${filter === 'verified' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
        >
          {filter === 'verified' ? '✓ Showing Verified' : 'Verified Accounts Only'}
        </button>

        <button 
          onClick={exportCSV}
          className="px-3 py-1.5 bg-indigo-600 border border-indigo-600 text-white rounded-md text-sm font-medium shadow-sm hover:bg-indigo-700 transition-colors ml-auto flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Export CSV
        </button>
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
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-slate-900">{lead.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{city}, India</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-indigo-600 font-medium">{lead.handle}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {lead.formattedFollowers}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => alert(`Analyzing digital presence for ${lead.name}...`)}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Analyze
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-slate-500 font-medium">Applying filters or waiting for results...</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
