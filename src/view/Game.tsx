import { LETTERS, NUMS } from 'store/store.constance';
import BoardLegend from './BoardLegend';
import Board from './Board';
import PlayerInfo from './info/PlayerInfo';
import Menu from './Menu';
import { inject, observer } from 'mobx-react';
import { IStoreProps } from 'store/Store.model';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { GameTranslate } from './game.enum';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import Loader from 'components/Loader';

const Modal = lazy(() => import('components/Modal'));

const Game: React.FC<IStoreProps> = ({ Store }) => {
  const { t } = useTranslation();

  const { isBoardRotated, getWinnerTurnBot, getWinnerTurnUser, mated, isGameStarted, setNewGameInTurn } = Store || {};

  const [modalState, setModalState] = useState({
    isModalOpen: false,
    winner: null as string | null,
  });

  const [hasModalBeenShown, setHasModalBeenShown] = useState(false);

  const handleCloseModal = useCallback(() => {
    setModalState({ isModalOpen: false, winner: null });
    setHasModalBeenShown(false);
    Store?.setStopGame?.();
  }, []);

  const handleNextGame = useCallback(() => {
    setModalState({ isModalOpen: false, winner: null });
    setHasModalBeenShown(false);
    Store?.setNewGameInTurn?.();
  }, [setNewGameInTurn]);

  const determineWinner = useMemo(() => {
    if (mated && isGameStarted && (getWinnerTurnUser || getWinnerTurnBot)) {
      return getWinnerTurnUser ? 'user' : 'bot';
    }
    return null;
  }, [mated, getWinnerTurnUser, getWinnerTurnBot, isGameStarted]);

  useEffect(() => {
    if (determineWinner && determineWinner !== modalState.winner && !hasModalBeenShown) {
      setModalState({ isModalOpen: true, winner: determineWinner });
      setHasModalBeenShown(true);
    } else if (!mated && modalState.isModalOpen) {
      handleCloseModal();
    }
  }, [determineWinner, mated]);

  const boardLegend = useMemo(
    () => (
      <>
        <div className="col_label label-margin">
          <BoardLegend lists={LETTERS} isBoardRotated={!!isBoardRotated} />
        </div>
        <div className="d-flex">
          <div className="row_label">
            <BoardLegend lists={NUMS} isBoardRotated={!!isBoardRotated} />
          </div>
          <Board />
          <div className="row_label">
            <BoardLegend lists={NUMS} isBoardRotated={!!isBoardRotated} />
          </div>
        </div>
        <div className="col_label label-margin">
          <BoardLegend lists={LETTERS} isBoardRotated={!!isBoardRotated} />
        </div>
      </>
    ),
    [isBoardRotated]
  );

  return (
    <>
      <Menu />

      <div className="main">
        <PlayerInfo isBot={false} />
        <div className={`board ${isBoardRotated ? 'rotated' : ''}`}>{boardLegend}</div>
        <PlayerInfo isBot={true} />
      </div>

      <Suspense fallback={<Loader />}>
        <Modal isOpen={modalState.isModalOpen} onClose={handleCloseModal}>
          <>
            {modalState.winner === 'user' && <h2 className="green">{t(GameTranslate.WIN)}</h2>}
            {modalState.winner === 'bot' && <h2 className="red">{t(GameTranslate.LOST)}</h2>}
            <p>{t(GameTranslate.NEXT_GAME)}</p>
            <div className="d-flex justify-content-center">
              <Button name={GameTranslate.YES} customClass="filled flat" handleClick={handleNextGame} />
              <Button name={GameTranslate.NO} customClass="filled flat ms-3" handleClick={handleCloseModal} />
            </div>
          </>
        </Modal>
      </Suspense>
    </>
  );
};

export default inject('Store')(observer(Game));
