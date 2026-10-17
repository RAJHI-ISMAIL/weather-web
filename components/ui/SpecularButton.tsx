'use client';

import { CSSProperties, MouseEventHandler, ReactNode, useEffect, useRef } from 'react';
import './SpecularButton.css';

// ─── WebGL shader sources ─────────────────────────────────────────────────────

const PAD = 24;
const TAU = Math.PI * 2;

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uCenter;
uniform vec2 uHalf;
uniform float uRadius;
uniform float uPx;
uniform float uSpot;
uniform vec2 uEntry;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform vec2 uWindow;
uniform float uThickness;
uniform float uGlow;
out vec4 outColor;

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float loopPosition(vec2 p, vec2 b, float r) {
  vec2 inner = b - r;
  float arc = 1.5707963 * r;
  float quarter = inner.x + inner.y + arc;
  vec2 a = abs(p);
  vec2 q = a - inner;
  float s = q.x > 0.0 && q.y > 0.0
    ? inner.y + atan(q.y, q.x) * r
    : (q.x > q.y ? min(a.y, inner.y) : inner.y + arc + inner.x - min(a.x, inner.x));
  if (p.x < 0.0) s = p.y >= 0.0 ? 2.0 * quarter - s : 2.0 * quarter + s;
  else if (p.y < 0.0) s = 4.0 * quarter - s;
  return s / max(4.0 * quarter, 0.0001);
}

