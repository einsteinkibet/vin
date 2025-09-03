import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { dashboardAPI } from '../../services/api';
import { toast } from 'react-toastify';

const SavedVehicles = () => {
  const [savedVehicles, setSavedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    fetchSavedVehicles();
  }, []);

  const fetchSavedVehicles = async () => {
    try {
      const response = await dashboardAPI.getSavedVehicles();
      setSavedVehicles(response.data);
    } catch (error) {
      toast.error('Failed to load saved vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVehicle = async (vin) => {
    try {
      // This would call a backend endpoint to remove from saved
      toast.info('Remove feature coming soon!');
    } catch (error) {
      toast.error('Failed to remove vehicle');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

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
          {savedVehicles.map((historyItem, index) => (
            <div key={index} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="position-relative">
                  <img 
                    src={`https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80`} 
                    alt={historyItem.vehicle_model}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="position-absolute top-0 end-0 m-2">
                    <button 
                      className="btn btn-sm btn-light"
                      onClick={() => handleRemoveVehicle(historyItem.vehicle.vin)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <h6 className="card-title">{historyItem.vehicle_model} ({historyItem.vehicle.model_year})</h6>
                  <p className="card-text">
                    <small className="text-muted">
                      VIN: <code>{historyItem.vehicle.vin}</code>
                    </small>
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      Last viewed: {new Date(historyItem.lookup_date).toLocaleDateString()}
                    </small>
                  </p>
                  <span className={`badge ${historyItem.was_premium ? 'bg-success' : 'bg-secondary'}`}>
                    {historyItem.was_premium ? 'Premium Report' : 'Basic Report'}
                  </span>
                </div>
                <div className="card-footer bg-transparent">
                  <div className="d-flex gap-2">
                    <a 
                      href={`/decode?vin=${historyItem.vehicle.vin}`}
                      className="btn btn-sm btn-outline-primary flex-fill"
                    >
                      <i className="fas fa-eye me-1"></i>
                      View Again
                    </a>
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
              Decode VINs to save them here for quick access
            </p>
            <a href="/decode" className="btn btn-primary btn-sm">
              Decode Your First VIN
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedVehicles;