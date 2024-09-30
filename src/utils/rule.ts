import { ColorsPieces, PiecesNameShort, ROW_SIZE } from 'store/store.constance';

const { ROOK, KNIGHT, BISHOP, QUEEN, KING, PAWN } = PiecesNameShort;
const { WHITE } = ColorsPieces;

const getPosition = (index: number, rowSize: number) => {
  const row = rowSize - Math.floor(index / rowSize);
  const col = (index % rowSize) + 1;
  return { row, col };
};

export const isCanMove = (name: string, start: number, end: number): boolean => {
  const ruleName: string | null = name?.replace(/WHITE|BLACK|_/g, '') ?? null;
  const { row: startRow, col: startCol } = getPosition(start, ROW_SIZE);
  const { row: endRow, col: endCol } = getPosition(end, ROW_SIZE);
  const rowDiff = endRow - startRow;
  const colDiff = endCol - startCol;
  switch (ruleName) {
    case ROOK:
      return rowDiff === 0 || colDiff === 0;
    case KNIGHT:
      return (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) || (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2);
    case BISHOP:
      return Math.abs(rowDiff) === Math.abs(colDiff);
    case QUEEN:
      return isCanMove(ROOK, start, end) || isCanMove(BISHOP, start, end);
    case KING:
      return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;
    case PAWN:
      const isWhite = name.includes(WHITE);
      const startRowForPawn = isWhite ? 2 : 7;
      const direction = isWhite ? 1 : -1;
      if (colDiff === 0) {
        return rowDiff === direction || (startRow === startRowForPawn && rowDiff === 2 * direction);
      } else if (Math.abs(colDiff) === 1) {
        return rowDiff === direction;
      }
      return false;
    default:
      return false;
  }
};
