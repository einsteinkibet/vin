import React from 'react';
import { useSelector } from 'react-redux';

const UsageStats = () => {
  const { user } = useSelector(state => state.auth);
  
  // Mock usage data - would come from API
  const usageData = {
    totalLookups: 47,
    premiumLookups: 32,
    monthlyLimit: user.premium_status ? 'Unlimited' : 5,
    lookupsThisMonth: user.premium_status ? 18 : 3,
    apiCalls: 124,
    savedVehicles: 2
  };

  const getUsagePercentage = () => {
    if (user.premium_status) return 100;
    return Math.min((usageData.lookupsThisMonth / parseInt(usageData.monthlyLimit)) * 100, 100);
  };

  const getProgressVariant = () => {
    const percentage = getUsagePercentage();
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="fas fa-chart-bar me-2"></i>
          Usage Statistics
        </h5>
      </div>
      <div className="card-body">
        <div className="row text-center mb-4">
          <div className="col-4">
            <div className="display-6 fw-bold text-primary">{usageData.totalLookups}</div>
            <small className="text-muted">Total Lookups</small>
          </div>
          <div className="col-4">
            <div className="display-6 fw-bold text-success">{usageData.premiumLookups}</div>
            <small className="text-muted">Premium Reports</small>
          </div>
          <div className="col-4">
            <div className="display-6 fw-bold text-info">{usageData.savedVehicles}</div>
            <small className="text-muted">Saved Vehicles</small>
          </div>
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted">Monthly Lookups</span>
            <span className="fw-bold">
              {usageData.lookupsThisMonth} / {usageData.monthlyLimit}
            </span>
          </div>
          <div className="progress" style={{height: '10px'}}>
            <div 
              className={`progress-bar bg-${getProgressVariant()}`}
              style={{width: `${getUsagePercentage()}%`}}
            ></div>
          </div>
          <small className="text-muted">
            {user.premium_status ? 'Unlimited lookups' : `${usageData.monthlyLimit - usageData.lookupsThisMonth} lookups remaining this month`}
          </small>
        </div>

        <div className="row">
          <div className="col-6">
            <div className="card bg-light">
              <div className="card-body text-center py-3">
                <i className="fas fa-bolt fa-2x text-warning mb-2"></i>
                <div className="fw-bold">{usageData.apiCalls}</div>
                <small className="text-muted">API Calls</small>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card bg-light">
              <div className="card-body text-center py-3">
                <i className="fas fa-crown fa-2x text-success mb-2"></i>
                <div className="fw-bold">
                  {user.premium_status ? 'Premium' : 'Free'}
                </div>
                <small className="text-muted">Account Type</small>
              </div>
            </div>
          </div>
        </div>

        {!user.premium_status && usageData.lookupsThisMonth >= parseInt(usageData.monthlyLimit) && (
          <div className="alert alert-warning mt-4">
            <div className="d-flex align-items-center">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <div>
                <strong>Monthly limit reached:</strong> Upgrade to Premium for unlimited VIN lookups.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsageStats;