import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <LoginForm 
            onSwitchMode={(mode) => {
              window.location.href = `/${mode}`;
            }}
            onSuccess={() => {
              window.location.href = '/dashboard';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;