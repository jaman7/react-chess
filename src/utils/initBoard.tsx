import FillerPiece from 'components/pieces/FillerPiece';
import Bishop from 'components/pieces/PieceBishop';
import King from 'components/pieces/PieceKing';
import Knight from 'components/pieces/PieceKnight';
import Pawn from 'components/pieces/PiecePawn';
import Queen from 'components/pieces/PieceQuenn';
import Rook from 'components/pieces/PieceRook';
import { BOARD_SIZE, ColorsPieces, ROW_SIZE } from 'store/store.constance';
import { IPieces } from 'store/Store.model';

const { WHITE, BLACK } = ColorsPieces;

export const initializeBoard = (): IPieces[] => {
  const piecesOrder = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];
  const pieces: IPieces[] = Array(BOARD_SIZE).fill(null);
  for (let i = 0; i < ROW_SIZE; i++) {
    pieces[i + ROW_SIZE] = new Pawn(BLACK, i + ROW_SIZE);
    pieces[i + 6 * ROW_SIZE] = new Pawn(WHITE, i + 6 + ROW_SIZE);
  }
  piecesOrder.forEach((Piece, index) => {
    pieces[index] = new Piece(BLACK, index);
    pieces[BOARD_SIZE - ROW_SIZE + index] = new Piece(WHITE, BOARD_SIZE - ROW_SIZE + index);
  });
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (!pieces[i]) {
      pieces[i] = new FillerPiece(null, i);
    }
  }
  return pieces;
};
