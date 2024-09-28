interface IProps {
  lists: number[] | string[];
  isBoardRotated: boolean;
}

const BoardLegend: React.FC<IProps> = ({ lists, isBoardRotated }: IProps) => {
  const renderRowColNums = () => {
    return lists?.map(el => {
      const classNameOfSize = typeof el === 'number' ? 'w-20 label-height' : 'h-20 label-width';
      return (
        <span key={el} className={`label ${classNameOfSize} ${isBoardRotated ? 'rotated' : ''}`}>
          {el}
        </span>
      );
    });
  };

  return renderRowColNums();
};

export default BoardLegend;
