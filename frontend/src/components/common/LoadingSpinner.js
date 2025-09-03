import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', centered = false }) => {
  const sizeClass = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  };

  const wrapperClass = centered ? 'd-flex justify-content-center align-items-center' : '';

  return (
    <div className={wrapperClass}>
      <div className={`spinner-border text-primary ${sizeClass[size]}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <span className="ms-2 text-muted">{text}</span>}
    </div>
  );
};

export const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center min-vh-100">
    <div className="text-center">
      <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted">Loading BimmerVIN...</p>
    </div>
  </div>
);

export const ButtonSpinner = ({ text = 'Processing...' }) => (
  <>
    <span className="spinner-border spinner-border-sm me-2" role="status">
      <span className="visually-hidden">Loading...</span>
    </span>
    {text}
  </>
);

export default LoadingSpinner;