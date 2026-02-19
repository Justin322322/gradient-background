import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Settings01Icon } from '@hugeicons/core-free-icons';
import Grainient, { GrainientProps } from './components/Grainient';
import ControlPanel from './components/ControlPanel';
import CodeModal from './components/CodeModal';

// Default configuration matches the component's defaults
const DEFAULT_CONFIG: GrainientProps = {
  timeSpeed: 0.25,
  colorBalance: 0.0,
  warpStrength: 1.0,
  warpFrequency: 5.0,
  warpSpeed: 2.0,
  warpAmplitude: 50.0,
  blendAngle: 0.0,
  blendSoftness: 0.05,
  rotationAmount: 500.0,
  noiseScale: 2.0,
  grainAmount: 0.1,
  grainScale: 2.0,
  grainAnimated: false,
  contrast: 1.5,
  gamma: 1.0,
  saturation: 1.0,
  centerX: 0.0,
  centerY: 0.0,
  zoom: 0.9,
  color1: '#FF9FFC',
  color2: '#5227FF',
  color3: '#B19EEF',
};

const App: React.FC = () => {
  const [config, setConfig] = useState<GrainientProps>(DEFAULT_CONFIG);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const updateConfig = (key: keyof GrainientProps, value: number | string | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <Grainient {...config} className="w-full h-full" />
      </div>

      {/* Floating Toggle Button */}
      {!isPanelOpen && (
        <button
          onClick={() => setIsPanelOpen(true)}
          className="absolute top-6 right-6 z-20 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all shadow-lg"
          aria-label="Open Settings"
        >
          <HugeiconsIcon icon={Settings01Icon} size={24} />
        </button>
      )}

      {/* Code Modal */}
      <CodeModal 
        isOpen={showCodeModal} 
        onClose={() => setShowCodeModal(false)} 
        config={config} 
      />

      {/* Control Panel */}
      <ControlPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
        onOpenCodeModal={() => setShowCodeModal(true)}
        config={config}
        onUpdateConfig={updateConfig}
        onReset={handleReset}
      />
    </div>
  );
};

export default App;
