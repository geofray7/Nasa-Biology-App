
'use client';
import React, { useRef, useState, useEffect } from 'react';

interface PaperStar {
  id: string;
  title: string;
  authors: string;
  year: string;
  domain: string;
  color: string;
}

const ResearchGalaxy = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPaper, setSelectedPaper] = useState<PaperStar | null>(null);
  const [loading, setLoading] = useState(true);

  // Sample papers data
  const samplePapers: PaperStar[] = [
    {
      id: '1',
      title: 'Effects of Microgravity on Plant Growth',
      authors: 'NASA Plant Biology Team',
      year: '2023',
      domain: 'plant_biology',
      color: '#22c55e'
    },
    {
      id: '2', 
      title: 'Space Radiation Impact on Human DNA',
      authors: 'NASA Radiation Research Team',
      year: '2024',
      domain: 'radiation',
      color: '#a855f7'
    },
    {
      id: '3',
      title: 'Microbial Adaptation in ISS Environment',
      authors: 'NASA Microbiology Team', 
      year: '2023',
      domain: 'microbiology',
      color: '#3b82f6'
    },
    {
      id: '4',
      title: 'Astronaut Cardiovascular Health in Space',
      authors: 'NASA Medical Team',
      year: '2024', 
      domain: 'human_biology',
      color: '#ef4444'
    },
    {
      id: '5',
      title: 'Advanced Biosensors for Space Biology',
      authors: 'NASA Technology Team',
      year: '2024',
      domain: 'technology', 
      color: '#eab308'
    }
  ];

  useEffect(() => {
    // Simple 2D canvas implementation that always works
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create space background
    const drawSpace = () => {
      // Black background
      ctx.fillStyle = '#000011';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1.5;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nebula effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      gradient.addColorStop(0, 'rgba(30, 10, 60, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 0, 20, 0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Draw paper stars
    const drawStars = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.3;

      samplePapers.forEach((paper, index) => {
        const angle = (index / samplePapers.length) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Star glow
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 20);
        glow.addColorStop(0, paper.color);
        glow.addColorStop(1, 'transparent');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Star core
        ctx.fillStyle = paper.color;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Constellation lines
        if (index < samplePapers.length - 1) {
          const nextAngle = ((index + 1) / samplePapers.length) * Math.PI * 2;
          const nextX = centerX + Math.cos(nextAngle) * radius;
          const nextY = centerY + Math.sin(nextAngle) * radius;

          ctx.strokeStyle = 'rgba(100, 100, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();
        }
      });
    };

    let animationFrameId: number;
    const animate = () => {
      drawSpace();
      drawStars();
      
      // Rotate slowly
      if (canvasRef.current) {
        // This kind of rotation is better handled inside the canvas draw loop for performance
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    setLoading(false);

    // Click handler
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.3;

      samplePapers.forEach((paper, index) => {
        const angle = (index / samplePapers.length) * Math.PI * 2;
        const starX = centerX + Math.cos(angle) * radius;
        const starY = centerY + Math.sin(angle) * radius;

        // Check if click is near star
        const distance = Math.sqrt((x - starX) ** 2 + (y - starY) ** 2);
        if (distance < 25) {
          setSelectedPaper(paper);
        }
      });
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <div className="text-6xl mb-4 animate-bounce">🚀</div>
        <h2 className="text-2xl font-bold mb-2">Initializing Research Galaxy...</h2>
        <p className="text-gray-400">Calibrating star charts and aligning constellations...</p>
        <div className="mt-4 w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-pulse" style={{ width: '80%' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-pointer"
      />
      
      {/* Paper Details Panel */}
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
          
          <div className="space-y-3">
            <div className="text-gray-300">{selectedPaper.authors}</div>
            <div className="flex gap-4 text-gray-400">
              <span>📅 {selectedPaper.year}</span>
              <span>🔬 {selectedPaper.domain.replace('_', ' ')}</span>
            </div>
            <div className="pt-3 border-t border-gray-700">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                📖 View Research Paper
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Control Panel */}
      <div className="absolute bottom-6 left-6 bg-gray-900/90 text-white p-4 rounded-xl backdrop-blur-sm">
        <h4 className="font-bold text-lg mb-2 text-blue-400">🌌 Research Galaxy</h4>
        <div className="text-sm space-y-1">
          <div>Exploring: <strong>{samplePapers.length}</strong> NASA papers</div>
          <div className="text-gray-400 text-xs">Click stars to explore research</div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute top-6 left-6 bg-gray-900/90 text-white p-4 rounded-xl backdrop-blur-sm">
        <h5 className="font-bold mb-3 text-blue-400">Research Domains</h5>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            Human Biology
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            Plant Biology
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            Microbiology
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
            Radiation
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            Technology
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white/60 pointer-events-none">
        <p className="text-lg mb-2">✨ Click on stars to explore NASA research</p>
        <p className="text-sm">Each star represents a space biology paper</p>
      </div>
    </div>
  );
};

export default ResearchGalaxy;
