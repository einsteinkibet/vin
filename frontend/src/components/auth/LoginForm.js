import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

const LoginForm = ({ onSwitchMode, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await dispatch(login(formData)).unwrap();
      toast.success('Login successful!');
      onSuccess?.();
    } catch (error) {
      toast.error(error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="card">
      <div className="card-body p-4">
        <h3 className="card-title text-center mb-4">Welcome Back</h3>
        
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
          
          <div className="mb-4">
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
            <div className="form-text">
              <a href="#forgot" onClick={() => onSwitchMode('forgot')}>
                Forgot password?
              </a>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="text-center mt-3">
          <span className="text-muted">Don't have an account? </span>
          <a href="#register" onClick={() => onSwitchMode('register')}>
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;