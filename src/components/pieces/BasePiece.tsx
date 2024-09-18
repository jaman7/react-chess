import { TypeColor } from 'store/Store.model';
import { IPiece } from './Piece.model';
import { PiecesNames, SQUARES } from 'store/store.constance';
import { getRowColFromIndex } from 'utils';

export default abstract class BasePiece implements IPiece {
  player: TypeColor | null;
  highlight: boolean;
  possible: boolean;
  possibleCapture: boolean;
  name: PiecesNames | null;
  imageName?: string | null;
  field?: string;
  index?: number;
  inCheck?: boolean;
  checked?: number;
  icon: JSX.Element | null;

  constructor(player: TypeColor | null, index?: number, pieceName?: PiecesNames | null) {
    const { row, col } = getRowColFromIndex(index as number);
    this.player = player ?? null;
    this.name = (pieceName as PiecesNames) ?? null;
    this.imageName = (pieceName as PiecesNames)?.toLowerCase() ?? null;
    this.field = SQUARES[row][col] ?? '';
    this.index = index;
    this.highlight = false;
    this.possible = false;
    this.possibleCapture = false;
    this.inCheck = false;
    this.checked = 0;
    this.icon = this.createIcon();
  }

  abstract createIcon(): JSX.Element | null;

  setIndex(index: number): void {
    const { row, col } = getRowColFromIndex(index);
    this.field = SQUARES[row][col] ?? '';
    this.index = index;
  }

  setName(name?: PiecesNames | null): void {
    this.name = name ?? null;
  }

  setHighlight(highlight: boolean): void {
    this.highlight = highlight;
  }

  setPossible(possible: boolean): void {
    this.possible = possible;
  }

  setPossibleCapture(possibleCapture: boolean): void {
    this.possibleCapture = possibleCapture;
  }

  setInCheck(inCheck: boolean): void {
    this.inCheck = inCheck;
  }

  setChecked(checked: number): void {
    this.checked = checked;
  }
}
