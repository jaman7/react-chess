import { configure, makeAutoObservable, runInAction } from 'mobx';
import { IHistoryMoves, IPieces, IStore, TypeColor } from './Store.model';
import { ColorsPieces, NO_MOVE, PiecesNames } from './store.constance';
import {
  ifCanMove,
  checkMate,
  clearHighlight,
  clearPossibleHighlight,
  highlightMate,
  checkIsMovePiece,
  initializeBoard,
  isBlack,
  getPassant,
  isWhite,
  setMove,
  miniMax,
  staleMate,
  setCheckkHighlight,
  clearCheckHighlight,
  isSamePlayerTurn,
  isSamePlayer,
  collectMoveData,
  collectIfMate,
  posibilityMoves,
  randPositions,
} from 'utils';

const { WHITE, BLACK } = ColorsPieces;
const { KING_WHITE, KING_BLACK, ROOK_WHITE, ROOK_BLACK } = PiecesNames;

configure({
  enforceActions: 'never',
});

class Store implements IStore {
  gameStarted: boolean = false;
  isBoardRotated: boolean = false;
  board: IPieces[] = [];
  activePiece: number | null = -1; // Indeks aktywnej figury
  botColor: TypeColor = BLACK;
  userColor: TypeColor = WHITE;
  currentPlayer: TypeColor = WHITE;
  botRunning?: boolean = false;
  mated?: boolean = false;
  passantPos: number | null = NO_MOVE;
  whiteKingHasMoved: boolean = false;
  blackKingHasMoved: boolean = false;
  leftBlackRookHasMoved: boolean = false;
  rightBlackRookHasMoved: boolean = false;
  leftWhiteRookHasMoved: boolean = false;
  rightWhiteRookHasMoved: boolean = false;
  botFirstPos: number | null = null;
  botSecondPos: number | null = null;
  message: string = '';
  repetition: number = 0;
  historyMoves: IHistoryMoves[] = [];
  gameTurn: number = -1;
  disableStartBeforeReset: boolean = false;

  get isGameStarted(): boolean {
    return this.gameStarted;
  }

  get getPlayersScore(): { user: number; bot: number } {
    let userWins = 0,
      botWins = 0;
    this.historyMoves.forEach(round => {
      round.user.forEach(move => {
        if (move.winBy !== null) userWins++;
      });
      round.bot.forEach(move => {
        if (move.winBy !== null) botWins++;
      });
    });
    return { user: userWins, bot: botWins };
  }

  get getWinnerTurnBot(): boolean {
    const botMoves = this.historyMoves?.[this.gameTurn]?.bot ?? [];
    return botMoves?.some(move => move.winBy !== null) ?? false;
  }

  get getWinnerTurnUser(): boolean {
    const userMoves = this.historyMoves?.[this.gameTurn]?.user ?? [];
    return userMoves?.some(move => move.winBy !== null) ?? false;
  }

  get getHistoryturnMovs(): IHistoryMoves {
    return this.historyMoves?.[this.gameTurn] ?? {};
  }

  get isUserColorCurrent(): boolean {
    return this.userColor === this.currentPlayer;
  }

  setNewGameInTurn() {
    runInAction(() => {
      this.gameStarted = true;
      this.gameTurn = this.gameTurn + 1;
      this.setUserPlayerColor();
      this.resetTurn();
    });
    if (isWhite(this.botColor)) this.triggerBotMove();
  }

  setStartGame() {
    runInAction(() => {
      this.gameStarted = true;
      this.gameTurn = 0;
      if (isWhite(this.botColor)) this.triggerBotMove();
    });
  }

  setStopGame() {
    this.mated = false;
    this.gameStarted = false;
    this.botRunning = false;
    this.activePiece = -1;
    this.passantPos = NO_MOVE;
    this.whiteKingHasMoved = false;
    this.blackKingHasMoved = false;
    this.leftBlackRookHasMoved = false;
    this.rightBlackRookHasMoved = false;
    this.leftWhiteRookHasMoved = false;
    this.rightWhiteRookHasMoved = false;
    this.disableStartBeforeReset = true;
    this.botFirstPos = null;
    this.botSecondPos = null;
    this.repetition = 0;
    this.message = '';
  }

  setUserPlayerColor(): void {
    const color = isWhite(this.userColor) ? BLACK : WHITE;
    runInAction(() => {
      this.userColor = color;
      this.currentPlayer = color;
      this.botColor = isWhite(color) ? BLACK : WHITE;
      this.isBoardRotated = !isWhite(this.userColor);
    });
  }

