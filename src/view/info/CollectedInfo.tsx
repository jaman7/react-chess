import LazyImage from 'components/LazyImage';
import { inject, observer } from 'mobx-react';
import { IStore, TypePieceName } from 'store/Store.model';

interface IProps {
  isBot: boolean;
  Store?: IStore;
}

const CollectedInfo: React.FC<IProps> = ({ Store, isBot = false }) => {
  const { getHistoryturnMovs = {} } = Store || {};

  const createCollected = (): JSX.Element | JSX.Element[] => {
    const data: TypePieceName[] = (getHistoryturnMovs?.[isBot ? 'bot' : 'user']?.map(move => move.captured)?.filter(item => item) ??
      []) as TypePieceName[];
    return (
      <>
        {data.map((el, i) => (
          <LazyImage key={`${i}-${el}`} src={`img/${el.toLowerCase()}.png`} alt={el.toLowerCase()} />
        ))}
      </>
    );
  };

  return <div className="collected">{createCollected()}</div>;
};

export default inject('Store')(observer(CollectedInfo));
