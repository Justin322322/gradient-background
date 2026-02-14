import React, { useState } from 'react';
import { Settings, X, RefreshCw, Layers, Sliders, Palette, Zap, Code, Check, Copy, FileCode, FileJson, Terminal } from 'lucide-react';
import Grainient, { GrainientProps } from './components/Grainient';

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

// Embed the source code for the component so it can be copied easily
const GRAINIENT_SOURCE = `import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

export interface GrainientProps {
  timeSpeed?: number;
  colorBalance?: number;
  warpStrength?: number;
  warpFrequency?: number;
  warpSpeed?: number;
  warpAmplitude?: number;
  blendAngle?: number;
  blendSoftness?: number;
  rotationAmount?: number;
  noiseScale?: number;
  grainAmount?: number;
  grainScale?: number;
  grainAnimated?: boolean;
  contrast?: number;
  gamma?: number;
  saturation?: number;
  centerX?: number;
  centerY?: number;
  zoom?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  className?: string;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const vertex = \`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
\`;

const fragment = \`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);} 
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);} 
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}
void mainImage(out vec4 o, vec2 C){
  float t=iTime*uTimeSpeed;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);

  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;

  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);

  vec3 colLav=uColor1;
  vec3 colOrg=uColor2;
  vec3 colDark=uColor3;
  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  mat2 blendRot=Rot(radians(uBlendAngle));
  float blendX=(tuv*blendRot).x;
  float edge0=-0.3-b-s;
  float edge1=0.2-b+s;
  float v0=0.5-b+s;
  float v1=-0.3-b-s;
  vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));
  vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));

  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);} 
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;

  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  col=clamp(col,0.0,1.0);

  o=vec4(col,1.0);
}
void main(){
  vec4 o=vec4(0.0);
  mainImage(o,gl_FragCoord.xy);
  fragColor=o;
}
\`;

const Grainient: React.FC<GrainientProps> = ({
  timeSpeed = 0.25,
  colorBalance = 0.0,
  warpStrength = 1.0,
  warpFrequency = 5.0,
  warpSpeed = 2.0,
  warpAmplitude = 50.0,
  blendAngle = 0.0,
  blendSoftness = 0.05,
  rotationAmount = 500.0,
  noiseScale = 2.0,
  grainAmount = 0.1,
  grainScale = 2.0,
  grainAnimated = false,
  contrast = 1.5,
  gamma = 1.0,
  saturation = 1.0,
  centerX = 0.0,
  centerY = 0.0,
  zoom = 0.9,
  color1 = '#FF9FFC',
  color2 = '#5227FF',
  color3 = '#B19EEF',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const programRef = useRef<Program | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    rendererRef.current = renderer;

    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';

    const container = containerRef.current;
    container.appendChild(canvas);

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uTimeSpeed: { value: timeSpeed },
        uColorBalance: { value: colorBalance },
        uWarpStrength: { value: warpStrength },
        uWarpFrequency: { value: warpFrequency },
        uWarpSpeed: { value: warpSpeed },
        uWarpAmplitude: { value: warpAmplitude },
        uBlendAngle: { value: blendAngle },
        uBlendSoftness: { value: blendSoftness },
        uRotationAmount: { value: rotationAmount },
        uNoiseScale: { value: noiseScale },
        uGrainAmount: { value: grainAmount },
        uGrainScale: { value: grainScale },
        uGrainAnimated: { value: grainAnimated ? 1.0 : 0.0 },
        uContrast: { value: contrast },
        uGamma: { value: gamma },
        uSaturation: { value: saturation },
        uCenterOffset: { value: new Float32Array([centerX, centerY]) },
        uZoom: { value: zoom },
        uColor1: { value: new Float32Array(hexToRgb(color1)) },
        uColor2: { value: new Float32Array(hexToRgb(color2)) },
        uColor3: { value: new Float32Array(hexToRgb(color3)) }
      }
    });
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    const setSize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      rendererRef.current.setSize(width, height);
      
      if (programRef.current) {
        const res = programRef.current.uniforms.iResolution.value as Float32Array;
        res[0] = gl.drawingBufferWidth;
        res[1] = gl.drawingBufferHeight;
      }
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    const t0 = performance.now() - Math.random() * 10000;
    
    const loop = (t: number) => {
      if (programRef.current) {
        (programRef.current.uniforms.iTime as { value: number }).value = (t - t0) * 0.001;
      }
      if (rendererRef.current && meshRef.current) {
        rendererRef.current.render({ scene: meshRef.current });
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      if (container && container.contains(canvas)) {
        container.removeChild(canvas);
      }
      const extension = gl.getExtension('WEBGL_lose_context');
      if (extension) extension.loseContext();
      
      rendererRef.current = null;
      programRef.current = null;
      meshRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    timeSpeed,
    colorBalance,
    warpStrength,
    warpFrequency,
    warpSpeed,
    warpAmplitude,
    blendAngle,
    blendSoftness,
    rotationAmount,
    noiseScale,
    grainAmount,
    grainScale,
    grainAnimated,
    contrast,
    gamma,
    saturation,
    centerX,
    centerY,
    zoom,
    color1,
    color2,
    color3
  ]); 

  // The Effect for updating uniforms is merged into the initialization effect in this static string
  // for simplicity, but in the real component, it uses two effects. 
  // For this export string, we will assume the user uses the component file provided.
  
  return <div ref={containerRef} className={\`relative h-full w-full overflow-hidden \${className}\`.trim()} />;
};

export default Grainient;
`;

