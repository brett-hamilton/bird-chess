import type { Board, CastlingRights, GameState, Piece, PieceKind } from './types';

export const BOARD_SIZE = 8;

export const BIRD_NAMES: Record<PieceKind, string> = {
  pawn: 'Eastern Starling',
  rook: 'Crow',
  knight: 'Eastern Bluebird',
  bishop: 'Screech Owl',
  queen: 'Great Blue Heron',
  king: 'Kingfisher',
};

const W = 'white' as const;
const B = 'black' as const;

function p(color: typeof W | typeof B, kind: PieceKind): Piece {
  return { color, kind };
}

export function createInitialBoard(): Board {
  return [
    [p(B,'rook'), p(B,'knight'), p(B,'bishop'), p(B,'queen'), p(B,'king'), p(B,'bishop'), p(B,'knight'), p(B,'rook')],
    [p(B,'pawn'), p(B,'pawn'),   p(B,'pawn'),   p(B,'pawn'),  p(B,'pawn'), p(B,'pawn'),   p(B,'pawn'),   p(B,'pawn')],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [p(W,'pawn'), p(W,'pawn'),   p(W,'pawn'),   p(W,'pawn'),  p(W,'pawn'), p(W,'pawn'),   p(W,'pawn'),   p(W,'pawn')],
    [p(W,'rook'), p(W,'knight'), p(W,'bishop'), p(W,'queen'), p(W,'king'), p(W,'bishop'), p(W,'knight'), p(W,'rook')],
  ];
}

export function createInitialCastlingRights(): CastlingRights {
  return {
    whiteKingSide: true,
    whiteQueenSide: true,
    blackKingSide: true,
    blackQueenSide: true,
  };
}

export function createInitialGameState(): GameState {
  return {
    board: createInitialBoard(),
    turn: 'white',
    castlingRights: createInitialCastlingRights(),
    enPassantTarget: null,
    capturedPieces: { white: [], black: [] },
    status: 'playing',
    winner: null,
    moveHistory: [],
  };
}
