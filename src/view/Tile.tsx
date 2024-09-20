interface SquareProps {
  icon: JSX.Element | null;
  color: string;
  cursor: string;
  className?: string;
  onClick: () => void;
}

const Tile: React.FC<SquareProps> = ({ icon, color, cursor, className, onClick }) => (
  <div className={`tile ${color} ${className} ${cursor}`} onClick={onClick}>
    {icon ?? ''}
  </div>
);

export default Tile;
