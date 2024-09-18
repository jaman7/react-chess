import { IMoves, IPieces } from 'store/Store.model';

export const collectMoveData = (pieces: IPieces[], start: number, end: number): IMoves => {
  const pieceStart = pieces[start];
  const startField = pieceStart.field as string;
  const pieceEnd = pieces[end];
  const endField = pieceEnd.field as string;

  return {
    start,
    end,
    pieceName: pieceStart?.name || null,
    startField,
    endField,
    captured: pieceEnd?.name || null,
    winBy: null,
  };
};

export const collectIfMate = (checkMated: boolean, staleMated: boolean): IMoves => {
  let winBy = null;
  if (checkMated) {
    winBy = 'checkmate';
  } else if (staleMated) {
    winBy = 'stalemate';
  }

  return {
    winBy: winBy || null,
  };
};
