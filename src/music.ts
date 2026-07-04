// Core music-theory helpers shared by both trainers.

// Chromatic scale using sharps, anchored at A = 0.
export const CHROMATIC = [
  'A',
  'A#',
  'B',
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
] as const;

export type Note = (typeof CHROMATIC)[number];

export const NOTE_INDEX: Record<Note, number> = CHROMATIC.reduce(
  (acc, note, i) => {
    acc[note] = i;
    return acc;
  },
  {} as Record<Note, number>,
);

// Standard guitar tuning, listed low string (6th) to high string (1st).
export interface GuitarString {
  /** Display label for the open note. */
  label: Note;
  /** Chromatic index of the open note. */
  open: number;
}

export const STRINGS: GuitarString[] = [
  { label: 'E', open: NOTE_INDEX['E'] }, // 6th (low E)
  { label: 'A', open: NOTE_INDEX['A'] }, // 5th
  { label: 'D', open: NOTE_INDEX['D'] }, // 4th
  { label: 'G', open: NOTE_INDEX['G'] }, // 3rd
  { label: 'B', open: NOTE_INDEX['B'] }, // 2nd
  { label: 'E', open: NOTE_INDEX['E'] }, // 1st (high E)
];

export const FRET_COUNT = 12;

/** Note sounding at a given string (index into STRINGS) and fret. */
export function noteAt(stringIndex: number, fret: number): Note {
  const open = STRINGS[stringIndex].open;
  return CHROMATIC[(open + fret) % 12];
}

// Flat equivalents for the five accidental notes.
const FLAT_EQUIV: Partial<Record<Note, string>> = {
  'A#': 'B♭',
  'C#': 'D♭',
  'D#': 'E♭',
  'F#': 'G♭',
  'G#': 'A♭',
};

/** Display form of a note: naturals as-is, accidentals as "A♯/B♭". */
export function displayNote(note: Note): string {
  const flat = FLAT_EQUIV[note];
  return flat ? `${note.replace('#', '♯')}/${flat}` : note;
}

// ---- Triads -------------------------------------------------------------

export type Quality = 'major' | 'minor' | 'diminished' | 'augmented';

export const QUALITY_LABEL: Record<Quality, string> = {
  major: 'major',
  minor: 'minor',
  diminished: 'diminished',
  augmented: 'augmented',
};

// Semitone offsets from the root for root / third / fifth.
export const TRIAD_INTERVALS: Record<Quality, [number, number, number]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
};

export const EASY_QUALITIES: Quality[] = ['major', 'minor'];
export const HARD_QUALITIES: Quality[] = [
  'major',
  'minor',
  'diminished',
  'augmented',
];

/** The three notes of a triad, in root/third/fifth order. */
export function triadNotes(root: Note, quality: Quality): [Note, Note, Note] {
  const r = NOTE_INDEX[root];
  const [i1, i2, i3] = TRIAD_INTERVALS[quality];
  return [
    CHROMATIC[(r + i1) % 12],
    CHROMATIC[(r + i2) % 12],
    CHROMATIC[(r + i3) % 12],
  ];
}

// ---- Intervals -----------------------------------------------------------

export interface Interval {
  semitones: number;
  name: string;
  short: string;
}

export const INTERVALS: Interval[] = [
  { semitones: 1, name: 'Minor 2nd', short: 'm2' },
  { semitones: 2, name: 'Major 2nd', short: 'M2' },
  { semitones: 3, name: 'Minor 3rd', short: 'm3' },
  { semitones: 4, name: 'Major 3rd', short: 'M3' },
  { semitones: 5, name: 'Perfect 4th', short: 'P4' },
  { semitones: 6, name: 'Tritone', short: 'TT' },
  { semitones: 7, name: 'Perfect 5th', short: 'P5' },
  { semitones: 8, name: 'Minor 6th', short: 'm6' },
  { semitones: 9, name: 'Major 6th', short: 'M6' },
  { semitones: 10, name: 'Minor 7th', short: 'm7' },
  { semitones: 11, name: 'Major 7th', short: 'M7' },
  { semitones: 12, name: 'Octave', short: 'P8' },
];

/** Pitch class reached by going up `semitones` from a note. */
export function transpose(note: Note, semitones: number): Note {
  return CHROMATIC[(NOTE_INDEX[note] + semitones) % 12];
}

// ---- Scales --------------------------------------------------------------

export type ScaleType = 'major' | 'minor';

// Semitone offsets from the root for each scale degree.
// Major:         W-W-H-W-W-W-H
// Natural minor: W-H-W-W-H-W-W
export const SCALE_INTERVALS: Record<ScaleType, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
};

export const MAJOR_SCALE_PATTERN = ['W', 'W', 'H', 'W', 'W', 'W', 'H'];

/** The seven notes of a scale, in degree order starting from the root. */
export function scaleNotes(root: Note, type: ScaleType): Note[] {
  const r = NOTE_INDEX[root];
  return SCALE_INTERVALS[type].map((i) => CHROMATIC[(r + i) % 12]);
}

// ---- Random helpers -----------------------------------------------------

export function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

export function randomNote(): Note {
  return CHROMATIC[randomInt(CHROMATIC.length)];
}

export function pick<T>(items: T[]): T {
  return items[randomInt(items.length)];
}

/** Compare two note sets for equality regardless of order. */
export function sameNoteSet(a: Note[], b: Note[]): boolean {
  if (a.length !== b.length) return false;
  const setB = new Set(b);
  return a.every((n) => setB.has(n));
}
