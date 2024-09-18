import LazyImage from 'components/LazyImage';
import { PiecesNames, ROW_SIZE } from 'store/store.constance';
import { TypeColor } from 'store/Store.model';
import { isWhite } from 'utils';
import BasePiece from './BasePiece';

const { KNIGHT_WHITE, KNIGHT_BLACK } = PiecesNames;

class Knight extends BasePiece {
  constructor(player: TypeColor, index?: number) {
    super(player, index, isWhite(player) ? KNIGHT_WHITE : KNIGHT_BLACK);
  }

  createIcon(): JSX.Element {
    return <LazyImage className="piece" src={`img/${this.imageName}.png`} alt={this.imageName as string} />;
  }

  canMove(start: number, end: number): boolean {
    const startRow = Math.floor(start / ROW_SIZE);
    const startCol = start % ROW_SIZE;
    const endRow = Math.floor(end / ROW_SIZE);
    const endCol = end % ROW_SIZE;

    const rowDiff = Math.abs(endRow - startRow);
    const colDiff = Math.abs(endCol - startCol);

    if (rowDiff === 1 && colDiff === -2) {
      return true;
    } else if (rowDiff === 2 && colDiff === -1) {
      return true;
    } else if (rowDiff === 2 && colDiff === 1) {
      return true;
    } else if (rowDiff === 1 && colDiff === 2) {
      return true;
    } else if (rowDiff === -1 && colDiff === 2) {
      return true;
    } else if (rowDiff === -2 && colDiff === 1) {
      return true;
    } else if (rowDiff === -2 && colDiff === -1) {
      return true;
    } else if (rowDiff === -1 && colDiff === -2) {
      return true;
    }
    return false;
  }
}

export default Knight;
