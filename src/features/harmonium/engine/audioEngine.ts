"use client";
/**
 * Harmonium Audio Engine using Web Audio API.
 * Synthesises harmonium-like tones: sawtooth + slight detuning + ADSR.
 * No external audio files needed – runs entirely in the browser.
 */

import type { DroneMode, HarmoniumToneMode, HarmoniumTuningMode, RootNote } from "@/types";

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;

interface ActiveVoice {
  osc1: OscillatorNode;
  osc2: OscillatorNode;
  osc3: OscillatorNode;
  gainNode: GainNode;
  filterNode: BiquadFilterNode;
}

const voices = new Map<string, ActiveVoice>();
let droneVoices: ActiveVoice[] = [];

const NOTE_TO_SEMITONE: Record<RootNote, number> = {
  C: 0,
  "C#": 1,
  D: 2,
  "D#": 3,
  E: 4,
  F: 5,
  "F#": 6,
  G: 7,
  "G#": 8,
  A: 9,
  "A#": 10,
  B: 11,
};

const JUST_RATIOS = [
  1,
  16 / 15,
  9 / 8,
  6 / 5,
  5 / 4,
  4 / 3,
  45 / 32,
  3 / 2,
  8 / 5,
  5 / 3,
  9 / 5,
  15 / 8,
];

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext({ latencyHint: "interactive" });
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.8;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function noteToFreq(
  note: string,
  transpose = 0,
  tuningMode: HarmoniumTuningMode = "equal",
  rootNote: RootNote = "C"
): number {
  // e.g. "C4", "F#3"
  const match = note.match(/^([A-G]#?)(\d)$/);
  if (!match) return 261.63;
  const semitones = NOTE_TO_SEMITONE[match[1] as RootNote] ?? 0;
  const octave = parseInt(match[2]);
  const midi = semitones + (octave + 1) * 12 + transpose;

  const equalFreq = 440 * Math.pow(2, (midi - 69) / 12);
  if (tuningMode === "equal") return equalFreq;

  const rootSemi = NOTE_TO_SEMITONE[rootNote];
  const rootMidi = (octave + 1) * 12 + rootSemi;
  const distance = midi - rootMidi;
  const octaveShift = Math.floor(distance / 12);
  const degree = ((distance % 12) + 12) % 12;
  const rootFreq = 440 * Math.pow(2, (rootMidi - 69) / 12) * Math.pow(2, octaveShift);
  const ratio = JUST_RATIOS[degree] ?? 1;
  return rootFreq * ratio;
}

function createHarmoniumVoice(
  frequency: number,
  volume: number,
  sustain: number,
  toneMode: HarmoniumToneMode,
  bellowsExpression: number,
  velocity = 1
): ActiveVoice {
  const ctx_ = getCtx();
  const safeBellows = Math.max(0, Math.min(1, bellowsExpression));
  const safeVelocity = Math.max(0.2, Math.min(1, velocity));

  const attackTime = 0.015 + (1 - safeBellows) * 0.04;
  const decayTime = 0.07 + (1 - safeBellows) * 0.08;
  const brightness = toneMode === "warm-reed"
    ? 1400 + safeBellows * 1400
    : 2200 + safeBellows * 2200;

  // Low-pass filter for warmth
  const filter = ctx_.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = brightness + frequency * (toneMode === "warm-reed" ? 0.45 : 0.8);
  filter.Q.value = toneMode === "warm-reed" ? 1.0 : 0.7;

  const gainNode = ctx_.createGain();
  gainNode.gain.setValueAtTime(0, ctx_.currentTime);
  // ADSR with bellows-influenced attack and decay.
  gainNode.gain.linearRampToValueAtTime(volume * safeVelocity * (0.7 + safeBellows * 0.3), ctx_.currentTime + attackTime);
  gainNode.gain.exponentialRampToValueAtTime(
    Math.max(0.001, volume * safeVelocity * sustain),
    ctx_.currentTime + attackTime + decayTime
  );

  // Three oscillator stack with selectable tonal character.
  const osc1 = ctx_.createOscillator();
  osc1.type = toneMode === "warm-reed" ? "triangle" : "sawtooth";
  osc1.frequency.value = frequency;

  const osc2 = ctx_.createOscillator();
  osc2.type = "sawtooth";
  osc2.frequency.value = frequency * (toneMode === "warm-reed" ? 1.0015 : 1.003);

  const osc3 = ctx_.createOscillator();
  osc3.type = toneMode === "warm-reed" ? "sine" : "square";
  osc3.frequency.value = frequency * 2;     // one octave up, quiet
  const osc3Gain = ctx_.createGain();
  osc3Gain.gain.value = toneMode === "warm-reed" ? 0.12 : 0.08;

  osc1.connect(filter);
  osc2.connect(filter);
  osc3.connect(osc3Gain);
  osc3Gain.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(masterGain!);

  osc1.start();
  osc2.start();
  osc3.start();

  return { osc1, osc2, osc3, gainNode, filterNode: filter };
}

export function playNote(
  note: string,
  volume: number,
  sustain: number,
  transpose = 0,
  rootNote: RootNote = "C",
  tuningMode: HarmoniumTuningMode = "equal",
  toneMode: HarmoniumToneMode = "basic",
  bellowsExpression = 0.7,
  velocity = 1
) {
  if (voices.has(note)) return; // already playing
  const freq = noteToFreq(note, transpose, tuningMode, rootNote);
  const voice = createHarmoniumVoice(freq, volume, sustain, toneMode, bellowsExpression, velocity);
  voices.set(note, voice);
}

export function stopNote(note: string) {
  const voice = voices.get(note);
  if (!voice) return;
  // Remove the voice immediately so a quick repeat of the same key can start a new sound.
  voices.delete(note);
  const ctx_ = getCtx();
  const t = ctx_.currentTime;
  voice.gainNode.gain.cancelScheduledValues(t);
  voice.gainNode.gain.setValueAtTime(voice.gainNode.gain.value, t);
  // Short release keeps the instrument responsive and avoids notes hanging after input ends.
  voice.gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  setTimeout(() => {
    try {
      voice.osc1.stop(); voice.osc2.stop(); voice.osc3.stop();
      voice.osc1.disconnect(); voice.osc2.disconnect(); voice.osc3.disconnect();
      voice.filterNode.disconnect(); voice.gainNode.disconnect();
    } catch { /* already stopped */ }
    if (voices.get(note) === voice) voices.delete(note);
  }, 150);
}

export function stopAllNotes() {
  for (const note of Array.from(voices.keys())) stopNote(note);
}

export function setMasterVolume(v: number) {
  if (masterGain) masterGain.gain.value = v;
}

// ── Drone ────────────────────────────────────────────────────────────────────

export function startDrone(
  mode: DroneMode,
  octave: number,
  volume: number,
  transpose = 0,
  rootNote: RootNote = "C",
  tuningMode: HarmoniumTuningMode = "equal",
  toneMode: HarmoniumToneMode = "basic",
  bellowsExpression = 0.7
) {
  stopDrone();
  if (mode === "off") return;

  const rootSemi = NOTE_TO_SEMITONE[rootNote];
  const paSemi = (rootSemi + 7) % 12;
  const noteNames = Object.entries(NOTE_TO_SEMITONE).reduce<Record<number, RootNote>>((acc, [name, value]) => {
    acc[value] = name as RootNote;
    return acc;
  }, {});

  const dronePairs: string[] = [];
  if (mode === "sa" || mode === "sa+pa") dronePairs.push(`${noteNames[rootSemi]}${octave}`);
  if (mode === "pa" || mode === "sa+pa") dronePairs.push(`${noteNames[paSemi]}${octave}`);

  const safeBellows = Math.max(0, Math.min(1, bellowsExpression));

  droneVoices = dronePairs.map((note) => {
    const freq = noteToFreq(note, transpose, tuningMode, rootNote);
    const ctx_ = getCtx();
    const filter = ctx_.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = toneMode === "warm-reed" ? 900 + safeBellows * 700 : 1200 + safeBellows * 700;

    const gainNode = ctx_.createGain();
    gainNode.gain.setValueAtTime(0, ctx_.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * (0.28 + safeBellows * 0.2), ctx_.currentTime + 0.8);

    const osc1 = ctx_.createOscillator();
    osc1.type = toneMode === "warm-reed" ? "triangle" : "sawtooth";
    osc1.frequency.value = freq;

    const osc2 = ctx_.createOscillator();
    osc2.type = "sawtooth";
    osc2.frequency.value = freq * (toneMode === "warm-reed" ? 0.999 : 0.998);

    const osc3 = ctx_.createOscillator();
    osc3.type = "sine";
    osc3.frequency.value = freq * 2;
    const subGain = ctx_.createGain();
    subGain.gain.value = 0.15;

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(subGain);
    subGain.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain!);

    osc1.start(); osc2.start(); osc3.start();
    return { osc1, osc2, osc3, gainNode, filterNode: filter };
  });
}

export function stopDrone() {
  droneVoices.forEach((v) => {
    const t = getCtx().currentTime;
    v.gainNode.gain.setValueAtTime(v.gainNode.gain.value, t);
    v.gainNode.gain.linearRampToValueAtTime(0.001, t + 0.5);
    setTimeout(() => {
      try {
        v.osc1.stop(); v.osc2.stop(); v.osc3.stop();
        v.osc1.disconnect(); v.osc2.disconnect(); v.osc3.disconnect();
        v.filterNode.disconnect(); v.gainNode.disconnect();
      } catch { /* already stopped */ }
    }, 550);
  });
  droneVoices = [];
}

// ── Recording capture ────────────────────────────────────────────────────────

let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: BlobPart[] = [];
let recordingDest: MediaStreamAudioDestinationNode | null = null;

function clearAudioCapture() {
  if (recordingDest) {
    try { masterGain?.disconnect(recordingDest); } catch { /* ignore */ }
    recordingDest = null;
  }
}

export async function startAudioCapture(onError?: (message: string) => void): Promise<void> {
  if (typeof MediaRecorder === "undefined") {
    throw new Error("Recording is not supported by this browser.");
  }
  if (mediaRecorder?.state === "recording") {
    throw new Error("A recording is already in progress.");
  }

  // Disconnect previous destination to avoid accumulating connections
  clearAudioCapture();

  const ctx_ = getCtx();
  recordingDest = ctx_.createMediaStreamDestination();
  masterGain?.connect(recordingDest);
  recordedChunks = [];

  const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
    ? "audio/webm;codecs=opus"
    : "audio/webm";

  try {
    mediaRecorder = new MediaRecorder(recordingDest.stream, { mimeType });
  } catch {
    clearAudioCapture();
    throw new Error("Recording could not be initialized in this browser.");
  }
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };
  mediaRecorder.onerror = () => {
    mediaRecorder = null;
    recordedChunks = [];
    clearAudioCapture();
    onError?.("Recording stopped unexpectedly. Please try again.");
  };
  mediaRecorder.start(100);
}

export async function stopAudioCapture(): Promise<Blob | null> {
  if (!mediaRecorder) return null;
  if (mediaRecorder.state === "inactive") return null;
  return new Promise((resolve) => {
    mediaRecorder!.onstop = () => {
      const mimeType = mediaRecorder?.mimeType ?? "audio/webm";
      const blob = new Blob(recordedChunks, { type: mimeType });
      recordedChunks = [];
      clearAudioCapture();
      mediaRecorder = null;
      resolve(blob);
    };
    try {
      mediaRecorder!.stop();
    } catch {
      resolve(null);
    }
  });
}
