'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';

const AdvancedResearchGalaxy = ({ papers = [], onPaperSelect, searchQuery = '' }) => {
  const [galaxyData, setGalaxyData] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [timeRange, setTimeRange] = useState([2010, 2024]);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [isAnimating, setIsAnimating] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  // Domain color mapping
  const domainColors = {
    'microgravity': '#3b82f6',
    'radiation': '#ef4444', 
    'plant biology': '#22c55e',
    'genomics': '#a855f7',
    'astrobiology': '#f59e0b',
    'materials science': '#ec4899',
    'animal models': '#06b6d4',
    'astronaut health': '#84cc16',
    'deep space': '#f97316',
    'terraforming': '#14b8a6',
    'lunar exploration': '#a1a1aa',
    'mars': '#dc2626',
    'space biology': '#ffffff'
  };

  const getKeywordColor = (keywords) => {
    if (!keywords || keywords.length === 0) return '#6b7280';
    for (const keyword of keywords) {
      const key = keyword.toLowerCase();
      if (domainColors[key]) {
        return domainColors[key];
      }
    }
    return '#6b7280';
  }


  // Initialize galaxy with force simulation
  useEffect(() => {
    if (!papers.length) return;

    const initializeGalaxy = () => {
      const filteredPapers = papers.filter(paper => 
        paper.year >= timeRange[0] && 
        paper.year <= timeRange[1] &&
        (selectedDomain === 'All' || paper.keywords.includes(selectedDomain))
      );

      // Create initial positions in 3D space
      const newGalaxyData = filteredPapers.map((paper, index) => {
        const angle = (index / filteredPapers.length) * Math.PI * 2;
        const radius = 150 + (paper.year - 2020) * 50;
        const height = (paper.year - 2010) * 10;
        
        return {
          ...paper,
          x: Math.cos(angle) * radius,
          y: height,
          z: Math.sin(angle) * radius,
          vx: 0, vy: 0, vz: 0, // Velocity
          fx: 0, fy: 0, fz: 0, // Force
          connections: paper.connections || []
        };
      });

      setGalaxyData(newGalaxyData);
      initializeParticles();
    };

    initializeGalaxy();
  }, [papers, timeRange, selectedDomain]);

  // Particle system for background
  const initializeParticles = () => {
    particlesRef.current = Array.from({ length: 200 }, () => ({
      x: Math.random() * 2000 - 1000,
      y: Math.random() * 2000 - 1000,
      z: Math.random() * 2000 - 1000,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      vz: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 2 + 0.5
    }));
  };

  // Advanced force simulation
  const runSimulation = useCallback(() => {
    if (!isAnimating || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear with space gradient
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/1.5);
    gradient.addColorStop(0, 'hsl(var(--background) / 0.1)');
    gradient.addColorStop(1, 'hsl(var(--background))');

    ctx.fillStyle = 'hsl(var(--background))';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);


    // Draw star field
    updateParticles(ctx, width, height);

    // Apply forces and update positions
    if (galaxyData.length > 0) {
      applyForces();
      updatePositions();
      drawGalaxy(ctx, width, height);
    }

    animationRef.current = requestAnimationFrame(runSimulation);
  }, [isAnimating, galaxyData, simulationSpeed]);

  // Physics simulation
  const applyForces = () => {
    const centerForce = 0.0001;
    const repulsionForce = 1000;
    const attractionForce = 0.01;

    galaxyData.forEach((paper, i) => {
      // Reset forces
      paper.fx = paper.fy = paper.fz = 0;

      // Center attraction
      paper.fx -= paper.x * centerForce;
      paper.fy -= paper.y * centerForce;
      paper.fz -= paper.z * centerForce;

      // Repulsion between all papers
      galaxyData.forEach((other, j) => {
        if (i === j) return;

        const dx = paper.x - other.x;
        const dy = paper.y - other.y;
        const dz = paper.z - other.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;

        const force = repulsionForce / (distance * distance);
        paper.fx += (dx / distance) * force;
        paper.fy += (dy / distance) * force;
        paper.fz += (dz / distance) * force;
      });

    });
  };

  const updatePositions = () => {
    const damping = 0.95;

    setGalaxyData(prev => prev.map(paper => {
      // Update velocity
      paper.vx = (paper.vx + paper.fx) * damping;
      paper.vy = (paper.vy + paper.fy) * damping;
      paper.vz = (paper.vz + paper.fz) * damping;

      // Update position
      return {
        ...paper,
        x: paper.x + paper.vx * simulationSpeed,
        y: paper.y + paper.vy * simulationSpeed,
        z: paper.z + paper.vz * simulationSpeed
      };
    }));
  };

  const updateParticles = (ctx, width, height) => {
    particlesRef.current.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.z += particle.vz;

      if (Math.abs(particle.x) > 1000) particle.x = -particle.x;
      if (Math.abs(particle.y) > 1000) particle.y = -particle.y;
      if (Math.abs(particle.z) > 1000) particle.z = -particle.z;

      const scale = 1000 / (1000 + particle.z);
      const x2d = particle.x * scale + width / 2;
      const y2d = particle.y * scale + height / 2;

      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + particle.z / 3000})`;
      ctx.beginPath();
      ctx.arc(x2d, y2d, particle.size * scale, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const drawGalaxy = (ctx, width, height) => {
    // Sort by Z for proper layering
    const sortedPapers = [...galaxyData].sort((a, b) => b.z - a.z);

    // Draw papers
    sortedPapers.forEach(paper => {
      const scale = 1000 / (1000 + paper.z);
      const x = paper.x * scale + width / 2;
      const y = paper.y * scale + height / 2;
      const size = (3 + (paper.year - 2020)) * scale;
      
      const isHighlighted = searchQuery && 
        (paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         paper.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())));

      const color = getKeywordColor(paper.keywords);
      
      // Glow effect
      ctx.shadowColor = isHighlighted ? '#fbbf24' : color;
      ctx.shadowBlur = isHighlighted ? 20 : 15;
      
      // Main circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      // Inner highlight
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'hsl(var(--card))';
      ctx.beginPath();
      ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Click hit area (invisible)
      ctx.fillStyle = 'transparent';
      ctx.beginPath();
      ctx.arc(x, y, size + 5, 0, Math.PI * 2);
      ctx.fill();

      // Store clickable area data
      paper.screenX = x;
      paper.screenY = y;
      paper.screenSize = size + 5;
    });
  };

  // Handle canvas clicks
  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find the topmost paper that was clicked
    const clickedPaper = [...galaxyData].sort((a,b) => b.z - a.z).find(paper => {
      const dx = paper.screenX - x;
      const dy = paper.screenY - y;
      return Math.sqrt(dx * dx + dy * dy) <= paper.screenSize;
    });

    if (clickedPaper) {
      setSelectedPaper(clickedPaper);
      if (onPaperSelect) onPaperSelect(clickedPaper);
    } else {
      setSelectedPaper(null);
    }
  };

  // Start animation
  useEffect(() => {
    if (isAnimating && canvasRef.current) {
      animationRef.current = requestAnimationFrame(runSimulation);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, runSimulation]);

  const exportGalaxyImage = () => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const link = document.createElement('a');
    link.download = `nasa-research-galaxy-${new Date().getTime()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const allKeywords = ['All', ...new Set(papers.flatMap(p => p.keywords))];

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search & Filters */}
        <div className="bg-card border rounded-lg p-6 lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">Time Range: {timeRange[0]} - {timeRange[1]}</label>
            <div className="flex space-x-2 items-center">
              <span className='text-xs'>{timeRange[0]}</span>
              <input
                  type="range"
                  min="2010"
                  max={timeRange[1]}
                  value={timeRange[0]}
                  onChange={(e) => setTimeRange([parseInt(e.target.value), timeRange[1]])}
                  className="flex-1"
                />
              <input
                type="range"
                min={timeRange[0]}
                max="2024"
                value={timeRange[1]}
                onChange={(e) => setTimeRange([timeRange[0], parseInt(e.target.value)])}
                className="flex-1"
              />
              <span className='text-xs'>{timeRange[1]}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Domain Filter</label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground"
              >
                {allKeywords.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
          </div>
        </div>
      </div>

      {/* Main Visualization */}
      <div className="bg-card rounded-lg p-1 relative overflow-hidden border">
        <canvas
          ref={canvasRef}
          width={1200}
          height={800}
          className="w-full h-[70vh] cursor-pointer rounded-lg"
          onClick={handleCanvasClick}
        />
        
        {/* HUD Overlay */}
        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg border">
          <div className="text-sm text-muted-foreground">
            <div>🖱️ Click papers for details</div>
            <div>🔍 {searchQuery ? `Searching: "${searchQuery}"` : 'No active search'}</div>
            <div>Displaying: {galaxyData.length} / {papers.length} papers</div>
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg border">
          <div className="flex items-center gap-2 text-sm">
            <button
                onClick={() => setIsAnimating(!isAnimating)}
                className="text-muted-foreground hover:text-foreground"
              >
              {isAnimating ? '⏸' : '▶️'}
            </button>
            <div className={`w-2 h-2 rounded-full ${isAnimating ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-muted-foreground">
              {isAnimating ? 'Live Sim' : 'Paused'}
            </span>
          </div>
        </div>
      </div>

      {/* Selected Paper Details */}
      {selectedPaper && (
        <div className="bg-card rounded-lg p-6 border animate-fade-in">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold font-headline">{selectedPaper.title}</h2>
            <button
              onClick={() => setSelectedPaper(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Paper Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Author:</span>
                    <span className="text-foreground text-right">{selectedPaper.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year:</span>
                    <span className="text-foreground">{selectedPaper.year}</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="lg:col-span-2">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Summary</h3>
                <p className="text-muted-foreground leading-relaxed">{selectedPaper.summary}</p>
              </div>

              {selectedPaper.keywords && selectedPaper.keywords.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPaper.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground border"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedResearchGalaxy;
