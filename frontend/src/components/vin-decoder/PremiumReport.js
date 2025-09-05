import React from 'react';
import { useSelector } from 'react-redux';
import VehicleImage from './VehicleImage';
import OptionsList from './OptionsList';
import Specifications from './Specifications';
import VehicleHistory from './VehicleHistory';

const PremiumReport = () => {
  const { currentVehicle } = useSelector(state => state.vin);

  return (
    <div className="card">
      <div className="card-header bg-success text-white">
        <h4 className="mb-0">
          <i className="fas fa-crown me-2"></i>
          Premium Vehicle Report
        </h4>
      </div>
      
      <div className="card-body">
        {/* Vehicle Header */}
        <div className="row mb-4">
          <div className="col-md-4">
            <VehicleImage vehicle={currentVehicle} />
          </div>
          <div className="col-md-8">
            <h2 className="text-primary">{currentVehicle.model}</h2>
            <div className="row mt-3">
              <div className="col-6">
                <strong>VIN:</strong> <code>{currentVehicle.vin}</code>
              </div>
              <div className="col-6">
                <strong>Year:</strong> {currentVehicle.model_year}
              </div>
              <div className="col-6">
                <strong>Series:</strong> {currentVehicle.series}
              </div>
              <div className="col-6">
                <strong>Production:</strong> {currentVehicle.assembly_plant}
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Engine & Performance</h6>
              </div>
              <div className="card-body">
                <SpecificationItem label="Engine Code" value={currentVehicle.engine_code} />
                <SpecificationItem label="Horsepower" value={currentVehicle.horsepower ? `${currentVehicle.horsepower} HP` : 'N/A'} />
                <SpecificationItem label="Transmission" value={currentVehicle.transmission_type} />
                <SpecificationItem label="Drive Type" value={currentVehicle.drive_type} />
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Vehicle Details</h6>
              </div>
              <div className="card-body">
                <SpecificationItem label="Body Type" value={currentVehicle.body_type} />
                <SpecificationItem label="Fuel Type" value={currentVehicle.fuel_type} />
                <SpecificationItem label="Data Source" value={currentVehicle.data_source} />
                <SpecificationItem label="Confidence" 
                  value={(
                    <div className="progress" style={{height: '8px'}}>
                      <div className="progress-bar bg-success" 
                           style={{width: `${currentVehicle.data_confidence * 100}%`}}>
                      </div>
                    </div>
                  )} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Factory Options */}
        <OptionsList vehicle={currentVehicle} />
        
        {/* Vehicle History - NEW SECTION */}
        <VehicleHistory />
        
        {/* Action Buttons */}
        <div className="text-center mt-4">
          <button className="btn btn-primary">
            <i className="fas fa-download me-2"></i>
            Download PDF Report
          </button>
          <button className="btn btn-outline-primary ms-2">
            <i className="fas fa-bookmark me-2"></i>
            Save Vehicle
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper component for specs
const SpecificationItem = ({ label, value }) => (
  <div className="d-flex justify-content-between py-2 border-bottom">
    <span className="text-muted">{label}:</span>
    <strong>{value}</strong>
  </div>
);

export default PremiumReport;