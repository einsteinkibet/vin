import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { authAPI } from '../../services/api';

const Settings = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState({
    emailReports: true,
    marketingEmails: user.marketing_consent || false,
    securityAlerts: true,
    productUpdates: true
  });
  const [loading, setLoading] = useState(false);

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await authAPI.updateProfile({
        marketing_consent: notifications.marketingEmails
      });
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

    const handleExportData = async () => {
    try {
      const response = await authAPI.exportData();
      // Create download link
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bimmervin-data-export.json';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="fas fa-cog me-2"></i>
          Account Settings
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <h6 className="mb-3">Notification Preferences</h6>
            
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={notifications.emailReports}
                onChange={() => handleNotificationChange('emailReports')}
                id="emailReports"
              />
              <label className="form-check-label" htmlFor="emailReports">
                Email reports
              </label>
              <div className="form-text">Receive VIN reports via email</div>
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={notifications.marketingEmails}
                onChange={() => handleNotificationChange('marketingEmails')}
                id="marketingEmails"
              />
              <label className="form-check-label" htmlFor="marketingEmails">
                Marketing emails
              </label>
              <div className="form-text">Receive product updates and promotions</div>
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={notifications.securityAlerts}
                onChange={() => handleNotificationChange('securityAlerts')}
                id="securityAlerts"
              />
              <label className="form-check-label" htmlFor="securityAlerts">
                Security alerts
              </label>
              <div className="form-text">Get notified about account activity</div>
            </div>

            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                checked={notifications.productUpdates}
                onChange={() => handleNotificationChange('productUpdates')}
                id="productUpdates"
              />
              <label className="form-check-label" htmlFor="productUpdates">
                Product updates
              </label>
              <div className="form-text">Stay informed about new features</div>
            </div>

            <button className="btn btn-primary" onClick={handleSaveSettings}>
              Save Notification Settings
            </button>
          </div>

          <div className="col-md-6">
            <h6 className="mb-3">Account Management</h6>
            
            <div className="d-grid gap-2">
              <button className="btn btn-outline-primary text-start">
                <i className="fas fa-download me-2"></i>
                Export My Data
              </button>
              
              <button className="btn btn-outline-primary text-start">
                <i className="fas fa-sync-alt me-2"></i>
                Refresh Account Data
              </button>
              
              <button className="btn btn-outline-danger text-start">
                <i className="fas fa-trash me-2"></i>
                Delete Account
              </button>
            </div>

            <div className="mt-4 pt-3 border-top">
              <h6 className="mb-3">Security</h6>
              <div className="d-grid">
                <button className="btn btn-outline-warning">
                  <i className="fas fa-key me-2"></i>
                  Change Password
                </button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-top">
              <h6 className="mb-3">Subscription</h6>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-success">
                  <i className="fas fa-crown me-2"></i>
                  {user.premium_status ? 'Manage Subscription' : 'Upgrade to Premium'}
                </button>
                {user.premium_status && (
                  <button className="btn btn-outline-secondary">
                    <i className="fas fa-times me-2"></i>
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;