  setCurrentBotColor(): void {
    runInAction(() => {
      this.currentPlayer = this.botColor;
    });
  }

  setCurrentUserColor(): void {
    runInAction(() => {
      this.currentPlayer = this.userColor;
    });
  }

  resetTurn() {
    runInAction(() => {
      this.board = initializeBoard();
      this.botRunning = false;
      this.activePiece = -1;
      this.mated = false;
      this.passantPos = NO_MOVE;
      this.whiteKingHasMoved = false;
      this.blackKingHasMoved = false;
      this.leftBlackRookHasMoved = false;
      this.rightBlackRookHasMoved = false;
      this.leftWhiteRookHasMoved = false;
      this.rightWhiteRookHasMoved = false;
      this.disableStartBeforeReset = false;
      this.botFirstPos = null;
      this.botSecondPos = null;
      this.repetition = 0;
      this.message = '';
    });
  }

  reset() {
    runInAction(() => {
      this.isBoardRotated = false;
      this.gameStarted = false;
      this.board = initializeBoard();
      this.activePiece = -1;
      this.botColor = BLACK;
      this.userColor = WHITE;
      this.currentPlayer = WHITE;
      this.botRunning = false;
      this.mated = false;
      this.passantPos = NO_MOVE;
      this.whiteKingHasMoved = false;
      this.blackKingHasMoved = false;
      this.leftBlackRookHasMoved = false;
      this.rightBlackRookHasMoved = false;
      this.leftWhiteRookHasMoved = false;
      this.rightWhiteRookHasMoved = false;
      this.disableStartBeforeReset = false;
      this.botFirstPos = null;
      this.botSecondPos = null;
      this.message = '';
      this.repetition = 0;
      this.historyMoves = [];
      this.gameTurn = -1;
    });
  }

  onFirstClick = (index: number) => {
    let copyBoard = [...this.board];
    const selectedPiece = copyBoard[index];
    if (selectedPiece.player !== this.userColor || !selectedPiece.player) return;
    copyBoard.forEach((_, i) => {
      if (copyBoard[i]?.possible) copyBoard[i].setPossible?.(false);
      if (copyBoard[i]?.possibleCapture) copyBoard[i].setPossibleCapture?.(false);
    });
    if (this.activePiece !== null && this.activePiece > -1 && index !== this.activePiece) {
      const prevSelectedPiece = copyBoard[this.activePiece];
      prevSelectedPiece?.setHighlight?.(false);
    }
    this.activePiece = index;
    selectedPiece?.setHighlight?.(true);
    copyBoard.forEach((_, i) => {
      if (ifCanMove(index, i, this.board)) {
        if (copyBoard[i]?.name === null) copyBoard[i].setPossible?.(true);
        if (copyBoard[i]?.name !== null) copyBoard[i].setPossibleCapture?.(true);
      }
    });
    runInAction(() => {
      this.board = copyBoard;
    });
  };

  onSecondClick = (index: number): void => {
    const sourcePiece = this.activePiece as number;
    if (ifCanMove(sourcePiece, index, this.board)) {
      this.executeMove(this.userColor, sourcePiece, index);
      this.triggerBotMove();
    } else {
      this.resetSelection();
    }
  };

  onClickPiece(index: number): void {
    if (this.mated || !this.gameStarted) {
      this.activePiece = -1;
      return;
    }
    const selectedPiece = this.board[index];
    if (!selectedPiece) return;
    const isSamePlayer = isSamePlayerTurn(selectedPiece.player as TypeColor, this.userColor, this.currentPlayer);
    if (!this.botRunning && this.isUserColorCurrent) {
      if (isSamePlayer) {
        this.onFirstClick(index);
      } else if (this.activePiece !== null && this.activePiece > -1 && this.activePiece !== index) {
        this.onSecondClick(index);
      }
    } else {
      this.activePiece = -1;
      return;
    }
  }

  resetSelection = (): void => {
    if (this.activePiece !== null && this.activePiece > -1) this.board[this.activePiece]?.setHighlight?.(false);
    this.board = clearPossibleHighlight(this.board);
    this.activePiece = -1;
  };

  triggerBotMove = (): void => {
    runInAction(() => {
      this.setCurrentBotColor();
      setTimeout(() => this.executeBot(3, this.botColor), 700);
    });
  };

