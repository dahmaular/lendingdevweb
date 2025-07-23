import React from "react";
import "./Modal.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
}) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {title && <div className="modal-title">{title}</div>}
        <div className="modal-body">{children}</div>
        {actions && <div className="modal-actions">{actions}</div>}
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
      </div>
    </div>
  );
};

export default Modal;
