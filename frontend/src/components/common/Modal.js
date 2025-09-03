import React from 'react';

const Modal = ({ show, onHide, title, children, size = 'md', closeButton = true }) => {
  if (!show) return null;

  return (
    <div 
      className="modal fade show" 
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onHide}
    >
      <div 
        className={`modal-dialog modal-${size} modal-dialog-centered`}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-content">
          {(title || closeButton) && (
            <div className="modal-header">
              {title && <h5 className="modal-title">{title}</h5>}
              {closeButton && (
                <button
                  type="button"
                  className="btn-close"
                  onClick={onHide}
                  aria-label="Close"
                ></button>
              )}
            </div>
          )}
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;