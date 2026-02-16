import type { Board as BoardType, Position, Move } from '../chess';
import { getPieceAt } from '../chess';
import Square from './Square';
import './Board.css';

interface BoardProps {
  board: BoardType;
  selectedSquare: Position | null;
  legalMoves: Move[];
  lastMove: Move | null;
  onSquareClick: (pos: Position) => void;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export default function Board({ board, selectedSquare, legalMoves, lastMove, onSquareClick }: BoardProps) {
  const legalTargets = new Set(legalMoves.map(m => `${m.to.row},${m.to.col}`));

  return (
    <div className="board">
      <div className="board__grid">
        {Array.from({ length: 64 }, (_, i) => {
          const row = Math.floor(i / 8);
          const col = i % 8;
          const pos: Position = { row, col };
          const piece = getPieceAt(board, pos);
          const isLight = (row + col) % 2 === 0;
          const isSelected = selectedSquare?.row === row && selectedSquare?.col === col;
          const isLegalTarget = legalTargets.has(`${row},${col}`);
          const isLastMoveFrom = lastMove?.from.row === row && lastMove?.from.col === col;
          const isLastMoveTo = lastMove?.to.row === row && lastMove?.to.col === col;

          return (
            <Square
              key={`${row}-${col}`}
              piece={piece}
              isLight={isLight}
              isSelected={isSelected}
              isLegalTarget={isLegalTarget}
              isLastMoveFrom={isLastMoveFrom}
              isLastMoveTo={isLastMoveTo}
              onClick={() => onSquareClick(pos)}
            />
          );
        })}
      </div>
      <div className="board__ranks">
        {RANKS.map(r => (
          <span key={r} className="board__label">{r}</span>
        ))}
      </div>
      <div className="board__files">
        {FILES.map(f => (
          <span key={f} className="board__label">{f}</span>
        ))}
      </div>
    </div>
  );
}
