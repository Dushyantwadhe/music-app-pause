"use client";
/**
 * Harmonium Audio Engine using Web Audio API.
 * Synthesises harmonium-like tones: sawtooth + slight detuning + ADSR.
 * No external audio files needed – runs entirely in the browser.
 */

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

function noteToFreq(note: string, transpose = 0): number {
  // e.g. "C4", "F#3"
  const match = note.match(/^([A-G]#?)(\d)$/);
  if (!match) return 261.63;
  const noteMap: Record<string, number> = {
    C:0,  "C#":1, D:2,  "D#":3, E:4,  F:5,
    "F#":6, G:7, "G#":8, A:9, "A#":10, B:11,
  };
  const semitones = noteMap[match[1]] ?? 0;
  const octave = parseInt(match[2]);
  const midi = semitones + (octave + 1) * 12 + transpose;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function createHarmoniumVoice(
  frequency: number,
  volume: number,
  sustain: number
): ActiveVoice {
  const ctx_ = getCtx();

  // Low-pass filter for warmth
  const filter = ctx_.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 2200 + frequency * 0.8;
  filter.Q.value = 0.7;

  const gainNode = ctx_.createGain();
  gainNode.gain.setValueAtTime(0, ctx_.currentTime);
  // ADSR: Attack 30ms, Decay 80ms, Sustain level, Release via stopNote
  gainNode.gain.linearRampToValueAtTime(volume * 0.85, ctx_.currentTime + 0.03);
  gainNode.gain.exponentialRampToValueAtTime(
    Math.max(0.001, volume * sustain),
    ctx_.currentTime + 0.11
  );

  // Three slightly detuned oscillators for richness
  const osc1 = ctx_.createOscillator();
  osc1.type = "sawtooth";
  osc1.frequency.value = frequency;

  const osc2 = ctx_.createOscillator();
  osc2.type = "sawtooth";
  osc2.frequency.value = frequency * 1.003; // +3 cents detune

  const osc3 = ctx_.createOscillator();
  osc3.type = "square";
  osc3.frequency.value = frequency * 2;     // one octave up, quiet
  const osc3Gain = ctx_.createGain();
  osc3Gain.gain.value = 0.08;

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

export function playNote(note: string, volume: number, sustain: number, transpose = 0) {
  if (voices.has(note)) return; // already playing
  const freq = noteToFreq(note, transpose);
  const voice = createHarmoniumVoice(freq, volume, sustain);
  voices.set(note, voice);
}

export function stopNote(note: string) {
  const voice = voices.get(note);
  if (!voice) return;
  const ctx_ = getCtx();
  const t = ctx_.currentTime;
  voice.gainNode.gain.cancelScheduledValues(t);
  voice.gainNode.gain.setValueAtTime(voice.gainNode.gain.value, t);
  // Release: 350ms fade to silence
  voice.gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  setTimeout(() => {
    try {
      voice.osc1.stop(); voice.osc2.stop(); voice.osc3.stop();
      voice.osc1.disconnect(); voice.osc2.disconnect(); voice.osc3.disconnect();
      voice.filterNode.disconnect(); voice.gainNode.disconnect();
    } catch { /* already stopped */ }
    voices.delete(note);
  }, 380);
}

export function stopAllNotes() {
  for (const note of voices.keys()) stopNote(note);
}

export function setMasterVolume(v: number) {
  if (masterGain) masterGain.gain.value = v;
}

// ── Drone ────────────────────────────────────────────────────────────────────

export function startDrone(
  mode: "sa" | "pa" | "sa+pa",
  octave: number,
  volume: number,
  transpose = 0
) {
  stopDrone();
  const dronePairs: string[] = [];
  if (mode === "sa" || mode === "sa+pa") dronePairs.push(`C${octave}`);
  if (mode === "pa" || mode === "sa+pa") dronePairs.push(`G${octave}`);

  droneVoices = dronePairs.map((note) => {
    const freq = noteToFreq(note, transpose);
    const ctx_ = getCtx();
    const filter = ctx_.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1200;

    const gainNode = ctx_.createGain();
    gainNode.gain.setValueAtTime(0, ctx_.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.4, ctx_.currentTime + 0.8);

    const osc1 = ctx_.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.value = freq;

    const osc2 = ctx_.createOscillator();
    osc2.type = "sawtooth";
    osc2.frequency.value = freq * 0.998;

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

export async function startAudioCapture(): Promise<void> {
  // Disconnect previous destination to avoid accumulating connections
  if (recordingDest) {
    try { masterGain?.disconnect(recordingDest); } catch { /* ignore */ }
    recordingDest = null;
  }

  const ctx_ = getCtx();
  recordingDest = ctx_.createMediaStreamDestination();
  masterGain?.connect(recordingDest);
  recordedChunks = [];

  const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
    ? "audio/webm;codecs=opus"
    : "audio/webm";

  mediaRecorder = new MediaRecorder(recordingDest.stream, { mimeType });
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };
  mediaRecorder.start(100);
}

export async function stopAudioCapture(): Promise<Blob | null> {
  if (!mediaRecorder) return null;
  return new Promise((resolve) => {
    mediaRecorder!.onstop = () => {
      const mimeType = mediaRecorder?.mimeType ?? "audio/webm";
      const blob = new Blob(recordedChunks, { type: mimeType });
      recordedChunks = [];
      // Disconnect recording destination
      if (recordingDest) {
        try { masterGain?.disconnect(recordingDest); } catch { /* ignore */ }
        recordingDest = null;
      }
      mediaRecorder = null;
      resolve(blob);
    };
    mediaRecorder!.stop();
  });
}
