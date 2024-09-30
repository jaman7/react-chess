import { inject, observer } from 'mobx-react';
import { IPieces, IStoreProps, TypeColor } from 'store/Store.model';
import Tile from './Tile';
import { ROW_SIZE } from 'store/store.constance';
import { calcSquareColor, setCursor } from 'utils';
import React from 'react';
import { toJS } from 'mobx';

const Board: React.FC<IStoreProps> = ({ Store }) => {
  const { board = [], isBoardRotated, botRunning = false, mated, userColor } = Store || {};

  const handleClick = (index: number) => {
    if (!botRunning && !mated) {
      Store?.onClickPiece?.(index);
    }
  };

  const renderTile = React.useCallback(
    (piece: IPieces, tileColor: string, cursor: string, index: number) => {
      return (
        <Tile
          key={index}
          name={piece?.name ?? null}
          color={tileColor}
          cursor={cursor}
          className={isBoardRotated ? 'rotated' : ''}
          onClick={() => handleClick(index)}
        />
      );
    },
    [board, botRunning, mated, isBoardRotated, userColor]
  );

  const renderBoard = () =>
    Array.from({ length: ROW_SIZE }, (_, rowIndex) => (
      <div key={rowIndex} className="d-flex">
        {Array.from({ length: ROW_SIZE }, (_, colIndex) => {
          const index = rowIndex * ROW_SIZE + colIndex;
          const piece = board[index];
          const tileColor = calcSquareColor(rowIndex, colIndex, board);
          const cursor = setCursor(piece, userColor as TypeColor, botRunning);
          return renderTile(piece, tileColor, cursor, index);
        })}
      </div>
    ));

  return <div className="board-main">{renderBoard()}</div>;
};

export default inject('Store')(observer(Board));
