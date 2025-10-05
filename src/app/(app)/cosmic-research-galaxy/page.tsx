
'use client';
import dynamic from 'next/dynamic';

// Use dynamic import to avoid SSR issues
const ResearchGalaxy = dynamic(() => import('./galaxy'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <div className="text-6xl mb-4 animate-bounce">🚀</div>
      <h2 className="text-2xl font-bold mb-2">Loading Research Galaxy...</h2>
      <p className="text-gray-400">Preparing cosmic exploration</p>
    </div>
  )
});

export default function CosmicResearchGalaxyPage() {
  return <ResearchGalaxy />;
}
