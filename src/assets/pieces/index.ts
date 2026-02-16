import type { Color, PieceKind } from '../../chess/types';

import starlingWhite from './starling-white.svg';
import starlingBlack from './starling-black.svg';
import crowWhite from './crow-white.svg';
import crowBlack from './crow-black.svg';
import bluebirdWhite from './bluebird-white.svg';
import bluebirdBlack from './bluebird-black.svg';
import owlWhite from './owl-white.svg';
import owlBlack from './owl-black.svg';
import heronWhite from './heron-white.svg';
import heronBlack from './heron-black.svg';
import kingfisherWhite from './kingfisher-white.svg';
import kingfisherBlack from './kingfisher-black.svg';

const pieceImages: Record<Color, Record<PieceKind, string>> = {
  white: {
    pawn: starlingWhite,
    rook: crowWhite,
    knight: bluebirdWhite,
    bishop: owlWhite,
    queen: heronWhite,
    king: kingfisherWhite,
  },
  black: {
    pawn: starlingBlack,
    rook: crowBlack,
    knight: bluebirdBlack,
    bishop: owlBlack,
    queen: heronBlack,
    king: kingfisherBlack,
  },
};

export function getPieceImage(color: Color, kind: PieceKind): string {
  return pieceImages[color][kind];
}
