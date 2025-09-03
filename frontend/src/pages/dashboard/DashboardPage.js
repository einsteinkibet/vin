import React from 'react';
import { useSelector } from 'react-redux';
import UsageStats from '../../components/dashboard/UsageStats';
import VINHistory from '../../components/dashboard/VINHistory';
import SavedVehicles from '../../components/dashboard/SavedVehicles';

const DashboardPage = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Dashboard</h1>
            <span className={`badge ${user.premium_status ? 'bg-success' : 'bg-secondary'}`}>
              {user.premium_status ? 'Premium Account' : 'Free Account'}
            </span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-3 text-center">
                  <i className="fas fa-search fa-2x text-primary"></i>
                </div>
                <div className="col-9">
                  <h6 className="text-muted mb-1">Total Lookups</h6>
                  <h4 className="mb-0">47</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-3 text-center">
                  <i className="fas fa-crown fa-2x text-success"></i>
                </div>
                <div className="col-9">
                  <h6 className="text-muted mb-1">Premium Reports</h6>
                  <h4 className="mb-0">32</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-3 text-center">
                  <i className="fas fa-bookmark fa-2x text-info"></i>
                </div>
                <div className="col-9">
                  <h6 className="text-muted mb-1">Saved Vehicles</h6>
                  <h4 className="mb-0">5</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-4 mb-4">
          <UsageStats />
        </div>
        <div className="col-xl-8 mb-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Quick Actions</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-4">
                  <a href="/decode" className="text-decoration-none">
                    <div className="p-3 border rounded">
                      <i className="fas fa-search fa-2x text-primary mb-2"></i>
                      <div className="small">Decode VIN</div>
                    </div>
                  </a>
                </div>
                <div className="col-4">
                  <a href="/history" className="text-decoration-none">
                    <div className="p-3 border rounded">
                      <i className="fas fa-history fa-2x text-success mb-2"></i>
                      <div className="small">View History</div>
                    </div>
                  </a>
                </div>
                <div className="col-4">
                  <a href="/pricing" className="text-decoration-none">
                    <div className="p-3 border rounded">
                      <i className="fas fa-crown fa-2x text-warning mb-2"></i>
                      <div className="small">Upgrade</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <VINHistory />
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <SavedVehicles />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;