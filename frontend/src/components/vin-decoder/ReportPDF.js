import React from 'react';
import { useSelector } from 'react-redux';

const ReportPDF = () => {
  const { currentVehicle } = useSelector(state => state.vin);

  const downloadPDF = () => {
    // This would generate and download a PDF report
    toast.info('PDF download feature coming soon!');
  };

  if (!currentVehicle) return null;

  return (
    <div className="card">
      <div className="card-header">
        <h6 className="mb-0">
          <i className="fas fa-file-pdf me-2 text-danger"></i>
          PDF Report
        </h6>
      </div>
      <div className="card-body">
        <p className="text-muted">
          Download a beautiful PDF report of your vehicle information that you can 
          save, print, or share with others.
        </p>
        
        <div className="row text-center">
          <div className="col-4">
            <div className="border rounded p-3">
              <i className="fas fa-print fa-2x text-primary mb-2"></i>
              <div className="small">Printable</div>
            </div>
          </div>
          <div className="col-4">
            <div className="border rounded p-3">
              <i className="fas fa-save fa-2x text-success mb-2"></i>
              <div className="small">Saveable</div>
            </div>
          </div>
          <div className="col-4">
            <div className="border rounded p-3">
              <i className="fas fa-share-alt fa-2x text-info mb-2"></i>
              <div className="small">Shareable</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-danger" onClick={downloadPDF}>
            <i className="fas fa-download me-2"></i>
            Download PDF Report
          </button>
        </div>

        <div className="mt-3 text-center">
          <small className="text-muted">
            Includes all vehicle details, specifications, and option codes
          </small>
        </div>
      </div>
    </div>
  );
};

export default ReportPDF;