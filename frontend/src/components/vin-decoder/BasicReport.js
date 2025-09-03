import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const BasicReport = () => {
  const { currentVehicle } = useSelector(state => state.vin);
  const { isAuthenticated } = useSelector(state => state.auth);

  if (!currentVehicle) return null;

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">
          <i className="fas fa-car me-2"></i>
          Basic Vehicle Report
        </h4>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <h6 className="text-muted">Vehicle Information</h6>
            <dl className="row">
              <dt className="col-sm-4">VIN</dt>
              <dd className="col-sm-8">
                <code>{currentVehicle.vin}</code>
              </dd>

              <dt className="col-sm-4">Model</dt>
              <dd className="col-sm-8">{currentVehicle.model}</dd>

              <dt className="col-sm-4">Year</dt>
              <dd className="col-sm-8">{currentVehicle.model_year}</dd>

              <dt className="col-sm-4">Series</dt>
              <dd className="col-sm-8">{currentVehicle.series}</dd>

              <dt className="col-sm-4">Body Type</dt>
              <dd className="col-sm-8">{currentVehicle.body_type}</dd>
            </dl>
          </div>

          <div className="col-md-6">
            <h6 className="text-muted">Technical Specifications</h6>
            <dl className="row">
              <dt className="col-sm-4">Engine</dt>
              <dd className="col-sm-8">{currentVehicle.engine_code}</dd>

              <dt className="col-sm-4">Transmission</dt>
              <dd className="col-sm-8">{currentVehicle.transmission_type}</dd>

              <dt className="col-sm-4">Drive Type</dt>
              <dd className="col-sm-8">{currentVehicle.drive_type}</dd>

              <dt className="col-sm-4">Fuel Type</dt>
              <dd className="col-sm-8">{currentVehicle.fuel_type}</dd>
            </dl>
          </div>
        </div>

        <div className="alert alert-info mt-4">
          <div className="d-flex align-items-center">
            <i className="fas fa-lock me-3 fa-2x"></i>
            <div>
              <h6 className="mb-1">Unlock Full Vehicle Report</h6>
              <p className="mb-0">
                Get complete access to all factory options, detailed specifications, 
                production data, and premium features.
              </p>
              {isAuthenticated ? (
                <Link to="/pricing" className="btn btn-primary btn-sm mt-2">
                  Upgrade to Premium
                </Link>
              ) : (
                <Link to="/register" className="btn btn-primary btn-sm mt-2">
                  Sign Up for Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicReport;