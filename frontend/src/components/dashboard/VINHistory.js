import React from 'react';
import { useSelector } from 'react-redux';

const VINHistory = () => {
  const { user } = useSelector(state => state.auth);
  // Mock history data - would come from API
  const history = [
    { vin: 'WBA7E2C30FG123456', model: '330i', year: 2023, date: '2024-01-15', premium: true },
    { vin: 'WBA5E5C57FD567890', model: 'X5', year: 2022, date: '2024-01-10', premium: false },
    { vin: 'WBA3B1C58JF789012', model: 'M3', year: 2024, date: '2024-01-05', premium: true },
    { vin: 'WBA8E9C52JG345678', model: '540i', year: 2023, date: '2023-12-28', premium: true }
  ];

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
                    <code>{item.vin}</code>
                  </td>
                  <td>{item.model}</td>
                  <td>{item.year}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${item.premium ? 'bg-success' : 'bg-secondary'}`}>
                      {item.premium ? 'Premium' : 'Basic'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary">
                      <i className="fas fa-eye"></i>
                    </button>
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
              Showing {history.length} of {history.length} lookups
            </small>
            <button className="btn btn-sm btn-outline-secondary">
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VINHistory;