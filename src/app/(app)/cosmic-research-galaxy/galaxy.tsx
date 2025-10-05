'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { type ResearchPapersOutput } from '@/ai/flows/get-research-papers';

// --- Helper Functions ---

// Smart domain detection
const detectDomain = (paper: any) => {
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
  const radius = 1.5 + (index % 7);
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

const calculateStarSize = (paper: any) => {
  const baseSize = 0.1;
  const recencyBoost = (2024 - (paper.year || 2020)) * -0.02;
  return baseSize + recencyBoost;
};

const calculateBrightness = (year: number) => {
  const currentYear = new Date().getFullYear();
  const yearsAgo = currentYear - (year || currentYear);
  return Math.max(0.3, 1.0 - yearsAgo * 0.1);
};


// --- Components ---

// Individual Paper Star Component
const PaperStar = ({ paper, onClick, isSelected }: { paper: any; onClick: (p: any) => void; isSelected: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + parseInt(paper.id, 10)) * 0.001;

      const targetScale = hovered || isSelected ? 1.8 : paper.size;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={paper.position}
      onClick={() => onClick(paper)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial
        color={paper.color}
        emissive={paper.color}
        emissiveIntensity={paper.brightness}
        transparent={true}
        opacity={0.9}
      />
      <pointLight color={paper.color} intensity={0.4} distance={1.2} />

      {(hovered || isSelected) && (
        <mesh scale={[2, 2, 2]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color={paper.color} transparent={true} opacity={0.3} />
        </mesh>
      )}
    </mesh>
  );
};

// Constellation Lines Component
const ConstellationLines = ({ papers, links, constellationMode }: { papers: any[], links: any[], constellationMode: boolean }) => {
    const linesRef = useRef<THREE.Group>(null!);

    useFrame(() => {
        if (linesRef.current && constellationMode) {
            linesRef.current.rotation.y += 0.001;
        }
    });

    if (!constellationMode) return null;

    const paperMap = new Map(papers.map(p => [p.id, p]));

    const lineGeometries = links.map((link, index) => {
        const sourcePaper = paperMap.get(link.source);
        const targetPaper = paperMap.get(link.target);

        if (!sourcePaper || !targetPaper) return null;

        const start = new THREE.Vector3(...sourcePaper.position);
        const end = new THREE.Vector3(...targetPaper.position);

        return (
            <line key={index}>
                <bufferGeometry attach="geometry">
                    <bufferAttribute
                        attach="attributes-position"
                        count={2}
                        array={new Float32Array([...start.toArray(), ...end.toArray()])}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial color={sourcePaper.color} opacity={0.3} transparent />
            </line>
        );
    }).filter(Boolean);

    return <group ref={linesRef}>{lineGeometries}</group>;
};

// --- Main Galaxy Component ---

interface ResearchGalaxyProps {
  papersData: ResearchPapersOutput;
}

const ResearchGalaxy = ({ papersData }: ResearchGalaxyProps) => {
  const [selectedPaper, setSelectedPaper] = useState<any>(null);
  const [researchPapers, setResearchPapers] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [constellationMode, setConstellationMode] = useState(true);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (papersData?.nodes) {
        const papers3D = papersData.nodes.map((paper, index) => {
            const domain = detectDomain(paper);
            return {
                ...paper,
                domain: domain,
                position: calculateSpiralPosition(index, papersData.nodes.length, domain),
                color: getDomainColor(domain),
                size: calculateStarSize(paper),
                brightness: calculateBrightness(paper.year),
            };
        });
        setResearchPapers(papers3D);
    }
  }, [papersData]);

  const filteredPapers = researchPapers.filter(paper => {
    const matchesSearch = !searchTerm ||
      paper.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.author?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || paper.domain === filter;
    
    return matchesSearch && matchesFilter;
  });
  
  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="w-full h-[85vh] relative bg-black overflow-hidden rounded-lg">
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} />
        <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
        <fog attach="fog" args={['#000022', 5, 25]} />
        
        <ConstellationLines papers={researchPapers} links={papersData.links} constellationMode={constellationMode} />
        
        {filteredPapers.map((paper) => (
          <PaperStar 
            key={paper.id} 
            paper={paper}
            onClick={setSelectedPaper}
            isSelected={selectedPaper?.id === paper.id}
          />
        ))}
        
        <OrbitControls 
          ref={controlsRef}
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={25}
          rotateSpeed={0.3}
        />
        
        <ambientLight intensity={0.15} />
        <pointLight position={[10, 10, 10]} intensity={0.3} />
        <pointLight position={[-10, -5, -5]} intensity={0.2} color="#0044ff" />
      </Canvas>
      
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
          <button 
            className={`p-1.5 border border-blue-900/60 bg-blue-500/30 text-white rounded text-xs cursor-pointer ${constellationMode ? 'bg-blue-500/50 border-blue-400' : ''}`}
            onClick={() => setConstellationMode(!constellationMode)}
          >
            {constellationMode ? '🔗 Connections On' : '🔗 Connections Off'}
          </button>
          <button onClick={resetView} className="p-1.5 border border-blue-900/60 bg-blue-500/30 text-white rounded text-xs cursor-pointer">🎯 Reset View</button>
        </div>
        <div className="text-xs opacity-80 text-center">
          Exploring: <strong>{filteredPapers.length}</strong> papers
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

export default ResearchGalaxy;
