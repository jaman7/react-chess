import { TypeColor } from 'store/Store.model';
import BasePiece from './BasePiece';

class FillerPiece extends BasePiece {
  constructor(player: TypeColor | null, index?: number) {
    super(player, index, null);
  }

  createIcon(): JSX.Element | null {
    return null;
  }

  canMove(): boolean {
    return false;
  }
}

export default FillerPiece;
