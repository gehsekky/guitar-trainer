// Web Audio engine: note → frequency math and tone playback.
// Kept generic (sequences, chords) so future ear trainers can reuse it.

import { NOTE_INDEX, type Note } from './music';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** MIDI number for a note in scientific pitch notation (A4 = 69). */
export function midiOf(note: Note, octave: number): number {
  // NOTE_INDEX is anchored at A = 0; convert to semitones-above-C.
  const fromC = (NOTE_INDEX[note] + 9) % 12;
  return (octave + 1) * 12 + fromC;
}

export function freqOfMidi(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

const ATTACK = 0.015;
const PEAK_GAIN = 0.35;

/** Schedule a single plucked-style tone. Returns its end time. */
function scheduleTone(
  audio: AudioContext,
  midi: number,
  start: number,
  duration: number,
): number {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = 'triangle';
  osc.frequency.value = freqOfMidi(midi);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(PEAK_GAIN, start + ATTACK);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(gain).connect(audio.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
  return start + duration;
}

/**
 * Play MIDI notes one after another.
 * Returns the total duration in seconds (for UI "is playing" state).
 */
export function playMidiSequence(
  midis: number[],
  noteDuration = 0.9,
  gap = 0.2,
): number {
  const audio = getCtx();
  const t0 = audio.currentTime + 0.05;
  midis.forEach((midi, i) => {
    scheduleTone(audio, midi, t0 + i * (noteDuration + gap), noteDuration);
  });
  return midis.length * (noteDuration + gap);
}

/**
 * Play MIDI notes simultaneously as a chord.
 * Returns the total duration in seconds.
 */
export function playMidiChord(midis: number[], duration = 1.6): number {
  const audio = getCtx();
  const t0 = audio.currentTime + 0.05;
  midis.forEach((midi) => scheduleTone(audio, midi, t0, duration));
  return duration;
}
