import React from 'react';

const SavedVehicles = () => {
  // Mock saved vehicles data - would come from API
  const savedVehicles = [
    { 
      vin: 'WBA7E2C30FG123456', 
      model: '330i', 
      year: 2023, 
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      lastViewed: '2024-01-15'
    },
    { 
      vin: 'WBA5E5C57FD567890', 
      model: 'X5', 
      year: 2022,
      image: 'https://images.unsplash.com/photo-1549399542-7e82138ccf10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      lastViewed: '2024-01-10'
    }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="fas fa-bookmark me-2"></i>
          Saved Vehicles
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          {savedVehicles.map((vehicle, index) => (
            <div key={index} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="position-relative">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.model}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="position-absolute top-0 end-0 m-2">
                    <button className="btn btn-sm btn-light">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <h6 className="card-title">{vehicle.model} ({vehicle.year})</h6>
                  <p className="card-text">
                    <small className="text-muted">
                      VIN: <code>{vehicle.vin}</code>
                    </small>
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      Last viewed: {new Date(vehicle.lastViewed).toLocaleDateString()}
                    </small>
                  </p>
                </div>
                <div className="card-footer bg-transparent">
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary flex-fill">
                      <i className="fas fa-eye me-1"></i>
                      View
                    </button>
                    <button className="btn btn-sm btn-outline-secondary">
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {savedVehicles.length === 0 && (
          <div className="text-center text-muted py-4">
            <i className="fas fa-bookmark fa-3x mb-3"></i>
            <p>No saved vehicles yet</p>
            <p className="small">
              Save vehicles to access them quickly later
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedVehicles;