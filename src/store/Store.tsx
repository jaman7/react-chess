import { configure, makeAutoObservable, runInAction, toJS } from 'mobx';
import { IHistoryMoves, IParamsCanMove, IPieces, IStore, TypeColor } from './Store.model';
import { ColorsPieces, NO_MOVE, PiecesNames } from './store.constance';
import {
  ifCanMove,
  checkMate,
  clearHighlight,
  clearPossibleHighlight,
  highlightMate,
  checkIsMovePiece,
  isBlack,
  getPassant,
  isWhite,
  setMove,
  staleMate,
  setCheckkHighlight,
  clearCheckHighlight,
  isSamePlayerTurn,
  isSamePlayer,
  collectMoveData,
  collectIfMate,
  posibilityMoves,
  randPositions,
  handlePieceSelection,
  initializeBoard,
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
  activePiece: number | null = -1;
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
  difficultyLevel: number = 4;

  constructor() {
    makeAutoObservable(this);
    this.board = initializeBoard();
  }

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

  setDifficultyLevel = (level: number): void => {
    runInAction(() => {
      this.difficultyLevel = level;
    });
  };

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
      this.difficultyLevel = 4;
    });
  }

  onFirstClick = (index: number) => {
    const params: IParamsCanMove = {
      passantPos: null,
      passantPosStore: this.passantPos,
      whiteKingHasMoved: this.whiteKingHasMoved,
      blackKingHasMoved: this.blackKingHasMoved,
      rightWhiteRookHasMoved: this.rightWhiteRookHasMoved,
      leftWhiteRookHasMoved: this.leftWhiteRookHasMoved,
      rightBlackRookHasMoved: this.rightBlackRookHasMoved,
      leftBlackRookHasMoved: this.leftBlackRookHasMoved,
    };
    runInAction(() => {
      this.board = handlePieceSelection(toJS(this.board), this.userColor, index, this.activePiece, params);
      this.activePiece = index;
    });
  };

  onSecondClick = (index: number): void => {
    const sourcePiece = this.activePiece as number;
    const copyBoard = toJS(this.board);
    const params: IParamsCanMove = {
      passantPos: null,
      passantPosStore: this.passantPos,
      whiteKingHasMoved: this.whiteKingHasMoved,
      blackKingHasMoved: this.blackKingHasMoved,
      rightWhiteRookHasMoved: this.rightWhiteRookHasMoved,
      leftWhiteRookHasMoved: this.leftWhiteRookHasMoved,
      rightBlackRookHasMoved: this.rightBlackRookHasMoved,
      leftBlackRookHasMoved: this.leftBlackRookHasMoved,
    };
    if (ifCanMove(sourcePiece, index, copyBoard, params)) {
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
    if (this.activePiece !== null && this.activePiece > -1) this.board[this.activePiece].highlight = false;
    this.board = clearPossibleHighlight([...toJS(this.board)]);
    this.activePiece = -1;
  };

  triggerBotMove = (): void => {
    runInAction(() => {
      this.setCurrentBotColor();

      setTimeout(() => this.executeBot(this.difficultyLevel, this.botColor), 200);
    });
  };

  executeBot(depth: number, botColor: TypeColor): void {
    this.botRunning = true;
    if (this.mated) {
      this.message = 'Bot cannot run';
      return;
    }
    const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });

    let copyBoard = [...toJS(this.board)];
    const randStarts = randPositions();
    const randEnds = randPositions();
    const moves = posibilityMoves(botColor, copyBoard, randStarts, randEnds);
    const moveCount = moves.length;
    if (moveCount === 0) return;

    worker.onmessage = e => {
      const bestMove = e.data; // Get the best move from the worker
      if (bestMove.start && bestMove.end) {
        runInAction(() => {
          if (bestMove.start === this.botSecondPos && bestMove.end === this.botFirstPos) {
            this.repetition++;
          } else {
            this.repetition = 0;
          }
          this.executeMove(botColor, bestMove.start, bestMove.end);
          this.botRunning = false;
        });
      }
    };

    const params = {
      passantPos: null,
      passantPosStore: this.passantPos,
      whiteKingHasMoved: this.whiteKingHasMoved,
      blackKingHasMoved: this.blackKingHasMoved,
      rightWhiteRookHasMoved: this.rightWhiteRookHasMoved,
      leftWhiteRookHasMoved: this.leftWhiteRookHasMoved,
      rightBlackRookHasMoved: this.rightBlackRookHasMoved,
      leftBlackRookHasMoved: this.leftBlackRookHasMoved,
    };

    worker.postMessage({
      moves,
      copyBoard,
      botColor,
      randStarts,
      randEnds,
      depth,
      params,
    });
  }

  executeMove(player: TypeColor, start: number, end: number): void {
    let copyBoard = [...toJS(this.board)];
    const prevBoard = [...toJS(this.board)];
    let moveData = collectMoveData(prevBoard, start, end);
    const isUserPlayer = isSamePlayer(player, this.userColor);
    const isBotPlayer = isSamePlayer(player, this.botColor);
    const oppositeColor = isWhite(player) ? BLACK : WHITE;

    copyBoard = clearHighlight(copyBoard);
    if (isUserPlayer) copyBoard = clearPossibleHighlight(copyBoard);

    this.checkKingOrRookHasMoved(player, copyBoard, start);

    copyBoard = [
      ...setMove(copyBoard, start, end, {
        passantPosStore: this.passantPos,
      }),
    ];
    const params = {
      passantPos: null,
      passantPosStore: this.passantPos,
      whiteKingHasMoved: this.whiteKingHasMoved,
      blackKingHasMoved: this.blackKingHasMoved,
      rightWhiteRookHasMoved: this.rightWhiteRookHasMoved,
      leftWhiteRookHasMoved: this.leftWhiteRookHasMoved,
      rightBlackRookHasMoved: this.rightBlackRookHasMoved,
      leftBlackRookHasMoved: this.leftBlackRookHasMoved,
    };
    const passant = getPassant(player, copyBoard, start, end);
    const checkMated = checkMate(WHITE, copyBoard, params) || checkMate(BLACK, copyBoard, params);
    const staleMated = (staleMate(WHITE, copyBoard, params) && isBlack(player)) || (staleMate(BLACK, copyBoard, params) && isWhite(player));

    if (checkIsMovePiece(oppositeColor, copyBoard, params) && (!checkMated || !staleMated)) {
      copyBoard = setCheckkHighlight(oppositeColor, copyBoard);
    } else {
      copyBoard = clearCheckHighlight(player, copyBoard);
    }

    copyBoard = highlightMate(oppositeColor, copyBoard, checkMated, staleMated);

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
}

export default new Store();
