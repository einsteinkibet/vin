import React from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

const AuthModal = ({ show, onHide, mode = 'login', onSwitchMode }) => {
  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm 
            onSwitchMode={onSwitchMode} 
            onSuccess={onHide}
          />
        );
      case 'register':
        return (
          <RegisterForm 
            onSwitchMode={onSwitchMode} 
            onSuccess={onHide}
          />
        );
      case 'forgot':
        return <ForgotPassword onSwitchMode={onSwitchMode} />;
      case 'reset':
        return <ResetPassword onSwitchMode={onSwitchMode} />;
      default:
        return null;
    }
  };

  return (
    <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
            ></button>
          </div>
          <div className="modal-body">
            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;