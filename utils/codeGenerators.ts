import { GrainientProps } from '../components/Grainient';

export const getUsageCode = (config: GrainientProps) => {
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

export const getVanillaCode = (config: GrainientProps) => {
  const num = (n: number, d = 3) => Number(n.toFixed(d));
  const cfg = {
    timeSpeed: num(config.timeSpeed!),
    colorBalance: num(config.colorBalance!, 3),
    warpStrength: num(config.warpStrength!, 3),
    warpFrequency: num(config.warpFrequency!, 3),
    warpSpeed: num(config.warpSpeed!, 3),
    warpAmplitude: num(config.warpAmplitude!, 3),
    blendAngle: num(config.blendAngle!, 3),
    blendSoftness: num(config.blendSoftness!, 3),
    rotationAmount: num(config.rotationAmount!, 3),
    noiseScale: num(config.noiseScale!, 3),
    grainAmount: num(config.grainAmount!, 3),
    grainScale: num(config.grainScale!, 3),
    grainAnimated: !!config.grainAnimated,
    contrast: num(config.contrast!, 3),
    gamma: num(config.gamma!, 3),
    saturation: num(config.saturation!, 3),
    centerX: num(config.centerX!, 3),
    centerY: num(config.centerY!, 3),
    zoom: num(config.zoom!, 3),
    color1: config.color1!,
    color2: config.color2!,
    color3: config.color3!,
  };
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Grainient Vanilla (OGL)</title>
    <style>
      html, body { height: 100%; margin: 0; }
      body { background: #000; color: #fff; }
      #app { position: relative; width: 100%; height: 100vh; overflow: hidden; }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script type="module">
      import { Renderer, Program, Mesh, Triangle } from 'https://esm.sh/ogl@1.0.11';

      const hexToRgb = (hex) => {
        const res = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
        if (!res) return [1,1,1];
        return [parseInt(res[1],16)/255, parseInt(res[2],16)/255, parseInt(res[3],16)/255];
      };

      const opts = ${JSON.stringify(cfg, null, 2)};

      const vertex = \`#version 300 es
      in vec2 position;
      void main() { gl_Position = vec4(position, 0.0, 1.0); }
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
      void main(){ vec4 o=vec4(0.0); mainImage(o,gl_FragCoord.xy); fragColor=o; }
      \`;

      const container = document.getElementById('app');
      const renderer = new Renderer({ webgl: 2, alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio||1, 2) });
      const gl = renderer.gl;
      const canvas = gl.canvas;
      canvas.style.width='100%'; canvas.style.height='100%'; canvas.style.display='block';
      container.appendChild(canvas);

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex, fragment,
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new Float32Array([1, 1]) },
          uTimeSpeed: { value: opts.timeSpeed },
          uColorBalance: { value: opts.colorBalance },
          uWarpStrength: { value: opts.warpStrength },
          uWarpFrequency: { value: opts.warpFrequency },
          uWarpSpeed: { value: opts.warpSpeed },
          uWarpAmplitude: { value: opts.warpAmplitude },
          uBlendAngle: { value: opts.blendAngle },
          uBlendSoftness: { value: opts.blendSoftness },
          uRotationAmount: { value: opts.rotationAmount },
          uNoiseScale: { value: opts.noiseScale },
          uGrainAmount: { value: opts.grainAmount },
          uGrainScale: { value: opts.grainScale },
          uGrainAnimated: { value: opts.grainAnimated ? 1.0 : 0.0 },
          uContrast: { value: opts.contrast },
          uGamma: { value: opts.gamma },
          uSaturation: { value: opts.saturation },
          uCenterOffset: { value: new Float32Array([opts.centerX, opts.centerY]) },
          uZoom: { value: opts.zoom },
          uColor1: { value: new Float32Array(hexToRgb(opts.color1)) },
          uColor2: { value: new Float32Array(hexToRgb(opts.color2)) },
          uColor3: { value: new Float32Array(hexToRgb(opts.color3)) },
        }
      });
      const mesh = new Mesh(gl, { geometry, program });

      const setSize = () => {
        const rect = container.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width));
        const height = Math.max(1, Math.floor(rect.height));
        renderer.setSize(width, height);
        const res = program.uniforms.iResolution.value;
        res[0] = gl.drawingBufferWidth;
        res[1] = gl.drawingBufferHeight;
      };
      window.addEventListener('resize', setSize, { passive: true });
      setSize();

      const t0 = performance.now() - Math.random()*10000;
      const loop = (t) => {
        program.uniforms.iTime.value = (t - t0) * 0.001;
        renderer.render({ scene: mesh });
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    </script>
  </body>
</html>`;
};
