"use client";
/**
 * Tabla Rhythm Engine using Web Audio API.
 * Synthesises tabla/dhol-like percussive sounds via noise + resonant filter.
 * No audio files needed.
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let schedulerTimer: ReturnType<typeof setTimeout> | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext({ latencyHint: "interactive" });
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.9;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

/** Clamp pitch so bass frequencies stay audible (≥ 30 Hz) */
function bassPitch(base: number, pitch: number, scale = 8): number {
  return Math.max(30, base + pitch * scale);
}

// ── Percussion synthesis ─────────────────────────────────────────────────────

function playDha(time: number, volume: number, pitch: number) {
  const c = getCtx();

  // ── Bayan (left drum – low bass) ──
  const bass = c.createOscillator();
  const bassGain = c.createGain();
  bass.type = "sine";
  bass.frequency.setValueAtTime(bassPitch(90, pitch, 10), time);
  bass.frequency.exponentialRampToValueAtTime(bassPitch(45, pitch, 5), time + 0.15);
  bassGain.gain.setValueAtTime(0, time);
  bassGain.gain.linearRampToValueAtTime(volume * 0.9, time + 0.005);
  bassGain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
  bass.connect(bassGain); bassGain.connect(masterGain!);
  bass.start(time); bass.stop(time + 0.25);

  // ── Dayan (right drum – bright hit) ──
  _playNoiseHit(c, time, volume * 0.55, bassPitch(320, pitch, 22), 5.5, 0.12);
}

function playDhin(time: number, volume: number, pitch: number) {
  const c = getCtx();
  const bass = c.createOscillator();
  const bassGain = c.createGain();
  bass.type = "sine";
  bass.frequency.setValueAtTime(bassPitch(75, pitch, 8), time);
  bass.frequency.exponentialRampToValueAtTime(bassPitch(38, pitch, 4), time + 0.18);
  bassGain.gain.setValueAtTime(0, time);
  bassGain.gain.linearRampToValueAtTime(volume * 0.75, time + 0.006);
  bassGain.gain.exponentialRampToValueAtTime(0.001, time + 0.26);
  bass.connect(bassGain); bassGain.connect(masterGain!);
  bass.start(time); bass.stop(time + 0.28);

  _playNoiseHit(c, time, volume * 0.4, bassPitch(280, pitch, 18), 6, 0.14);
}

function playTin(time: number, volume: number, pitch: number) {
  const c = getCtx();
  _playNoiseHit(c, time, volume * 0.5, bassPitch(380, pitch, 28), 9, 0.1);
  // Resonant ting overtone
  const osc = c.createOscillator();
  const og = c.createGain();
  osc.type = "sine";
  osc.frequency.value = bassPitch(420, pitch, 30);
  og.gain.setValueAtTime(0, time);
  og.gain.linearRampToValueAtTime(volume * 0.25, time + 0.003);
  og.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
  osc.connect(og); og.connect(masterGain!);
  osc.start(time); osc.stop(time + 0.1);
}

function playTa(time: number, volume: number, pitch: number) {
  const c = getCtx();
  _playNoiseHit(c, time, volume * 0.38, bassPitch(340, pitch, 20), 7, 0.08);
}

function playNa(time: number, volume: number, pitch: number) {
  const c = getCtx();
  // High-frequency ghost note
  const hpFilter = c.createBiquadFilter();
  hpFilter.type = "highpass";
  hpFilter.frequency.value = bassPitch(700, pitch, 40);
  hpFilter.Q.value = 2;
  const ng = c.createGain();
  ng.gain.setValueAtTime(0, time);
  ng.gain.linearRampToValueAtTime(volume * 0.28, time + 0.003);
  ng.gain.exponentialRampToValueAtTime(0.001, time + 0.065);
  const bufSrc = _makeNoiseSrc(c, 0.07);
  bufSrc.connect(hpFilter); hpFilter.connect(ng); ng.connect(masterGain!);
  bufSrc.start(time);
}

function playGe(time: number, volume: number, pitch: number) {
  // Low ghost stroke on bayan
  playDhin(time, volume * 0.45, pitch - 2);
}

function playKe(time: number, volume: number, pitch: number) {
  playNa(time, volume * 0.42, pitch);
}

