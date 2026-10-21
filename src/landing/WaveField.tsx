import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { token, type Theme } from "../lib/theme";

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uEnv;
  uniform vec2 uMouse;
  uniform float uDpr;
  varying float vH;
  varying float vZ;

  void main() {
    float x = position.x;
    float z = position.z;
    // Taper to silence at both ends, like a single utterance on a scope.
    float bell = exp(-pow(x * 1.45, 2.0));
    // Long, slow swells (not a flicker), on the same tempo as the orb.
    float w = sin(x * 11.0 - uTime * 2.2 + z * 4.0) * 0.50
            + sin(x * 23.0 + uTime * 3.0 - z * 6.5) * 0.22
            + sin(x * 6.0 + uTime * 1.0 + z * 2.0) * 0.38;
    // Back rows sit further away, so they get more height to read as moving too.
    float amp = (0.02 + uEnv * 0.28) * bell * (1.0 + z * 0.9);
    float bend = exp(-pow((x - uMouse.x) * 2.2, 2.0)) * uMouse.y * 0.34 * (1.0 - z);
    float y = w * amp + bend;

    vec3 p = vec3(x * 3.4, y, (z - 0.35) * -2.6);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vH = abs(y);
    vZ = z;
    gl_PointSize = (1.8 + vH * 7.0) * uDpr * (2.6 / -mv.z);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uBone;
  uniform vec3 uSignal;
  varying float vH;
  varying float vZ;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    // Crests run warm even at rest, and go fully orange as she speaks.
    float heat = smoothstep(0.015, 0.2, vH);
    // The front rows carry a light orange tint even when nothing is playing.
    vec3 col = mix(uBone, uSignal, max(heat, 0.4 * (1.0 - vZ)));
    float a = (1.0 - vZ * 0.7) * (0.55 + heat * 0.45);
    gl_FragColor = vec4(col, a);
  }
`;

// Shared with the orb so the two move together.
export const TEMPO = 0.25;

/** Points ribbon that "speaks": its amplitude follows `envelope.current` (0..1). */
export default function WaveField({ envelope, theme }: { envelope: MutableRefObject<number>; theme: Theme }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0, 0.85, 4.2);
    camera.lookAt(0, -0.05, 0);

    const NX = 260;
    const NZ = 64;
    const pos = new Float32Array(NX * NZ * 3);
    for (let j = 0, i = 0; j < NZ; j++) {
      for (let k = 0; k < NX; k++, i += 3) {
        pos[i] = (k / (NX - 1)) * 2 - 1;
        pos[i + 1] = 0;
        pos[i + 2] = j / (NZ - 1);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    const uniforms = {
      uTime: { value: 0 },
      uEnv: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uDpr: { value: dpr },
      uBone: { value: new THREE.Color(token("--bone")) },
      uSignal: { value: new THREE.Color(token("--signal")) },
    };
    const mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms,
      transparent: true,
      depthWrite: false,
      // Additive glow vanishes on a light page, so light uses normal blending.
      blending: theme === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    scene.add(new THREE.Points(geo, mat));

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Keep the whole ribbon in frame on narrow screens.
      camera.position.z = w / h < 1 ? 4.2 / Math.max(w / h, 0.45) : 4.2;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const target = new THREE.Vector2(0, 0);
    // Listen on the window: the hero copy sits on top of the stage and would swallow its pointer events.
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const inside = e.clientY >= r.top && e.clientY <= r.bottom;
      target.set(((e.clientX - r.left) / r.width) * 2 - 1, inside ? 1 - Math.min(1, Math.abs((e.clientY - r.top) / r.height - 0.5) * 2) : 0);
    };
    window.addEventListener("pointermove", onMove);

    // Only render while on screen.
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t * TEMPO;
      // Heavy smoothing: follow the shape of her speech, not every syllable.
      uniforms.uEnv.value += (envelope.current - uniforms.uEnv.value) * 0.04;
      uniforms.uMouse.value.lerp(target, 0.06);
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [envelope, theme]);

  return <div ref={host} className="wavefield" aria-hidden="true" />;
}
