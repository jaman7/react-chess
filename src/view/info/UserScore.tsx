import { inject, observer } from 'mobx-react';
import { useMemo } from 'react';
import { IStore } from 'store/Store.model';

interface IProps {
  isBot: boolean;
  Store?: IStore;
}

const UserScore: React.FC<IProps> = ({ Store, isBot = false }) => {
  const { getPlayersScore } = Store || {};

  const score = useMemo(() => {
    return getPlayersScore ? getPlayersScore[isBot ? 'bot' : 'user'] : 0;
  }, [isBot, getPlayersScore]);

  return (
    <div className="score">
      <span className="score__result">{score}</span>
    </div>
  );
};

export default inject('Store')(observer(UserScore));
