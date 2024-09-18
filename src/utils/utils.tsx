import classNames from 'classnames';
import { BishopEvalWhite, ColorsPieces, KingEvalWhite, PawnEvalWhite, PiecesNames, RookEvalWhite, ROW_SIZE } from 'store/store.constance';
import { IPieces, TypeColor } from 'store/Store.model';

const { KING_WHITE, KING_BLACK } = PiecesNames;
const { WHITE, BLACK } = ColorsPieces;

export const isEven = (value: number): boolean => value % 2 === 0;

export const isPlayerColor = (player: TypeColor, color: TypeColor): boolean => player === color;

export const isWhite = (player: TypeColor): boolean => isPlayerColor(player, WHITE);

export const isBlack = (player: TypeColor): boolean => isPlayerColor(player, BLACK);

export const isSamePlayer = (player1: TypeColor, player2: TypeColor): boolean => player1 === player2;

export const isSamePlayerTurn = (playColor: TypeColor, userColor: TypeColor, currentColor: TypeColor): boolean =>
  playColor === userColor && userColor === currentColor;

export const reverseArray = <T,>(array: T[]): T[] => [...array].reverse();

export const PawnEvalBlack = reverseArray(PawnEvalWhite);
export const BishopEvalBlack = reverseArray(BishopEvalWhite);
export const KingEvalBlack = reverseArray(KingEvalWhite);
export const RookEvalBlack = reverseArray(RookEvalWhite);

export const getRowColFromIndex = (index: number, rowSize: number = ROW_SIZE): { row: number; col: number } => ({
  row: Math.floor(index / rowSize),
  col: index % rowSize,
});

export const getRowCol = (position: number): { row: number; col: number } => ({
  row: ROW_SIZE - Math.floor(position / ROW_SIZE),
  col: (position % ROW_SIZE) + 1,
});

export const shuffle = (array: number[]): number[] => {
  let currentIndex = array.length;
  while (currentIndex > 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex--);
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const getBaseSquareColor = (i: number, j: number, base: string, highlight: string): string =>
  (isEven(i) && isEven(j)) || (!isEven(i) && !isEven(j)) ? base : highlight;

export const calcSquareColor = (i: number, j: number, pieces: IPieces[]): string => {
  const piece = pieces[i * ROW_SIZE + j];
  const baseColor = getBaseSquareColor(i, j, 'tile-white', 'tile-black');
  let addedColor = '';

  if (piece.highlight) {
    addedColor = getBaseSquareColor(i, j, 'tile-white-selected', 'tile-black-selected');
  }
  if (piece.possible) {
    addedColor = getBaseSquareColor(i, j, 'tile-white-highlighted', 'tile-black-highlighted');
  }
  if (piece.possibleCapture) {
    addedColor = getBaseSquareColor(i, j, 'tile-white-capture', 'tile-black-capture');
  }
  if (piece.name === KING_WHITE || piece.name === KING_BLACK) {
    if (piece.inCheck) {
      addedColor = getBaseSquareColor(i, j, 'tile-white-incheck', 'tile-black-incheck');
    }
    if (piece.checked && piece.checked >= 1) {
      addedColor = piece.checked === 1 ? 'tile-mated' : 'tile-stale';
    }
  }

  const classNamesColors = classNames(baseColor, {
    [addedColor]: addedColor !== '',
  });

  return classNamesColors;
};

export const formatTime = (time: number): string => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  const formattedHours = hours > 0 ? `${hours}:` : '';
  const formattedMinutes = `${minutes < 10 && hours > 0 ? `0${minutes}` : minutes}`;
  const formattedSeconds = `${seconds < 10 ? `0${seconds}` : seconds}`;
  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
};
