import { produce } from 'immer';
import { BOARD_SIZE, ColorsPieces, PiecesNames, PiecesNameShort } from 'store/store.constance';
import { IParamsCanMove, IPieces, TypeColor } from 'store/Store.model';
import { getRowCol, isBlack, isWhite, shuffle } from './utils';
import { isCanMove } from './rule';
import { setPiece } from './initBoard';

const { WHITE, BLACK } = ColorsPieces;
const { PAWN_WHITE, PAWN_BLACK, ROOK_WHITE, ROOK_BLACK, KING_WHITE, KING_BLACK, BISHOP_WHITE, BISHOP_BLACK, QUEEN_WHITE, QUEEN_BLACK } =
  PiecesNames;
const { QUEEN } = PiecesNameShort;

export const checkCastling = (start: number, end: number, pieces: IPieces[], params: IParamsCanMove): boolean => {
  const {
    whiteKingHasMoved,
    blackKingHasMoved,
    rightWhiteRookHasMoved,
    leftWhiteRookHasMoved,
    rightBlackRookHasMoved,
    leftBlackRookHasMoved,
  } = params || {};
  const copyPieces = [...pieces];
  const player = copyPieces[start].player as TypeColor;
  const deltaPos = end - start;
  const isWhitePlayer = isWhite(player);
  const isBlackPlayer = isBlack(player);
  if (start !== (isWhitePlayer ? 60 : 4)) return false;
  if ((deltaPos === 2 ? copyPieces[end + 1]?.name : copyPieces[end - 2]?.name) !== (isWhitePlayer ? ROOK_WHITE : ROOK_BLACK)) return false;
  if (isWhitePlayer ? whiteKingHasMoved : blackKingHasMoved) return false;
  if (isBlackPlayer) {
    if (deltaPos === 2 ? rightWhiteRookHasMoved : leftWhiteRookHasMoved) return false;
  } else if (isBlackPlayer) {
    if (deltaPos === 2 ? rightBlackRookHasMoved : leftBlackRookHasMoved) return false;
  }
  return true;
};

export const checkIsPawn = (start: number, end: number, pieces: IPieces[], params: IParamsCanMove): boolean => {
  const copyPieces = [...pieces];
  const { passantPos, passantPosStore } = params || {};
  const passant = passantPos ?? passantPosStore;
  const { row: startRow, col: startCol } = getRowCol(start);
  const { row: endRow, col: endCol } = getRowCol(end);
  const rowDiff = endRow - startRow;
  const colDiff = endCol - startCol;
  if (Math.abs(rowDiff) === 2) {
    if (isWhite(copyPieces[start].player as TypeColor) && (start < 48 || start > 55)) return false;
    if (isBlack(copyPieces[start].player as TypeColor) && (start < 8 || start > 15)) return false;
  }
  if (copyPieces[end].name !== null && colDiff === 0) return false;
  const isDiagonal = Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1;
  if (isDiagonal && copyPieces[end].name === null) {
    const diagonalCapture = (position: number, opponentPawn: string) => copyPieces[position].name === opponentPawn && passant === position;
    if ((rowDiff === 1 && diagonalCapture(start + 1, PAWN_BLACK)) || (rowDiff === -1 && diagonalCapture(start - 1, PAWN_WHITE)))
      return true;
    return false;
  }
  return true;
};

export const isBlockersExist = (start: number, end: number, pieces: IPieces[]): boolean => {
  const copyPieces = [...pieces];
  const { row: startRow, col: startCol } = getRowCol(start);
  const { row: endRow, col: endCol } = getRowCol(end);
  let rowCtr = 0;
  let colCtr = 0;
  while (colCtr !== endCol - startCol || rowCtr !== endRow - startRow) {
    const position = BOARD_SIZE - startRow * 8 - 8 * rowCtr + (startCol - 1 + colCtr);
    if (copyPieces[position].name !== null && copyPieces[position] !== copyPieces[start]) return true;
    colCtr += Math.sign(endCol - startCol);
    rowCtr += Math.sign(endRow - startRow);
  }
  return false;
};

export const isInvalidMove = (start: number, end: number, pieces: IPieces[], params: IParamsCanMove): boolean => {
  const copyPieces = [...pieces];
  const pieceName = copyPieces[start].name;
  const bqrpk = [
    ROOK_WHITE,
    ROOK_BLACK,
    QUEEN_WHITE,
    QUEEN_BLACK,
    BISHOP_WHITE,
    BISHOP_BLACK,
    PAWN_WHITE,
    PAWN_BLACK,
    KING_WHITE,
    KING_BLACK,
  ].includes(pieceName as PiecesNames);
  if (bqrpk && isBlockersExist(start, end, copyPieces)) return true;
  if (pieceName === PAWN_WHITE || pieceName === PAWN_BLACK) {
    if (!checkIsPawn(start, end, copyPieces, params)) return true;
  }
  if ([KING_WHITE, KING_BLACK].includes(pieceName as PiecesNames) && Math.abs(end - start) === 2) {
    return !checkCastling(start, end, copyPieces, params);
  }
  return false;
};

