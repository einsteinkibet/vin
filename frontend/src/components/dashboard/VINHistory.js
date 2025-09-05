import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { dashboardAPI } from '../../services/api';
import { toast } from 'react-toastify';

const VINHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    fetchHistory();
  }, []);


  const fetchHistory = async () => {
    try {
      const response = await dashboardAPI.getVINHistory();
      console.log('VIN History API Response:', response); // DEBUG
      console.log('Response data:', response.data); // DEBUG
      
      // Handle different response structures
      let historyData = response.data;
      
      // If response.data is an object with a results property
      if (response.data && response.data.results) {
        historyData = response.data.results;
      }
      // If response.data is an object with a history property  
      else if (response.data && response.data.history) {
        historyData = response.data.history;
      }
      // If response.data is already an array
      else if (Array.isArray(response.data)) {
        historyData = response.data;
      }
      // If it's something else, default to empty array
      else {
        console.warn('Unexpected API response format:', response.data);
        historyData = [];
      }
      
      setHistory(historyData);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load history');
      setHistory([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      // This would call a backend endpoint to clear history
      toast.info('Clear history feature coming soon!');
    } catch (error) {
      toast.error('Failed to clear history');
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
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          <i className="fas fa-history me-2"></i>
          VIN Lookup History
        </h5>
        <span className="badge bg-primary">{history.length} lookups</span>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>VIN</th>
                <th>Model</th>
                <th>Year</th>
                <th>Date</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td>
                    <code>{item.vehicle.vin}</code>
                  </td>
                  <td>{item.vehicle_model}</td>
                  <td>{item.vehicle.model_year}</td>
                  <td>{new Date(item.lookup_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${item.was_premium ? 'bg-success' : 'bg-secondary'}`}>
                      {item.was_premium ? 'Premium' : 'Basic'}
                    </span>
                  </td>
                  <td>
                    <a 
                      href={`/decode?vin=${item.vehicle.vin}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="fas fa-eye"></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {history.length === 0 && (
          <div className="text-center text-muted py-4">
            <i className="fas fa-search fa-3x mb-3"></i>
            <p>No VIN lookups yet</p>
            <a href="/decode" className="btn btn-primary">
              Decode Your First VIN
            </a>
          </div>
        )}

        {history.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <small className="text-muted">
              Showing {history.length} lookups
            </small>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={handleClearHistory}
            >
              <i className="fas fa-trash me-2"></i>
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VINHistory;