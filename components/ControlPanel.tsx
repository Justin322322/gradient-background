import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  RefreshIcon,
  Layers01Icon,
  SlidersHorizontalIcon,
  ColorPickerIcon,
  ZapIcon,
  Copy01Icon
} from '@hugeicons/core-free-icons';
import { GrainientProps } from './Grainient';
import { TabButton, SectionTitle, RangeInput, ColorInput } from './UIControls';

interface ControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCodeModal: () => void;
  config: GrainientProps;
  onUpdateConfig: (key: keyof GrainientProps, value: number | string | boolean) => void;
  onReset: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isOpen,
  onClose,
  onOpenCodeModal,
  config,
  onUpdateConfig,
  onReset
}) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'motion' | 'effects' | 'view'>('colors');

  return (
    <div
      className={`absolute top-0 right-0 z-20 h-full w-full sm:w-[380px] bg-black/40 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCodeModal}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors border border-white/5"
            title="Get Code"
          >
            <HugeiconsIcon icon={Copy01Icon} size={16} />
            <span>Copy Code</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors border border-white/5"
            title="Reset to defaults"
          >
            <HugeiconsIcon icon={RefreshIcon} size={16} />
            <span>Reset</span>
          </button>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-white/50 hover:text-white transition-colors"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex p-2 gap-1 border-b border-white/10 bg-black/10">
        <TabButton
          active={activeTab === 'colors'}
          onClick={() => setActiveTab('colors')}
          icon={<HugeiconsIcon icon={ColorPickerIcon} size={16} />}
          label="Colors"
        />
        <TabButton
          active={activeTab === 'motion'}
          onClick={() => setActiveTab('motion')}
          icon={<HugeiconsIcon icon={ZapIcon} size={16} />}
          label="Motion"
        />
        <TabButton
          active={activeTab === 'effects'}
          onClick={() => setActiveTab('effects')}
          icon={<HugeiconsIcon icon={Layers01Icon} size={16} />}
          label="Effects"
        />
        <TabButton
          active={activeTab === 'view'}
          onClick={() => setActiveTab('view')}
          icon={<HugeiconsIcon icon={SlidersHorizontalIcon} size={16} />}
          label="Adjust"
        />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        
        {activeTab === 'colors' && (
          <div className="space-y-6">
            <SectionTitle label="Palette" />
            <div className="grid grid-cols-1 gap-4">
              <ColorInput label="Primary Color" value={config.color1!} onChange={(v) => onUpdateConfig('color1', v)} />
              <ColorInput label="Secondary Color" value={config.color2!} onChange={(v) => onUpdateConfig('color2', v)} />
              <ColorInput label="Tertiary Color" value={config.color3!} onChange={(v) => onUpdateConfig('color3', v)} />
            </div>

            <SectionTitle label="Blending" />
            <RangeInput
              label="Color Balance"
              value={config.colorBalance!}
              min={-1}
              max={1}
              step={0.01}
              onChange={(v) => onUpdateConfig('colorBalance', v)}
            />
            <RangeInput
              label="Blend Angle"
              value={config.blendAngle!}
              min={0}
              max={360}
              onChange={(v) => onUpdateConfig('blendAngle', v)}
            />
             <RangeInput
              label="Blend Softness"
              value={config.blendSoftness!}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => onUpdateConfig('blendSoftness', v)}
            />
          </div>
        )}

        {activeTab === 'motion' && (
          <div className="space-y-6">
            <SectionTitle label="Warp Dynamics" />
            <RangeInput
              label="Time Speed"
              value={config.timeSpeed!}
              min={0}
              max={2}
              step={0.01}
              onChange={(v) => onUpdateConfig('timeSpeed', v)}
            />
            <RangeInput
              label="Warp Strength"
              value={config.warpStrength!}
              min={0.1}
              max={5}
              step={0.1}
              onChange={(v) => onUpdateConfig('warpStrength', v)}
            />
            <RangeInput
              label="Warp Frequency"
              value={config.warpFrequency!}
              min={0.1}
              max={20}
              step={0.1}
              onChange={(v) => onUpdateConfig('warpFrequency', v)}
            />
            <RangeInput
              label="Warp Speed"
              value={config.warpSpeed!}
              min={0}
              max={5}
              step={0.1}
              onChange={(v) => onUpdateConfig('warpSpeed', v)}
            />
            <RangeInput
              label="Flow Amplitude"
              value={config.warpAmplitude!}
              min={1}
              max={100}
              onChange={(v) => onUpdateConfig('warpAmplitude', v)}
            />
          </div>
        )}

        {activeTab === 'effects' && (
          <div className="space-y-6">
            <SectionTitle label="Noise & Grain" />
            <RangeInput
              label="Noise Scale"
              value={config.noiseScale!}
              min={0.1}
              max={10}
              step={0.1}
              onChange={(v) => onUpdateConfig('noiseScale', v)}
            />
            <RangeInput
              label="Grain Amount"
              value={config.grainAmount!}
              min={0}
              max={0.5}
              step={0.01}
              onChange={(v) => onUpdateConfig('grainAmount', v)}
            />
            <RangeInput
              label="Grain Scale"
              value={config.grainScale!}
              min={0.5}
              max={5}
              step={0.1}
              onChange={(v) => onUpdateConfig('grainScale', v)}
            />
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
              <span className="text-sm font-medium text-white/90">Animated Grain</span>
              <button
                onClick={() => onUpdateConfig('grainAnimated', !config.grainAnimated)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.grainAnimated ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.grainAnimated ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'view' && (
          <div className="space-y-6">
            <SectionTitle label="Composition" />
            <RangeInput
              label="Zoom"
              value={config.zoom!}
              min={0.1}
              max={3}
              step={0.01}
              onChange={(v) => onUpdateConfig('zoom', v)}
            />
            <RangeInput
              label="Rotation"
              value={config.rotationAmount!}
              min={0}
              max={1000}
              onChange={(v) => onUpdateConfig('rotationAmount', v)}
            />
            <RangeInput
              label="Center X"
              value={config.centerX!}
              min={-1}
              max={1}
              step={0.01}
              onChange={(v) => onUpdateConfig('centerX', v)}
            />
            <RangeInput
              label="Center Y"
              value={config.centerY!}
              min={-1}
              max={1}
              step={0.01}
              onChange={(v) => onUpdateConfig('centerY', v)}
            />

            <SectionTitle label="Post Processing" />
            <RangeInput
              label="Contrast"
              value={config.contrast!}
              min={0.5}
              max={3}
              step={0.1}
              onChange={(v) => onUpdateConfig('contrast', v)}
            />
            <RangeInput
              label="Saturation"
              value={config.saturation!}
              min={0}
              max={3}
              step={0.1}
              onChange={(v) => onUpdateConfig('saturation', v)}
            />
            <RangeInput
              label="Gamma"
              value={config.gamma!}
              min={0.1}
              max={3}
              step={0.1}
              onChange={(v) => onUpdateConfig('gamma', v)}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-black/20 text-xs text-white/40 text-center">
        Built with React & OGL
      </div>
    </div>
  );
};

export default ControlPanel;
