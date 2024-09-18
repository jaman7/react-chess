import { IPieces, TypeColor } from 'store/Store.model';
import { PiecesNames } from 'store/store.constance';
import { isWhite } from './utils';

const { KING_WHITE, KING_BLACK } = PiecesNames;

export const highlightMate = (player: TypeColor, pieces: IPieces[], checkMated: boolean, staleMated: boolean): IPieces[] => {
  const copyPieces = [...pieces];
  if (checkMated || staleMated) {
    const king = copyPieces.find(piece => piece.name === (isWhite(player) ? KING_WHITE : KING_BLACK));
    if (king) king.setChecked?.(checkMated ? 1 : 2);
  }
  return copyPieces;
};

export const clearPossibleHighlight = (pieces: IPieces[]): IPieces[] => {
  const copyPieces = [...pieces];
  for (let j = 0; j < copyPieces.length; j++) {
    if (copyPieces[j]?.possible) copyPieces[j].setPossible?.(false);
    if (copyPieces[j]?.possibleCapture) copyPieces[j].setPossibleCapture?.(false);
  }
  return copyPieces;
};

export const clearCheckHighlight = (player: TypeColor, pieces: IPieces[]): IPieces[] => {
  const copyPieces = [...pieces];
  const king = copyPieces.find(piece => piece.name === (isWhite(player) ? KING_WHITE : KING_BLACK));
  if (king) king.setInCheck?.(false);
  return copyPieces;
};

export const setCheckkHighlight = (player: TypeColor, pieces: IPieces[]): IPieces[] => {
  const copyPieces = [...pieces];
  const king = copyPieces.find(piece => piece.name === (isWhite(player) ? KING_WHITE : KING_BLACK));
  if (king) king.setInCheck?.(true);
  return copyPieces;
};

export const clearHighlight = (pieces: IPieces[]): IPieces[] => {
  const copyPieces = [...pieces];
  for (let j = 0; j < copyPieces.length; j++) {
    const piece = copyPieces[j];
    if (piece?.highlight) piece.setHighlight?.(false);
  }
  return pieces;
};
