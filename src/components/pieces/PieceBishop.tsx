import { PiecesNames, ROW_SIZE } from 'store/store.constance';
import { TypeColor } from 'store/Store.model';
import { isWhite } from 'utils';
import BasePiece from './BasePiece';
import LazyImage from 'components/LazyImage';

const { BISHOP_WHITE, BISHOP_BLACK } = PiecesNames;

class Bishop extends BasePiece {
  constructor(player: TypeColor, index?: number) {
    super(player, index, isWhite(player) ? BISHOP_WHITE : BISHOP_BLACK);
  }

  createIcon(): JSX.Element {
    return <LazyImage className="piece" src={`img/${this.imageName}.png`} alt={this.imageName as string} />;
  }

  canMove(start: number, end: number) {
    const startRow = 8 - Math.floor(start / ROW_SIZE);
    const startCol = (start % ROW_SIZE) + 1;
    const endRow = 8 - Math.floor(end / ROW_SIZE);
    const endCol = (end % ROW_SIZE) + 1;
    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    if (rowDiff === colDiff) {
      return true;
    } else if (rowDiff === -colDiff) {
      return true;
    }
    return false;
  }
}

export default Bishop;
