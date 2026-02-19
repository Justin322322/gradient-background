import React from 'react';

export const TabButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
      active
        ? 'bg-white/10 text-white shadow-sm'
        : 'text-white/50 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export const SectionTitle = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 pb-2 border-b border-white/10">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">{label}</h3>
  </div>
);

export const RangeInput = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
}) => (
  <div className="group">
    <div className="flex justify-between items-center mb-2">
      <label className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">{label}</label>
      <span className="text-xs font-mono text-white/50 bg-white/5 px-2 py-1 rounded">{value.toFixed(2)}</span>
    </div>
    <div className="relative h-6 flex items-center">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40"
      />
    </div>
    <style>{`
      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        margin-top: -5px; 
        border: 2px solid rgba(0,0,0,0.1);
      }
      input[type=range]::-moz-range-thumb {
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
        border: none;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
      }
      /* Ensure track styling is consistent */
      input[type=range]::-webkit-slider-runnable-track {
        height: 6px;
        border-radius: 3px;
        /* Background is handled by inline style for progress */
      }
    `}</style>
  </div>
);

export const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) => (
  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
    <label className="text-sm font-medium text-white/90">{label}</label>
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono text-white/50">{value.toUpperCase()}</span>
      {/* 
        Fixed alignment issue:
        Used flex to ensure centering, and explicit dimensions for the circle.
      */}
      <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-inner ring-1 ring-white/20 flex-shrink-0">
        <div className="absolute inset-0 z-0" style={{ backgroundColor: value }} />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      </div>
    </div>
  </div>
);
