import LazyImage from 'components/LazyImage';

interface SquareProps {
  name: string | null;
  color: string;
  cursor: string;
  className?: string;
  onClick: () => void;
}

const Tile: React.FC<SquareProps> = ({ name, color, cursor, className, onClick }) => (
  <div className={`tile ${color} ${className} ${cursor}`} onClick={onClick}>
    {name ? <LazyImage className="piece" src={`img/${name?.toLowerCase()}.png`} alt={name?.toLowerCase()} /> : <></>}
  </div>
);

export default Tile;
