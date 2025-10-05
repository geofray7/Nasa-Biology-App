'use client';
import React, { useRef, useState, useEffect } from 'react';

const ResearchGalaxy = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPaper, setSelectedPaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Sample papers
  const papers = [
    { id: 1, title: "Plant Growth in Microgravity", domain: "plant", color: "#22c55e", x: 100, y: 100 },
    { id: 2, title: "Space Radiation Effects", domain: "radiation", color: "#a855f7", x: 200, y: 150 },
    { id: 3, title: "Microbial Space Adaptation", domain: "microbiology", color: "#3b82f6", x: 150, y: 250 },
    { id: 4, title: "Astronaut Health Research", domain: "human", color: "#ef4444", x: 300, y: 200 },
    { id: 5, title: "Space Biology Technology", domain: "technology", color: "#eab308", x: 250, y: 100 },
  ];

  useEffect(() => {
    
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Draw everything immediately
    const drawGalaxy = () => {
      
      // Clear with space background
      ctx.fillStyle = '#000011';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw paper stars
      papers.forEach(paper => {
        // Glow effect
        const gradient = ctx.createRadialGradient(paper.x, paper.y, 0, paper.x, paper.y, 30);
        gradient.addColorStop(0, paper.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(paper.x, paper.y, 30, 0, Math.PI * 2);
        ctx.fill();

        // Star core
        ctx.fillStyle = paper.color;
        ctx.beginPath();
        ctx.arc(paper.x, paper.y, 12, 0, Math.PI * 2);
        ctx.fill();

        // Add sparkle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(paper.x - 5, paper.y - 5, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Draw immediately
    drawGalaxy();
    
    // Set loading to false after a short delay to ensure everything is drawn
    setTimeout(() => {
      setLoading(false);
    }, 500);

    // Click handler
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      papers.forEach(paper => {
        const distance = Math.sqrt((x - paper.x) ** 2 + (y - paper.y) ** 2);
        if (distance < 30) {
          setSelectedPaper(paper);
        }
      });
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  // If loading takes more than 3 seconds, force show content
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <div className="text-6xl mb-4 animate-bounce">🚀</div>
        <h2 className="text-2xl font-bold mb-2">Initializing Research Galaxy...</h2>
        <p className="text-gray-400 mb-4">Calibrating star charts and aligning constellations...</p>
        <div className="w-64 h-2 bg-gray-700 rounded-full">
          <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '75%' }}></div>
        </div>
        <button 
          onClick={() => setLoading(false)}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Skip Loading
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-pointer"
      />
      
      {/* Paper Details */}
      {selectedPaper && (
        <div className="absolute top-6 right-6 bg-gray-900/95 text-white p-6 rounded-xl max-w-md border-l-4 backdrop-blur-sm"
             style={{ borderLeftColor: selectedPaper.color }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold flex-1 mr-4">{selectedPaper.title}</h3>
            <button 
              onClick={() => setSelectedPaper(null)}
              className="text-white hover:text-gray-300 text-xl font-bold"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            <div className="text-gray-300">NASA Research Team</div>
            <div className="text-gray-400">2024 • {selectedPaper.domain.toUpperCase()}</div>
            <button className="w-full mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              📖 Explore Research Paper
            </button>
          </div>
        </div>
      )}
      
      {/* Controls */}
      <div className="absolute bottom-6 left-6 bg-gray-900/90 text-white p-4 rounded-xl backdrop-blur-sm">
        <h4 className="font-bold text-blue-400">🌌 Research Galaxy</h4>
        <p className="text-sm mt-1">Click stars to explore NASA research</p>
        <p className="text-xs text-gray-400 mt-2">{papers.length} papers loaded</p>
      </div>

      {/* Success Message */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="bg-green-600/90 text-white px-6 py-3 rounded-lg backdrop-blur-sm">
          <p className="text-lg font-bold">✅ Research Galaxy Ready!</p>
          <p className="text-sm">Click on the colored stars to explore papers</p>
        </div>
      </div>
    </div>
  );
};

export default ResearchGalaxy;
