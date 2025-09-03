import React from 'react';
import { useSelector } from 'react-redux';
import VINForm from '../components/vin-decoder/VINForm';
import BasicReport from '../components/vin-decoder/BasicReport';
import PremiumReport from '../components/vin-decoder/PremiumReport';
import LoadingSpinner from '../components/common/LoadingSpinner';

const VINDecoderPage = () => {
  const { currentVehicle, loading, error } = useSelector(state => state.vin);
  const { isAuthenticated, user } = useSelector(state => state.auth);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="fw-bold">BMW VIN Decoder</h1>
            <p className="lead text-muted">
              Decode any BMW VIN to get detailed vehicle information
            </p>
          </div>

          <VINForm />

          {loading && (
            <div className="text-center my-5">
              <LoadingSpinner size="lg" text="Decoding VIN..." centered />
            </div>
          )}

          {error && (
            <div className="alert alert-danger mt-4">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {currentVehicle && !loading && (
            <div className="mt-4">
              {user?.premium_status ? (
                <PremiumReport />
              ) : (
                <BasicReport />
              )}
            </div>
          )}

          {!currentVehicle && !loading && (
            <div className="text-center mt-5">
              <div className="card bg-light border-0">
                <div className="card-body py-5">
                  <i className="fas fa-search fa-3x text-muted mb-3"></i>
                  <h5>Ready to decode a VIN?</h5>
                  <p className="text-muted">
                    Enter a 17-character BMW VIN above to get started
                  </p>
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