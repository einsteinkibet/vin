import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

const RegisterForm = ({ onSwitchMode, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',  // Change to underscore
    marketing_consent: false  // Change to underscore
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirm) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      await dispatch(register(formData)).unwrap();
      toast.success('Registration successful! Welcome to BimmerVIN!');
      onSuccess?.();
    } catch (error) {
      toast.error(error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  return (
    <div className="card">
      <div className="card-body p-4">
        <h3 className="card-title text-center mb-4">Create Account</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="passwordConfirm" className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="password_confirm"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="mb-4 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="marketingConsent"
              name="marketingConsent"
              checked={formData.marketing_consent}
              onChange={handleChange}
              disabled={loading}
            />
            <label className="form-check-label" htmlFor="marketingConsent">
              I want to receive marketing promotions and updates
            </label>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <div className="text-center mt-3">
          <span className="text-muted">Already have an account? </span>
          <a href="#login" onClick={() => onSwitchMode('login')}>
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;