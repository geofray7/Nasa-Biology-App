
'use client';

import { useState, useEffect } from 'react';
import { getResearchPapers, type ResearchPapersOutput } from '@/ai/flows/get-research-papers';
import ResearchGalaxy from './galaxy';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function CosmicResearchGalaxyPage() {
  const [data, setData] = useState<ResearchPapersOutput>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getResearchPapers().then((fetchedData) => {
      setData(fetchedData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading Research Galaxy...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
       <h1 className="text-2xl font-headline font-bold">Cosmic Research Galaxy</h1>
      <Card>
        <div className="p-4 border-b">
          <Input 
            placeholder="Search for papers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ResearchGalaxy papers={data.nodes} searchQuery={searchQuery} />
      </Card>
    </div>
  );
}
