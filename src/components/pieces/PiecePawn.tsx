import LazyImage from 'components/LazyImage';
import { PiecesNames, ROW_SIZE } from 'store/store.constance';
import { TypeColor } from 'store/Store.model';
import { isWhite } from 'utils';
import BasePiece from './BasePiece';

const { PAWN_WHITE, PAWN_BLACK } = PiecesNames;

class Pawn extends BasePiece {
  constructor(player: TypeColor, index?: number) {
    super(player, index, isWhite(player) ? PAWN_WHITE : PAWN_BLACK);
  }

  createIcon(): JSX.Element {
    return <LazyImage className="piece" src={`img/${this.imageName}.png`} alt={this.imageName as string} />;
  }

  canMove(start: number, end: number): boolean {
    const startRow = ROW_SIZE - Math.floor(start / ROW_SIZE);
    const startCol = (start % ROW_SIZE) + 1;
    const endRow = ROW_SIZE - Math.floor(end / ROW_SIZE);
    const endCol = (end % ROW_SIZE) + 1;
    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    if (isWhite(this.player as TypeColor)) {
      if (colDiff === 0) {
        if (rowDiff === 1 || rowDiff === 2) return true;
      } else if (colDiff === -1 || colDiff === 1) {
        if (rowDiff === 1) return true;
      }
    } else {
      if (colDiff === 0) {
        if (rowDiff === -2 || rowDiff === -1) return true;
      } else if (colDiff === -1 || colDiff === 1) {
        if (rowDiff === -1) return true;
      }
    }
    return false;
  }
}

export default Pawn;
