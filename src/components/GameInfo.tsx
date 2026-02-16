import type { GameState, Piece, PieceKind } from '../chess';
import { BIRD_NAMES } from '../chess';
import { getPieceImage } from '../assets/pieces';
import './GameInfo.css';

interface GameInfoProps {
  state: GameState;
  onNewGame: () => void;
}

const PIECE_ORDER: PieceKind[] = ['queen', 'rook', 'bishop', 'knight', 'pawn'];

function CapturedList({ pieces, label }: { pieces: Piece[]; label: string }) {
  if (pieces.length === 0) return null;

  const sorted = [...pieces].sort(
    (a, b) => PIECE_ORDER.indexOf(a.kind) - PIECE_ORDER.indexOf(b.kind)
  );

  return (
    <div className="game-info__captured-group">
      <span className="game-info__captured-label">{label}</span>
      <div className="game-info__captured-pieces">
        {sorted.map((p, i) => (
          <img
            key={i}
            className="game-info__captured-img"
            src={getPieceImage(p.color, p.kind)}
            alt={BIRD_NAMES[p.kind]}
            title={BIRD_NAMES[p.kind]}
          />
        ))}
      </div>
    </div>
  );
}

export default function GameInfo({ state, onNewGame }: GameInfoProps) {
  let statusText: string;
  if (state.status === 'checkmate') {
    statusText = `Checkmate! ${state.winner === 'white' ? 'White' : 'Black'} wins!`;
  } else if (state.status === 'stalemate') {
    statusText = 'Stalemate — Draw!';
  } else if (state.status === 'check') {
    statusText = `${state.turn === 'white' ? 'White' : 'Black'} is in check!`;
  } else {
    statusText = `${state.turn === 'white' ? 'White' : 'Black'}'s turn`;
  }

  const isGameOver = state.status === 'checkmate' || state.status === 'stalemate';

  return (
    <div className="game-info">
      <div className={`game-info__status ${isGameOver ? 'game-info__status--gameover' : ''}`}>
        {statusText}
      </div>

      <div className={`game-info__turn-indicator game-info__turn-indicator--${state.turn}`}>
        <span className="game-info__turn-dot" />
        <span>{state.turn === 'white' ? 'White' : 'Black'} to move</span>
      </div>

      <div className="game-info__captured">
        <CapturedList pieces={state.capturedPieces.black} label="Captured by White:" />
        <CapturedList pieces={state.capturedPieces.white} label="Captured by Black:" />
      </div>

      <button className="game-info__new-game" onClick={onNewGame}>
        New Game
      </button>

      <div className="game-info__legend">
        <h3 className="game-info__legend-title">Bird Guide</h3>
        {PIECE_ORDER.map(kind => (
          <div key={kind} className="game-info__legend-row">
            <img
              className="game-info__legend-img"
              src={getPieceImage('white', kind)}
              alt={BIRD_NAMES[kind]}
            />
            <span className="game-info__legend-name">{BIRD_NAMES[kind]}</span>
          </div>
        ))}
        <div className="game-info__legend-row">
          <img
            className="game-info__legend-img"
            src={getPieceImage('white', 'king')}
            alt={BIRD_NAMES.king}
          />
          <span className="game-info__legend-name">{BIRD_NAMES.king}</span>
        </div>
      </div>
    </div>
  );
}
