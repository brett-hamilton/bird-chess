import type { Piece as PieceType } from '../chess';
import Piece from './Piece';
import './Square.css';

interface SquareProps {
  piece: PieceType | null;
  isLight: boolean;
  isSelected: boolean;
  isLegalTarget: boolean;
  isLastMoveFrom: boolean;
  isLastMoveTo: boolean;
  onClick: () => void;
}

export default function Square({
  piece,
  isLight,
  isSelected,
  isLegalTarget,
  isLastMoveFrom,
  isLastMoveTo,
  onClick,
}: SquareProps) {
  const classes = [
    'square',
    isLight ? 'square--light' : 'square--dark',
    isSelected && 'square--selected',
    isLegalTarget && 'square--legal',
    isLastMoveFrom && 'square--last-from',
    isLastMoveTo && 'square--last-to',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {piece && <Piece piece={piece} />}
      {isLegalTarget && !piece && <span className="square__dot" />}
      {isLegalTarget && piece && <span className="square__ring" />}
    </div>
  );
}
