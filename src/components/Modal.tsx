import { ReactNode } from 'react';
import Button from './Button';
import { IoClose } from 'react-icons/io5';

export interface IModal {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const Modal: React.FC<IModal> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header__title">{title}</div>
          <Button round={true} customClass="small" handleClick={onClose}>
            <IoClose />
          </Button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
