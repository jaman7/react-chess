import { inject, observer } from 'mobx-react';
import { IPieces, IStoreProps } from 'store/Store.model';
import Tile from './Tile';
import { ROW_SIZE } from 'store/store.constance';
import { calcSquareColor } from 'utils';
import React from 'react';

const Board: React.FC<IStoreProps> = ({ Store }) => {
  const { board = [], isBoardRotated, botRunning, mated } = Store || {};

  const handleClick = (index: number) => {
    if (!botRunning && !mated) {
      Store?.onClickPiece?.(index);
    }
  };

  const renderTile = React.useCallback(
    (piece: IPieces, tileColor: string, index: number) => {
      return (
        <Tile
          key={index}
          icon={piece.icon}
          color={tileColor}
          className={isBoardRotated ? 'rotated' : ''}
          onClick={() => handleClick(index)}
        />
      );
    },
    [board, botRunning, mated, isBoardRotated]
  );

  const renderBoard = () =>
    Array.from({ length: ROW_SIZE }, (_, rowIndex) => (
      <div key={rowIndex} className="d-flex">
        {Array.from({ length: ROW_SIZE }, (_, colIndex) => {
          const index = rowIndex * ROW_SIZE + colIndex;
          const piece = board[index];
          const tileColor = calcSquareColor(rowIndex, colIndex, board);
          return renderTile(piece, tileColor, index);
        })}
      </div>
    ));

  return <div className="board-main">{renderBoard()}</div>;
};

export default inject('Store')(observer(Board));
