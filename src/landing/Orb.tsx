import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { token, type Theme } from "../lib/theme";
import { TEMPO } from "./WaveField";

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform float uDpr;
  uniform float uSize;
  varying float vFace;
  varying float vLift;

  // Cheap smooth "noise" from layered sines: enough for a soft, folding blob.
  float field(vec3 p, float t) {
    return sin(p.x * 2.0 + t * 0.9) * sin(p.y * 2.4 - t * 1.1) * sin(p.z * 1.8 + t * 0.7) * 1.4
         + 0.6 * sin(p.x * 3.0 - t * 1.2 + p.z * 2.0) * sin(p.y * 2.7 + t);
  }

  void main() {
    vec3 n = normalize(position);
    float d = field(n * 1.4, uTime);
    vec3 p = n * (1.0 + d * uAmp);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vFace = normalize(normalMatrix * n).z;
    vLift = d;
    gl_PointSize = uSize * uDpr * (5.6 / -mv.z);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uRim;
  uniform vec3 uCore;
  uniform vec3 uDeep;
  varying float vFace;
  varying float vLift;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    // Orange at the silhouette and on raised folds, purple-red towards the middle.
    float rim = 1.0 - abs(vFace);
    vec3 col = mix(uDeep, uCore, smoothstep(0.05, 0.65, rim + vLift * 0.25));
    col = mix(col, uRim, smoothstep(0.5, 1.0, rim + vLift * 0.45));
    float a = vFace < 0.0 ? 0.22 : 0.45 + 0.55 * rim;
    gl_FragColor = vec4(col, a);
  }
`;

/** Dotted blob that idles gently and churns with the voice. `envelope` is the live level (0..1). */
export default function Orb({ envelope, playing, theme }: { envelope: MutableRefObject<number>; playing: boolean; theme: Theme }) {
  const host = useRef<HTMLDivElement>(null);
  const live = useRef(playing);
  live.current = playing;

  useEffect(() => {
    const el = host.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
    camera.position.set(0, 0, 8.1);

    // The canvas is much larger than the button and the camera sits back to match,
    // so the blob can swell past the button without hitting the canvas edge.
    // Latitude rows of dots, like the reference's knitted look.
    const ROWS = 70;
    const pts: number[] = [];
    for (let r = 1; r < ROWS; r++) {
      const phi = (r / ROWS) * Math.PI;
      const count = Math.max(6, Math.round(Math.sin(phi) * ROWS * 2));
      for (let k = 0; k < count; k++) {
        const th = (k / count) * Math.PI * 2;
        pts.push(Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th));
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));

    const uniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.1 },
      uDpr: { value: dpr },
      uSize: { value: theme === "dark" ? 1.9 : 2.3 },
      // Accent rim fading into a dark core: white-to-grey on dark, black-to-grey on light.
      uRim: { value: new THREE.Color(token("--signal")) },
      uCore: { value: new THREE.Color(theme === "dark" ? "#a8a8a8" : "#6b6b6b") },
      uDeep: { value: new THREE.Color(theme === "dark" ? "#3a3a3a" : "#c9c9c9") },
    };
    const mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: theme === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    const blob = new THREE.Points(geo, mat);
    scene.add(blob);

    const resize = () => {
      const s = el.clientWidth;
      renderer.setSize(s, s, false);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    let speak = 0;
    let env = 0;
    let t = 0;
    let last = 0;
    let raf = 0;
    const loop = (ms: number) => {
      raf = requestAnimationFrame(loop);
      const dt = last ? Math.min((ms - last) / 1000, 0.05) : 0;
      last = ms;
      if (!visible) return;
      speak += ((live.current ? 1 : 0) - speak) * 0.03;
      env += ((live.current ? envelope.current : 0) - env) * 0.04;
      t += dt * (TEMPO + speak * 0.6);
      uniforms.uTime.value = t;
      uniforms.uAmp.value = 0.13 + speak * 0.07 + Math.min(env, 1) * 0.24;
      blob.rotation.y += dt * (0.12 + speak * 0.18);
      blob.rotation.x = Math.sin(t * 0.3) * 0.25;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [envelope, theme]);

  return <div ref={host} className="orb__gl" aria-hidden="true" />;
}
