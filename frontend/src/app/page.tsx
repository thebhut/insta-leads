"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Business = {
  business_name: string;
  phone: string | null;
  address: string | null;
  instagram_username: string | null;
  followers: string | null;
  bio: string | null;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [results, setResults] = useState<Business[]>([]);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = async () => {
    if (!query) return;
    
    setLoading(true);
    setStatus("Searching businesses and finding Instagram accounts...");
    setError("");
    setResults([]);

    try {
      const res = await fetch("http://localhost:3001/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch results");
      }

      const data: Business[] = await res.json();
      setResults(data);
      setStatus(`Found ${data.length} leads.`);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title
      doc.setFontSize(22);
      doc.setTextColor(30, 41, 59); // var(--foreground)
      doc.text("Instagram Lead Report", 14, 15);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139); // var(--text-muted)
      doc.text(`Search Query: ${query}`, 14, 25);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);

      // Generate table
      const tableData = results.map(b => [
        b.business_name,
        b.phone || "-",
        b.address || "-",
        b.instagram_username || "-",
        b.followers || "-",
        b.bio || "-"
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['Business Name', 'Phone', 'Address', 'Instagram', 'Followers', 'Bio']],
        body: tableData,
        theme: 'grid',
        headStyles: { 
          fillColor: [99, 102, 241], 
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold'
        },
        styles: { 
          fontSize: 9, 
          cellPadding: 4,
          valign: 'middle'
        },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 30 },
          2: { cellWidth: 50 },
          3: { cellWidth: 40 },
          4: { cellWidth: 25 },
          5: { cellWidth: 'auto' }
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        }
      });

      // Save PDF
      const safeQuery = query.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `${safeQuery}_leads_${new Date().getTime()}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (!mounted) return null;

  return (
    <div className="container">
      <h1>V1 Instagram Lead Finder</h1>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="e.g., restaurants in Ahmedabad"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          disabled={loading}
        />
        <button onClick={handleSearch} disabled={loading || !query}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {loading && <div className="loading" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>{status}</div>}
      {!loading && error && <div className="loading" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>{error}</div>}
      {!loading && !error && status && <div className="loading" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>{status}</div>}

      {results.length > 0 && (
        <>
          <div className="table-header-actions">
            <h2 className="table-title">Search Results</h2>
            <button className="export-btn" onClick={exportToPDF}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export as PDF
            </button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Instagram</th>
                  <th>Followers</th>
                  <th>Bio</th>
                </tr>
              </thead>
              <tbody>
                {results.map((b, index) => (
                  <tr key={index}>
                    <td>{b.business_name}</td>
                    <td>{b.phone || "-"}</td>
                    <td>{b.address || "-"}</td>
                    <td>{b.instagram_username || "-"}</td>
                    <td>{b.followers || "-"}</td>
                    <td>{b.bio || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
