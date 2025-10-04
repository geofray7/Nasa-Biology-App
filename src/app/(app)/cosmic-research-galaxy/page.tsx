
'use client';

import { useState, useEffect } from 'react';
import { getResearchPapers, type ResearchPapersOutput } from '@/ai/flows/get-research-papers';
import AdvancedResearchGalaxy from './galaxy';
import { Input } from '@/components/ui/input';
import { Card, CardHeader } from '@/components/ui/card';

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
        <div className="text-center space-y-4">
          <div className="text-4xl animate-spin">🌌</div>
          <p className="text-muted-foreground">Loading Research Galaxy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <Input 
            placeholder="Search for papers by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CardHeader>
      </Card>
      <AdvancedResearchGalaxy papers={data.nodes} searchQuery={searchQuery} />
    </div>
  );
}
