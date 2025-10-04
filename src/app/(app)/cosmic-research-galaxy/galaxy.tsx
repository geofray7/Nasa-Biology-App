
'use client';
import React, { useState, useEffect } from 'react';

const ResearchGalaxy = ({ papers = [], onPaperSelect, searchQuery = '' }) => {
  const [positions, setPositions] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);

  // Generate positions for papers (circular layout)
  useEffect(() => {
    const generatedPositions = papers.map((paper, index) => {
      const angle = (index / papers.length) * 2 * Math.PI;
      const radius = 200 + ((paper.year - 2022) * 50) + (Math.random() * 50); // Radius based on year
      const containerWidth = 800; // a fixed width for calculation
      const containerHeight = 600;

      return {
        x: (containerWidth / 2) + radius * Math.cos(angle),
        y: (containerHeight / 2) + radius * Math.sin(angle),
        ...paper
      };
    });
    setPositions(generatedPositions);
  }, [papers]);

  // Color mapping for domains
  const getDomainColor = (domain) => {
    const colors = {
      'microgravity': 'bg-blue-500',
      'radiation': 'bg-red-500',
      'plant biology': 'bg-green-500',
      'genomics': 'bg-purple-500',
      'astrobiology': 'bg-orange-500',
      'materials science': 'bg-yellow-400',
      'animal models': 'bg-pink-500',
      'astronaut health': 'bg-indigo-500',
      'deep space': 'bg-teal-500',
      'terraforming': 'bg-cyan-500',
      'lunar exploration': 'bg-gray-400',
      'mars': 'bg-red-700',
      'space biology': 'bg-white'
    };
    const key = domain.toLowerCase();
    for(const colorKey in colors) {
      if (key.includes(colorKey)) return colors[colorKey];
    }
    return 'bg-gray-500';
  };

  const getGlowColor = (domain) => {
    const glows = {
        'microgravity': 'shadow-[0_0_15px_3px_rgba(59,130,246,0.6)]',
        'radiation': 'shadow-[0_0_15px_3px_rgba(239,68,68,0.6)]',
        'plant biology': 'shadow-[0_0_15px_3px_rgba(34,197,94,0.6)]',
        'genomics': 'shadow-[0_0_15px_3px_rgba(168,85,247,0.6)]',
        'astrobiology': 'shadow-[0_0_15px_3px_rgba(245,158,11,0.6)]',
        'materials science': 'shadow-[0_0_15px_3px_rgba(250,204,21,0.6)]',
        'animal models': 'shadow-[0_0_15px_3px_rgba(236,72,153,0.6)]',
        'astronaut health': 'shadow-[0_0_15px_3px_rgba(99,102,241,0.6)]',
        'deep space': 'shadow-[0_0_15px_3px_rgba(20,184,166,0.6)]',
        'terraforming': 'shadow-[0_0_15px_3px_rgba(6,182,212,0.6)]',
        'lunar exploration': 'shadow-[0_0_15px_3px_rgba(156,163,175,0.6)]',
        'mars': 'shadow-[0_0_15px_3px_rgba(185,28,28,0.6)]',
        'space biology': 'shadow-[0_0_15px_3px_rgba(255,255,255,0.6)]'
    };
    const key = domain.toLowerCase();
    for(const glowKey in glows) {
        if (key.includes(glowKey)) return glows[glowKey];
      }
    return 'shadow-gray-500/50';
  };

  const handlePaperClick = (paper) => {
    setSelectedPaper(paper);
    if (onPaperSelect) onPaperSelect(paper);
  };

  const domainColors: {[key: string]: string} = {
    'Microgravity': 'bg-blue-500',
    'Radiation': 'bg-red-500',
    'Plant Bio': 'bg-green-500',
    'Genomics': 'bg-purple-500',
    'Astrobiology': 'bg-orange-500'
  };


  return (
    <div className="relative w-full h-[70vh] bg-gradient-to-br from-gray-900 via-indigo-900/80 to-black rounded-lg overflow-auto">
      {/* Galaxy Container */}
      <div className="relative w-[1000px] h-[800px] scale-75 sm:scale-100 origin-top-left">
        {positions.map((paper, index) => {
            const isMatch = searchQuery && (paper.title.toLowerCase().includes(searchQuery.toLowerCase()) || paper.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())))
            return (
                <div
                    key={paper.id || index}
                    className={`absolute rounded-full cursor-pointer transition-all duration-300 hover:scale-[1.75] hover:z-10
                    ${getDomainColor(paper.keywords[0])} 
                    ${getGlowColor(paper.keywords[0])}
                    ${isMatch 
                        ? 'animate-pulse shadow-[0_0_25px_5px_rgba(250,204,21,0.9)] bg-yellow-400' 
                        : 'shadow-lg'
                    }`}
                    style={{
                    left: `${paper.x}px`,
                    top: `${paper.y}px`,
                    width: `${4 + (paper.year - 2021) * 2}px`,
                    height: `${4 + (paper.year - 2021) * 2}px`,
                    transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => handlePaperClick(paper)}
                    title={`${paper.title} (${paper.year})`}
                />
            )
        })}
      </div>

      {/* Selected Paper Details */}
      {selectedPaper && (
        <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-90 backdrop-blur-sm p-6 rounded-lg max-w-sm w-[90%] text-white border border-gray-600 shadow-2xl animate-in fade-in-0 slide-in-from-right-10 duration-300">
          <button
            onClick={() => setSelectedPaper(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white p-1 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <h3 className="font-bold font-headline text-lg mb-2 pr-6">{selectedPaper.title}</h3>
          <p className="text-sm text-gray-300 mb-3">
            {selectedPaper.author}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDomainColor(selectedPaper.keywords[0])} text-white`}>
              {selectedPaper.keywords[0]}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-600 text-gray-200">
              {selectedPaper.year}
            </span>
          </div>
          
          <p className="text-sm mt-4 text-gray-300 line-clamp-4">
            {selectedPaper.summary}
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-80 backdrop-blur-sm p-3 rounded-lg text-white text-sm border border-gray-700">
        <h4 className="font-bold mb-2 font-headline">Domains</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {Object.entries(domainColors).map(([domain, color]) => (
            <div key={domain} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${color}`}></div>
              <span className="text-xs">{domain}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchGalaxy;
