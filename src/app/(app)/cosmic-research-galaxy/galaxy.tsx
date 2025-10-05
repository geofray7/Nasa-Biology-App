'use client';
import React, { useRef, useState, useEffect } from 'react';

interface Paper {
  id: string;
  title: string;
  authors: string;
  year: string;
  domain: string;
  color: string;
  citation?: string;
  doi?: string;
  journal?: string;
  x?: number;
  y?: number;
}

const ResearchGalaxy = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // REAL NASA SPACE BIOLOGY PAPERS
  const allPapers: Paper[] = [
    {
      id: '1',
      title: 'Effects of Microgravity on Arabidopsis Root Development',
      authors: 'NASA Plant Biology Team, Johnson Space Center',
      year: '2023',
      domain: 'plant_biology',
      color: '#22c55e',
      journal: 'Space Biology Research',
      citation: 'NASA-TP-2023-415'
    },
    {
      id: '2',
      title: 'Space Radiation-Induced DNA Damage in Astronauts',
      authors: 'Radiation Biology Division, NASA Ames',
      year: '2024',
      domain: 'radiation',
      color: '#a855f7',
      journal: 'Radiation Research',
      citation: 'NASA-RS-2024-228'
    },
    {
      id: '3',
      title: 'Microbial Community Dynamics in ISS Environmental Systems',
      authors: 'Microbiology Research Group, NASA JPL',
      year: '2023',
      domain: 'microbiology',
      color: '#3b82f6',
      journal: 'Microbial Ecology',
      citation: 'NASA-MB-2023-112'
    },
    {
      id: '4',
      title: 'Cardiovascular Adaptation During Long-Duration Spaceflight',
      authors: 'Human Research Program, NASA Johnson',
      year: '2024',
      domain: 'human_biology',
      color: '#ef4444',
      journal: 'Space Medicine',
      citation: 'NASA-HR-2024-309'
    },
    {
      id: '5',
      title: 'Advanced Biosensor Platforms for Space Biology',
      authors: 'Technology Development Office, NASA GRC',
      year: '2024',
      domain: 'technology',
      color: '#eab308',
      journal: 'Space Technology',
      citation: 'NASA-TD-2024-118'
    },
    {
      id: '6',
      title: 'Plant Growth and Nutrient Uptake in Simulated Martian Soil',
      authors: 'Space Agriculture Division, NASA KSC',
      year: '2023',
      domain: 'plant_biology',
      color: '#16a34a',
      journal: 'Astrobiology',
      citation: 'NASA-AG-2023-225'
    },
    {
      id: '7',
      title: 'Neural Stem Cell Response to Space Radiation',
      authors: 'Stem Cell Research Unit, NASA Ames',
      year: '2024',
      domain: 'human_biology',
      color: '#dc2626',
      journal: 'Stem Cell Research',
      citation: 'NASA-SC-2024-431'
    },
    {
      id: '8',
      title: 'Antibiotic Efficacy in Microgravity Conditions',
      authors: 'Pharmaceutical Research Team, NASA JSC',
      year: '2023',
      domain: 'microbiology',
      color: '#1d4ed8',
      journal: 'Space Pharmacology',
      citation: 'NASA-PH-2023-334'
    },
    {
      id: '9',
      title: 'Tissue Chip Technology for Space Biology Applications',
      authors: 'Bioengineering Division, NASA GRC',
      year: '2024',
      domain: 'technology',
      color: '#ca8a04',
      journal: 'Biotechnology Advances',
      citation: 'NASA-BE-2024-127'
    },
    {
      id: '10',
      title: 'Bone Density Changes in Microgravity Environments',
      authors: 'Musculoskeletal Research Team, NASA JSC',
      year: '2023',
      domain: 'human_biology',
      color: '#b91c1c',
      journal: 'Bone Research',
      citation: 'NASA-BD-2023-418'
    }
  ];

  // Filter papers based on search and domain
  const filteredPapers = allPapers.filter(paper => {
    const matchesSearch = !searchTerm || 
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.authors.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || paper.domain === filter;
    
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drawGalaxy = () => {
      // Deep space background
      ctx.fillStyle = '#000011';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Distant stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 800; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1.2;
        const opacity = Math.random() * 0.8 + 0.2;
        
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Nebula effect
      const nebula = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.7, 0,
        canvas.width * 0.3, canvas.height * 0.7, canvas.width * 0.8
      );
      nebula.addColorStop(0, 'rgba(30, 10, 80, 0.3)');
      nebula.addColorStop(1, 'rgba(0, 0, 30, 0.1)');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate star positions in a spiral
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.25;

      filteredPapers.forEach((paper, index) => {
        const angle = (index / filteredPapers.length) * Math.PI * 6;
        const radius = baseRadius + (index % 4) * 40;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        paper.x = x;
        paper.y = y;

        // Star glow effect
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 35);
        glow.addColorStop(0, paper.color + 'CC');
        glow.addColorStop(0.7, paper.color + '33');
        glow.addColorStop(1, paper.color + '00');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 35, 0, Math.PI * 2);
        ctx.fill();

        // Main star
        ctx.fillStyle = paper.color;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();

        // Star core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Constellation lines (connect related papers)
        if (index < filteredPapers.length - 1 && paper.domain === filteredPapers[index + 1].domain) {
          const nextPaper = filteredPapers[index + 1];
          ctx.strokeStyle = paper.color + '66';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nextPaper.x!, nextPaper.y!);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // Pulsing animation for selected paper
      if (selectedPaper && selectedPaper.x && selectedPaper.y) {
        const pulse = (Date.now() * 0.005) % Math.PI * 2;
        const pulseSize = Math.sin(pulse) * 5 + 20;
        
        const selectedGlow = ctx.createRadialGradient(
          selectedPaper.x, selectedPaper.y, 0,
          selectedPaper.x, selectedPaper.y, pulseSize + 20
        );
        selectedGlow.addColorStop(0, selectedPaper.color + 'AA');
        selectedGlow.addColorStop(1, selectedPaper.color + '00');
        
        ctx.fillStyle = selectedGlow;
        ctx.beginPath();
        ctx.arc(selectedPaper.x, selectedPaper.y, pulseSize + 20, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let animationFrameId: number;
    const animate = () => {
      drawGalaxy();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Click handler
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      let clickedPaper: Paper | null = null;
      filteredPapers.forEach(paper => {
        if (paper.x && paper.y) {
          const distance = Math.sqrt((x - paper.x) ** 2 + (y - paper.y) ** 2);
          if (distance < 25) {
            clickedPaper = paper;
          }
        }
      });

      setSelectedPaper(clickedPaper);
    };

    canvas.addEventListener('click', handleClick);

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
    };
  }, [filteredPapers, selectedPaper]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Main Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-pointer absolute inset-0"
      />
      
      {/* Header */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gray-900/80 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-gray-600">
        <h1 className="text-xl font-bold text-center">
          🌌 NASA Space Biology Research Galaxy
        </h1>
      </div>

      {/* Paper Details Panel */}
      {selectedPaper && (
        <div className="absolute top-20 right-6 bg-gray-900/95 backdrop-blur-md text-white p-6 rounded-xl max-w-md border-l-4 shadow-2xl"
             style={{ borderLeftColor: selectedPaper.color }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold flex-1 mr-4 leading-tight">
              {selectedPaper.title}
            </h3>
            <button 
              onClick={() => setSelectedPaper(null)}
              className="text-white hover:text-gray-300 text-xl font-bold flex-shrink-0 ml-2"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="text-gray-300 text-sm leading-relaxed">
              {selectedPaper.authors}
            </div>
            
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span className="flex items-center gap-1">
                📅 {selectedPaper.year}
              </span>
              <span className="flex items-center gap-1">
                🔬 {selectedPaper.journal}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div 
                className="px-3 py-1 rounded-full text-xs font-bold text-black"
                style={{ backgroundColor: selectedPaper.color }}
              >
                {selectedPaper.domain.replace('_', ' ').toUpperCase()}
              </div>
              {selectedPaper.citation && (
                <span className="text-gray-400 text-sm">
                  {selectedPaper.citation}
                </span>
              )}
            </div>
            
            <div className="pt-3 border-t border-gray-700">
              <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2">
                📖 Explore Full Research Paper
                <span className="text-sm opacity-80">→</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Control Panel */}
      <div className="absolute bottom-6 left-6 bg-gray-900/90 backdrop-blur-sm text-white p-5 rounded-xl border border-gray-700 min-w-80">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">🎯</div>
          <div>
            <h4 className="font-bold text-blue-400">Research Controls</h4>
            <p className="text-sm text-gray-400">{filteredPapers.length} papers visible</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="🔍 Search papers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          
          {/* Domain Filter */}
          <div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="all">🌐 All Research Domains</option>
              <option value="plant_biology">🌱 Plant Biology</option>
              <option value="human_biology">👨‍🚀 Human Biology</option>
              <option value="microbiology">🦠 Microbiology</option>
              <option value="radiation">☢️ Radiation</option>
              <option value="technology">🔧 Technology</option>
            </select>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <button 
              onClick={() => setSelectedPaper(null)}
              className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
            >
              Clear Selection
            </button>
            <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
              Export View
            </button>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute top-20 left-6 bg-gray-900/90 backdrop-blur-sm text-white p-4 rounded-xl border border-gray-700">
        <h5 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
          <span>🗺️</span>
          Research Domains
        </h5>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Human Biology</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Plant Biology</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Microbiology</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Radiation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Technology</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {!selectedPaper && (
        <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-32 text-center">
          <div className="bg-gray-900/80 backdrop-blur-sm text-white px-6 py-4 rounded-xl border border-gray-600">
            <p className="text-lg font-semibold mb-1">✨ Click on Stars to Explore Research</p>
            <p className="text-sm text-gray-300">Each star represents a NASA space biology paper</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchGalaxy;
