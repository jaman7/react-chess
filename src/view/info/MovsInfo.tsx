import { inject, observer } from 'mobx-react';
import { useEffect, useMemo, useRef } from 'react';
import { IMoves, IStore } from 'store/Store.model';

interface IProps {
  isBot: boolean;
  Store?: IStore;
}

const MovsInfo: React.FC<IProps> = ({ Store, isBot = false }) => {
  const { getHistoryturnMovs = {} } = Store || {};
  const containerRef = useRef<HTMLUListElement>(null);

  const data: IMoves[] = getHistoryturnMovs?.[isBot ? 'bot' : 'user'] ?? [];

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [data.length]);

  const dataPiecesMovs = useMemo(() => data?.map(el => el.pieceName)?.filter(Boolean) ?? [], [data.length]);
  const winBY = useMemo(() => data?.find(el => el.winBy)?.winBy ?? null, [data.length]);

  const createMoves = useMemo(() => {
    return data?.map((item, i) => (
      <li key={i}>
        <span>{i + 1}</span>
        <span>{item.pieceName}</span>
        <span>{item.startField}</span>
        <span>{item.endField}</span>
        {item.captured && <span>x {item.captured}</span>}
      </li>
    ));
  }, [data.length]);

  return (
    <div className="moves">
      <div className="moves-turn">Movs: {dataPiecesMovs?.length}</div>
      {winBY && <div className="moves-win">Win By: {winBY}</div>}
      <ul ref={containerRef}>{createMoves}</ul>
    </div>
  );
};

export default inject('Store')(observer(MovsInfo));
