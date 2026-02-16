import { cloneBoard, getPieceAt, setPieceAt } from './board';
import type { CastlingRights, GameState, Move } from './types';
import { hasAnyLegalMove, isInCheck } from './moves';

function opponent(color: 'white' | 'black'): 'white' | 'black' {
  return color === 'white' ? 'black' : 'white';
}

export function applyMove(state: GameState, move: Move): GameState {
  const newBoard = cloneBoard(state.board);
  const piece = getPieceAt(newBoard, move.from)!;
  const captured = getPieceAt(newBoard, move.to);

  const newCaptured = {
    white: [...state.capturedPieces.white],
    black: [...state.capturedPieces.black],
  };

  // En passant capture
  if (move.isEnPassant) {
    const capturedRow = move.from.row;
    const epPiece = getPieceAt(newBoard, { row: capturedRow, col: move.to.col });
    if (epPiece) {
      newCaptured[epPiece.color].push(epPiece);
    }
    setPieceAt(newBoard, { row: capturedRow, col: move.to.col }, null);
  } else if (captured) {
    newCaptured[captured.color].push(captured);
  }

  // Castling - move rook
  if (move.isCastling) {
    const row = move.from.row;
    if (move.to.col === 6) {
      setPieceAt(newBoard, { row, col: 7 }, null);
      setPieceAt(newBoard, { row, col: 5 }, { color: piece.color, kind: 'rook' });
    } else {
      setPieceAt(newBoard, { row, col: 0 }, null);
      setPieceAt(newBoard, { row, col: 3 }, { color: piece.color, kind: 'rook' });
    }
  }

  // Move piece
  setPieceAt(newBoard, move.from, null);
  if (move.promotion) {
    setPieceAt(newBoard, move.to, { color: piece.color, kind: move.promotion });
  } else {
    setPieceAt(newBoard, move.to, piece);
  }

  // Update castling rights
  const newCastling: CastlingRights = { ...state.castlingRights };
  if (piece.kind === 'king') {
    if (piece.color === 'white') {
      newCastling.whiteKingSide = false;
      newCastling.whiteQueenSide = false;
    } else {
      newCastling.blackKingSide = false;
      newCastling.blackQueenSide = false;
    }
  }
  if (piece.kind === 'rook') {
    if (move.from.row === 7 && move.from.col === 7) newCastling.whiteKingSide = false;
    if (move.from.row === 7 && move.from.col === 0) newCastling.whiteQueenSide = false;
    if (move.from.row === 0 && move.from.col === 7) newCastling.blackKingSide = false;
    if (move.from.row === 0 && move.from.col === 0) newCastling.blackQueenSide = false;
  }
  // If a rook is captured
  if (move.to.row === 7 && move.to.col === 7) newCastling.whiteKingSide = false;
  if (move.to.row === 7 && move.to.col === 0) newCastling.whiteQueenSide = false;
  if (move.to.row === 0 && move.to.col === 7) newCastling.blackKingSide = false;
  if (move.to.row === 0 && move.to.col === 0) newCastling.blackQueenSide = false;

  // En passant target
  let enPassantTarget = null;
  if (piece.kind === 'pawn' && Math.abs(move.to.row - move.from.row) === 2) {
    enPassantTarget = {
      row: (move.from.row + move.to.row) / 2,
      col: move.from.col,
    };
  }

  const nextTurn = opponent(state.turn);

  const newState: GameState = {
    board: newBoard,
    turn: nextTurn,
    castlingRights: newCastling,
    enPassantTarget: enPassantTarget,
    capturedPieces: newCaptured,
    status: 'playing',
    winner: null,
    moveHistory: [...state.moveHistory, move],
  };

  // Detect check/checkmate/stalemate
  const inCheck = isInCheck(newBoard, nextTurn);
  const hasLegalMove = hasAnyLegalMove(newState);

  if (inCheck && !hasLegalMove) {
    newState.status = 'checkmate';
    newState.winner = state.turn;
  } else if (!inCheck && !hasLegalMove) {
    newState.status = 'stalemate';
  } else if (inCheck) {
    newState.status = 'check';
  }

  return newState;
}
