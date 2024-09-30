import { IParamsCanMove, IPieces, TypeColor } from 'store/Store.model';
import { PiecesNames } from 'store/store.constance';
import { isWhite } from './utils';
import { produce } from 'immer';
import { ifCanMove } from './movs';

const { KING_WHITE, KING_BLACK } = PiecesNames;

export const handlePieceSelection = (
  board: IPieces[],
  userColor: TypeColor,
  index: number,
  activePiece: number | null,
  params: IParamsCanMove
): IPieces[] => {
  return produce(board, draft => {
    const selectedPiece = draft[index];
    if (selectedPiece.player !== userColor || !selectedPiece.player) return;
    draft.forEach(piece => {
      if (piece.possible) piece.possible = false;
      if (piece.possibleCapture) piece.possibleCapture = false;
    });
    if (activePiece !== null && activePiece > -1 && index !== activePiece) {
      const prevSelectedPiece = draft[activePiece];
      prevSelectedPiece.highlight = false;
    }
    selectedPiece.highlight = true;
    draft.forEach((_, i) => {
      if (ifCanMove(index, i, draft, params)) {
        if (!draft[i].name) draft[i].possible = true;
        if (draft[i].name) draft[i].possibleCapture = true;
      }
    });
  });
};

export const highlightMate = (player: TypeColor, pieces: IPieces[], checkMated: boolean, staleMated: boolean): IPieces[] => {
  return produce(pieces, draft => {
    if (checkMated || staleMated) {
      const king = draft.find(piece => piece.name === (isWhite(player) ? KING_WHITE : KING_BLACK));
      if (king) king.checked = checkMated ? 1 : 2;
    }
  });
};

export const clearPossibleHighlight = (pieces: IPieces[]): IPieces[] => {
  return produce(pieces, draft => {
    draft.forEach(piece => {
      if (piece.possible) piece.possible = false;
      if (piece.possibleCapture) piece.possibleCapture = false;
    });
  });
};

export const clearCheckHighlight = (player: TypeColor, pieces: IPieces[]): IPieces[] => {
  return produce(pieces, draft => {
    const king = draft.find(piece => piece.name === (isWhite(player) ? KING_WHITE : KING_BLACK));
    if (king?.inCheck) king.inCheck = false;
  });
};

export const setCheckkHighlight = (player: TypeColor, pieces: IPieces[]): IPieces[] => {
  return produce(pieces, draft => {
    const king = draft.find(piece => piece.name === (isWhite(player) ? KING_WHITE : KING_BLACK));
    if (king) {
      king.inCheck = true;
    }
  });
};

export const clearHighlight = (pieces: IPieces[]): IPieces[] => {
  return produce(pieces, draft => {
    draft.forEach(piece => {
      if (piece.highlight) piece.highlight = false;
    });
  });
};
