interface SquareProps {
  icon: JSX.Element | null;
  color: string;
  className?: string;
  onClick: () => void;
}

const Tile: React.FC<SquareProps> = ({ icon, color, className, onClick }) => (
  <div className={`tile ${color} ${className}`} onClick={onClick}>
    {icon ?? ''}
  </div>
);

export default Tile;
