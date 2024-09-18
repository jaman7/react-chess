import LazyImage from 'components/LazyImage';
import { PiecesNames, ROW_SIZE } from 'store/store.constance';
import { TypeColor } from 'store/Store.model';
import { isWhite } from 'utils';
import BasePiece from './BasePiece';

const { QUEEN_WHITE, QUEEN_BLACK } = PiecesNames;

class Queen extends BasePiece {
  constructor(player: TypeColor, index?: number) {
    super(player, index, isWhite(player) ? QUEEN_WHITE : QUEEN_BLACK);
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

    if (rowDiff > 0 && colDiff === 0) {
      return true;
    } else if (rowDiff === 0 && colDiff > 0) {
      return true;
    } else if (rowDiff < 0 && colDiff === 0) {
      return true;
    } else if (rowDiff === 0 && colDiff < 0) {
      return true;
    } else if (rowDiff === colDiff) {
      return true;
    } else if (rowDiff === -colDiff) {
      return true;
    }
    return false;
  }
}

export default Queen;
