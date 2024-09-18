import { useEffect, useRef, useState } from 'react';
import { formatTime } from 'utils';

interface IProps {
  isGameStarted?: boolean;
  isActivePlayer?: boolean;
}

const ChessClock: React.FC<IProps> = ({ isActivePlayer, isGameStarted }: IProps) => {
  const [time, setTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isGameStarted && isActivePlayer) {
      timerRef.current = setInterval(() => setTime(prevTime => prevTime + 1), 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameStarted, isActivePlayer]);

  useEffect(() => {
    if (!isGameStarted) {
      setTime(0);
    }
  }, [isGameStarted]);

  return <span>{formatTime(time)}</span>;
};

export default ChessClock;
