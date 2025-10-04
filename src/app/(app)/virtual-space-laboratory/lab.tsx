'use client';
import React, { useState, useEffect } from 'react';

const VirtualSpaceLab = () => {
  const [activeExperiment, setActiveExperiment] = useState('plant-growth');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);

  // Plant Growth Experiment State
  const [plantParams, setPlantParams] = useState({
    lightIntensity: 50,
    co2Level: 400,
    nutrients: 70,
    gravity: 0.16 // Moon gravity
  });

  // Radiation Experiment State
  const [radiationParams, setRadiationParams] = useState({
    radiationDose: 50,
    exposureTime: 24,
    cellType: 'human',
    shielding: 30
  });

  // Microbiome Experiment State
  const [microbiomeParams, setMicrobiomeParams] = useState({
    temperature: 22,
    pressure: 101,
    species: 'mixed',
    nutrients: 80
  });

  // Run experiment simulation
  const runExperiment = () => {
    setIsRunning(true);
    setResults(null);
    
    // Simulate experiment processing
    setTimeout(() => {
      let experimentResults = {};
      
      switch (activeExperiment) {
        case 'plant-growth':
          experimentResults = simulatePlantGrowth(plantParams);
          break;
        case 'radiation':
          experimentResults = simulateRadiationEffects(radiationParams);
          break;
        case 'microbiome':
          experimentResults = simulateMicrobiomeChanges(microbiomeParams);
          break;
      }
      
      setResults(experimentResults);
      setIsRunning(false);
    }, 2000);
  };

  useEffect(() => {
    setResults(null);
  }, [activeExperiment]);

  // Simulation functions
  const simulatePlantGrowth = (params) => {
    const growthRate = (params.lightIntensity * params.nutrients * (params.gravity > 0 ? params.gravity : 0.01)) / 5000;
    const biomass = growthRate * 100;
    const oxygenProduction = biomass * 0.8;
    
    return {
      growthRate: growthRate.toFixed(2),
      biomass: Math.round(biomass),
      oxygenProduction: Math.round(oxygenProduction),
      health: params.lightIntensity > 30 && params.nutrients > 40 ? 'Healthy' : 'Stressed'
    };
  };

  const simulateRadiationEffects = (params) => {
    const survivalRate = 100 - (params.radiationDose * params.exposureTime) / 100 + params.shielding;
    const mutationRate = (params.radiationDose * params.exposureTime) / (params.shielding * 5 + 1);
    const repairEfficiency = 100 - mutationRate;
    
    return {
      survivalRate: Math.max(0, Math.min(100, Math.round(survivalRate))),
      mutationRate: Math.min(100, Math.round(mutationRate)),
      repairEfficiency: Math.max(0, Math.round(repairEfficiency)),
      riskLevel: mutationRate > 50 ? 'High' : mutationRate > 20 ? 'Medium' : 'Low'
    };
  };

  const simulateMicrobiomeChanges = (params) => {
    const diversity = (params.temperature * params.nutrients) / 100;
    const growthRate = (params.temperature - 20 + params.nutrients) / 2;
    const adaptation = (100 - Math.abs(params.temperature - 37) + params.nutrients) / 2;
    
    return {
      diversityIndex: diversity.toFixed(1),
      growthRate: Math.round(growthRate),
      adaptationScore: Math.round(adaptation),
      stability: adaptation > 60 ? 'Stable' : 'Volatile'
    };
  };

  const renderSliders = () => {
    switch (activeExperiment) {
      case 'plant-growth':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Light Intensity: {plantParams.lightIntensity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={plantParams.lightIntensity}
                onChange={(e) => setPlantParams({...plantParams, lightIntensity: parseInt(e.target.value)})}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                CO₂ Level: {plantParams.co2Level} ppm
              </label>
              <input
                type="range"
                min="200"
                max="1000"
                value={plantParams.co2Level}
                onChange={(e) => setPlantParams({...plantParams, co2Level: parseInt(e.target.value)})}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
             <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Nutrients: {plantParams.nutrients}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={plantParams.nutrients}
                  onChange={(e) => setPlantParams({...plantParams, nutrients: parseInt(e.target.value)})}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Gravity
              </label>
              <select
                value={plantParams.gravity}
                onChange={(e) => setPlantParams({...plantParams, gravity: parseFloat(e.target.value)})}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground"
              >
                <option value={1}>Earth (1g)</option>
                <option value={0.16}>Moon (0.16g)</option>
                <option value={0.38}>Mars (0.38g)</option>
                <option value={0.00001}>Microgravity (~0g)</option>
              </select>
            </div>
          </>
        )
      case 'radiation':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Radiation Dose: {radiationParams.radiationDose} mSv
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={radiationParams.radiationDose}
                onChange={(e) => setRadiationParams({...radiationParams, radiationDose: parseInt(e.target.value)})}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Exposure Time: {radiationParams.exposureTime} hours
              </label>
              <input
                type="range"
                min="1"
                max="168"
                value={radiationParams.exposureTime}
                onChange={(e) => setRadiationParams({...radiationParams, exposureTime: parseInt(e.target.value)})}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
             <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Shielding: {radiationParams.shielding}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={radiationParams.shielding}
                  onChange={(e) => setRadiationParams({...radiationParams, shielding: parseInt(e.target.value)})}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
          </>
        )
      case 'microbiome':
        return (
           <>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Temperature: {microbiomeParams.temperature}°C
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={microbiomeParams.temperature}
                onChange={(e) => setMicrobiomeParams({...microbiomeParams, temperature: parseInt(e.target.value)})}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Nutrients: {microbiomeParams.nutrients}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={microbiomeParams.nutrients}
                onChange={(e) => setMicrobiomeParams({...microbiomeParams, nutrients: parseInt(e.target.value)})}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </>
        )
    }
  }

  const renderResultVisualization = () => {
    if(!results) return null;

    switch (activeExperiment) {
      case 'plant-growth':
        const growthScale = Math.min(2, Math.max(0.2, parseFloat(results.growthRate)));
        return (
           <div className="flex justify-center items-center h-full">
            <div 
              className="text-8xl transition-transform duration-1000" 
              style={{ transform: `scale(${growthScale})`}}
            >
              🌱
            </div>
          </div>
        )
       case 'radiation':
        const damage = results.mutationRate / 100;
        return (
          <div className="flex justify-center items-center h-full text-8xl">
            <span style={{opacity: 1-damage}}>🧬</span>
            <span className="absolute text-red-500" style={{opacity: damage, clipPath: `inset(0 0 ${100 - damage*100}% 0)`}}>🧬</span>
          </div>
        )
      case 'microbiome':
        return (
          <div className="flex justify-center items-center h-full text-8xl">
            🔬
          </div>
        )
    }
  }


  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Experiment Selection */}
        <div className="lg:col-span-1 bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-bold font-headline mb-4">Select Experiment</h2>
          <div className="space-y-3">
            {[
              { id: 'plant-growth', name: 'Plant Growth', icon: '🌱', description: 'Study plant development in microgravity' },
              { id: 'radiation', name: 'Radiation Effects', icon: '☢️', description: 'Analyze cellular damage from radiation' },
              { id: 'microbiome', name: 'Microbiome', icon: '🦠', description: 'Observe microbial changes in space' }
            ].map(exp => (
              <button
                key={exp.id}
                onClick={() => setActiveExperiment(exp.id)}
                className={`w-full p-4 rounded-lg text-left transition-all border-2 ${
                  activeExperiment === exp.id 
                    ? 'bg-primary/20 border-primary' 
                    : 'bg-muted hover:bg-primary/10 border-transparent'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl bg-background p-2 rounded-md">{exp.icon}</span>
                  <div>
                    <div className="font-semibold text-card-foreground">{exp.name}</div>
                    <div className="text-sm text-muted-foreground">{exp.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Control & Results Panel */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-xl font-bold font-headline mb-4">Experiment Controls</h2>
              <div className="space-y-4">
                {renderSliders()}
              </div>
              <button
                onClick={runExperiment}
                disabled={isRunning}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-all text-white ${
                  isRunning 
                    ? 'bg-muted-foreground cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-500'
                }`}
              >
                {isRunning ? 'Running Experiment...' : 'Start Experiment'}
              </button>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-xl font-bold font-headline mb-4">Results</h2>
              
              <div className="h-48 relative">
                {isRunning ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Simulating...</p>
                    </div>
                  </div>
                ) : results ? (
                  renderResultVisualization()
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Run an experiment to see the visualization
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>

       <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-bold font-headline mb-4">Metrics</h2>
           {isRunning ? (
                <div className="flex items-center justify-center h-24 text-muted-foreground">
                    <p>Calculating metrics...</p>
                </div>
           ) : results ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {activeExperiment === 'plant-growth' && (
                <>
                    <MetricCard value={`${results.growthRate}x`} label="Growth Rate" color="text-green-400" />
                    <MetricCard value={`${results.biomass}g`} label="Biomass" color="text-blue-400" />
                    <MetricCard value={`${results.oxygenProduction}ml/hr`} label="Oxygen Prod." color="text-cyan-400" />
                    <MetricCard value={results.health} label="Health" color="text-yellow-400" />
                </>
              )}

              {activeExperiment === 'radiation' && (
                <>
                  <MetricCard value={`${results.survivalRate}%`} label="Survival Rate" color="text-red-400" />
                  <MetricCard value={`${results.mutationRate}%`} label="Mutation Rate" color="text-purple-400" />
                  <MetricCard value={`${results.repairEfficiency}%`} label="Repair Efficiency" color="text-green-400" />
                  <MetricCard value={results.riskLevel} label="Risk Level" 
                    color={
                      results.riskLevel === 'High' ? 'text-red-500' : 
                      results.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                    } 
                  />
                </>
              )}

              {activeExperiment === 'microbiome' && (
                <>
                  <MetricCard value={results.diversityIndex} label="Diversity Index" color="text-blue-400" />
                  <MetricCard value={`${results.growthRate}%`} label="Growth Rate" color="text-green-400" />
                  <MetricCard value={`${results.adaptationScore}%`} label="Adaptation" color="text-yellow-400" />
                  <MetricCard value={results.stability} label="Stability" color="text-cyan-400" />
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-24 text-muted-foreground">
              Run an experiment to see metrics
            </div>
          )}
        </div>

    </div>
  );
};

const MetricCard = ({value, label, color}) => (
  <div className="bg-muted p-4 rounded-lg text-center">
    <div className={`text-2xl lg:text-3xl font-bold ${color}`}>{value}</div>
    <div className="text-sm text-muted-foreground mt-1">{label}</div>
  </div>
)

export default VirtualSpaceLab;
