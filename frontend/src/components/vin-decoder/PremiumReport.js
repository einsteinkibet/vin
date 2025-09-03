import React from 'react';
import { useSelector } from 'react-redux';
import VehicleImage from './VehicleImage';
import OptionsList from './OptionsList';
import Specifications from './Specifications';

const PremiumReport = () => {
  const { currentVehicle } = useSelector(state => state.vin);

  if (!currentVehicle) return null;

  return (
    <div className="card">
      <div className="card-header bg-success text-white">
        <h4 className="mb-0">
          <i className="fas fa-crown me-2"></i>
          Premium Vehicle Report
        </h4>
      </div>
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-4">
            <VehicleImage vehicle={currentVehicle} />
          </div>
          <div className="col-md-8">
            <h3 className="mb-3">{currentVehicle.model} ({currentVehicle.model_year})</h3>
            <div className="row">
              <div className="col-6">
                <strong>VIN:</strong> <code>{currentVehicle.vin}</code>
              </div>
              <div className="col-6">
                <strong>Series:</strong> {currentVehicle.series}
              </div>
              <div className="col-6">
                <strong>Production Date:</strong> {currentVehicle.production_date}
              </div>
              <div className="col-6">
                <strong>Assembly Plant:</strong> {currentVehicle.assembly_plant}
              </div>
            </div>
          </div>
        </div>

        <Specifications vehicle={currentVehicle} />
        
        <OptionsList vehicle={currentVehicle} />

        <div className="mt-4">
          <h5>Additional Information</h5>
          <div className="row">
            <div className="col-md-6">
              <strong>Data Source:</strong> {currentVehicle.data_source}
            </div>
            <div className="col-md-6">
              <strong>Data Confidence:</strong> 
              <div className="progress mt-1" style={{height: '8px'}}>
                <div 
                  className="progress-bar bg-success" 
                  style={{width: `${currentVehicle.data_confidence * 100}%`}}
                ></div>
              </div>
              <small className="text-muted">
                {(currentVehicle.data_confidence * 100).toFixed(1)}% accuracy
              </small>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button className="btn btn-outline-primary me-2">
            <i className="fas fa-download me-2"></i>
            Download PDF Report
          </button>
          <button className="btn btn-outline-secondary">
            <i className="fas fa-share-alt me-2"></i>
            Share Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumReport;