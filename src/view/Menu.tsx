import Button, { IButtonComponent } from 'components/Button';
import { inject, observer } from 'mobx-react';
import { useMemo } from 'react';
import { ColorsPieces } from 'store/store.constance';
import { IStoreProps } from 'store/Store.model';
import GameLevel from './GameLevel/GameLevel';

const { WHITE, BLACK } = ColorsPieces;

const Menu: React.FC<IStoreProps> = inject('Store')(
  observer(({ Store }: IStoreProps) => {
    const { gameStarted, isBoardRotated, disableStartBeforeReset = false } = Store || {};

    const defaultButtons: IButtonComponent[] = useMemo(
      () => [
        {
          name: gameStarted ? 'buttons.stop' : 'buttons.start',
          key: gameStarted ? 'STOP' : 'START',
          customClass: 'flat filled mr-2',
          handleClick: () => (gameStarted ? Store?.setStopGame?.() : Store?.setStartGame?.()),
          disabled: disableStartBeforeReset,
        },
        {
          name: 'buttons.reset',
          key: 'RESET',
          customClass: 'filled',
          handleClick: () => Store?.reset?.(),
          disabled: gameStarted,
        },
        {
          name: isBoardRotated ? 'buttons.whiteChoose' : 'buttons.blackChoose',
          key: isBoardRotated ? BLACK : WHITE,
          customClass: 'filled',
          handleClick: () => Store?.setUserPlayerColor?.(),
          disabled: gameStarted,
        },
      ],
      [gameStarted, isBoardRotated, disableStartBeforeReset]
    );

    return (
      <div className="menu">
        <Button buttonsConfig={defaultButtons} />
        <GameLevel />
      </div>
    );
  })
);

export default Menu;
