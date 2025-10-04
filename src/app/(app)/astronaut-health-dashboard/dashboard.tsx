'use client';
import React, { useState, useEffect } from 'react';

const AstronautHealthDashboard = () => {
  const [missionType, setMissionType] = useState('moon');
  const [missionDuration, setMissionDuration] = useState(30);
  const [healthData, setHealthData] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Mission configurations
  const missionConfigs = {
    moon: { name: 'Lunar Mission', gravity: 0.16, radiation: 'Medium', distance: '384,400 km' },
    mars: { name: 'Mars Mission', gravity: 0.38, radiation: 'High', distance: '225M km' },
    iss: { name: 'ISS Mission', gravity: 0, radiation: 'Medium', distance: '408 km' }
  };

  // Initialize health monitoring
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(updateHealthData, 3000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring, missionType, missionDuration]);

  const startMonitoring = () => {
    setIsMonitoring(true);
    generateInitialHealthData();
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  const generateInitialHealthData = () => {
    const baseData = {
      timestamp: new Date().toLocaleTimeString(),
      heartRate: 65 + Math.floor(Math.random() * 20),
      bloodPressure: `${110 + Math.floor(Math.random() * 20)}/${70 + Math.floor(Math.random() * 10)}`,
      oxygenSaturation: 96 + Math.floor(Math.random() * 3),
      radiationExposure: Math.floor(Math.random() * 50),
      cognitiveFunction: 85 + Math.floor(Math.random() * 15),
      sleepQuality: 70 + Math.floor(Math.random() * 25),
      muscleMass: 95 - Math.floor(Math.random() * 10),
      boneDensity: 98 - Math.floor(Math.random() * 6)
    };

    setHealthData(baseData);
  };

  const updateHealthData = () => {
    if (!healthData) return;

    const updatedData = {
      timestamp: new Date().toLocaleTimeString(),
      heartRate: Math.max(50, Math.min(120, healthData.heartRate + (Math.random() * 4 - 2))),
      bloodPressure: calculateBloodPressure(healthData.bloodPressure),
      oxygenSaturation: Math.max(92, Math.min(99, healthData.oxygenSaturation + (Math.random() * 2 - 1))),
      radiationExposure: healthData.radiationExposure + (missionType === 'mars' ? 2 : 1),
      cognitiveFunction: Math.max(60, Math.min(100, healthData.cognitiveFunction + (Math.random() * 4 - 2))),
      sleepQuality: Math.max(50, Math.min(95, healthData.sleepQuality + (Math.random() * 6 - 3))),
      muscleMass: Math.max(80, healthData.muscleMass - (missionType === 'iss' ? 0.2 : 0.1)),
      boneDensity: Math.max(85, healthData.boneDensity - (missionType === 'iss' ? 0.3 : 0.1))
    };

    setHealthData(updatedData);
  };

  const calculateBloodPressure = (currentBP) => {
    const [systolic, diastolic] = currentBP.split('/').map(Number);
    const newSystolic = Math.max(100, Math.min(140, systolic + (Math.random() * 6 - 3)));
    const newDiastolic = Math.max(60, Math.min(90, diastolic + (Math.random() * 4 - 2)));
    return `${Math.round(newSystolic)}/${Math.round(newDiastolic)}`;
  };

  // Risk assessment calculations
  const calculateRisks = () => {
    if (!healthData) return {};

    const risks = {
      radiation: Math.min(100, (healthData.radiationExposure / 200) * 100),
      cardiovascular: Math.abs(healthData.heartRate - 72) * 1.5,
      cognitive: 100 - healthData.cognitiveFunction,
      musculoskeletal: (100 - healthData.muscleMass) + (100 - healthData.boneDensity),
      psychological: 100 - healthData.sleepQuality
    };

    const overallRisk = Object.values(risks).reduce((a, b) => a + b, 0) / Object.values(risks).length;

    return {
      ...risks,
      overall: overallRisk,
      level: overallRisk < 25 ? 'Low' : overallRisk < 50 ? 'Medium' : overallRisk < 75 ? 'High' : 'Critical'
    };
  };

  const getRiskColor = (risk) => {
    if (risk < 25) return 'text-green-400';
    if (risk < 50) return 'text-yellow-400';
    if (risk < 75) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRiskBgColor = (risk) => {
    if (risk < 25) return 'bg-green-500';
    if (risk < 50) return 'bg-yellow-500';
    if (risk < 75) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const risks = healthData ? calculateRisks() : {};
  const mission = missionConfigs[missionType];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline mb-2">Astronaut Health Dashboard</h1>
        <p className="text-muted-foreground">Real-time health monitoring and mission risk assessment</p>
      </div>

      {/* Mission Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-bold font-headline mb-4">Mission Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Mission Type</label>
              <select
                value={missionType}
                onChange={(e) => setMissionType(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground"
                disabled={isMonitoring}
              >
                <option value="moon">Lunar Mission</option>
                <option value="mars">Mars Mission</option>
                <option value="iss">ISS Mission</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Mission Duration: {missionDuration} days
              </label>
              <input
                type="range"
                min="7"
                max="365"
                value={missionDuration}
                onChange={(e) => setMissionDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                disabled={isMonitoring}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={startMonitoring}
                disabled={isMonitoring}
                className={`py-2 px-4 rounded-lg font-semibold text-white ${
                  isMonitoring 
                    ? 'bg-muted-foreground cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-500'
                }`}
              >
                Start Monitoring
              </button>
              <button
                onClick={stopMonitoring}
                disabled={!isMonitoring}
                className={`py-2 px-4 rounded-lg font-semibold text-white ${
                  !isMonitoring 
                    ? 'bg-muted-foreground cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-500'
                }`}
              >
                Stop Monitoring
              </button>
            </div>
          </div>
        </div>

        {/* Mission Info */}
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-bold font-headline mb-4">Mission Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mission:</span>
              <span className="text-foreground font-semibold">{mission.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gravity:</span>
              <span className="text-foreground">{mission.gravity}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Radiation:</span>
              <span className="text-foreground">{mission.radiation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Distance:</span>
              <span className="text-foreground">{mission.distance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="text-foreground">{missionDuration} days</span>
            </div>
          </div>
        </div>

        {/* Overall Risk */}
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-bold font-headline mb-4">Mission Readiness</h2>
          {healthData ? (
            <div className="text-center">
              <div className={`text-5xl font-bold mb-2 ${getRiskColor(risks.overall)}`}>
                {risks.overall ? Math.round(risks.overall) : 0}%
              </div>
              <div className={`text-lg font-semibold ${getRiskColor(risks.overall)}`}>
                {risks.level} Risk
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Last Update: {healthData.timestamp}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Start monitoring to assess mission readiness
            </div>
          )}
        </div>
      </div>

      {/* Health Metrics */}
      {healthData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vital Signs */}
          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-xl font-bold font-headline mb-4">Vital Signs</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Heart Rate', value: `${healthData.heartRate} BPM`, optimal: '60-100' },
                { label: 'Blood Pressure', value: healthData.bloodPressure, optimal: '120/80' },
                { label: 'Oxygen Sat', value: `${healthData.oxygenSaturation}%`, optimal: '95-100%' },
                { label: 'Radiation', value: `${healthData.radiationExposure} mSv`, optimal: '<50 mSv' },
                { label: 'Cognitive Function', value: `${healthData.cognitiveFunction}%`, optimal: '>80%' },
                { label: 'Sleep Quality', value: `${healthData.sleepQuality}%`, optimal: '>70%' },
                { label: 'Muscle Mass', value: `${Math.round(healthData.muscleMass)}%`, optimal: '>90%' },
                { label: 'Bone Density', value: `${Math.round(healthData.boneDensity)}%`, optimal: '>95%' }
              ].map((metric, index) => (
                <div key={index} className="bg-muted p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                  <div className="text-lg font-semibold text-foreground">{metric.value}</div>
                  <div className="text-xs text-muted-foreground/70">Optimal: {metric.optimal}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Breakdown */}
          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-xl font-bold font-headline mb-4">Risk Assessment</h2>
            <div className="space-y-4">
              {[
                { label: 'Radiation Exposure', risk: risks.radiation },
                { label: 'Cardiovascular', risk: risks.cardiovascular },
                { label: 'Cognitive Function', risk: risks.cognitive },
                { label: 'Musculoskeletal', risk: risks.musculoskeletal },
                { label: 'Psychological', risk: risks.psychological }
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>{item.label}</span>
                    <span className={getRiskColor(item.risk)}>{Math.round(item.risk)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getRiskBgColor(item.risk)}`}
                      style={{ width: `${Math.min(100, item.risk)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Countermeasures */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Recommended Countermeasures</h3>
              <div className="space-y-2">
                {risks.radiation > 30 && (
                  <div className="flex items-center gap-2 text-sm text-yellow-300">
                    <span>🛡️</span>
                    <span>Increase radiation shielding and monitoring</span>
                  </div>
                )}
                {risks.cardiovascular > 40 && (
                  <div className="flex items-center gap-2 text-sm text-yellow-300">
                    <span>💓</span>
                    <span>Cardiovascular exercise regimen required</span>
                  </div>
                )}
                {risks.cognitive > 35 && (
                  <div className="flex items-center gap-2 text-sm text-yellow-300">
                    <span>🧠</span>
                    <span>Cognitive training and rest periods needed</span>
                  </div>
                )}
                {risks.musculoskeletal > 25 && (
                  <div className="flex items-center gap-2 text-sm text-yellow-300">
                    <span>💪</span>
                    <span>Resistance exercise and nutritional supplements</span>
                  </div>
                )}
                {risks.psychological > 40 && (
                  <div className="flex items-center gap-2 text-sm text-yellow-300">
                    <span>😴</span>
                    <span>Sleep optimization and psychological support</span>
                  </div>
                )}
                {risks.overall < 25 && (
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <span>✅</span>
                    <span>All systems nominal - Mission ready</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Protocols */}
      {healthData && risks.level === 'Critical' && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl animate-pulse">🚨</span>
            <h2 className="text-xl font-bold text-white">CRITICAL ALERT</h2>
          </div>
          <div className="text-red-200 space-y-2">
            <p>Immediate medical intervention required. Health parameters indicate critical risk levels.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <button className="bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold">
                Initiate Emergency Protocol
              </button>
              <button className="bg-yellow-600 hover:bg-yellow-500 text-white py-2 px-4 rounded-lg font-semibold">
                Contact Mission Control
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Monitoring Status */}
      <div className="text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
          isMonitoring ? 'bg-green-900/50 text-green-300' : 'bg-muted text-muted-foreground'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
          }`}></div>
          <span>{isMonitoring ? 'Real-time Monitoring Active' : 'Monitoring Inactive'}</span>
        </div>
      </div>
    </div>
  );
};

export default AstronautHealthDashboard;

    