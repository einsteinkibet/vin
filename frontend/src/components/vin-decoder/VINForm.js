import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { decodeVIN } from '../../redux/slices/vinSlice';
import { toast } from 'react-toastify';

const VINForm = () => {
  const [vin, setVin] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!vin || vin.length !== 17) {
      toast.error('Please enter a valid 17-character VIN');
      return;
    }

    setLoading(true);
    
    try {
      await dispatch(decodeVIN(vin)).unwrap();
      toast.success('VIN decoded successfully!');
    } catch (error) {
      toast.error(error || 'Failed to decode VIN');
    } finally {
      setLoading(false);
    }
  };

  const handleExampleVIN = () => {
    setVin('WBA7E2C30FG123456'); // Example BMW VIN
  };

  return (
    <div className="card">
      <div className="card-body p-4">
        <h2 className="card-title text-center mb-4">
          <i className="fas fa-search me-2"></i>
          Decode Your BMW VIN
        </h2>
        
        <p className="text-center text-muted mb-4">
          Enter your 17-character BMW VIN to get detailed vehicle information, 
          specifications, and factory options.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="vin" className="form-label fw-bold">
              Vehicle Identification Number (VIN)
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="vin"
              placeholder="e.g., WBA7E2C30FG123456"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              maxLength={17}
              disabled={loading}
              style={{ fontFamily: 'monospace', letterSpacing: '1px' }}
            />
            <div className="form-text">
              The VIN is 17 characters long and can be found on your vehicle's dashboard or door jamb.
            </div>
          </div>

          <div className="d-grid gap-2">
            <button 
              type="submit" 
              className="btn btn-primary btn-lg"
              disabled={loading || vin.length !== 17}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Decoding...
                </>
              ) : (
                <>
                  <i className="fas fa-bolt me-2"></i>
                  Decode VIN
                </>
              )}
            </button>
            
            <button 
              type="button" 
              className="btn btn-outline-secondary"
              onClick={handleExampleVIN}
              disabled={loading}
            >
              <i className="fas fa-eye me-2"></i>
              View Example
            </button>
          </div>
        </form>

        {!isAuthenticated && (
          <div className="alert alert-info mt-4">
            <div className="d-flex align-items-center">
              <i className="fas fa-info-circle me-2"></i>
              <div>
                <strong>Free account required:</strong> Sign up to decode unlimited VINs 
                and access premium features.
              </div>
            </div>
          </div>
        )}

        {isAuthenticated && !user.premium_status && (
          <div className="alert alert-warning mt-4">
            <div className="d-flex align-items-center">
              <i className="fas fa-crown me-2"></i>
              <div>
                <strong>Upgrade to Premium:</strong> Unlock detailed vehicle reports, 
                option packages, and full specifications.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VINForm;