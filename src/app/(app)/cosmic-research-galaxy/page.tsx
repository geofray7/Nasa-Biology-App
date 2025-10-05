'use client';

import { useState, useEffect } from 'react';
import { getResearchPapers, type ResearchPapersOutput } from '@/ai/flows/get-research-papers';
import ResearchGalaxy from './galaxy';

export default function CosmicResearchGalaxyPage() {
  const [data, setData] = useState<ResearchPapersOutput>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getResearchPapers().then((fetchedData) => {
      setData(fetchedData);
      setLoading(false);
    }).catch(error => {
      console.error("Failed to fetch research papers:", error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-black text-white">
        <div className="text-4xl mb-4 animate-[bounce_2s_ease-in-out_infinite]">🚀</div>
        <h3 className="text-2xl font-bold mb-2">Initializing Research Galaxy...</h3>
        <p className="text-blue-300">Calibrating star charts and aligning constellations...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-0 m-0">
      <ResearchGalaxy papersData={data} />
    </div>
  );
}
