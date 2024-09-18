import { PiecesNames } from 'store/store.constance';
import { TypeColor, TypePieceName } from 'store/Store.model';

export interface IPiece {
  index?: number;
  player?: TypeColor | null;
  name: TypePieceName | null;
  highlight?: boolean;
  possible: boolean;
  field?: string;
  checked?: number;
  inCheck?: boolean;
  hasMoved?: boolean;
  icon?: JSX.Element | null;

  canMove?: (start: number, end: number) => boolean;
  setIndex?: (index: number) => void;
  setName?: (name: PiecesNames | null) => void;
  setHighlight?: (highlight: boolean) => void;
  setPossible?: (possible: boolean) => void;
  setInCheck?: (inCheck: boolean) => void;
  setChecked?: (checked: number) => void;
  setHasMoved?: (hasMoved: boolean) => void;
}
