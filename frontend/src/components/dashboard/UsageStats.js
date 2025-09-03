import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { dashboardAPI } from '../../services/api';
import { toast } from 'react-toastify';

const UsageStats = () => {
  const { user } = useSelector(state => state.auth);
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageStats();
  }, []);

  const fetchUsageStats = async () => {
    try {
      const response = await dashboardAPI.getUsageStats();
      setUsageData(response.data);
    } catch (error) {
      toast.error('Failed to load usage statistics');
    } finally {
      setLoading(false);
    }
  };

  const getUsagePercentage = () => {
    if (user.premium_status) return 100;
    return Math.min((usageData?.lookups_this_month / 5) * 100, 100);
  };

  const getProgressVariant = () => {
    const percentage = getUsagePercentage();
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'success';
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
          <i className="fas fa-chart-bar me-2"></i>
          Usage Statistics
        </h5>
      </div>
      <div className="card-body">
        <div className="row text-center mb-4">
          <div className="col-4">
            <div className="display-6 fw-bold text-primary">{usageData?.total_lookups || 0}</div>
            <small className="text-muted">Total Lookups</small>
          </div>
          <div className="col-4">
            <div className="display-6 fw-bold text-success">{usageData?.premium_lookups || 0}</div>
            <small className="text-muted">Premium Reports</small>
          </div>
          <div className="col-4">
            <div className="display-6 fw-bold text-info">{usageData?.saved_vehicles || 0}</div>
            <small className="text-muted">Saved Vehicles</small>
          </div>
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted">Monthly Lookups</span>
            <span className="fw-bold">
              {usageData?.lookups_this_month || 0} / {user.premium_status ? 'Unlimited' : '5'}
            </span>
          </div>
          <div className="progress" style={{height: '10px'}}>
            <div 
              className={`progress-bar bg-${getProgressVariant()}`}
              style={{width: `${getUsagePercentage()}%`}}
            ></div>
          </div>
          <small className="text-muted">
            {user.premium_status ? 'Unlimited lookups' : `${5 - (usageData?.lookups_this_month || 0)} lookups remaining this month`}
          </small>
        </div>

        {!user.premium_status && usageData?.lookups_this_month >= 5 && (
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