float lobe(float position, float center) {
  float gap = abs(fract(position - center + 0.5) - 0.5);
  return 1.0 - smoothstep(uWindow.x, uWindow.x + uWindow.y, gap);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = roundedBox(p, uHalf, uRadius);
  float position = loopPosition(p, uHalf, uRadius);
  float key = lobe(position, uSpot);
  float back = lobe(position, uSpot + 0.5);
  float streak = key + back * 0.45;
  float width = max(uThickness * uPx * mix(1.0, max(key, back), 0.6), 0.35);
  float band = smoothstep(-width - 0.6, -width + 0.6, d) * (1.0 - smoothstep(-0.6, 0.6, d));
  float hair = smoothstep(-uPx - 0.6, -uPx + 0.6, d) * (1.0 - smoothstep(-0.6, 0.6, d));
  float inside = 1.0 - smoothstep(-0.6, 0.6, d);
  vec2 pool = (p - uEntry) / (uHalf.y * vec2(1.6, 1.1));
  float glow = streak * 0.2 * exp(-abs(d + width * 0.5) / (5.0 * uPx)) + inside * 0.08 * exp(-dot(pool, pool));
  float light = clamp((band * streak + glow * uGlow) * uIntensity, 0.0, 1.0);
  vec4 base = vec4(uBaseColor, 1.0) * hair * 0.6;
  outColor = vec4(uLineColor, 1.0) * light + base * (1.0 - light);
}`;

const UNIFORM_NAMES = [
  'uCenter', 'uHalf', 'uRadius', 'uPx', 'uSpot', 'uEntry',
  'uLineColor', 'uBaseColor', 'uIntensity', 'uWindow', 'uThickness', 'uGlow',
] as const;

// ─── Geometry helpers ─────────────────────────────────────────────────────────

const clampVal = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const wrapVal = (v: number) => v - Math.floor(v);

const loopPosition = (x: number, y: number, halfX: number, halfY: number, r: number): number => {
  const ix = halfX - r, iy = halfY - r;
  const arc = (Math.PI / 2) * r;
  const quarter = ix + iy + arc;
  const ax = Math.abs(x), ay = Math.abs(y);
  const qx = ax - ix, qy = ay - iy;
  let s: number;
  if (qx > 0 && qy > 0) s = iy + Math.atan2(qy, qx) * r;
  else if (qx > qy) s = Math.min(ay, iy);
  else s = iy + arc + ix - Math.min(ax, ix);
  if (x < 0) s = y >= 0 ? 2 * quarter - s : 2 * quarter + s;
  else if (y < 0) s = 4 * quarter - s;
  return wrapVal(s / Math.max(4 * quarter, 0.0001));
};

const rimPoint = (position: number, halfX: number, halfY: number, r: number): [number, number] => {
  const ix = halfX - r, iy = halfY - r;
  const arc = (Math.PI / 2) * r;
  const quarter = ix + iy + arc;
  let s = wrapVal(position) * 4 * quarter;
  let sx = 1, sy = 1;
  if (s > 3 * quarter) { s = 4 * quarter - s; sy = -1; }
  else if (s > 2 * quarter) { s -= 2 * quarter; sx = -1; sy = -1; }
  else if (s > quarter) { s = 2 * quarter - s; sx = -1; }
  let x = ix - (s - iy - arc);
  let y = halfY;
  if (s <= iy) { x = halfX; y = s; }
  else if (s <= iy + arc) {
    const angle = (s - iy) / Math.max(r, 0.0001);
    x = ix + Math.cos(angle) * r;
    y = iy + Math.sin(angle) * r;
  }
  return [x * sx, y * sy];
};

const compile = (gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
};

const buildProgram = (gl: WebGL2RenderingContext): WebGLProgram | null => {
  const vert = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const frag = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const prog = gl.createProgram();
  if (!vert || !frag || !prog) return null;
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.bindAttribLocation(prog, 0, 'aPosition');
  gl.linkProgram(prog);
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  if (gl.getProgramParameter(prog, gl.LINK_STATUS)) return prog;
  gl.deleteProgram(prog);
  return null;
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SpecularButtonProps {
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  idleIntensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  glow?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
  speed?: number;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: CSSProperties;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SpecularButton({
  children = 'Get Started',
  size = 'lg',
  radius = 18,
  tint = '#ffffff',
  tintOpacity = 0.04,
  blur = 0,
  textColor = '#f5f5f5',
  lineColor = '#ffffff',
  baseColor = '#525252',
  intensity = 1,
  idleIntensity = 0.35,
  shineSize = 10,
  shineFade = 34,
  thickness = 1.2,
  glow = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  style,
}: SpecularButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wakeRef = useRef<(() => void) | null>(null);

  const settings = {
    radius: Math.max(0, radius),
    lineColor: String(lineColor),
    baseColor: String(baseColor),
    intensity: Math.max(0, intensity),
    idleIntensity: clampVal(idleIntensity, 0, 1),
    shineSize: Math.max(0, shineSize),
    shineFade: Math.max(0, shineFade),
    thickness: Math.max(0, thickness),
    glow: Math.max(0, glow),
    speed,
    followMouse,
    proximity: Math.max(1, proximity),
    autoAnimate,
    disabled,
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const button = buttonRef.current;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!button || !canvas || !gl) return;

    const program = buildProgram(gl);
    if (!program) return;

    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    for (const name of UNIFORM_NAMES) uniforms[name] = gl.getUniformLocation(program, name);

    const buf = gl.createBuffer();
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const colors = new Map<string, [number, number, number]>();
    const view = { width: 1, height: 1, ratio: 1 };
    const pointer = { x: 0, y: 0, known: false };
    const state = { spot: 0, level: 0, press: 0, ready: false };
    let raf = 0, last = 0, visible = true;

    const toRgb = (v: string): [number, number, number] => {
      if (colors.has(v)) return colors.get(v)!;
      let rgb: [number, number, number] = [1, 1, 1];
      if (probe) {
        probe.clearRect(0, 0, 1, 1);
        probe.fillStyle = '#000000';
        probe.fillStyle = v;
        probe.fillRect(0, 0, 1, 1);
        const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
        rgb = [r / 255, g / 255, b / 255];
      }
      colors.set(v, rgb);
      return rgb;
    };

    const cornerR = (s: typeof settings) => Math.min(s.radius, view.width / 2, view.height / 2);

    const restSpot = (s: typeof settings) => {
      const r = cornerR(s);
      const inset = r * (1 - Math.SQRT1_2);
      return loopPosition(inset - view.width / 2, view.height / 2 - inset, view.width / 2, view.height / 2, r);
    };

    const aim = (s: typeof settings) => {
      if (!s.followMouse || s.disabled || !pointer.known) return null;
      const rect = button.getBoundingClientRect();
      const scale = rect.width / view.width || 1;
      const hx = view.width / 2, hy = view.height / 2;
      const x = (pointer.x - rect.left - rect.width / 2) / scale;
      const y = (rect.top + rect.height / 2 - pointer.y) / scale;
      const dist = Math.hypot(Math.max(Math.abs(x) - hx, 0), Math.max(Math.abs(y) - hy, 0));
      const t = clampVal(1 - dist / s.proximity, 0, 1);
      const near = t * t * (3 - 2 * t);
      const nearest = loopPosition(x, y, hx, hy, cornerR(s));
      if (dist > 0) return { spot: nearest, near };
      const depth = clampVal(Math.min(hx - Math.abs(x), hy - Math.abs(y)) / (hy * 0.8), 0, 1);
      const sway = restSpot(s) - (x / hx) * 0.06 - (y / hy) * 0.02;
      const offset = sway - nearest - Math.round(sway - nearest);
      return { spot: wrapVal(nearest + offset * depth * depth * (3 - 2 * depth)), near };
    };

    const draw = (s: typeof settings) => {
      const { width, height } = view;
      const sx = canvas.width / (width + PAD * 2);
      const sy = canvas.height / (height + PAD * 2);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(uniforms.uCenter, (PAD + width / 2) * sx, (PAD + height / 2) * sy);
      gl.uniform2f(uniforms.uHalf, (width / 2) * sx, (height / 2) * sy);
      gl.uniform1f(uniforms.uRadius, Math.min(s.radius, width / 2, height / 2) * sx);
      gl.uniform1f(uniforms.uPx, view.ratio);
      const r = Math.min(s.radius, width / 2, height / 2);
      const [rimX, rimY] = rimPoint(state.spot, width / 2, height / 2, r);
      const pull = 1 - Math.min(0.35 * (height / 2), Math.hypot(rimX, rimY)) / Math.max(Math.hypot(rimX, rimY), 0.0001);
      gl.uniform1f(uniforms.uSpot, state.spot);
      gl.uniform2f(uniforms.uEntry, rimX * pull * sx, rimY * pull * sy);
      gl.uniform3fv(uniforms.uLineColor, toRgb(s.lineColor));
      gl.uniform3fv(uniforms.uBaseColor, toRgb(s.baseColor));
      gl.uniform1f(uniforms.uIntensity, s.intensity * (state.level + state.press * 0.8));
      gl.uniform2f(uniforms.uWindow, s.shineSize / 360 + state.press * 0.06, s.shineFade / 360 + 0.0001);
      gl.uniform1f(uniforms.uThickness, s.thickness);
      gl.uniform1f(uniforms.uGlow, s.glow);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindVertexArray(null);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const s = settingsRef.current;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const target = aim(s);
      const spinning = s.autoAnimate && !reduced;
      const steering = !!target && target.near > 0;
      if (!state.ready) {
        state.spot = restSpot(s);
        state.level = s.autoAnimate ? 1 : s.idleIntensity;
        state.ready = true;
      }
      let diff = 0;
      if (spinning && !steering) state.spot = wrapVal(state.spot + (s.speed / TAU) * dt);
      else {
        diff = (steering ? target.spot : restSpot(s)) - state.spot;
        diff -= Math.round(diff);
        state.spot = wrapVal(state.spot + diff * (1 - Math.exp(-dt * 8)));
      }
      const lvl = s.autoAnimate ? 1 : s.idleIntensity + (1 - s.idleIntensity) * (target ? target.near : 0);
      state.level += (lvl - state.level) * (1 - Math.exp(-dt * 7));
      state.press *= Math.exp(-dt * 5);
      draw(s);
      const settling = Math.abs(diff) > 0.0002 || Math.abs(lvl - state.level) > 0.001 || state.press > 0.002;
      if (settling || (spinning && !steering)) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const wake = () => { if (!raf && visible) raf = requestAnimationFrame(frame); };

    const measure = (entry?: ResizeObserverEntry) => {
      const box = entry?.borderBoxSize?.[0];
      view.width = Math.max(1, box ? box.inlineSize : button.offsetWidth);
      view.height = Math.max(1, box ? box.blockSize : button.offsetHeight);
      view.ratio = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.max(1, Math.round((view.width + PAD * 2) * view.ratio));
      canvas.height = Math.max(1, Math.round((view.height + PAD * 2) * view.ratio));
      if (state.ready) draw(settingsRef.current);
      wake();
    };

    const onPointerMove = (e: PointerEvent) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.known = true; wake(); };
    const onPointerDown = (e: PointerEvent) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.known = true; if (!settingsRef.current.disabled) state.press = 1; wake(); };
    const onPointerEnd = (e: PointerEvent) => { if (e.pointerType === 'mouse') return; pointer.known = false; wake(); };
    const onPointerLeave = () => { pointer.known = false; wake(); };

    const ro = new ResizeObserver(entries => measure(entries[entries.length - 1]));
    ro.observe(button);
    const io = new IntersectionObserver(entries => {
      visible = entries.some(e => e.isIntersecting);
      if (visible) { last = 0; wake(); }
    });
    io.observe(button);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerEnd, { passive: true });
    window.addEventListener('pointercancel', onPointerEnd, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    button.addEventListener('pointerdown', onPointerDown);

    measure();
    wakeRef.current = wake;

    return () => {
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      button.removeEventListener('pointerdown', onPointerDown);
      if (buf) gl.deleteBuffer(buf);
      if (vao) gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  // Re-wake on every render so prop changes (intensity, lineColor, etc.) take effect
  useEffect(() => { wakeRef.current?.(); });

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`specular-button specular-button--${size}${className ? ` ${className}` : ''}`}
      style={{
        '--sb-radius': `${radius}px`,
        '--sb-tint': tint,
        '--sb-tint-opacity': tintOpacity,
        '--sb-blur': `${blur}px`,
        '--sb-text-color': textColor,
        ...style,
      } as CSSProperties}
    >
      <canvas ref={canvasRef} className="specular-button__light" aria-hidden="true" />
      <span className="specular-button__label">{children}</span>
    </button>
  );
}
