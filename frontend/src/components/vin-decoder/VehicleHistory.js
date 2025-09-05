import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const VehicleHistory = () => {
  const { currentVehicle } = useSelector(state => state.vin);
  const [activeTab, setActiveTab] = useState('accidents');
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentVehicle) {
      fetchVehicleHistory(currentVehicle.vin);
    }
  }, [currentVehicle]);

  const fetchVehicleHistory = async (vin) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/vehicles/${vin}/history/`);
      setHistoryData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching vehicle history:', err);
      setError('Failed to load vehicle history data');
      // Fallback to mock data if API fails
      setHistoryData(getMockHistoryData());
    } finally {
      setLoading(false);
    }
  };

  const getMockHistoryData = () => {
    return {
      accidents: [
        {
          id: 1,
          date: '2023-05-15',
          type: 'collision',
          severity: 'moderate',
          description: 'Front-end collision, bumper and headlight replacement',
          damage: 4200,
          airbags: false,
          policeReport: true
        }
      ],
      owners: [
        {
          id: 1,
          number: 1,
          purchaseDate: '2020-01-15',
          saleDate: '2022-03-20',
          type: 'personal',
          location: 'California',
          milesPurchase: 15,
          milesSale: 24500
        },
        {
          id: 2,
          number: 2,
          purchaseDate: '2022-03-21',
          saleDate: null,
          type: 'lease',
          location: 'Texas',
          milesPurchase: 24500,
          milesSale: 38700
        }
      ],
      services: [
        {
          id: 1,
          date: '2020-05-15',
          type: 'oil',
          description: 'Synthetic oil change and filter replacement',
          mileage: 5000,
          cost: 120,
          center: 'BMW of Los Angeles'
        },
        {
          id: 2,
          date: '2021-02-10',
          type: 'brakes',
          description: 'Brake pad replacement and rotor resurfacing',
          mileage: 15000,
          cost: 450,
          center: 'BMW of Los Angeles'
        }
      ],
      recalls: [],
      titles: []
    };
  };

  const getAccidentSeverityBadge = (severity) => {
    const variants = {
      minor: 'bg-success',
      moderate: 'bg-warning',
      severe: 'bg-danger',
      total: 'bg-dark'
    };
    return <span className={`badge ${variants[severity]}`}>{severity}</span>;
  };

  if (loading) {
    return (
      <div className="card mt-4">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading vehicle history...</p>
        </div>
      </div>
    );
  }

  if (error && !historyData) {
    return (
      <div className="card mt-4">
        <div className="card-body text-center py-5 text-danger">
          <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card mt-4">
      <div className="card-header bg-dark text-white">
        <h5 className="mb-0">
          <i className="fas fa-history me-2"></i>
          Complete Vehicle History Report
        </h5>
      </div>
      
      <div className="card-body">
        {error && (
          <div className="alert alert-warning">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error} Showing sample data.
          </div>
        )}

        {/* Tab Navigation */}
        <ul className="nav nav-tabs nav-justified mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'accidents' ? 'active' : ''}`}
              onClick={() => setActiveTab('accidents')}
            >
              <i className="fas fa-car-crash me-2"></i>
              Accidents
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'owners' ? 'active' : ''}`}
              onClick={() => setActiveTab('owners')}
            >
              <i className="fas fa-users me-2"></i>
              Owners
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              <i className="fas fa-tools me-2"></i>
              Service History
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'recalls' ? 'active' : ''}`}
              onClick={() => setActiveTab('recalls')}
            >
              <i className="fas fa-exclamation-triangle me-2"></i>
              Recalls
            </button>
          </li>
        </ul>

        {/* Accidents Tab */}
        {activeTab === 'accidents' && (
          <div>
            <h6>Accident History</h6>
            {historyData.accidents.length === 0 ? (
              <div className="text-center text-muted py-4">
                <i className="fas fa-check-circle fa-2x text-success mb-2"></i>
                <p>No accidents reported</p>
              </div>
            ) : (
              historyData.accidents.map(accident => (
                <div key={accident.id} className="card mb-3 border-warning">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="card-title">
                          {new Date(accident.date).toLocaleDateString()} - 
                          {accident.type.charAt(0).toUpperCase() + accident.type.slice(1)}
                        </h6>
                        <p className="card-text">{accident.description}</p>
                        <div className="small text-muted">
                          {accident.airbags && <span className="badge bg-danger me-2">Airbags Deployed</span>}
                          {accident.policeReport && <span className="badge bg-info me-2">Police Report</span>}
                          {accident.damage && <span>Estimated Damage: ${accident.damage.toLocaleString()}</span>}
                        </div>
                      </div>
                      {getAccidentSeverityBadge(accident.severity)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Owners Tab */}
        {activeTab === 'owners' && (
          <div>
            <h6>Ownership History</h6>
            <div className="timeline">
              {historyData.owners.map(owner => (
                <div key={owner.id} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h6>{owner.number}{owner.number === 1 ? 'st' : owner.number === 2 ? 'nd' : owner.number === 3 ? 'rd' : 'th'} Owner</h6>
                    <p className="small text-muted mb-1">
                      {new Date(owner.purchaseDate).toLocaleDateString()} - 
                      {owner.saleDate ? new Date(owner.saleDate).toLocaleDateString() : 'Present'}
                    </p>
                    <p className="mb-1">{owner.type.charAt(0).toUpperCase() + owner.type.slice(1)} - {owner.location}</p>
                    <p className="small text-muted">
                      Mileage: {owner.milesPurchase?.toLocaleString()} - {owner.milesSale?.toLocaleString()} miles
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service History Tab */}
        {activeTab === 'services' && (
          <div>
            <h6>Service History</h6>
            {historyData.services.length === 0 ? (
              <div className="text-center text-muted py-4">
                <i className="fas fa-tools fa-2x mb-2"></i>
                <p>No service records found</p>
              </div>
            ) : (
              historyData.services.map(service => (
                <div key={service.id} className="card mb-2">
                  <div className="card-body py-3">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="card-title mb-1">
                          {new Date(service.date).toLocaleDateString()} - 
                          {service.type.replace('_', ' ').charAt(0).toUpperCase() + service.type.replace('_', ' ').slice(1)}
                      </h6>
                        <p className="card-text small mb-1">{service.description}</p>
                        <p className="small text-muted mb-0">
                          {service.mileage.toLocaleString()} miles • {service.center}
                          {service.cost && ` • $${service.cost}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Recalls Tab */}
        {activeTab === 'recalls' && (
          <div>
            <h6>Recall History</h6>
            {historyData.recalls.length === 0 ? (
              <div className="text-center text-muted py-4">
                <i className="fas fa-check-circle fa-2x text-success mb-2"></i>
                <p>No recall campaigns for this vehicle</p>
              </div>
            ) : (
              historyData.recalls.map(recall => (
                <div key={recall.id} className="card mb-3 border-danger">
                  <div className="card-body">
                    <h6 className="card-title text-danger">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {recall.component}
                    </h6>
                    <p className="card-text">{recall.description}</p>
                    <div className="small">
                      <strong>NHTSA Campaign:</strong> {recall.nhtsa_campaign_number}<br/>
                      <strong>Date:</strong> {new Date(recall.recall_date).toLocaleDateString()}<br/>
                      <strong>Status:</strong> <span className={`badge ${recall.status === 'open' ? 'bg-warning' : 'bg-success'}`}>
                        {recall.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleHistory;