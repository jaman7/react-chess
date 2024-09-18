import { ColorsPieces, PiecesNames, ROW_SIZE } from 'store/store.constance';
import { IPieces, TypeColor } from 'store/Store.model';
import { evaluateBlack } from './evaluateValues';
import { ifCanMove, setMove } from './movs';
import { isBlack } from './utils';

const { PAWN_WHITE, PAWN_BLACK } = PiecesNames;
const { WHITE, BLACK } = ColorsPieces;

export const getPassantPositionMinMax = (isBlackPlayer: boolean, start: number, end: number, piece: IPieces): number => {
  if (piece.name === (isBlackPlayer ? PAWN_BLACK : PAWN_WHITE) && Math.abs(end - start) === 16) {
    if ((isBlackPlayer && start >= ROW_SIZE && start <= 15) || (!isBlackPlayer && start >= 48 && start <= 55)) {
      return end;
    }
  }
  return 65;
};

export const miniMax = (
  depth: number,
  isBotTurn: boolean,
  alpha: number,
  beta: number,
  pieces: IPieces[],
  possibleStartPositions: number[],
  possibleEndPositions: number[],
  passantPos: number,
  botColor: TypeColor
): number => {
  const copyBoard = [...pieces];
  if (depth === 0) {
    return evaluateBlack(copyBoard);
  }

  let bestValue = isBotTurn ? -Infinity : Infinity;

  const currentPlayerColor = isBotTurn ? botColor : botColor === BLACK ? WHITE : BLACK;

  for (let i = 0; i < 64; i++) {
    const start = possibleStartPositions[i];
    const isPlayerPiece = copyBoard[start].name !== null && copyBoard[start].player === currentPlayerColor;

    if (isPlayerPiece) {
      for (let j = 0; j < 64; j++) {
        let end = possibleEndPositions[j];
        if (ifCanMove(start, end, copyBoard, passantPos)) {
          const testBoard = [...pieces];
          const testBoard2 = setMove(testBoard, start, end, passantPos);

          let passant = 65;
          if (
            testBoard[end].name === (isBlack(currentPlayerColor) ? PAWN_BLACK : PAWN_WHITE) &&
            start >= (isBlack(currentPlayerColor) ? 8 : 48) &&
            start <= (isBlack(currentPlayerColor) ? 15 : 55) &&
            Math.abs(end - start) === (isBlack(currentPlayerColor) ? 16 : -16)
          ) {
            passant = end;
          }

          let value = miniMax(
            depth - 1,
            !isBotTurn,
            alpha,
            beta,
            testBoard2,
            possibleStartPositions,
            possibleEndPositions,
            passant,
            botColor
          );

          if (isBotTurn) {
            if (value > bestValue) bestValue = value;
            alpha = Math.max(alpha, bestValue);
            if (bestValue >= beta) return bestValue;
          } else {
            if (value < bestValue) bestValue = value;
            beta = Math.min(beta, bestValue);
            if (bestValue <= alpha) return bestValue;
          }
        }
      }
    }
  }

  return bestValue;
};
