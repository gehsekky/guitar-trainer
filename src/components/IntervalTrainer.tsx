import { useEffect, useRef, useState } from 'react';
import { midiOf, playMidiSequence } from '../audio';
import {
  INTERVALS,
  displayNote,
  pick,
  randomNote,
  transpose,
  type Interval,
  type Note,
} from '../music';

interface Round {
  tonic: Note;
  octave: number;
  interval: Interval;
}

function newRound(): Round {
  return {
    tonic: randomNote(),
    octave: pick([3, 4]),
    interval: pick(INTERVALS),
  };
}

type Phase = 'guessing' | 'graded';

export default function IntervalTrainer() {
  const [round, setRound] = useState<Round>(() => newRound());
  const [selected, setSelected] = useState<Interval | null>(null);
  const [phase, setPhase] = useState<Phase>('guessing');
  const [correct, setCorrect] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(playTimer.current), []);

  function play(r: Round = round) {
    const root = midiOf(r.tonic, r.octave);
    const seconds = playMidiSequence([root, root + r.interval.semitones]);
    setHasPlayed(true);
    setIsPlaying(true);
    window.clearTimeout(playTimer.current);
    playTimer.current = window.setTimeout(
      () => setIsPlaying(false),
      seconds * 1000,
    );
  }

  function submit() {
    if (!selected) return;
    setCorrect(selected.semitones === round.interval.semitones);
    setPhase('graded');
  }

  function next() {
    const r = newRound();
    setRound(r);
    setSelected(null);
    setPhase('guessing');
    // The Next click is a user gesture, so we can start audio right away.
    play(r);
  }

  const upperNote = transpose(round.tonic, round.interval.semitones);

  return (
    <div className="ear-game">
      <p className="instructions">
        The tonic plays first, then a second note. Which interval do you hear?
      </p>

      <div className="key-label">Key: {displayNote(round.tonic)}</div>

      <button
        type="button"
        className="secondary-btn"
        onClick={() => play()}
        disabled={isPlaying}
      >
        {isPlaying ? '♪ Playing…' : hasPlayed ? '▶ Play Again' : '▶ Play'}
      </button>

      <div className="interval-picker" role="group" aria-label="Interval choices">
        {INTERVALS.map((iv) => {
          const isSelected = selected?.semitones === iv.semitones;
          const isCorrect =
            phase === 'graded' && iv.semitones === round.interval.semitones;
          const isWrongPick = phase === 'graded' && isSelected && !isCorrect;
          let cls = 'note-btn interval-btn';
          if (isSelected) cls += ' selected';
          if (isCorrect) cls += ' correct';
          if (isWrongPick) cls += ' wrong';
          return (
            <button
              key={iv.semitones}
              type="button"
              className={cls}
              aria-pressed={isSelected}
              disabled={phase === 'graded'}
              onClick={() => setSelected(isSelected ? null : iv)}
            >
              <span className="interval-name">{iv.name}</span>
              <span className="interval-short">{iv.short}</span>
            </button>
          );
        })}
      </div>

      {phase === 'guessing' ? (
        <button
          type="button"
          className="primary-btn"
          onClick={submit}
          disabled={!selected || !hasPlayed}
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
            <>
              ✓ Correct! That was a{' '}
              <strong>{round.interval.name}</strong> (
              {displayNote(round.tonic)} → {displayNote(upperNote)}).
            </>
          ) : (
            <>
              ✗ Not quite. That was a{' '}
              <strong>{round.interval.name}</strong> (
              {displayNote(round.tonic)} → {displayNote(upperNote)}).
            </>
          )}
        </div>
      )}
    </div>
  );
}
