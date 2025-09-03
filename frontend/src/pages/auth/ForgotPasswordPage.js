import React from 'react';
import ForgotPassword from '../../components/auth/ForgotPassword';

const ForgotPasswordPage = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <ForgotPassword 
            onSwitchMode={(mode) => {
              console.log('Switch to:', mode);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;