'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { type ResearchPapersOutput } from '@/ai/flows/get-research-papers';
import { getResearchPapers } from '@/ai/flows/get-research-papers';

interface PaperNode {
  id: string;
  title: string;
  author: string;
  year: number;
  summary: string;
  keywords: string[];
}

interface PaperStar extends PaperNode {
  domain: string;
  position: [number, number, number];
  color: string;
  size: number;
  brightness: number;
}

const ResearchGalaxy = ({ papersData: initialPapersData }: { papersData: ResearchPapersOutput }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPaper, setSelectedPaper] = useState<PaperStar | null>(null);
  const [papers, setPapers] = useState<PaperStar[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const starGroupRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<{
    isDragging: boolean;
    previousMousePosition: { x: number, y: number };
    rotation: { x: number, y: number };
    reset: () => void;
  } | null>(null);


  // Smart domain detection
  const detectDomain = (paper: PaperNode) => {
    const title = paper.title?.toLowerCase() || '';
    const keywords = paper.keywords?.map((k: string) => k.toLowerCase()) || [];

    if (keywords.includes('plant biology')) return 'plant_biology';
    if (keywords.includes('microgravity')) return 'microbiology';
    if (keywords.includes('radiation')) return 'radiation';
    if (keywords.includes('astronaut health')) return 'human_biology';
    if (keywords.includes('materials science')) return 'technology';
    if (title.includes('plant') || title.includes('arabidopsis')) return 'plant_biology';
    if (title.includes('microbial') || title.includes('microbiome') || title.includes('bacteria')) return 'microbiology';
    if (title.includes('radiation') || title.includes('radiat')) return 'radiation';
    if (title.includes('astronaut') || title.includes('human') || title.includes('health')) return 'human_biology';
    if (title.includes('technology') || title.includes('sensor') || title.includes('device')) return 'technology';

    return 'general';
  };

  const getDomainColor = (domain: string) => {
    const colors: { [key: string]: string } = {
      human_biology: '#ff6b6b',
      plant_biology: '#51cf66',
      microbiology: '#339af0',
      radiation: '#cc5de8',
      technology: '#ffd43b',
      general: '#adb5bd',
    };
    return colors[domain] || '#adb5bd';
  };

  // Create beautiful spiral galaxy
  const calculateSpiralPosition = (index: number, total: number, domain: string): [number, number, number] => {
    const angle = (index / total) * Math.PI * 8;
    const radius = 2 + (index % 7);
    const height = (Math.random() - 0.5) * 4;

    const domainOffset: { [key: string]: number } = {
      human_biology: 0,
      plant_biology: Math.PI / 3,
      microbiology: (Math.PI * 2) / 3,
      radiation: Math.PI,
      technology: (Math.PI * 4) / 3,
      general: (Math.PI * 5) / 3,
    };

    return [
      Math.cos(angle + (domainOffset[domain] || 0)) * radius,
      height * 0.7,
      Math.sin(angle + (domainOffset[domain] || 0)) * radius,
    ];
  };

  const calculateStarSize = (paper: PaperNode) => {
    const baseSize = 0.1;
    const recencyBoost = (2024 - (paper.year || 2020)) * -0.02;
    return baseSize + recencyBoost;
  };

  const calculateBrightness = (year: number) => {
    const currentYear = new Date().getFullYear();
    const yearsAgo = currentYear - (year || currentYear);
    return Math.max(0.3, 1.0 - yearsAgo * 0.1);
  };
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    rendererRef.current = renderer;
    
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);

    camera.position.z = 8;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const starGroup = new THREE.Group();
    scene.add(starGroup);
    starGroupRef.current = starGroup;
    
    const backgroundStarsGeometry = new THREE.BufferGeometry();
    const backgroundStarsPositions = new Float32Array(5000 * 3);
    for (let i = 0; i < 15000; i++) {
      backgroundStarsPositions[i] = (Math.random() - 0.5) * 200;
    }
    backgroundStarsGeometry.setAttribute('position', new THREE.BufferAttribute(backgroundStarsPositions, 3));
    const backgroundStarsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.5 });
    const backgroundStars = new THREE.Points(backgroundStarsGeometry, backgroundStarsMaterial);
    scene.add(backgroundStars);


    const papers3D = initialPapersData.nodes.map((paper, index) => {
        const domain = detectDomain(paper);
        return {
            ...paper,
            domain: domain,
            position: calculateSpiralPosition(index, initialPapersData.nodes.length, domain),
            color: getDomainColor(domain),
            size: calculateStarSize(paper),
            brightness: calculateBrightness(paper.year),
        };
    });
    setPapers(papers3D);
    setLoading(false);

    papers3D.forEach(paper => {
      const geometry = new THREE.SphereGeometry(paper.size * 0.5, 16, 16);
      const material = new THREE.MeshStandardMaterial({ 
        color: paper.color,
        emissive: paper.color,
        emissiveIntensity: paper.brightness,
        metalness: 0.2,
        roughness: 0.8
      });
      
      const star = new THREE.Mesh(geometry, material);
      star.position.set(...paper.position);
      star.userData = paper;
      starGroup.add(star);
    });

    // Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotation = { x: starGroup.rotation.x, y: starGroup.rotation.y };

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };
      rotation.x += deltaMove.y * 0.01;
      rotation.y += deltaMove.x * 0.01;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onCanvasClick = (event: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(starGroup.children);
      if (intersects.length > 0) {
        setSelectedPaper(intersects[0].object.userData as PaperStar);
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.position.z += event.deltaY * 0.01;
      camera.position.z = Math.max(3, Math.min(25, camera.position.z));
    };

    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('click', onCanvasClick);
    canvas.addEventListener('wheel', onWheel);

    const animate = () => {
      requestAnimationFrame(animate);
      starGroup.rotation.x += (rotation.x - starGroup.rotation.x) * 0.1;
      starGroup.rotation.y += (rotation.y - starGroup.rotation.y) * 0.1;
      backgroundStars.rotation.y -= 0.0002;
      renderer.render(scene, camera);
    };
    
    animate();
    
    controlsRef.current = {
        isDragging,
        previousMousePosition,
        rotation,
        reset: () => {
            rotation.x = 0;
            rotation.y = 0;
            camera.position.z = 8;
        }
    };


    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('click', onCanvasClick);
      canvas.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, [initialPapersData]);

  const resetView = () => {
      if (controlsRef.current) {
          controlsRef.current.reset();
      }
  };

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = !searchTerm ||
      paper.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.author?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || paper.domain === filter;
    
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
      if(starGroupRef.current) {
          starGroupRef.current.children.forEach(child => {
              const paper = child.userData as PaperStar;
              child.visible = filteredPapers.some(p => p.id === paper.id);
          });
      }
  }, [filteredPapers]);

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
    <div className="relative w-full h-full bg-black overflow-hidden rounded-lg">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {selectedPaper && (
        <div className="absolute top-5 right-5 bg-[#000a1e]/95 text-white p-0 rounded-2xl max-w-md max-h-[80vh] overflow-y-auto backdrop-blur-lg border border-blue-900/50 shadow-2xl shadow-blue-500/10">
          <div className="p-5 border-l-4" style={{ borderLeftColor: selectedPaper.color }}>
            <div className="flex justify-between items-start">
              <h3 className="m-0 text-lg leading-snug flex-1">{selectedPaper.title}</h3>
              <button onClick={() => setSelectedPaper(null)} className="bg-transparent border-none text-white text-2xl cursor-pointer p-1 ml-2">&times;</button>
            </div>
          </div>
          <div className="p-5 border-t border-white/10">
              <p className="text-sm opacity-90 mb-2">{selectedPaper.author}</p>
              <div className="flex gap-4 text-xs opacity-70 mb-2">
                  <span className="year">{selectedPaper.year}</span>
              </div>
              <div className="inline-block px-2 py-1 rounded-full text-xs font-bold text-black" style={{ backgroundColor: selectedPaper.color }}>
                  {selectedPaper.domain.replace('_', ' ').toUpperCase()}
              </div>
          </div>
          <div className="p-5 border-t border-white/10">
              <strong>Summary:</strong>
              <p className="text-sm italic opacity-90 mt-1">{selectedPaper.summary}</p>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-6 left-6 bg-[#000a1e]/90 p-5 rounded-xl text-white backdrop-blur-lg border border-blue-900/40 min-w-[250px]">
        <h4 className="m-0 mb-4 text-blue-400 font-bold">🌌 Research Galaxy</h4>
        <input
          type="text"
          placeholder="🔍 Search papers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-blue-900/60 bg-white/10 text-white rounded-md mb-2.5"
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full p-2 border border-blue-900/60 bg-white/10 text-white rounded-md mb-2.5">
          <option value="all" className="text-black">All Domains</option>
          <option value="human_biology" className="text-black">Human Biology</option>
          <option value="plant_biology" className="text-black">Plant Biology</option>
          <option value="microbiology" className="text-black">Microbiology</option>
          <option value="radiation" className="text-black">Radiation</option>
          <option value="technology" className="text-black">Technology</option>
        </select>
        <div className="grid grid-cols-2 gap-2 mb-2.5">
          <button onClick={resetView} className="p-1.5 border border-blue-900/60 bg-blue-500/30 text-white rounded text-xs cursor-pointer">🎯 Reset View</button>
        </div>
        <div className="text-xs opacity-80 text-center">
          Displaying: <strong>{filteredPapers.length}</strong> of <strong>{papers.length}</strong> papers
        </div>
      </div>
      
      <div className="absolute top-5 left-6 bg-[#000a1e]/90 p-4 rounded-xl text-white backdrop-blur-lg border border-blue-900/40 text-xs">
        <h5 className="m-0 mb-2.5 text-blue-400 font-bold">Research Domains</h5>
        <div className="flex items-center mb-1.5"><span className="w-2.5 h-2.5 rounded-full mr-2" style={{ background: '#ff6b6b' }}></span>Human Biology</div>
        <div className="flex items-center mb-1.5"><span className="w-2.5 h-2.5 rounded-full mr-2" style={{ background: '#51cf66' }}></span>Plant Biology</div>
        <div className="flex items-center mb-1.5"><span className="w-2.5 h-2.5 rounded-full mr-2" style={{ background: '#339af0' }}></span>Microbiology</div>
        <div className="flex items-center mb-1.5"><span className="w-2.5 h-2.5 rounded-full mr-2" style={{ background: '#cc5de8' }}></span>Radiation</div>
        <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full mr-2" style={{ background: '#ffd43b' }}></span>Technology</div>
      </div>
    </div>
  );
};

export default function CosmicResearchGalaxyPageWrapper() {
  const [data, setData] = useState<ResearchPapersOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResearchPapers().then((fetchedData) => {
      setData(fetchedData);
      setLoading(false);
    }).catch(error => {
      console.error("Failed to fetch research papers:", error);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-black text-white">
        <div className="text-4xl mb-4 animate-[bounce_2s_ease-in-out_infinite]">🚀</div>
        <h3 className="text-2xl font-bold mb-2">Initializing Research Galaxy...</h3>
        <p className="text-blue-300">Calibrating star charts and aligning constellations...</p>
      </div>
    );
  }

  return <ResearchGalaxy papersData={data} />;
}
