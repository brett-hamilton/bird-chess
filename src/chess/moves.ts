import { cloneBoard, findKing, getAllPiecesOfColor, getPieceAt, isInBounds, setPieceAt } from './board';
import type { Board, CastlingRights, Color, GameState, Move, Position } from './types';

function opponent(color: Color): Color {
  return color === 'white' ? 'black' : 'white';
}

function addIfValid(moves: Move[], board: Board, from: Position, to: Position, color: Color): boolean {
  if (!isInBounds(to)) return false;
  const target = getPieceAt(board, to);
  if (target && target.color === color) return false; // blocked by own piece
  moves.push({ from, to });
  return !target; // return true if square was empty (can continue sliding)
}

function generateSlidingMoves(board: Board, from: Position, color: Color, directions: [number, number][]): Move[] {
  const moves: Move[] = [];
  for (const [dr, dc] of directions) {
    let row = from.row + dr;
    let col = from.col + dc;
    while (isInBounds({ row, col })) {
      const to = { row, col };
      const canContinue = addIfValid(moves, board, from, to, color);
      if (!canContinue) break;
      row += dr;
      col += dc;
    }
  }
  return moves;
}

function generatePawnMoves(board: Board, from: Position, color: Color, enPassantTarget: Position | null): Move[] {
  const moves: Move[] = [];
  const dir = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;
  const promoRow = color === 'white' ? 0 : 7;

  // Single push
  const oneStep = { row: from.row + dir, col: from.col };
  if (isInBounds(oneStep) && !getPieceAt(board, oneStep)) {
    if (oneStep.row === promoRow) {
      for (const kind of ['queen', 'rook', 'bishop', 'knight'] as const) {
        moves.push({ from, to: oneStep, promotion: kind });
      }
    } else {
      moves.push({ from, to: oneStep });
    }

    // Double push from start
    if (from.row === startRow) {
      const twoStep = { row: from.row + 2 * dir, col: from.col };
      if (!getPieceAt(board, twoStep)) {
        moves.push({ from, to: twoStep });
      }
    }
  }

  // Captures
  for (const dc of [-1, 1]) {
    const capPos = { row: from.row + dir, col: from.col + dc };
    if (!isInBounds(capPos)) continue;

    const target = getPieceAt(board, capPos);
    if (target && target.color !== color) {
      if (capPos.row === promoRow) {
        for (const kind of ['queen', 'rook', 'bishop', 'knight'] as const) {
          moves.push({ from, to: capPos, promotion: kind });
        }
      } else {
        moves.push({ from, to: capPos });
      }
    }

    // En passant
    if (enPassantTarget && capPos.row === enPassantTarget.row && capPos.col === enPassantTarget.col) {
      moves.push({ from, to: capPos, isEnPassant: true });
    }
  }

  return moves;
}

function generateKnightMoves(board: Board, from: Position, color: Color): Move[] {
  const moves: Move[] = [];
  const offsets: [number, number][] = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
  for (const [dr, dc] of offsets) {
    addIfValid(moves, board, from, { row: from.row + dr, col: from.col + dc }, color);
  }
  return moves;
}

function generateKingMoves(board: Board, from: Position, color: Color, castlingRights: CastlingRights): Move[] {
  const moves: Move[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      addIfValid(moves, board, from, { row: from.row + dr, col: from.col + dc }, color);
    }
  }

  // Castling
  const row = color === 'white' ? 7 : 0;
  if (from.row === row && from.col === 4) {
    // King side
    const canKingSide = color === 'white' ? castlingRights.whiteKingSide : castlingRights.blackKingSide;
    if (canKingSide
      && !getPieceAt(board, { row, col: 5 })
      && !getPieceAt(board, { row, col: 6 })
      && !isSquareAttackedBy(board, { row, col: 4 }, opponent(color))
      && !isSquareAttackedBy(board, { row, col: 5 }, opponent(color))
      && !isSquareAttackedBy(board, { row, col: 6 }, opponent(color))
    ) {
      moves.push({ from, to: { row, col: 6 }, isCastling: true });
    }

    // Queen side
    const canQueenSide = color === 'white' ? castlingRights.whiteQueenSide : castlingRights.blackQueenSide;
    if (canQueenSide
      && !getPieceAt(board, { row, col: 3 })
      && !getPieceAt(board, { row, col: 2 })
      && !getPieceAt(board, { row, col: 1 })
      && !isSquareAttackedBy(board, { row, col: 4 }, opponent(color))
      && !isSquareAttackedBy(board, { row, col: 3 }, opponent(color))
      && !isSquareAttackedBy(board, { row, col: 2 }, opponent(color))
    ) {
      moves.push({ from, to: { row, col: 2 }, isCastling: true });
    }
  }

  return moves;
}