  executeBot(depth: number, botColor: TypeColor): void {
    this.botRunning = true;
    if (this.mated) {
      this.message = 'Bot cannot run';
      return;
    }

    const copyBoard = [...this.board];
    let bestMove = { start: 100, end: 100 };
    const randStarts = randPositions();
    const randEnds = randPositions();
    const moves = posibilityMoves(botColor, copyBoard, randStarts, randEnds);
    let bestValue = -99999;

    for (const move of moves) {
      const { start, end } = move || {};
      if (moves.length && this.repetition >= 2 && start === this.botSecondPos && end === this.botFirstPos) {
        this.repetition = 0;
      } else {
        const testBoard = [...this.board];
        const updatedBoard = [...setMove(testBoard, start, end)];
        const passantPos = getPassant(botColor, testBoard, start, end);
        const evaluation = miniMax(depth - 1, false, -Infinity, Infinity, updatedBoard, randStarts, randEnds, passantPos, botColor);
        if (evaluation >= bestValue) {
          bestValue = evaluation;
          bestMove = { start, end };
        }
      }
    }

    if (bestMove.end != 100) {
      runInAction(() => {
        if (bestMove.start === this.botSecondPos && bestMove.end === this.botFirstPos) {
          this.repetition++;
        } else {
          this.repetition = 0;
        }
      });

      this.executeMove(botColor, bestMove.start, bestMove.end);
    }
  }

  executeMove(player: TypeColor, start: number, end: number): void {
    let copyBoard = [...this.board];

    const prevBoard = [...this.board];
    let moveData = collectMoveData(prevBoard, start, end);
    const isUserPlayer = isSamePlayer(player, this.userColor);
    const isBotPlayer = isSamePlayer(player, this.botColor);
    const oppositeColor = isWhite(player) ? BLACK : WHITE;

    copyBoard = clearHighlight(copyBoard);
    if (isUserPlayer) copyBoard = clearPossibleHighlight(copyBoard);

    this.checkKingOrRookHasMoved(player, copyBoard, start);

    copyBoard = [...setMove(copyBoard, start, end)];
    const passant = getPassant(player, copyBoard, start, end);
    copyBoard[start].setIndex(start);
    copyBoard[end].setIndex(end);

    const checkMated = checkMate(WHITE, copyBoard) || checkMate(BLACK, copyBoard);
    const staleMated = (staleMate(WHITE, copyBoard) && isBlack(player)) || (staleMate(BLACK, copyBoard) && isWhite(player));

    if (checkIsMovePiece(oppositeColor, copyBoard) && (!checkMated || !staleMated)) {
      copyBoard = setCheckkHighlight(oppositeColor, copyBoard);
    } else {
      copyBoard = clearCheckHighlight(player, copyBoard);
    }

    copyBoard = highlightMate(oppositeColor, copyBoard, checkMate(oppositeColor, copyBoard), staleMate(oppositeColor, copyBoard));

    this.passantPos = passant;

    this.activePiece = -1;
    this.mated = checkMated || staleMated;

    moveData = { ...moveData, ...collectIfMate(checkMated, staleMated) };

    if (!this.historyMoves[this.gameTurn]) {
      this.historyMoves.push({ user: [], bot: [] });
    }

    const history = this.historyMoves[this.gameTurn];
    if (isUserPlayer) {
      history.user.push(moveData);
    } else if (isBotPlayer) {
      history.bot.push(moveData);
    }

    if (isBotPlayer) {
      this.botFirstPos = start;
      this.botSecondPos = end;
    }

    if (isBotPlayer && this.botRunning) {
      this.botRunning = false;
      this.setCurrentUserColor();
    }

    runInAction(() => {
      this.board = [...copyBoard];
    });
  }

  checkKingOrRookHasMoved(player: TypeColor, pieces: IPieces[], start: number): void {
    const isWhiteMove = player === this.userColor ? isWhite(this.userColor) : isWhite(this.botColor);
    const piece = pieces[start]?.name;

    if (!piece) return;

    runInAction(() => {
      if (piece === (isWhiteMove ? KING_WHITE : KING_BLACK)) {
        isWhiteMove ? (this.whiteKingHasMoved = true) : (this.blackKingHasMoved = true);
      }
      if (piece === (isWhiteMove ? ROOK_WHITE : ROOK_BLACK)) {
        if (start === (isWhiteMove ? 56 : 0)) {
          isWhiteMove ? (this.leftWhiteRookHasMoved = true) : (this.leftBlackRookHasMoved = true);
        } else if (start === (isWhiteMove ? 63 : 7)) {
          isWhiteMove ? (this.rightWhiteRookHasMoved = true) : (this.rightBlackRookHasMoved = true);
        }
      }
    });
  }

  constructor() {
    makeAutoObservable(this);
    this.board = initializeBoard();
  }
}

export default new Store();