/** Bandpass noise burst — shared helper */
function _playNoiseHit(
  c: AudioContext,
  time: number,
  volume: number,
  freq: number,
  Q: number,
  release: number
) {
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = Math.max(200, freq);
  filter.Q.value = Q;
  const ng = c.createGain();
  ng.gain.setValueAtTime(0, time);
  ng.gain.linearRampToValueAtTime(volume, time + 0.004);
  ng.gain.exponentialRampToValueAtTime(0.001, time + release);
  const src = _makeNoiseSrc(c, release + 0.01);
  src.connect(filter); filter.connect(ng); ng.connect(masterGain!);
  src.start(time);
}

/** Create a short white-noise buffer source */
function _makeNoiseSrc(c: AudioContext, durationS: number): AudioBufferSourceNode {
  const bufLen = Math.ceil(c.sampleRate * durationS);
  const buffer = c.createBuffer(1, bufLen, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buffer;
  return src;
}

export function playSyllable(syllable: string, time: number, volume: number, pitch: number) {
  if (syllable === "-" || syllable.toLowerCase() === "rest") {
    return;
  }

  switch (syllable.toLowerCase()) {
    case "dha":  return playDha(time, volume, pitch);
    case "dhin": return playDhin(time, volume, pitch);
    case "tin":
    case "ti":   return playTin(time, volume, pitch);
    case "ta":   return playTa(time, volume, pitch);
    case "na":   return playNa(time, volume, pitch);
    case "ge":   return playGe(time, volume, pitch);
    case "ke":   return playKe(time, volume, pitch);
    default:     return playNa(time, volume, pitch);
  }
}

// ── Metronome click ──────────────────────────────────────────────────────────

export function playClick(time: number, volume: number, isAccent = false) {
  const c = getCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sine";
  osc.frequency.value = isAccent ? 1200 : 800;
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(volume * (isAccent ? 0.9 : 0.5), time + 0.002);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
  osc.connect(g); g.connect(masterGain!);
  osc.start(time); osc.stop(time + 0.05);
}

// ── Scheduler ────────────────────────────────────────────────────────────────

interface SchedulerOptions {
  pattern: Array<{ syllable: string; isKhali: boolean }>;
  bpm: number;
  pitch: number;
  volume: number;
  isMetronome: boolean;
  onBeat: (beatIndex: number) => void;
}

const LOOKAHEAD_MS    = 25;
const SCHEDULE_AHEAD_S = 0.12;

let currentBeat  = 0;
let nextBeatTime = 0;
let schedulerOpts: SchedulerOptions | null = null;
const beatUiTimers = new Set<ReturnType<typeof setTimeout>>();

function scheduler() {
  if (!schedulerOpts) return;
  const { pattern, bpm, pitch, volume, isMetronome, onBeat } = schedulerOpts;
  const beatLen = 60 / bpm;
  const c = getCtx();

  while (nextBeatTime < c.currentTime + SCHEDULE_AHEAD_S) {
    const beatIdx = currentBeat % pattern.length;
    const beat    = pattern[beatIdx];

    if (isMetronome) {
      playClick(nextBeatTime, volume, beatIdx === 0);
    } else {
      // Khali beats play softer (no bass, ghost stroke only)
      playSyllable(beat.syllable, nextBeatTime, beat.isKhali ? volume * 0.3 : volume, pitch);
    }

    // Schedule UI callback as close to the beat as possible
    const delay = Math.max(0, (nextBeatTime - c.currentTime) * 1000);
    const capturedBeat = beatIdx;
    const uiTimer = setTimeout(() => {
      beatUiTimers.delete(uiTimer);
      if (schedulerOpts) onBeat(capturedBeat);
    }, delay);
    beatUiTimers.add(uiTimer);

    nextBeatTime += beatLen;
    currentBeat++;
  }

  schedulerTimer = setTimeout(scheduler, LOOKAHEAD_MS);
}

export function startRhythm(opts: SchedulerOptions) {
  stopRhythm();
  schedulerOpts = opts;
  currentBeat  = 0;
  nextBeatTime = getCtx().currentTime + 0.05;
  scheduler();
}

export function stopRhythm() {
  if (schedulerTimer) { clearTimeout(schedulerTimer); schedulerTimer = null; }
  beatUiTimers.forEach((timer) => clearTimeout(timer));
  beatUiTimers.clear();
  schedulerOpts = null;
  currentBeat  = 0;
}

export function updateBpm(bpm: number) {
  if (schedulerOpts) schedulerOpts = { ...schedulerOpts, bpm };
}
