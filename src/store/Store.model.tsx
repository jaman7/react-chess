import FillerPiece from 'components/pieces/FillerPiece';
import Bishop from 'components/pieces/PieceBishop';
import King from 'components/pieces/PieceKing';
import Knight from 'components/pieces/PieceKnight';
import Pawn from 'components/pieces/PiecePawn';
import Queen from 'components/pieces/PieceQuenn';
import Rook from 'components/pieces/PieceRook';

export type IPieces = FillerPiece | Rook | Queen | Pawn | Knight | King | Bishop;

export type TypeColor = 'WHITE' | 'BLACK';

export type TypePieceName =
  | 'PAWN_WHITE'
  | 'PAWN_BLACK'
  | 'ROOK_WHITE'
  | 'ROOK_BLACK'
  | 'KING_WHITE'
  | 'KING_BLACK'
  | 'BISHOP_WHITE'
  | 'BISHOP_BLACK'
  | 'KNIGHT_WHITE'
  | 'KNIGHT_BLACK'
  | 'QUEEN_WHITE'
  | 'QUEEN_BLACK'
  | '';

export type Square =
  | 'a8'
  | 'b8'
  | 'c8'
  | 'd8'
  | 'e8'
  | 'f8'
  | 'g8'
  | 'h8'
  | 'a7'
  | 'b7'
  | 'c7'
  | 'd7'
  | 'e7'
  | 'f7'
  | 'g7'
  | 'h7'
  | 'a6'
  | 'b6'
  | 'c6'
  | 'd6'
  | 'e6'
  | 'f6'
  | 'g6'
  | 'h6'
  | 'a5'
  | 'b5'
  | 'c5'
  | 'd5'
  | 'e5'
  | 'f5'
  | 'g5'
  | 'h5'
  | 'a4'
  | 'b4'
  | 'c4'
  | 'd4'
  | 'e4'
  | 'f4'
  | 'g4'
  | 'h4'
  | 'a3'
  | 'b3'
  | 'c3'
  | 'd3'
  | 'e3'
  | 'f3'
  | 'g3'
  | 'h3'
  | 'a2'
  | 'b2'
  | 'c2'
  | 'd2'
  | 'e2'
  | 'f2'
  | 'g2'
  | 'h2'
  | 'a1'
  | 'b1'
  | 'c1'
  | 'd1'
  | 'e1'
  | 'f1'
  | 'g1'
  | 'h1';

export interface IMoves {
  start?: number;
  end?: number;
  pieceName?: string | null;
  startField?: string;
  endField?: string;
  captured?: string | null;
  winBy?: string | null;
}

export interface IHistoryMoves {
  [name: string]: IMoves[];
}

export interface IStore {
  board: IPieces[];
  botColor: TypeColor;
  userColor: TypeColor;
  currentPlayer: TypeColor;
  gameStarted: boolean;
  isBoardRotated: boolean;
  activePiece?: number | null;
  botRunning?: boolean;
  mated?: boolean;
  passantPos?: number | null;
  whiteKingHasMoved?: boolean;
  blackKingHasMoved?: boolean;
  leftBlackRookHasMoved?: boolean;
  rightBlackRookHasMoved?: boolean;
  leftWhiteRookHasMoved?: boolean;
  rightWhiteRookHasMoved?: boolean;
  botFirstPos?: number | null;
  botSecondPos?: number | null;
  message?: string;
  repetition?: number;
  historyMoves?: IHistoryMoves[];
  gameTurn?: number;
  disableStartBeforeReset?: boolean;
  isGameStarted?: boolean;
  isUserColorCurrent?: boolean;
  getHistoryturnMovs?: IHistoryMoves;
  getPlayersScore?: { user: number; bot: number };
  getWinnerTurnBot?: boolean;
  getWinnerTurnUser?: boolean;
  onClickPiece?: (index: number) => void;
  setStartGame?: () => void;
  setStopGame?: () => void;
  reset?: () => void;
  setUserPlayerColor?: (rotate?: boolean) => void;
  setNewGameInTurn?: () => void;
  setDifficultyLevel?: (level: number) => void;
}

export interface IStoreProps {
  Store?: IStore;
}

export enum StoreName {
  STORE = 'Store',
}
