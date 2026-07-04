import { useState } from 'react';
import NotePicker from './NotePicker';
import {
  DEGREE_NAMES,
  DIATONIC,
  QUALITY_LABEL,
  diatonicTriad,
  displayNote,
  randomInt,
  randomNote,
  scaleNotes,
  type Note,
  type Quality,
} from '../music';

// This trainer currently drills major keys, matching the I-ii-iii-IV-V-vi-vii°
// pattern. DIATONIC also holds the minor pattern for a future key-type toggle.
const SCALE_TYPE = 'major' as const;
const NUMERALS = DIATONIC[SCALE_TYPE].map((c) => c.numeral);
const FIND_QUALITIES: Quality[] = ['major', 'minor', 'diminished'];

type Mode = 'find' | 'name';

interface Round {
  keyRoot: Note;
  degree: number; // 0-6
}

function newRound(): Round {
  return { keyRoot: randomNote(), degree: randomInt(7) };
}

type Phase = 'guessing' | 'graded';

const MODE_STORAGE_KEY = 'guitar-trainer.diatonic-mode';

function loadMode(): Mode {
  return localStorage.getItem(MODE_STORAGE_KEY) === 'name' ? 'name' : 'find';
}

export default function DiatonicChordTrainer() {
  const [mode, setMode] = useState<Mode>(loadMode);
  const [round, setRound] = useState<Round>(() => newRound());
  const [phase, setPhase] = useState<Phase>('guessing');
  const [correct, setCorrect] = useState(false);

  // Find-mode inputs
  const [selectedRoot, setSelectedRoot] = useState<Note[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<Quality | null>(null);
  // Name-mode input
  const [selectedNumeral, setSelectedNumeral] = useState<string | null>(null);

  const chord = DIATONIC[SCALE_TYPE][round.degree];
  const chordRoot = scaleNotes(round.keyRoot, SCALE_TYPE)[round.degree];
  const triad = diatonicTriad(round.keyRoot, SCALE_TYPE, round.degree);
  const keyName = `${displayNote(round.keyRoot)} ${SCALE_TYPE}`;
  const chordName = `${displayNote(chordRoot)} ${QUALITY_LABEL[chord.quality]}`;
  const degreeName = DEGREE_NAMES[SCALE_TYPE][round.degree];
  const triadDisplay = triad.map(displayNote).join(' – ');

  function resetInputs() {
    setSelectedRoot([]);
    setSelectedQuality(null);
    setSelectedNumeral(null);
  }

  function changeMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    localStorage.setItem(MODE_STORAGE_KEY, next);
    setRound(newRound());
    resetInputs();
    setPhase('guessing');
  }

  const ready =
    mode === 'find'
      ? selectedRoot.length === 1 && selectedQuality !== null
      : selectedNumeral !== null;

  function submit() {
    if (!ready) return;
    const ok =
      mode === 'find'
        ? selectedRoot[0] === chordRoot && selectedQuality === chord.quality
        : selectedNumeral === chord.numeral;
    setCorrect(ok);
    setPhase('graded');
  }

  function next() {
    setRound(newRound());
    resetInputs();
    setPhase('guessing');
  }

  const reveal =
    mode === 'find' ? (
      <>
        <strong>{chord.numeral}</strong> in {keyName} is{' '}
        <strong>{chordName}</strong> ({triadDisplay}) — the {degreeName}
      </>
    ) : (
      <>
        <strong>{chordName}</strong> is <strong>{chord.numeral}</strong> in{' '}
        {keyName} — the {degreeName}
      </>
    );

  return (
    <section className="trainer">
      <h2>Diatonic Chord Trainer</h2>

      <div className="mode-toggle" role="radiogroup" aria-label="Mode">
        {(['find', 'name'] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            className={mode === m ? 'mode-btn active' : 'mode-btn'}
            onClick={() => changeMode(m)}
          >
            {m === 'find' ? 'Find Chord' : 'Name Numeral'}
          </button>
        ))}
      </div>

      <p className="instructions">
        {mode === 'find'
          ? 'Identify the chord for the Roman numeral — pick its root and quality.'
          : 'Name the Roman numeral for the chord shown in this key.'}
      </p>

      {mode === 'find' ? (
        <>
          <div className="chord-prompt">
            <div className="chord-name">{keyName}</div>
            <div className="numeral-display">{chord.numeral}</div>
          </div>

          <div className="field-label">Root</div>
          <NotePicker
            selected={selectedRoot}
            max={1}
            onChange={setSelectedRoot}
            disabled={phase === 'graded'}
            correctNotes={[chordRoot]}
            graded={phase === 'graded'}
          />

          <div className="field-label">Quality</div>
          <div className="chip-row" role="group" aria-label="Chord quality">
            {FIND_QUALITIES.map((q) => {
              const isSelected = selectedQuality === q;
              const isCorrect = phase === 'graded' && q === chord.quality;
              const isWrong = phase === 'graded' && isSelected && !isCorrect;
              let cls = 'note-btn chip-btn';
              if (isSelected) cls += ' selected';
              if (isCorrect) cls += ' correct';
              if (isWrong) cls += ' wrong';
              return (
                <button
                  key={q}
                  type="button"
                  className={cls}
                  aria-pressed={isSelected}
                  disabled={phase === 'graded'}
                  onClick={() => setSelectedQuality(isSelected ? null : q)}
                >
                  {QUALITY_LABEL[q]}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="chord-prompt">
            <div className="chord-label">In {keyName}:</div>
            <div className="chord-name">{chordName}</div>
          </div>

          <div className="field-label">Roman numeral</div>
          <div className="chip-row" role="group" aria-label="Roman numeral">
            {NUMERALS.map((num) => {
              const isSelected = selectedNumeral === num;
              const isCorrect = phase === 'graded' && num === chord.numeral;
              const isWrong = phase === 'graded' && isSelected && !isCorrect;
              let cls = 'note-btn chip-btn numeral-btn';
              if (isSelected) cls += ' selected';
              if (isCorrect) cls += ' correct';
              if (isWrong) cls += ' wrong';
              return (
                <button
                  key={num}
                  type="button"
                  className={cls}
                  aria-pressed={isSelected}
                  disabled={phase === 'graded'}
                  onClick={() => setSelectedNumeral(isSelected ? null : num)}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </>
      )}

      {phase === 'guessing' ? (
        <button
          type="button"
          className="primary-btn"
          onClick={submit}
          disabled={!ready}
        >
          Submit
        </button>
      ) : (
        <button type="button" className="primary-btn" onClick={next}>
          Next
        </button>
      )}

      {phase === 'graded' && (
        <div
          className={correct ? 'result success' : 'result failure'}
          role="status"
        >
          {correct ? <>✓ Correct — {reveal}.</> : <>✗ Not quite — {reveal}.</>}
        </div>
      )}
    </section>
  );
}
