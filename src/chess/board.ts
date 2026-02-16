import { BOARD_SIZE } from './constants';
import type { Board, Color, Piece, Position } from './types';

export function cloneBoard(board: Board): Board {
  return board.map(row => row.map(cell => (cell ? { ...cell } : null)));
}

export function isInBounds(pos: Position): boolean {
  return pos.row >= 0 && pos.row < BOARD_SIZE && pos.col >= 0 && pos.col < BOARD_SIZE;
}

export function getPieceAt(board: Board, pos: Position): Piece | null {
  return board[pos.row][pos.col];
}

export function setPieceAt(board: Board, pos: Position, piece: Piece | null): void {
  board[pos.row][pos.col] = piece;
}

export function findKing(board: Board, color: Color): Position {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color && piece.kind === 'king') {
        return { row, col };
      }
    }
  }
  throw new Error(`King not found for ${color}`);
}

export function getAllPiecesOfColor(board: Board, color: Color): { piece: Piece; pos: Position }[] {
  const pieces: { piece: Piece; pos: Position }[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        pieces.push({ piece, pos: { row, col } });
      }
    }
  }
  return pieces;
}
