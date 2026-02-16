export type Color = 'white' | 'black';

export type PieceKind = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';

export interface Piece {
  color: Color;
  kind: PieceKind;
}

export interface Position {
  row: number; // 0 = rank 8 (top), 7 = rank 1 (bottom)
  col: number; // 0 = a-file (left), 7 = h-file (right)
}

export type Board = (Piece | null)[][];

export interface Move {
  from: Position;
  to: Position;
  promotion?: PieceKind;
  isCastling?: boolean;
  isEnPassant?: boolean;
}

export interface CastlingRights {
  whiteKingSide: boolean;
  whiteQueenSide: boolean;
  blackKingSide: boolean;
  blackQueenSide: boolean;
}

export type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate';

export interface GameState {
  board: Board;
  turn: Color;
  castlingRights: CastlingRights;
  enPassantTarget: Position | null;
  capturedPieces: { white: Piece[]; black: Piece[] };
  status: GameStatus;
  winner: Color | null;
  moveHistory: Move[];
}
