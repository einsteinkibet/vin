import React from 'react';
import VINHistory from '../../components/dashboard/VINHistory';

const HistoryPage = () => {
  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">VIN Lookup History</h1>
            <div>
              <button className="btn btn-outline-secondary me-2">
                <i className="fas fa-download me-2"></i>
                Export
              </button>
              <button className="btn btn-outline-danger">
                <i className="fas fa-trash me-2"></i>
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <VINHistory />
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;