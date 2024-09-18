import React, { useMemo } from 'react';
import { inject, observer } from 'mobx-react';
import LazyImage from 'components/LazyImage';
import { IStore, TypeColor } from 'store/Store.model';
import { isSamePlayer, isWhite } from 'utils';
import ChessClock from './ChessClock';
import classNames from 'classnames';
import CollectedInfo from './CollectedInfo';
import MovsInfo from './MovsInfo';
import { PiecesNames } from 'store/store.constance';
import UserScore from './UserScore';

const { KING_WHITE, KING_BLACK } = PiecesNames;

interface IProps {
  Store?: IStore;
  isBot: boolean;
}

const PlayerInfo: React.FC<IProps> = ({ Store, isBot = false }) => {
  const { botRunning, gameStarted, mated, userColor, botColor, currentPlayer } = Store || {};

  const color = (isBot ? botColor : userColor) as TypeColor;

  const isActivePlayer = useMemo(
    () => gameStarted && !mated && isSamePlayer(color, currentPlayer as TypeColor) && !botRunning,
    [gameStarted, mated, color, currentPlayer, botRunning]
  );

  const userAvatarImgName = !isBot ? 'user-white' : 'user-black';

  const playerInfoClassName = classNames('player-info', {
    info1: !isBot,
    info2: isBot,
  });

  const createAvatar = (): JSX.Element => {
    const userClassName = classNames('user', {
      end: isBot,
      active: isActivePlayer && !mated,
    });

    const userInfoClassName = classNames('user-info', {
      reverse: !isBot,
    });

    const kingName = (isWhite(color) ? KING_WHITE : KING_BLACK).toLowerCase();

    return (
      <div className={userClassName}>
        <LazyImage className="avatar" src={`img/${userAvatarImgName}.png`} alt="userAvatarImgName" />
        <span className="user-info__name">{!isBot ? 'You' : 'Bot'}</span>
        <LazyImage className="user-info__piece" src={`img/${kingName}.png`} alt={kingName} />
        <div className={userInfoClassName}>
          <span className="user-info__time">
            <ChessClock isActivePlayer={isActivePlayer} isGameStarted={gameStarted as boolean} />
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={playerInfoClassName}>
      {createAvatar()}

      <div className="col">
        <UserScore isBot={isBot} />
        <CollectedInfo isBot={isBot} />
        <MovsInfo isBot={isBot} />
      </div>
    </div>
  );
};

export default inject('Store')(observer(PlayerInfo));
