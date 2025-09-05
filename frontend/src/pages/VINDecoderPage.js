import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import VINForm from '../components/vin-decoder/VINForm';
import BasicReport from '../components/vin-decoder/BasicReport';
import PremiumReport from '../components/vin-decoder/PremiumReport';
import { decodeVIN } from '../redux/slices/vinSlice';

const VINDecoderPage = () => {
  const { currentVehicle, loading, error } = useSelector(state => state.vin);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  // Add retry function for better reliability
  const handleRetry = () => {
    if (currentVehicle?.vin) {
      dispatch(decodeVIN(currentVehicle.vin));
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="text-center mb-5">
            <h1 className="fw-bold text-primary">BMW VIN Decoder</h1>
            <p className="lead text-muted">
              Get detailed vehicle information for any BMW
            </p>
          </div>

          <VINForm />

          {loading && (
            <div className="text-center my-5 py-4">
              <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Decoding your BMW VIN...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger mt-4">
              <div className="d-flex align-items-center">
                <i className="fas fa-exclamation-triangle fa-2x me-3"></i>
                <div>
                  <h6 className="alert-heading">Decoding Failed</h6>
                  <p className="mb-2">{error}</p>
                  <button className="btn btn-sm btn-outline-danger" onClick={handleRetry}>
                    <i className="fas fa-redo me-1"></i>
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentVehicle && !loading && (
            <div className="mt-4 fade-in">
              {user?.premium_status ? (
                <PremiumReport />
              ) : (
                <BasicReport />
              )}
            </div>
          )}

          {/* Empty state with guidance */}
          {!currentVehicle && !loading && !error && (
            <div className="text-center mt-5">
              <div className="card bg-light border-0">
                <div className="card-body py-5">
                  <i className="fas fa-car fa-3x text-muted mb-3"></i>
                  <h5>Ready to decode a BMW VIN?</h5>
                  <p className="text-muted mb-3">
                    Enter a 17-character BMW VIN above to get started
                  </p>
                  <div className="row text-start">
                    <div className="col-md-6">
                      <h6>Where to find your VIN:</h6>
                      <ul className="small text-muted">
                        <li>Driver's side dashboard</li>
                        <li>Driver's side door jamb</li>
                        <li>Vehicle registration documents</li>
                        <li>Insurance documents</li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <h6>BMW VIN Examples:</h6>
                      <ul className="small text-muted">
                        <li><code>WBA7E2C30FG123456</code> - 3 Series</li>
                        <li><code>WBS6S9C59J5E12345</code> - M Series</li>
                        <li><code>WBX7S1C58J5E12345</code> - X Series</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VINDecoderPage;