const ROOK_DIRS: [number, number][] = [[-1,0],[1,0],[0,-1],[0,1]];
const BISHOP_DIRS: [number, number][] = [[-1,-1],[-1,1],[1,-1],[1,1]];
const QUEEN_DIRS: [number, number][] = [...ROOK_DIRS, ...BISHOP_DIRS];

function generatePseudoLegalMoves(state: GameState, from: Position): Move[] {
  const piece = getPieceAt(state.board, from);
  if (!piece || piece.color !== state.turn) return [];

  switch (piece.kind) {
    case 'pawn':
      return generatePawnMoves(state.board, from, piece.color, state.enPassantTarget);
    case 'rook':
      return generateSlidingMoves(state.board, from, piece.color, ROOK_DIRS);
    case 'knight':
      return generateKnightMoves(state.board, from, piece.color);
    case 'bishop':
      return generateSlidingMoves(state.board, from, piece.color, BISHOP_DIRS);
    case 'queen':
      return generateSlidingMoves(state.board, from, piece.color, QUEEN_DIRS);
    case 'king':
      return generateKingMoves(state.board, from, piece.color, state.castlingRights);
  }
}

export function isSquareAttackedBy(board: Board, pos: Position, byColor: Color): boolean {
  // Check pawn attacks
  const pawnDir = byColor === 'white' ? 1 : -1; // direction pawns attack FROM
  for (const dc of [-1, 1]) {
    const pawnPos = { row: pos.row + pawnDir, col: pos.col + dc };
    if (isInBounds(pawnPos)) {
      const p = getPieceAt(board, pawnPos);
      if (p && p.color === byColor && p.kind === 'pawn') return true;
    }
  }

  // Check knight attacks
  const knightOffsets: [number, number][] = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
  for (const [dr, dc] of knightOffsets) {
    const kp = { row: pos.row + dr, col: pos.col + dc };
    if (isInBounds(kp)) {
      const p = getPieceAt(board, kp);
      if (p && p.color === byColor && p.kind === 'knight') return true;
    }
  }

  // Check king attacks (for adjacent squares)
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const kp = { row: pos.row + dr, col: pos.col + dc };
      if (isInBounds(kp)) {
        const p = getPieceAt(board, kp);
        if (p && p.color === byColor && p.kind === 'king') return true;
      }
    }
  }

  // Check sliding attacks (rook/queen on straights, bishop/queen on diagonals)
  for (const [dr, dc] of ROOK_DIRS) {
    let r = pos.row + dr, c = pos.col + dc;
    while (isInBounds({ row: r, col: c })) {
      const p = getPieceAt(board, { row: r, col: c });
      if (p) {
        if (p.color === byColor && (p.kind === 'rook' || p.kind === 'queen')) return true;
        break;
      }
      r += dr;
      c += dc;
    }
  }

  for (const [dr, dc] of BISHOP_DIRS) {
    let r = pos.row + dr, c = pos.col + dc;
    while (isInBounds({ row: r, col: c })) {
      const p = getPieceAt(board, { row: r, col: c });
      if (p) {
        if (p.color === byColor && (p.kind === 'bishop' || p.kind === 'queen')) return true;
        break;
      }
      r += dr;
      c += dc;
    }
  }

  return false;
}

export function isInCheck(board: Board, color: Color): boolean {
  const kingPos = findKing(board, color);
  return isSquareAttackedBy(board, kingPos, opponent(color));
}

function simulateMove(board: Board, move: Move): Board {
  const newBoard = cloneBoard(board);
  const piece = getPieceAt(newBoard, move.from)!;

  // En passant capture
  if (move.isEnPassant) {
    const capturedRow = move.from.row;
    setPieceAt(newBoard, { row: capturedRow, col: move.to.col }, null);
  }

  // Castling - move rook
  if (move.isCastling) {
    const row = move.from.row;
    if (move.to.col === 6) { // king side
      setPieceAt(newBoard, { row, col: 7 }, null);
      setPieceAt(newBoard, { row, col: 5 }, { color: piece.color, kind: 'rook' });
    } else { // queen side
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

  return newBoard;
}

export function getLegalMoves(state: GameState, from: Position): Move[] {
  const pseudoLegal = generatePseudoLegalMoves(state, from);
  return pseudoLegal.filter(move => {
    const newBoard = simulateMove(state.board, move);
    return !isInCheck(newBoard, state.turn);
  });
}

export function hasAnyLegalMove(state: GameState): boolean {
  const pieces = getAllPiecesOfColor(state.board, state.turn);
  for (const { pos } of pieces) {
    if (getLegalMoves(state, pos).length > 0) return true;
  }
  return false;
}