export const checkIsMovePiece = (player: TypeColor, pieces: IPieces[], params: IParamsCanMove): boolean => {
  const copyPieces = [...pieces];
  const king = isWhite(player) ? KING_WHITE : KING_BLACK;
  let positionOfKing = copyPieces.findIndex(p => p.name === king);
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (copyPieces[i].player !== player) {
      if (isCanMove(copyPieces[i].name as PiecesNames, i, positionOfKing) && !isInvalidMove(i, positionOfKing, copyPieces, params))
        return true;
    }
  }
  return false;
};

export const ifCanMove = (start: number, end: number, pieces: IPieces[], params: IParamsCanMove = {}): boolean => {
  if (start === end) return false;
  const copyPieces = [...pieces];
  const player = copyPieces[start].player as TypeColor;
  if (player === copyPieces[end].player || !isCanMove(copyPieces[start].name as PiecesNames, start, end)) return false;
  if (isInvalidMove(start, end, copyPieces, params)) return false;
  const cantCastle =
    copyPieces[start].name === (isWhite(player) ? KING_WHITE : KING_BLACK) &&
    Math.abs(end - start) === 2 &&
    checkIsMovePiece(player, copyPieces, params);
  if (cantCastle) return false;
  if ([KING_WHITE, KING_BLACK].includes(copyPieces[start].name as PiecesNames) && Math.abs(end - start) === 2) {
    const deltaPos = end - start;
    const testPieces = produce(copyPieces, draft => {
      draft[start + (deltaPos === 2 ? 1 : -1)] = draft[start];
      draft[start] = setPiece(start);
    });
    if (checkIsMovePiece(player, testPieces, params)) return false;
  }
  const checkPieces = produce(copyPieces, draft => {
    draft[end] = draft[start];
    draft[start] = setPiece(start);
  });
  if (checkIsMovePiece(player, checkPieces, params)) return false;
  return true;
};

export const getPassant = (player: TypeColor, pieces: IPieces[], start: number, end: number): number => {
  const copyPieces = [...pieces];
  const passantTrue = isWhite(player)
    ? copyPieces[end].name === PAWN_WHITE && start >= 48 && start <= 55 && end - start === -16
    : copyPieces[end].name === PAWN_BLACK && start >= 8 && start <= 15 && end - start === 16;
  return passantTrue ? end : 65;
};

export const randPositions = (): number[] => {
  let raOfStarts = [];
  for (let i = 0; i < 64; i++) {
    raOfStarts.push(i);
  }
  return shuffle(raOfStarts);
};

export const posibilityMoves = (
  player: TypeColor,
  pieces: IPieces[],
  starts: number[],
  ends: number[]
): { start: number; end: number }[] => {
  return starts.reduce(
    (moves, start) => {
      if (pieces[start]?.player === player) {
        ends.forEach(end => {
          if (ifCanMove(start, end, pieces)) {
            moves.push({ start, end });
          }
        });
      }
      return moves;
    },
    [] as { start: number; end: number }[]
  );
};

export const setMove = (pieces: IPieces[], start: number, end: number, params: IParamsCanMove = {}): IPieces[] => {
  const { passantPos = null, passantPosStore = null } = params || {};
  const copyBoard = produce(pieces, draft => {
    const isKing = draft[start].name === KING_WHITE || draft[start].name === KING_BLACK;
    if (isKing && Math.abs(end - start) === 2) {
      if (end === (draft[start].name === KING_WHITE ? 62 : 6)) {
        draft[end - 1] = draft[end + 1];
        draft[end - 1].highlight = true;
        draft[end + 1] = setPiece(end + 1);
        draft[end + 1].highlight = true;
      } else if (end === (draft[start].name === KING_WHITE ? 58 : 2)) {
        draft[end + 1] = draft[end - 2];
        draft[end + 1].highlight = true;
        draft[end - 2] = setPiece(end - 1);
        draft[end - 2].highlight = true;
      }
    }
    const passant = passantPos ?? passantPosStore;
    if (draft[start].name === PAWN_WHITE && (end - start === -7 || end - start === 9)) {
      if (start + 1 === passant) {
        draft[start + 1] = setPiece(start + 1);
        draft[start + 1].highlight = true;
      }
    }
    draft[end] = draft[start];
    draft[end].highlight = true;
    draft[start] = setPiece(start);
    draft[start].highlight = true;
    if ([PAWN_WHITE, PAWN_BLACK].includes(draft[end].name as PiecesNames)) {
      if (end >= 0 && end <= 7) {
        draft[end] = setPiece(end, { player: WHITE, name: QUEEN });
        draft[end].highlight = true;
      }
      if (end >= 56 && end <= 63) {
        draft[end] = setPiece(end, { player: BLACK, name: QUEEN });
        draft[end].highlight = true;
      }
    }
  });
  return copyBoard;
};
