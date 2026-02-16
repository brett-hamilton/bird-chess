import { BIRD_NAMES } from '../chess';
import type { Piece as PieceType } from '../chess';
import { getPieceImage } from '../assets/pieces';
import './Piece.css';

interface PieceProps {
  piece: PieceType;
}

export default function Piece({ piece }: PieceProps) {
  const birdName = BIRD_NAMES[piece.kind];
  const image = getPieceImage(piece.color, piece.kind);

  return (
    <img
      className={`piece piece--${piece.color}`}
      src={image}
      alt={`${piece.color} ${birdName}`}
      title={`${birdName} (${piece.color})`}
      draggable={false}
    />
  );
}
