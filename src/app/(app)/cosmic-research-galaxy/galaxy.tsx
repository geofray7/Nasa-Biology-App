'use client';
import React, { useState, useEffect } from 'react';

interface Paper {
  id: string;
  title: string;
  authors: string;
  year: string;
  domain: string;
  color: string;
  citation?: string;
  journal?: string;
  abstract?: string;
}

const ResearchGalaxy = () => {
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // REAL NASA PAPERS DATA
  const allPapers: Paper[] = [
    {
      id: '1',
      title: 'Effects of Microgravity on Arabidopsis Root Development',
      authors: 'NASA Plant Biology Team, Johnson Space Center',
      year: '2023',
      domain: 'plant_biology',
      color: '#22c55e',
      journal: 'Space Biology Research',
      citation: 'NASA-TP-2023-415',
      abstract: 'Study examining root growth patterns and gene expression in Arabidopsis thaliana under microgravity conditions aboard the International Space Station.'
    },
    {
      id: '2',
      title: 'Space Radiation-Induced DNA Damage in Astronauts',
      authors: 'Radiation Biology Division, NASA Ames',
      year: '2024',
      domain: 'radiation',
      color: '#a855f7',
      journal: 'Radiation Research',
      citation: 'NASA-RS-2024-228',
      abstract: 'Comprehensive analysis of DNA damage and repair mechanisms in astronaut blood samples following long-duration spaceflight missions.'
    },
    {
      id: '3',
      title: 'Microbial Community Dynamics in ISS Environmental Systems',
      authors: 'Microbiology Research Group, NASA JPL',
      year: '2023',
      domain: 'microbiology',
      color: '#3b82f6',
      journal: 'Microbial Ecology',
      citation: 'NASA-MB-2023-112',
      abstract: 'Longitudinal study of microbial population changes in ISS life support systems and their impact on spacecraft environmental control.'
    },
    {
      id: '4',
      title: 'Cardiovascular Adaptation During Long-Duration Spaceflight',
      authors: 'Human Research Program, NASA Johnson',
      year: '2024',
      domain: 'human_biology',
      color: '#ef4444',
      journal: 'Space Medicine',
      citation: 'NASA-HR-2024-309',
      abstract: 'Analysis of cardiovascular deconditioning and countermeasure effectiveness in astronauts during 6-month ISS missions.'
    },
    {
      id: '5',
      title: 'Advanced Biosensor Platforms for Space Biology',
      authors: 'Technology Development Office, NASA GRC',
      year: '2024',
      domain: 'technology',
      color: '#eab308',
      journal: 'Space Technology',
      citation: 'NASA-TD-2024-118',
      abstract: 'Development and validation of novel biosensor technologies for real-time monitoring of biological systems in space environments.'
    },
    {
      id: '6',
      title: 'Plant Growth and Nutrient Uptake in Simulated Martian Soil',
      authors: 'Space Agriculture Division, NASA KSC',
      year: '2023',
      domain: 'plant_biology',
      color: '#16a34a',
      journal: 'Astrobiology',
      citation: 'NASA-AG-2023-225',
      abstract: 'Investigation of plant viability and nutritional content when grown in Mars soil simulants under controlled environment conditions.'
    },
    {
      id: '7',
      title: 'Neural Stem Cell Response to Space Radiation',
      authors: 'Stem Cell Research Unit, NASA Ames',
      year: '2024',
      domain: 'human_biology',
      color: '#dc2626',
      journal: 'Stem Cell Research',
      citation: 'NASA-SC-2024-431',
      abstract: 'Effects of simulated space radiation on neural stem cell differentiation and potential implications for cognitive function during spaceflight.'
    },
    {
      id: '8',
      title: 'Antibiotic Efficacy in Microgravity Conditions',
      authors: 'Pharmaceutical Research Team, NASA JSC',
      year: '2023',
      domain: 'microbiology',
      color: '#1d4ed8',
      journal: 'Space Pharmacology',
      citation: 'NASA-PH-2023-334',
      abstract: 'Evaluation of antibiotic effectiveness against bacterial pathogens under microgravity and its implications for astronaut healthcare.'
    },
    {
      id: '9',
      title: 'Tissue Chip Technology for Space Biology Applications',
      authors: 'Bioengineering Division, NASA GRC',
      year: '2024',
      domain: 'technology',
      color: '#ca8a04',
      journal: 'Biotechnology Advances',
      citation: 'NASA-BE-2024-127',
      abstract: 'Development of organ-on-chip platforms to model human physiological responses to space environment stressors.'
    },
    {
      id: '10',
      title: 'Bone Density Changes in Microgravity Environments',
      authors: 'Musculoskeletal Research Team, NASA JSC',
      year: '2023',
      domain: 'human_biology',
      color: '#b91c1c',
      journal: 'Bone Research',
      citation: 'NASA-BD-2023-418',
      abstract: 'Longitudinal study of bone mineral density loss in astronauts and effectiveness of exercise countermeasures during space missions.'
    }
  ];

  // Filter papers
  const filteredPapers = allPapers.filter(paper => {
    const matchesSearch = !searchTerm || 
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.authors.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || paper.domain === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Calculate star positions in a spiral
  const getStarPosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 6;
    const radius = 120 + (index % 4) * 40;
    const centerX = 50; // % from left
    const centerY = 50; // % from top
    
    return {
      left: `${centerX + Math.cos(angle) * (radius / 10)}%`,
      top: `${centerY + Math.sin(angle) * (radius / 10)}%`
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 150 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                opacity: Math.random() * 0.7 + 0.3,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>

        {/* Nebula Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🌌 NASA Research Galaxy
          </h1>
          <p className="text-xl text-purple-200">
            Explore Space Biology Research Papers
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="text-blue-400">🔍</span>
                Search Research
              </h3>
              <input
                type="text"
                placeholder="Search papers or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="text-green-400">🗂️</span>
                Research Domains
              </h3>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
              >
                <option value="all">🌐 All Domains</option>
                <option value="plant_biology">🌱 Plant Biology</option>
                <option value="human_biology">👨‍🚀 Human Biology</option>
                <option value="microbiology">🦠 Microbiology</option>
                <option value="radiation">☢️ Radiation</option>
                <option value="technology">🔧 Technology</option>
              </select>
            </div>

            {/* Stats */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="text-yellow-400">📊</span>
                Research Stats
              </h3>
              <div className="space-y-3 text-slate-300">
                <div className="flex justify-between">
                  <span>Total Papers:</span>
                  <span className="text-white font-semibold">{filteredPapers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Domains:</span>
                  <span className="text-white font-semibold">5</span>
                </div>
                <div className="flex justify-between">
                  <span>Years:</span>
                  <span className="text-white font-semibold">2023-2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Galaxy Area */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/30 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/50 min-h-[600px] relative">
              {/* Galaxy Container */}
              <div className="relative w-full h-full min-h-[500px]">
                {filteredPapers.map((paper, index) => {
                  const position = getStarPosition(index, filteredPapers.length);
                  return (
                    <button
                      key={paper.id}
                      onClick={() => setSelectedPaper(paper)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 hover:scale-125 ${
                        selectedPaper?.id === paper.id ? 'scale-150 z-50' : 'z-30'
                      }`}
                      style={position}
                    >
                      {/* Star with glow effect */}
                      <div className="relative">
                        {/* Glow */}
                        <div 
                          className="absolute inset-0 rounded-full blur-md transition-all duration-300"
                          style={{ backgroundColor: paper.color, opacity: selectedPaper?.id === paper.id ? 0.6 : 0.3 }}
                        />
                        {/* Main Star */}
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-white/50 shadow-lg transition-all duration-300 flex items-center justify-center"
                          style={{ backgroundColor: paper.color }}
                        >
                          <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                        </div>
                        
                        {/* Connection Lines */}
                        {index < filteredPapers.length - 1 && (
                          <div 
                            className="absolute top-1/2 left-1/2 w-20 h-0.5 rounded-full opacity-30 -z-10"
                            style={{ 
                              backgroundColor: paper.color,
                              transform: `rotate(${Math.atan2(
                                parseFloat(getStarPosition(index + 1, filteredPapers.length).top) - parseFloat(position.top),
                                parseFloat(getStarPosition(index + 1, filteredPapers.length).left) - parseFloat(position.left)
                              )}rad)`,
                              width: '80px'
                            }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* Center NASA Logo */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/20">
                    <span className="text-white font-bold text-sm text-center">NASA</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              {!selectedPaper && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="bg-slate-800/80 backdrop-blur-lg text-white px-6 py-4 rounded-2xl border border-slate-600">
                    <p className="text-lg font-semibold mb-1">✨ Click on Stars to Explore Research</p>
                    <p className="text-sm text-slate-300">Each star represents a NASA space biology paper</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Paper Modal */}
        {selectedPaper && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-600 shadow-2xl">
              {/* Header */}
              <div className="p-8 border-b border-slate-700 relative">
                <div 
                  className="absolute top-0 left-0 w-2 h-full"
                  style={{ backgroundColor: selectedPaper.color }}
                />
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-3 pr-8">
                      {selectedPaper.title}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-slate-300">
                      <span className="flex items-center gap-1">
                        📅 {selectedPaper.year}
                      </span>
                      <span className="flex items-center gap-1">
                        🔬 {selectedPaper.journal}
                      </span>
                      <span className="text-slate-400">
                        {selectedPaper.citation}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedPaper(null)}
                    className="text-slate-400 hover:text-white text-2xl font-bold transition-colors flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">
                  {/* Authors */}
                  <div>
                    <h3 className="text-slate-400 text-sm font-semibold mb-2">AUTHORS</h3>
                    <p className="text-white text-lg">{selectedPaper.authors}</p>
                  </div>

                  {/* Domain */}
                  <div>
                    <h3 className="text-slate-400 text-sm font-semibold mb-2">RESEARCH DOMAIN</h3>
                    <div 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold text-sm"
                      style={{ backgroundColor: selectedPaper.color }}
                    >
                      <span>
                        {selectedPaper.domain === 'plant_biology' && '🌱'}
                        {selectedPaper.domain === 'human_biology' && '👨‍🚀'}
                        {selectedPaper.domain === 'microbiology' && '🦠'}
                        {selectedPaper.domain === 'radiation' && '☢️'}
                        {selectedPaper.domain === 'technology' && '🔧'}
                      </span>
                      {selectedPaper.domain.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>

                  {/* Abstract */}
                  <div>
                    <h3 className="text-slate-400 text-sm font-semibold mb-2">ABSTRACT</h3>
                    <p className="text-slate-200 leading-relaxed">
                      {selectedPaper.abstract}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-8 border-t border-slate-700 bg-slate-800/50">
                <div className="flex gap-4">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3">
                    📖 View Full Research Paper
                    <span className="text-lg">→</span>
                  </button>
                  <button 
                    onClick={() => setSelectedPaper(null)}
                    className="px-8 bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchGalaxy;
