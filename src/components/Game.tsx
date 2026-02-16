import { useState, useCallback } from 'react';
import type { GameState, Position, Move, PieceKind } from '../chess';
import { createInitialGameState, getPieceAt, getLegalMoves, applyMove } from '../chess';
import Board from './Board';
import GameInfo from './GameInfo';
import PromotionModal from './PromotionModal';
import './Game.css';

export default function Game() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Position; to: Position } | null>(null);

  const isGameOver = gameState.status === 'checkmate' || gameState.status === 'stalemate';

  const lastMove = gameState.moveHistory.length > 0
    ? gameState.moveHistory[gameState.moveHistory.length - 1]
    : null;

  const handleSquareClick = useCallback((pos: Position) => {
    if (isGameOver || pendingPromotion) return;

    // If a square is already selected, try to move there
    if (selectedSquare) {
      const matchingMoves = legalMoves.filter(
        m => m.to.row === pos.row && m.to.col === pos.col
      );

      if (matchingMoves.length > 0) {
        // Check if this is a promotion move
        if (matchingMoves.some(m => m.promotion)) {
          setPendingPromotion({ from: selectedSquare, to: pos });
          return;
        }

        // Execute the move
        setGameState(prev => applyMove(prev, matchingMoves[0]));
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
    }

    // Select a piece
    const piece = getPieceAt(gameState.board, pos);
    if (piece && piece.color === gameState.turn) {
      const moves = getLegalMoves(gameState, pos);
      setSelectedSquare(pos);
      setLegalMoves(moves);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }, [gameState, selectedSquare, legalMoves, isGameOver, pendingPromotion]);

  const handlePromotion = useCallback((kind: PieceKind) => {
    if (!pendingPromotion) return;

    const move: Move = {
      from: pendingPromotion.from,
      to: pendingPromotion.to,
      promotion: kind,
    };

    setGameState(prev => applyMove(prev, move));
    setPendingPromotion(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  }, [pendingPromotion]);

  const handleNewGame = useCallback(() => {
    setGameState(createInitialGameState());
    setSelectedSquare(null);
    setLegalMoves([]);
    setPendingPromotion(null);
  }, []);

  return (
    <div className="game">
      <div className="game__board-area">
        <Board
          board={gameState.board}
          selectedSquare={selectedSquare}
          legalMoves={legalMoves}
          lastMove={lastMove}
          onSquareClick={handleSquareClick}
        />
      </div>
      <div className="game__info-area">
        <GameInfo state={gameState} onNewGame={handleNewGame} />
      </div>
      {pendingPromotion && (
        <PromotionModal color={gameState.turn} onSelect={handlePromotion} />
      )}
    </div>
  );
}
