import FillerPiece from 'components/pieces/FillerPiece';
import Queen from 'components/pieces/PieceQuenn';
import { BOARD_SIZE, ColorsPieces, PiecesNames } from 'store/store.constance';
import { IPieces, TypeColor } from 'store/Store.model';
import { getRowCol, isBlack, isWhite, shuffle } from './utils';
import Store from 'store/Store';
import { produce } from 'immer';

const { WHITE, BLACK } = ColorsPieces;
const { PAWN_WHITE, PAWN_BLACK, ROOK_WHITE, ROOK_BLACK, KING_WHITE, KING_BLACK, BISHOP_WHITE, BISHOP_BLACK, QUEEN_WHITE, QUEEN_BLACK } =
  PiecesNames;

export const checkCastling = (start: number, end: number, pieces: IPieces[]): boolean => {
  const copyPieces = [...pieces];
  const player = copyPieces[start].player as TypeColor;
  const deltaPos = end - start;
  const isWhitePlayer = isWhite(player);
  const isBlackPlayer = isBlack(player);
  if (start !== (isWhitePlayer ? 60 : 4)) return false;
  if ((deltaPos === 2 ? copyPieces[end + 1]?.name : copyPieces[end - 2]?.name) !== (isWhitePlayer ? ROOK_WHITE : ROOK_BLACK)) return false;
  if (isWhitePlayer ? Store.whiteKingHasMoved : Store.blackKingHasMoved) return false;
  if (isBlackPlayer) {
    if (deltaPos === 2 ? Store.rightWhiteRookHasMoved : Store.leftWhiteRookHasMoved) return false;
  } else if (isBlackPlayer) {
    if (deltaPos === 2 ? Store.rightBlackRookHasMoved : Store.leftBlackRookHasMoved) return false;
  }
  return true;
};

export const checkIsPawn = (start: number, end: number, pieces: IPieces[], passantPos?: number): boolean => {
  const copyPieces = [...pieces];
  const passant = passantPos ?? Store.passantPos;
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

export const isInvalidMove = (start: number, end: number, pieces: IPieces[], passantPos?: number): boolean => {
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
    if (!checkIsPawn(start, end, copyPieces, passantPos)) return true;
  }
  if ([KING_WHITE, KING_BLACK].includes(pieceName as PiecesNames) && Math.abs(end - start) === 2) {
    return !checkCastling(start, end, copyPieces);
  }
  return false;
};

export const checkIsMovePiece = (player: TypeColor, pieces: IPieces[]): boolean => {
  const copyPieces = [...pieces];
  const king = isWhite(player) ? KING_WHITE : KING_BLACK;
  let positionOfKing = copyPieces.findIndex(p => p.name === king);
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (copyPieces[i].player !== player) {
      if (copyPieces[i].canMove(i, positionOfKing) && !isInvalidMove(i, positionOfKing, copyPieces)) return true;
    }
  }
  return false;
};

export const ifCanMove = (start: number, end: number, pieces: IPieces[], passantPos?: number): boolean => {
  if (start === end) return false;
  const copyPieces = [...pieces];
  const player = copyPieces[start].player as TypeColor;
  if (player === copyPieces[end].player || !copyPieces[start].canMove(start, end)) return false;
  if (isInvalidMove(start, end, copyPieces, passantPos)) return false;
  const cantCastle =
    copyPieces[start].name === (isWhite(player) ? KING_WHITE : KING_BLACK) &&
    Math.abs(end - start) === 2 &&
    checkIsMovePiece(player, copyPieces);
  if (cantCastle) return false;
  if ([KING_WHITE, KING_BLACK].includes(copyPieces[start].name as PiecesNames) && Math.abs(end - start) === 2) {
    const deltaPos = end - start;
    const testPieces = produce(copyPieces, draft => {
      draft[start + (deltaPos === 2 ? 1 : -1)] = draft[start];
      draft[start] = new FillerPiece(null, start);
    });
    if (checkIsMovePiece(player, testPieces)) return false;
  }
  const checkPieces = produce(copyPieces, draft => {
    draft[end] = draft[start];
    draft[start] = new FillerPiece(null, start);
  });
  if (checkIsMovePiece(player, checkPieces)) return false;
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
  let moves: { start: number; end: number }[] = [];
  for (let i = 0; i < 64; i++) {
    let start = starts[i];
    let isBotPiece = pieces[start].name != null && pieces[start].player === player;
    if (isBotPiece) {
      for (let j = 0; j < 64; j++) {
        let end = ends[j];
        if (ifCanMove(start, end, pieces)) {
          moves.push({ start, end });
        }
      }
    }
  }
  return moves;
};

export const setMove = (pieces: IPieces[], start: number, end: number, passantPos?: number): IPieces[] => {
  const copyBoard = produce(pieces, draft => {
    const isKing = draft[start].name === KING_WHITE || draft[start].name === KING_BLACK;
    if (isKing && Math.abs(end - start) === 2) {
      if (end === (draft[start].name === KING_WHITE ? 62 : 6)) {
        draft[end - 1] = draft[end + 1];
        draft[end - 1].setHighlight?.(true);
        draft[end + 1] = new FillerPiece(null, end + 1);
        draft[end + 1].setHighlight?.(true);
      } else if (end === (draft[start].name === KING_WHITE ? 58 : 2)) {
        draft[end + 1] = draft[end - 2];
        draft[end + 1].setHighlight?.(true);
        draft[end - 2] = new FillerPiece(null, end - 2);
        draft[end - 2].setHighlight?.(true);
      }
    }
    const passant = passantPos ?? Store.passantPos;
    console.log(passant);
    if (draft[start].name === PAWN_WHITE && (end - start === -7 || end - start === 9)) {
      if (start + 1 === passant) {
        draft[start + 1] = new FillerPiece(null, start + 1);
        draft[start + 1].setHighlight?.(true);
      }
    }
    draft[end] = draft[start];
    draft[end].setHighlight?.(true);
    draft[start] = new FillerPiece(null, start);
    draft[start].setHighlight?.(true);
    if ([PAWN_WHITE, PAWN_BLACK].includes(draft[end].name as PiecesNames)) {
      if (end >= 0 && end <= 7) {
        draft[end] = new Queen(WHITE, end);
        draft[end].setHighlight?.(true);
      }
      if (end >= 56 && end <= 63) {
        draft[end] = new Queen(BLACK, end);
        draft[end].setHighlight?.(true);
      }
    }
  });
  return copyBoard;
};
