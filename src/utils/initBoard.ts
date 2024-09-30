import { BOARD_SIZE, ColorsPieces, PiecesNames, PiecesNameShort, ROW_SIZE, SQUARES } from 'store/store.constance';
import { IPieces, TypeColor, TypePieceNameShort } from 'store/Store.model';
import { getRowColFromIndex } from './utils';

const { WHITE, BLACK } = ColorsPieces;

const { ROOK, KNIGHT, BISHOP, QUEEN, KING, PAWN } = PiecesNameShort;

const initObj = {
  index: null,
  player: null,
  name: null,
  field: null,
  highlight: false,
  possible: false,
  possibleCapture: false,
  inCheck: false,
  checked: 0,
};

export const setPiece = (
  index: number,
  params: {
    player?: TypeColor | null;
    name?: TypePieceNameShort;
  } = {}
) => {
  const { player = null, name = null } = params || {};
  const { row, col } = getRowColFromIndex(index);
  const pieceKey = `${name}_${player}` as keyof typeof PiecesNames;
  const setName = PiecesNames[pieceKey] ?? null;
  return {
    ...initObj,
    index,
    field: SQUARES[row][col] ?? '',
    player,
    name: setName,
  };
};

export const initializeBoard = (): IPieces[] => {
  const piecesOrder = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];
  const pieces: IPieces[] = [];
  for (let i = 0; i < ROW_SIZE; i++) {
    pieces[i + ROW_SIZE] = setPiece(i + ROW_SIZE, { player: BLACK as TypeColor, name: PAWN });
    pieces[i + 6 * ROW_SIZE] = setPiece(i + 6 * ROW_SIZE, { player: WHITE, name: PAWN });
  }
  piecesOrder.forEach((name, i) => {
    pieces[i] = setPiece(i, { player: BLACK, name });
    pieces[BOARD_SIZE - ROW_SIZE + i] = setPiece(BOARD_SIZE - ROW_SIZE + i, { player: WHITE, name });
  });
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (!pieces[i]) {
      pieces[i] = setPiece(i);
    }
  }
  return pieces;
};
