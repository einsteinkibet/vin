import React from 'react';
import UserProfile from '../../components/dashboard/UserProfile';

const ProfilePage = () => {
  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <h1 className="h3 mb-4">Profile Settings</h1>
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-8">
          <UserProfile />
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Profile Photo</h6>
            </div>
            <div className="card-body text-center">
              <div className="mb-3">
                <img 
                  src="https://via.placeholder.com/150" 
                  alt="Profile" 
                  className="rounded-circle"
                  width="150"
                  height="150"
                />
              </div>
              <button className="btn btn-outline-primary btn-sm">
                Change Photo
              </button>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-header">
              <h6 className="mb-0">Account Security</h6>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-outline-warning">
                  <i className="fas fa-key me-2"></i>
                  Change Password
                </button>
                <button className="btn btn-outline-danger">
                  <i className="fas fa-shield-alt me-2"></i>
                  Two-Factor Authentication
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;