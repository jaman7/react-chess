import { IPieces, TypeColor } from 'store/Store.model';
import { ifCanMove, checkIsMovePiece } from './movs';
import { BOARD_SIZE } from 'store/store.constance';

export const staleMate = (player: TypeColor, pieces: IPieces[]): boolean => {
  if (checkIsMovePiece(player, pieces)) return false;
  for (let i = 0; i < BOARD_SIZE; i++) {
    const piece = pieces[i];
    if (piece.player === player) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (ifCanMove(i, j, pieces)) return false;
      }
    }
  }
  return true;
};

export const checkMate = (player: TypeColor, pieces: IPieces[]): boolean => {
  if (!checkIsMovePiece(player, pieces)) return false;
  for (let i = 0; i < BOARD_SIZE; i++) {
    const piece = pieces[i];
    if (piece.player === player) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (ifCanMove(i, j, pieces)) return false;
      }
    }
  }
  return true;
};