const App: React.FC = () => {
  const [config, setConfig] = useState<GrainientProps>(DEFAULT_CONFIG);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'colors' | 'motion' | 'effects' | 'view'>('colors');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeTab, setCodeTab] = useState<'usage' | 'component'>('usage');
  const [copied, setCopied] = useState(false);
  const [dependencyCopied, setDependencyCopied] = useState(false);

  const updateConfig = (key: keyof GrainientProps, value: number | string | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const getUsageCode = () => {
    const props = Object.entries(config)
      .map(([key, value]) => {
        if (key === 'className') return null;
        if (typeof value === 'string') return `${key}="${value}"`;
        if (typeof value === 'boolean') return value ? `${key}` : `${key}={false}`;
        if (typeof value === 'number') {
           return `${key}={${Number(value.toFixed(3))}}`;
        }
        return `${key}={${value}}`;
      })
      .filter(Boolean)
      .join('\n        ');

    return `import Grainient from './components/Grainient';

export default function MyComponent() {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Grainient
        ${props}
      />
    </div>
  );
}`;
  };

  const getCodeContent = () => {
    return codeTab === 'usage' ? getUsageCode() : GRAINIENT_SOURCE;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(getCodeContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyDependency = async () => {
    try {
      await navigator.clipboard.writeText('npm install ogl');
      setDependencyCopied(true);
      setTimeout(() => setDependencyCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
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
          <Settings size={24} />
        </button>
      )}

      {/* Code Modal */}
      {showCodeModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#111] border border-white/10 rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl ring-1 ring-white/10">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Code size={20} className="text-purple-400" />
                  Get Code
                </h2>
                
                {/* Tabs */}
                <div className="flex bg-black/50 rounded-lg p-1 border border-white/10">
                  <button
                    onClick={() => { setCodeTab('usage'); setCopied(false); }}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${
                      codeTab === 'usage' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/50 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <FileJson size={14} />
                    Usage
                  </button>
                  <button
                    onClick={() => { setCodeTab('component'); setCopied(false); }}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${
                      codeTab === 'component' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/50 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <FileCode size={14} />
                    Grainient.tsx
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setShowCodeModal(false)} 
                className="text-white/50 hover:text-white transition-colors p-1"
              >
                <X size={20}/>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-0 custom-scrollbar bg-[#0a0a0a]">
              <div className="p-4 space-y-6">
                {/* Installation Instructions */}
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <h3 className="text-sm font-semibold text-blue-200 mb-2 flex items-center gap-2">
                    <Terminal size={14} />
                    Installation
                  </h3>
                  <div className="flex items-center justify-between bg-black/50 rounded border border-blue-500/20 px-3 py-2">
                    <code className="text-xs sm:text-sm font-mono text-blue-100">npm install ogl</code>
                    <button 
                      onClick={handleCopyDependency}
                      className="text-blue-300 hover:text-white transition-colors p-1"
                      title="Copy command"
                    >
                      {dependencyCopied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {/* Main Code Block */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-400">
                      {codeTab === 'usage' 
                        ? '1. Copy this snippet into your project.' 
                        : '2. Create a file named Grainient.tsx and paste the source code.'}
                    </p>
                  </div>
                  
                  <div className="relative group">
                    <pre className="text-xs sm:text-sm font-mono text-purple-300 bg-black p-4 rounded-lg border border-white/10 overflow-x-auto selection:bg-purple-500/30">
                      {getCodeContent()}
                    </pre>
                    <button
                      onClick={handleCopyCode}
                      className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 text-white rounded-md backdrop-blur-sm transition-all border border-white/10 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <button 
                onClick={() => setShowCodeModal(false)}
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                Close
              </button>
              <button 
                onClick={handleCopyCode}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all shadow-lg shadow-purple-900/20"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <div
        className={`absolute top-0 right-0 z-20 h-full w-full sm:w-[380px] bg-black/40 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Grainient
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCodeModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors border border-white/5"
              title="Get Code"
            >
              <Copy size={14} />
              <span>Copy Code</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors border border-white/5"
              title="Reset to defaults"
            >
              <RefreshCw size={14} />
              <span>Reset</span>
            </button>
            <button
              onClick={() => setIsPanelOpen(false)}
              className="p-1.5 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex p-2 gap-1 border-b border-white/10 bg-black/10">
          <TabButton
            active={activeTab === 'colors'}
            onClick={() => setActiveTab('colors')}
            icon={<Palette size={16} />}
            label="Colors"
          />
          <TabButton
            active={activeTab === 'motion'}
            onClick={() => setActiveTab('motion')}
            icon={<Zap size={16} />}
            label="Motion"
          />
          <TabButton
            active={activeTab === 'effects'}
            onClick={() => setActiveTab('effects')}
            icon={<Layers size={16} />}
            label="Effects"
          />
          <TabButton
            active={activeTab === 'view'}
            onClick={() => setActiveTab('view')}
            icon={<Sliders size={16} />}
            label="Adjust"
          />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <SectionTitle label="Palette" />
              <div className="grid grid-cols-1 gap-4">
                <ColorInput label="Primary Color" value={config.color1!} onChange={(v) => updateConfig('color1', v)} />
                <ColorInput label="Secondary Color" value={config.color2!} onChange={(v) => updateConfig('color2', v)} />
                <ColorInput label="Tertiary Color" value={config.color3!} onChange={(v) => updateConfig('color3', v)} />
              </div>

              <SectionTitle label="Blending" />
              <RangeInput
                label="Color Balance"
                value={config.colorBalance!}
                min={-1}
                max={1}
                step={0.01}
                onChange={(v) => updateConfig('colorBalance', v)}
              />
              <RangeInput
                label="Blend Angle"
                value={config.blendAngle!}
                min={0}
                max={360}
                onChange={(v) => updateConfig('blendAngle', v)}
              />
               <RangeInput
                label="Blend Softness"
                value={config.blendSoftness!}
                min={0}
                max={1}
                step={0.01}
                onChange={(v) => updateConfig('blendSoftness', v)}
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
                onChange={(v) => updateConfig('timeSpeed', v)}
              />
              <RangeInput
                label="Warp Strength"
                value={config.warpStrength!}
                min={0.1}
                max={5}
                step={0.1}
                onChange={(v) => updateConfig('warpStrength', v)}
              />
              <RangeInput
                label="Warp Frequency"
                value={config.warpFrequency!}
                min={0.1}
                max={20}
                step={0.1}
                onChange={(v) => updateConfig('warpFrequency', v)}
              />
              <RangeInput
                label="Warp Speed"
                value={config.warpSpeed!}
                min={0}
                max={5}
                step={0.1}
                onChange={(v) => updateConfig('warpSpeed', v)}
              />
              <RangeInput
                label="Flow Amplitude"
                value={config.warpAmplitude!}
                min={1}
                max={100}
                onChange={(v) => updateConfig('warpAmplitude', v)}
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
                onChange={(v) => updateConfig('noiseScale', v)}
              />
              <RangeInput
                label="Grain Amount"
                value={config.grainAmount!}
                min={0}
                max={0.5}
                step={0.01}
                onChange={(v) => updateConfig('grainAmount', v)}
              />
              <RangeInput
                label="Grain Scale"
                value={config.grainScale!}
                min={0.5}
                max={5}
                step={0.1}
                onChange={(v) => updateConfig('grainScale', v)}
              />
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                <span className="text-sm font-medium text-white/90">Animated Grain</span>
                <button
                  onClick={() => updateConfig('grainAnimated', !config.grainAnimated)}
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
                onChange={(v) => updateConfig('zoom', v)}
              />
              <RangeInput
                label="Rotation"
                value={config.rotationAmount!}
                min={0}
                max={1000}
                onChange={(v) => updateConfig('rotationAmount', v)}
              />
              <RangeInput
                label="Center X"
                value={config.centerX!}
                min={-1}
                max={1}
                step={0.01}
                onChange={(v) => updateConfig('centerX', v)}
              />
              <RangeInput
                label="Center Y"
                value={config.centerY!}
                min={-1}
                max={1}
                step={0.01}
                onChange={(v) => updateConfig('centerY', v)}
              />

              <SectionTitle label="Post Processing" />
              <RangeInput
                label="Contrast"
                value={config.contrast!}
                min={0.5}
                max={3}
                step={0.1}
                onChange={(v) => updateConfig('contrast', v)}
              />
              <RangeInput
                label="Saturation"
                value={config.saturation!}
                min={0}
                max={3}
                step={0.1}
                onChange={(v) => updateConfig('saturation', v)}
              />
              <RangeInput
                label="Gamma"
                value={config.gamma!}
                min={0.1}
                max={3}
                step={0.1}
                onChange={(v) => updateConfig('gamma', v)}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/20 text-xs text-white/40 text-center">
          Built with React & OGL
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const TabButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
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

const SectionTitle = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 pb-2 border-b border-white/10">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">{label}</h3>
  </div>
);

const RangeInput = ({
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
        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        style={{
          backgroundImage: `linear-gradient(to right, #a855f7 0%, #ec4899 100%)`,
          backgroundSize: `${((value - min) * 100) / (max - min)}% 100%`,
          backgroundRepeat: 'no-repeat',
        }}
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

const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) => (
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

export default App;