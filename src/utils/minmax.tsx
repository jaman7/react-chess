import { ColorsPieces } from 'store/store.constance';
import { IPieces, TypeColor } from 'store/Store.model';
import { evaluateBoard } from './evaluateValues';
import { getPassant, ifCanMove, posibilityMoves, setMove } from './movs';

const { WHITE, BLACK } = ColorsPieces;

const transpositionTable = new Map<string, number>();

const hashBoard = (board: IPieces[]): string => {
  return board.map(piece => piece?.index ?? '0').join(',');
};

export const miniMax = (
  depth: number,
  isBotTurn: boolean,
  alpha: number,
  beta: number,
  board: IPieces[],
  possibleStartPositions: number[],
  possibleEndPositions: number[],
  passantPos: number,
  botColor: TypeColor
): number => {
  const boardHash = hashBoard(board);
  const cachedValue = transpositionTable.get(boardHash);
  if (cachedValue !== undefined) return cachedValue;
  if (depth === 0) return evaluateBoard(board, botColor);
  const currentPlayerColor = isBotTurn ? botColor : botColor === BLACK ? WHITE : BLACK;
  let bestValue = isBotTurn ? -Infinity : Infinity;
  let moves = posibilityMoves(currentPlayerColor, board, possibleStartPositions, possibleEndPositions);

  for (const move of moves) {
    const { start, end } = move;
    if (ifCanMove(start, end, board, passantPos)) {
      const newBoard = setMove([...board], start, end);
      const newPassantPos = getPassant(botColor, newBoard, start, end);
      const value = miniMax(
        depth - 1,
        !isBotTurn,
        alpha,
        beta,
        newBoard,
        possibleStartPositions,
        possibleEndPositions,
        newPassantPos,
        botColor
      );

      if (isBotTurn) {
        bestValue = Math.max(bestValue, value);
        alpha = Math.max(alpha, bestValue);
        if (alpha >= beta) break;
      } else {
        bestValue = Math.min(bestValue, value);
        beta = Math.min(beta, bestValue);
        if (beta <= alpha) break;
      }
    }
  }
  transpositionTable.set(boardHash, bestValue);
  return bestValue;
};
