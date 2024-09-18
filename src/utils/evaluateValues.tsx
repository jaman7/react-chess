import {
  BishopEvalWhite,
  BOARD_SIZE,
  EvalQueen,
  KingEvalWhite,
  KnightEval,
  PawnEvalWhite,
  PiecesNames,
  RookEvalWhite,
  ROW_SIZE,
} from 'store/store.constance';
import { IPieces, TypeColor } from 'store/Store.model';
import { BishopEvalBlack, isBlack, KingEvalBlack, PawnEvalBlack, RookEvalBlack } from './utils';

const {
  PAWN_WHITE,
  PAWN_BLACK,
  ROOK_WHITE,
  ROOK_BLACK,
  KING_WHITE,
  KING_BLACK,
  BISHOP_WHITE,
  BISHOP_BLACK,
  KNIGHT_WHITE,
  KNIGHT_BLACK,
  QUEEN_WHITE,
  QUEEN_BLACK,
} = PiecesNames;

const pieceValueMap: Record<string, { baseValue: number; evalTable: number[][] }> = {
  [PAWN_WHITE]: { baseValue: 100, evalTable: PawnEvalWhite },
  [PAWN_BLACK]: { baseValue: 100, evalTable: PawnEvalBlack },
  [ROOK_WHITE]: { baseValue: 525, evalTable: RookEvalWhite },
  [ROOK_BLACK]: { baseValue: 525, evalTable: RookEvalBlack },
  [KNIGHT_WHITE]: { baseValue: 350, evalTable: KnightEval },
  [KNIGHT_BLACK]: { baseValue: 350, evalTable: KnightEval },
  [BISHOP_WHITE]: { baseValue: 350, evalTable: BishopEvalWhite },
  [BISHOP_BLACK]: { baseValue: 350, evalTable: BishopEvalBlack },
  [QUEEN_WHITE]: { baseValue: 1000, evalTable: EvalQueen },
  [QUEEN_BLACK]: { baseValue: 1000, evalTable: EvalQueen },
  [KING_WHITE]: { baseValue: 10000, evalTable: KingEvalWhite },
  [KING_BLACK]: { baseValue: 10000, evalTable: KingEvalBlack },
};

export const getPieceValue = (piece: IPieces, position: number): number => {
  if (!piece.name) return 0;
  const evalData = pieceValueMap[piece.name];
  if (!evalData) return 0;
  const { baseValue, evalTable } = evalData;
  const x = Math.floor(position / ROW_SIZE);
  const y = position % ROW_SIZE;
  const pieceValue = baseValue + 10 * evalTable[y][x];
  return isBlack(piece.player as TypeColor) ? pieceValue : -pieceValue;
};

export const evaluateBlack = (pieces: IPieces[]): number => {
  let totalEval = 0;
  for (let i = 0; i < BOARD_SIZE; i++) {
    totalEval += getPieceValue(pieces[i], i);
  }
  return totalEval;
};
