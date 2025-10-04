'use client';
import { useState, useEffect } from 'react';

const PlanetBiologyComparator = () => {
  const [activePlanet, setActivePlanet] = useState('earth');
  const [simulationParams, setSimulationParams] = useState({
    temperature: 22,
    pressure: 101,
    radiation: 0.1,
    gravity: 1.0,
    atmosphere: 'Earth-like'
  });

  const [biologicalData, setBiologicalData] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Planet configurations
  const planetConfigs = {
    earth: {
      name: 'Earth',
      color: 'bg-blue-500',
      icon: '🌍',
      gravity: 1.0,
      temperature: 22,
      pressure: 101,
      radiation: 0.1,
      atmosphere: 'Nitrogen-Oxygen',
      dayLength: '24 hours',
      description: 'Baseline terrestrial environment'
    },
    moon: {
      name: 'Moon',
      color: 'bg-gray-500',
      icon: '🌕',
      gravity: 0.16,
      temperature: -23,
      pressure: 0,
      radiation: 10.5,
      atmosphere: 'Trace',
      dayLength: '708 hours',
      description: 'Low gravity, high radiation environment'
    },
    mars: {
      name: 'Mars',
      color: 'bg-red-500',
      icon: '🪐',
      gravity: 0.38,
      temperature: -63,
      pressure: 0.6,
      radiation: 8.8,
      atmosphere: 'Carbon Dioxide',
      dayLength: '25 hours',
      description: 'Cold, thin atmosphere with moderate radiation'
    }
  };

  // Initialize simulation
  useEffect(() => {
    if (isSimulating) {
      runBiologicalSimulation();
    }
  }, [simulationParams, activePlanet, isSimulating]);

  const startSimulation = () => {
    setIsSimulating(true);
    runBiologicalSimulation();
  };

  const stopSimulation = () => {
    setIsSimulating(false);
  };

  const runBiologicalSimulation = () => {
    const planet = planetConfigs[activePlanet];
    
    // Calculate biological responses based on environmental parameters
    const responses = {
      plantGrowth: calculatePlantGrowth(planet, simulationParams),
      microbialSurvival: calculateMicrobialSurvival(planet, simulationParams),
      dnaDamage: calculateDnaDamage(planet, simulationParams),
      adaptationTime: calculateAdaptationTime(planet, simulationParams),
      resourceEfficiency: calculateResourceEfficiency(planet, simulationParams),
      terraformingPotential: calculateTerraformingPotential(planet, simulationParams)
    };

    setBiologicalData(responses);
  };

  // Simulation calculations
  const calculatePlantGrowth = (planet, params) => {
    const baseGrowth = 100;
    const gravityEffect = Math.max(0.1, planet.gravity);
    const tempEffect = 1 - Math.abs(planet.temperature - 22) / 100;
    const radiationEffect = 1 - (planet.radiation / 50);
    
    return Math.max(0, Math.min(100, baseGrowth * gravityEffect * tempEffect * radiationEffect));
  };

  const calculateMicrobialSurvival = (planet, params) => {
    const baseSurvival = 100;
    const pressureEffect = planet.pressure > 50 ? 1 : planet.pressure / 50;
    const tempEffect = 1 - Math.abs(planet.temperature + 10) / 100;
    const radiationEffect = 1 - (planet.radiation / 30);
    
    return Math.max(0, Math.min(100, baseSurvival * pressureEffect * tempEffect * radiationEffect));
  };

  const calculateDnaDamage = (planet, params) => {
    const baseDamage = planet.radiation * 2;
    const gravityEffect = 1 + (1 - planet.gravity) * 0.5;
    return Math.min(100, baseDamage * gravityEffect);
  };

  const calculateAdaptationTime = (planet, params) => {
    const earthTime = 1;
    const timeMultiplier = 1 + (1 - planet.gravity) + (planet.radiation / 5) + Math.abs(planet.temperature) / 50;
    return Math.round(earthTime * timeMultiplier * 10) / 10;
  };

  const calculateResourceEfficiency = (planet, params) => {
    const baseEfficiency = 100;
    const gravityEffect = planet.gravity;
    const tempEffect = 1 - Math.abs(planet.temperature) / 100;
    return Math.max(0, Math.min(100, baseEfficiency * gravityEffect * tempEffect));
  };

  const calculateTerraformingPotential = (planet, params) => {
    let potential = 100;
    
    // Negative factors
    potential -= (1 - planet.gravity) * 30;
    potential -= Math.abs(planet.temperature + 20) / 2;
    potential -= (10 - planet.pressure) * 2;
    potential -= planet.radiation * 3;
    
    return Math.max(0, Math.min(100, potential));
  };

  const updateParameter = (param, value) => {
    setSimulationParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const getComparisonData = () => {
    const comparisons = {};
    
    Object.keys(planetConfigs).forEach(planetKey => {
      const planet = planetConfigs[planetKey];
      comparisons[planetKey] = {
        plantGrowth: calculatePlantGrowth(planet, simulationParams),
        microbialSurvival: calculateMicrobialSurvival(planet, simulationParams),
        dnaDamage: calculateDnaDamage(planet, simulationParams),
        adaptationTime: calculateAdaptationTime(planet, simulationParams),
        resourceEfficiency: calculateResourceEfficiency(planet, simulationParams),
        terraformingPotential: calculateTerraformingPotential(planet, simulationParams)
      };
    });

    return comparisons;
  };

  const getStatusColor = (value) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    if (value >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getStatusBg = (value) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const comparisons = getComparisonData();
  const currentPlanet = planetConfigs[activePlanet];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Multi-Planet Biology Comparator</h1>
        <p className="text-gray-300">Compare biological adaptations across Earth, Moon, and Mars environments</p>
      </div>

      {/* Planet Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(planetConfigs).map(([key, planet]) => (
          <button
            key={key}
            onClick={() => setActivePlanet(key)}
            className={`p-6 rounded-lg text-left transition-all border-2 ${
              activePlanet === key 
                ? 'border-blue-500 bg-gray-800' 
                : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{planet.icon}</span>
              <div>
                <div className="text-xl font-bold text-white">{planet.name}</div>
                <div className="text-sm text-gray-400">{planet.description}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-300">Gravity:</div>
              <div className="text-white">{planet.gravity}g</div>
              <div className="text-gray-300">Temp:</div>
              <div className="text-white">{planet.temperature}°C</div>
              <div className="text-gray-300">Pressure:</div>
              <div className="text-white">{planet.pressure} kPa</div>
              <div className="text-gray-300">Radiation:</div>
              <div className="text-white">{planet.radiation} mSv/day</div>
            </div>
          </button>
        ))}
      </div>

      {/* Simulation Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parameter Controls */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Environmental Parameters</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Temperature: {simulationParams.temperature}°C
              </label>
              <input
                type="range"
                min="-100"
                max="50"
                value={simulationParams.temperature}
                onChange={(e) => updateParameter('temperature', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Atmospheric Pressure: {simulationParams.pressure} kPa
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={simulationParams.pressure}
                onChange={(e) => updateParameter('pressure', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Radiation Level: {simulationParams.radiation} mSv/day
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="0.1"
                value={simulationParams.radiation}
                onChange={(e) => updateParameter('radiation', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={startSimulation}
                disabled={isSimulating}
                className={`py-2 px-4 rounded-lg font-semibold ${
                  isSimulating 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-500'
                }`}
              >
                {isSimulating ? 'Simulating...' : 'Start Simulation'}
              </button>
              <button
                onClick={stopSimulation}
                disabled={!isSimulating}
                className={`py-2 px-4 rounded-lg font-semibold ${
                  !isSimulating 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-500'
                }`}
              >
                Stop Simulation
              </button>
            </div>
          </div>
        </div>

        {/* Current Planet Analysis */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            {currentPlanet.name} Biological Analysis
          </h2>
          
          {biologicalData ? (
            <div className="space-y-4">
              {[
                { label: 'Plant Growth Efficiency', value: biologicalData.plantGrowth, unit: '%', icon: '🌱' },
                { label: 'Microbial Survival Rate', value: biologicalData.microbialSurvival, unit: '%', icon: '🦠' },
                { label: 'DNA Damage Rate', value: biologicalData.dnaDamage, unit: '%', icon: '🧬' },
                { label: 'Adaptation Time', value: biologicalData.adaptationTime, unit: 'x Earth time', icon: '⏱️' },
                { label: 'Resource Efficiency', value: biologicalData.resourceEfficiency, unit: '%', icon: '⚡' },
                { label: 'Terraforming Potential', value: biologicalData.terraformingPotential, unit: '%', icon: '🏗️' }
              ].map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{metric.icon}</span>
                    <div>
                      <div className="text-sm text-gray-300">{metric.label}</div>
                      <div className={`text-lg font-semibold ${getStatusColor(metric.value)}`}>
                        {Math.round(metric.value)}{metric.unit}
                      </div>
                    </div>
                  </div>
                  <div className="w-24 bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getStatusBg(metric.value)}`}
                      style={{ width: `${Math.min(100, metric.value)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              Start simulation to see biological analysis
            </div>
          )}
        </div>
      </div>

      {/* Three-Planet Comparison */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">Three-Planet Comparison</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 text-gray-300">Biological Metric</th>
                {Object.entries(planetConfigs).map(([key, planet]) => (
                  <th key={key} className="text-center py-3">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl">{planet.icon}</span>
                      <span className="text-white">{planet.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Plant Growth', key: 'plantGrowth', unit: '%', reverse: false },
                { label: 'Microbial Survival', key: 'microbialSurvival', unit: '%', reverse: false },
                { label: 'DNA Damage', key: 'dnaDamage', unit: '%', reverse: true },
                { label: 'Adaptation Time', key: 'adaptationTime', unit: 'x', reverse: true },
                { label: 'Resource Efficiency', key: 'resourceEfficiency', unit: '%', reverse: false },
                { label: 'Terraforming Potential', key: 'terraformingPotential', unit: '%', reverse: false }
              ].map((metric, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-700">
                  <td className="py-3 text-gray-300 font-medium">{metric.label}</td>
                  {Object.keys(planetConfigs).map(planetKey => (
                    <td key={planetKey} className="py-3 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-lg font-semibold ${
                          getStatusColor(comparisons[planetKey][metric.key])
                        }`}>
                          {Math.round(comparisons[planetKey][metric.key])}{metric.unit}
                        </span>
                        <div className="w-16 bg-gray-600 rounded-full h-1 mt-1">
                          <div
                            className={`h-1 rounded-full ${
                              getStatusBg(comparisons[planetKey][metric.key])
                            }`}
                            style={{ width: `${Math.min(100, comparisons[planetKey][metric.key])}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adaptation Timeline */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Biological Adaptation Timeline</h2>
        <div className="space-y-4">
          {Object.entries(planetConfigs).map(([key, planet]) => (
            <div key={key} className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-32">
                <span className="text-2xl">{planet.icon}</span>
                <span className="text-white font-medium">{planet.name}</span>
              </div>
              <div className="flex-1 bg-gray-700 rounded-full h-4">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                  style={{ width: `${(1 / comparisons[key].adaptationTime) * 100}%` }}
                ></div>
              </div>
              <div className="text-gray-300 w-24 text-right">
                {comparisons[key].adaptationTime}x longer
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-sm text-gray-400">
          <p>Note: Adaptation time represents how long biological systems take to adapt compared to Earth baseline.</p>
        </div>
      </div>

      {/* Simulation Status */}
      <div className="text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
          isSimulating ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isSimulating ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
          }`}></div>
          <span>{isSimulating ? 'Real-time Simulation Active' : 'Simulation Ready'}</span>
        </div>
      </div>
    </div>
  );
};

export default PlanetBiologyComparator;

    