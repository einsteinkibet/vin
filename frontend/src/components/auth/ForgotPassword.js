import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ForgotPassword = ({ onSwitchMode }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password reset instructions sent to your email');
      setEmail('');
    } catch (error) {
      toast.error('Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body p-4">
        <h3 className="card-title text-center mb-4">Reset Password</h3>
        <p className="text-muted text-center mb-4">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Sending...
              </>
            ) : (
              'Send Reset Instructions'
            )}
          </button>
        </form>
        
        <div className="text-center mt-3">
          <a href="#login" onClick={() => onSwitchMode('login')}>
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;