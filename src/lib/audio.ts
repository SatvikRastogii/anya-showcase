import { useSyncExternalStore } from "react";

// One shared player for the whole page: starting a clip stops the previous one,
// and an analyser exposes the live level so the hero wave can follow the voice.

let ctx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let buf: Float32Array | null = null;
let el: HTMLAudioElement | null = null;
let current: string | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function ensure() {
  if (el) return el;
  el = new Audio();
  el.preload = "auto";
  el.addEventListener("ended", () => { current = null; emit(); });
  try {
    ctx = new AudioContext();
    const source = ctx.createMediaElementSource(el);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    buf = new Float32Array(analyser.fftSize);
    source.connect(analyser);
    analyser.connect(ctx.destination);
  } catch {
    // No Web Audio: the clip still plays, the wave just won't follow it.
    ctx = null;
    analyser = null;
  }
  return el;
}

/** Play `src`; pressing the same clip again stops it. Only ever called from a click. */
export async function toggle(src: string) {
  const a = ensure();
  if (current === src) {
    stop();
    return;
  }
  a.pause();
  a.src = src;
  a.currentTime = 0;
  current = src;
  emit();
  try {
    await ctx?.resume();
    await a.play();
  } catch {
    // A later click replaced this clip (AbortError): leave the new one's state alone.
    if (current === src) {
      current = null;
      emit();
    }
  }
}

export function stop() {
  el?.pause();
  current = null;
  emit();
}

/** 0..1 loudness of what's playing right now. */
export function level() {
  if (!analyser || !buf || !el || el.paused) return 0;
  analyser.getFloatTimeDomainData(buf);
  let sum = 0;
  for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
  return Math.min(1, Math.sqrt(sum / buf.length) * 5);
}

export function usePlaying(): string | null {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => current, () => null);
}
