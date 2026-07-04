import { useState } from 'react';
import Fretboard, { type FretboardMarker } from './Fretboard';
import NotePicker from './NotePicker';
import {
  FRET_COUNT,
  STRINGS,
  displayNote,
  noteAt,
  randomInt,
  type Note,
} from '../music';

interface Round {
  marker: FretboardMarker;
  answer: Note;
}

function newRound(): Round {
  const stringIndex = randomInt(STRINGS.length);
  const fret = randomInt(FRET_COUNT + 1); // include open string
  return { marker: { stringIndex, fret }, answer: noteAt(stringIndex, fret) };
}

type Phase = 'guessing' | 'graded';

export default function NeckTrainer() {
  const [round, setRound] = useState<Round>(() => newRound());
  const [selected, setSelected] = useState<Note[]>([]);
  const [phase, setPhase] = useState<Phase>('guessing');
  const [correct, setCorrect] = useState(false);

  function submit() {
    if (selected.length !== 1) return;
    setCorrect(selected[0] === round.answer);
    setPhase('graded');
  }

  function next() {
    setRound(newRound());
    setSelected([]);
    setPhase('guessing');
  }

  return (
    <section className="trainer">
      <h2>Neck Note Trainer</h2>
      <p className="instructions">
        A note is marked on the fretboard. Which note is it?
      </p>

      <Fretboard marker={round.marker} />

      <NotePicker
        selected={selected}
        max={1}
        onChange={setSelected}
        disabled={phase === 'graded'}
        correctNotes={[round.answer]}
        graded={phase === 'graded'}
      />

      {phase === 'guessing' ? (
        <button
          type="button"
          className="primary-btn"
          onClick={submit}
          disabled={selected.length !== 1}
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
          {correct ? (
            <>✓ Correct! That note is <strong>{displayNote(round.answer)}</strong>.</>
          ) : (
            <>✗ Not quite. The correct answer is <strong>{displayNote(round.answer)}</strong>.</>
          )}
        </div>
      )}
    </section>
  );
}
