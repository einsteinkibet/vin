import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <RegisterForm 
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

export default RegisterPage;