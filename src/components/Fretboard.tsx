import { FRET_COUNT, STRINGS } from '../music';

export interface FretboardMarker {
  stringIndex: number; // index into STRINGS (0 = low E)
  fret: number; // 0 = open string
}

interface FretboardProps {
  marker?: FretboardMarker;
}

// SVG layout constants
const NUT_X = 44;
const FRET_SPACING = 62;
const STRING_SPACING = 26;
const TOP = 24;
const BOTTOM = TOP + STRING_SPACING * (STRINGS.length - 1);
const WIDTH = NUT_X + FRET_SPACING * FRET_COUNT + 16;
const HEIGHT = BOTTOM + 40;

const INLAY_FRETS = [3, 5, 7, 9];

/** Center x of a fret slot (where a finger would go); fret 0 sits left of the nut. */
function fretX(fret: number): number {
  if (fret === 0) return NUT_X - 16;
  return NUT_X + FRET_SPACING * (fret - 0.5);
}

/** y of a string. STRINGS is low→high, but low E renders at the bottom. */
function stringY(stringIndex: number): number {
  return TOP + STRING_SPACING * (STRINGS.length - 1 - stringIndex);
}

export default function Fretboard({ marker }: FretboardProps) {
  return (
    <div className="fretboard-scroll">
      <svg
        className="fretboard"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={WIDTH}
        height={HEIGHT}
        role="img"
        aria-label="Guitar fretboard"
      >
        {/* Board background */}
        <rect
          x={NUT_X}
          y={TOP - 10}
          width={FRET_SPACING * FRET_COUNT}
          height={BOTTOM - TOP + 20}
          rx={4}
          className="fb-wood"
        />

        {/* Nut */}
        <rect x={NUT_X - 5} y={TOP - 10} width={5} height={BOTTOM - TOP + 20} className="fb-nut" />

        {/* Frets */}
        {Array.from({ length: FRET_COUNT }, (_, i) => i + 1).map((f) => (
          <line
            key={f}
            x1={NUT_X + FRET_SPACING * f}
            y1={TOP - 10}
            x2={NUT_X + FRET_SPACING * f}
            y2={BOTTOM + 10}
            className="fb-fret"
          />
        ))}

        {/* Inlays */}
        {INLAY_FRETS.map((f) => (
          <circle
            key={f}
            cx={NUT_X + FRET_SPACING * (f - 0.5)}
            cy={(TOP + BOTTOM) / 2}
            r={5}
            className="fb-inlay"
          />
        ))}
        {/* Double inlay at 12 */}
        <circle
          cx={NUT_X + FRET_SPACING * 11.5}
          cy={(TOP + BOTTOM) / 2 - STRING_SPACING}
          r={5}
          className="fb-inlay"
        />
        <circle
          cx={NUT_X + FRET_SPACING * 11.5}
          cy={(TOP + BOTTOM) / 2 + STRING_SPACING}
          r={5}
          className="fb-inlay"
        />

        {/* Strings */}
        {STRINGS.map((_s, i) => (
          <line
            key={i}
            x1={NUT_X - 5}
            y1={stringY(i)}
            x2={NUT_X + FRET_SPACING * FRET_COUNT}
            y2={stringY(i)}
            className="fb-string"
            // thicker lines for lower strings
            strokeWidth={2.4 - i * 0.3}
          />
        ))}

        {/* Open-string labels */}
        {STRINGS.map((s, i) => (
          <text key={i} x={14} y={stringY(i) + 4} className="fb-label">
            {s.label}
          </text>
        ))}

        {/* Fret numbers */}
        {Array.from({ length: FRET_COUNT }, (_, i) => i + 1).map((f) => (
          <text
            key={f}
            x={NUT_X + FRET_SPACING * (f - 0.5)}
            y={BOTTOM + 30}
            className="fb-fretnum"
          >
            {f}
          </text>
        ))}

        {/* Marker */}
        {marker && (
          <g>
            <circle
              cx={fretX(marker.fret)}
              cy={stringY(marker.stringIndex)}
              r={11}
              className="fb-marker"
            />
            <circle
              cx={fretX(marker.fret)}
              cy={stringY(marker.stringIndex)}
              r={11}
              className="fb-marker-ring"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
