
'use client';
import React, { useState, useEffect, useRef } from 'react';

const DNAExplorer = () => {
  const [dnaSequence, setDnaSequence] = useState('');
  const [mutations, setMutations] = useState<any[]>([]);
  const [radiationLevel, setRadiationLevel] = useState(0);
  const [repairEfficiency, setRepairEfficiency] = useState(80);
  const [activeView, setActiveView] = useState('helix');
  const [selectedBase, setSelectedBase] = useState<any | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Generate sample DNA sequence
  useEffect(() => {
    const bases = ['A', 'T', 'C', 'G'];
    let sequence = '';
    for (let i = 0; i < 100; i++) {
      sequence += bases[Math.floor(Math.random() * bases.length)];
    }
    setDnaSequence(sequence);
  }, []);

  useEffect(() => {
    simulateMutations(dnaSequence, radiationLevel);
  }, [dnaSequence, radiationLevel, repairEfficiency]);


  // Simulate radiation-induced mutations
  const simulateMutations = (sequence: string, radiation: number) => {
    if (!sequence) return;
    const mutationTypes = ['point', 'deletion', 'insertion', 'strand_break'];
    const newMutations: any[] = [];
    
    // Calculate number of mutations based on radiation level
    const mutationCount = Math.floor((radiation / 100) * 20);
    
    for (let i = 0; i < mutationCount; i++) {
      const position = Math.floor(Math.random() * sequence.length);
      const type = mutationTypes[Math.floor(Math.random() * mutationTypes.length)];
      
      newMutations.push({
        position,
        type,
        repaired: Math.random() < (repairEfficiency / 100),
        severity: Math.floor(Math.random() * 3) + 1 // 1-3
      });
    }
    
    setMutations(newMutations);
  };

  // DNA helix visualization
  useEffect(() => {
    if (activeView !== 'helix' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;

    let frameCount = 0;

    const drawHelix = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);
      
      // Draw background
      ctx.fillStyle = 'hsl(var(--card))';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const totalBases = 100;
      const amplitude = width * 0.15;
      const frequency = 5;
      const verticalSpacing = 5;
      const totalHeight = totalBases * verticalSpacing;
      const startY = (height - totalHeight) / 2;


      for(let i=0; i<totalBases; i++) {
        const angle = (i/frequency) + (frameCount * 0.01);
        const y = startY + i * verticalSpacing;
        const x1 = centerX + Math.cos(angle) * amplitude;
        const x2 = centerX - Math.cos(angle) * amplitude;
        const z = Math.sin(angle);

        const mutation = mutations.find(m => m.position === i);
        
        // Base pairs
        const baseColor = mutation ? 'hsl(var(--destructive))' : 'hsl(var(--primary))';
        const baseSize = 3 + z * 2;
        
        ctx.fillStyle = baseColor;
        ctx.fillRect(Math.min(x1,x2), y - baseSize/2, Math.abs(x1-x2), baseSize);
        
        // Phosphates
        const phosphateSize = 4 + z * 2;
        ctx.fillStyle = 'hsl(var(--accent))';
        ctx.beginPath();
        ctx.arc(x1, y, phosphateSize/2, 0, 2*Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x2, y, phosphateSize/2, 0, 2*Math.PI);
        ctx.fill();
        
      }

      animationRef.current = requestAnimationFrame(drawHelix);
    };

    drawHelix();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dnaSequence, mutations, activeView, isAnimating]);

  const getComplementaryBase = (base: string) => {
    const complements: {[key: string]: string} = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
    return complements[base] || '?';
  };

  const handleBaseClick = (position: number, base: string) => {
    const mutation = mutations.find(m => m.position === position);
    setSelectedBase({
      position,
      base,
      complementary: getComplementaryBase(base),
      mutation
    });
  };

  const simulateRadiationExposure = () => {
    setIsAnimating(true);
    setTimeout(() => {
      simulateMutations(dnaSequence, radiationLevel);
      setIsAnimating(false);
    }, 1000);
  };

  const getMutationTypeIcon = (type: string) => {
    const icons: {[key: string]: string} = {
      'point': '⚡',
      'deletion': '➖',
      'insertion': '➕',
      'strand_break': '💥'
    };
    return icons[type] || '❓';
  };

  const getMutationDescription = (type: string) => {
    const descriptions: {[key: string]: string} = {
      'point': 'Single base substitution',
      'deletion': 'Base pair removal',
      'insertion': 'Extra base pair added',
      'strand_break': 'DNA strand broken'
    };
    return descriptions[type] || 'Unknown mutation';
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-headline font-bold mb-2">DNA Cosmic Explorer</h1>
        <p className="text-muted-foreground">Analyze space radiation effects on DNA structure and function</p>
      </div>

      {/* Controls Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radiation Controls */}
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-bold font-headline mb-4">Radiation Simulation</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Radiation Level: {radiationLevel} mSv
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={radiationLevel}
                onChange={(e) => setRadiationLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Earth (0)</span>
                <span>ISS (50)</span>
                <span>Deep Space (100)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Repair Efficiency: {repairEfficiency}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={repairEfficiency}
                onChange={(e) => setRepairEfficiency(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <button
              onClick={simulateRadiationExposure}
              disabled={isAnimating}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all text-white ${
                isAnimating 
                  ? 'bg-muted-foreground cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-500'
              }`}
            >
              {isAnimating ? 'Simulating...' : 'Apply Radiation Exposure'}
            </button>
          </div>
        </div>

        {/* View Controls */}
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-bold font-headline mb-4">Visualization</h2>
          <div className="space-y-3">
            {[
              { id: 'helix', name: '3D Helix', icon: '🧬', description: 'Interactive DNA double helix' },
              { id: 'sequence', name: 'Sequence', icon: '📝', description: 'Linear base pair sequence' },
              { id: 'damage', name: 'Damage Map', icon: '🗺️', description: 'Mutation hotspots' }
            ].map(view => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`w-full p-3 rounded-lg text-left transition-all border-2 ${
                  activeView === view.id 
                    ? 'border-primary bg-primary/20' 
                    : 'bg-muted hover:bg-primary/10 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{view.icon}</span>
                  <div>
                    <div className="font-semibold text-foreground">{view.name}</div>
                    <div className="text-sm text-muted-foreground">{view.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-bold font-headline mb-4">DNA Health Metrics</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Mutations:</span>
              <span className="text-foreground font-semibold">{mutations.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Repaired:</span>
              <span className="text-green-400 font-semibold">
                {mutations.filter(m => m.repaired).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unrepaired:</span>
              <span className="text-red-400 font-semibold">
                {mutations.filter(m => !m.repaired).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Damage Score:</span>
              <span className={`font-semibold ${
                mutations.length === 0 ? 'text-green-400' :
                mutations.length < 3 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {mutations.length * 5}%
              </span>
            </div>
            <div className="pt-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${repairEfficiency}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">DNA Repair Efficiency</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Visualization */}
      <div className="bg-card rounded-lg p-6 border">
        <h2 className="text-xl font-bold font-headline mb-4">
          {activeView === 'helix' && 'DNA Double Helix'}
          {activeView === 'sequence' && 'Base Pair Sequence'}
          {activeView === 'damage' && 'Radiation Damage Map'}
        </h2>

        {activeView === 'helix' && (
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={550}
              className="w-full h-[32rem] bg-card rounded-lg"
            />
            <div className="absolute bottom-4 left-4 bg-background/80 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Live simulation of DNA strand</div>
            </div>
          </div>
        )}

        {activeView === 'sequence' && (
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="font-mono text-sm leading-8 text-center break-all">
              {dnaSequence.split('').map((base, index) => {
                const mutation = mutations.find(m => m.position === index);
                return (
                  <span
                    key={index}
                    onClick={() => handleBaseClick(index, base)}
                    className={`inline-flex items-center justify-center w-6 h-6 m-1 rounded cursor-pointer transition-all font-bold ${
                      mutation 
                        ? (mutation.repaired 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white animate-pulse')
                        : getBaseColor(base)
                    } hover:scale-125`}
                    title={`Position ${index}: ${base} → ${getComplementaryBase(base)}${mutation ? ` - ${getMutationDescription(mutation.type)}` : ''}`}
                  >
                    {base}
                  </span>
                );
              })}
            </div>
            <div className="text-center text-muted-foreground text-sm mt-4">
              Sequence Length: {dnaSequence.length} base pairs
            </div>
          </div>
        )}

        {activeView === 'damage' && (
          <div className="bg-muted/50 rounded-lg p-6">
             {mutations.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                    No mutations detected. Increase radiation level to simulate DNA damage.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mutations.map((mutation, index) => (
                    <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                        mutation.repaired 
                        ? 'border-green-500/50 bg-green-900/20' 
                        : 'border-red-500/50 bg-red-900/20'
                    }`}
                    >
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getMutationTypeIcon(mutation.type)}</span>
                        <div>
                        <div className="font-semibold text-foreground">
                            Position {mutation.position}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {getMutationDescription(mutation.type)}
                        </div>
                        </div>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Severity:</span>
                        <span className="text-yellow-400">{'⚠️'.repeat(mutation.severity)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={mutation.repaired ? 'text-green-400' : 'text-red-400'}>
                        {mutation.repaired ? 'Repaired' : 'Unrepaired'}
                        </span>
                    </div>
                    </div>
                ))}
                </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Base Details */}
      {selectedBase && (
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-bold font-headline mb-4">Base Pair Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-2">Base Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Position:</span>
                    <span className="text-foreground">{selectedBase.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Pair:</span>
                    <span className="text-foreground">
                      {selectedBase.base} - {selectedBase.complementary}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bond Type:</span>
                    <span className="text-foreground">
                      {(['A', 'T'].includes(selectedBase.base)) ? 'Double (2 H-bonds)' : 'Triple (3 H-bonds)'}
                    </span>
                  </div>
                </div>
              </div>

              {selectedBase.mutation && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Mutation Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="text-foreground">{getMutationDescription(selectedBase.mutation.type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Severity:</span>
                      <span className="text-yellow-400">{selectedBase.mutation.severity}/3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Repair Status:</span>
                      <span className={selectedBase.mutation.repaired ? 'text-green-400' : 'text-red-400'}>
                        {selectedBase.mutation.repaired ? 'Repaired' : 'Requires Repair'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-foreground mb-2">Biological Impact</h3>
              <div className="space-y-3 mt-4">
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Protein Coding Impact</span>
                    <span className={selectedBase.mutation ? 'text-red-400' : 'text-green-400'}>
                      {selectedBase.mutation ? 'High' : 'None'}
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-red-500"
                      style={{ width: `${selectedBase.mutation ? '75' : '0'}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Repair Complexity</span>
                     <span className="text-yellow-400">
                      {selectedBase.mutation ? 
                        (selectedBase.mutation.type === 'strand_break' ? 'High' : 'Medium') 
                        : 'None'
                      }
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-orange-500"
                      style={{ 
                        width: `${selectedBase.mutation ? 
                          (selectedBase.mutation.type === 'strand_break' ? '90' : '60') 
                          : '0'
                        }%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Cancer Risk</span>
                    <span className={selectedBase.mutation && !selectedBase.mutation.repaired ? 'text-purple-400' : 'text-green-400'}>
                      {selectedBase.mutation && !selectedBase.mutation.repaired ? 'Elevated' : 'Normal'}
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-purple-500"
                      style={{ 
                        width: `${selectedBase.mutation && !selectedBase.mutation.repaired ? '40' : '5'}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-card rounded-lg p-6 border">
        <h2 className="text-xl font-bold font-headline mb-4">DNA Base Color Legend</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { base: 'A', color: 'bg-red-500', name: 'Adenine' },
            { base: 'T', color: 'bg-blue-500', name: 'Thymine' },
            { base: 'C', color: 'bg-green-500', name: 'Cytosine' },
            { base: 'G', color: 'bg-yellow-500', name: 'Guanine' }
          ].map(item => (
            <div key={item.base} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded ${item.color} flex items-center justify-center text-white font-bold`}>
                {item.base}
              </div>
              <div>
                <div className="text-foreground font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.base}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function for base colors
const getBaseColor = (base: string) => {
  const colors: {[key: string]: string} = {
    'A': 'bg-red-500 text-white',
    'T': 'bg-blue-500 text-white',
    'C': 'bg-green-500 text-white',
    'G': 'bg-yellow-500 text-white'
  };
  return colors[base] || 'bg-gray-500 text-white';
};

export default DNAExplorer;

    