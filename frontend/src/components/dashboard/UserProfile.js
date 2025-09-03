import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    marketing_consent: user?.marketing_consent || false
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        marketing_consent: user.marketing_consent || false
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="fas fa-user me-2"></i>
          Profile Information
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="first_name" className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="last_name" className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="mb-4 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="marketing_consent"
              name="marketing_consent"
              checked={formData.marketing_consent}
              onChange={handleChange}
              disabled={loading}
            />
            <label className="form-check-label" htmlFor="marketing_consent">
              Receive marketing emails and updates
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Updating...
              </>
            ) : (
              'Update Profile'
            )}
          </button>
        </form>

        <div className="mt-4 pt-4 border-top">
          <h6 className="mb-3">Account Information</h6>
          <dl className="row">
            <dt className="col-sm-3">Username</dt>
            <dd className="col-sm-9">{user?.username}</dd>

            <dt className="col-sm-3">Member Since</dt>
            <dd className="col-sm-9">
              {new Date(user?.date_joined).toLocaleDateString()}
            </dd>

            <dt className="col-sm-3">Account Status</dt>
            <dd className="col-sm-9">
              <span className={`badge ${user?.premium_status ? 'bg-success' : 'bg-secondary'}`}>
                {user?.premium_status ? 'Premium' : 'Free'}
              </span>
            </dd>

            {user?.premium_since && (
              <>
                <dt className="col-sm-3">Premium Since</dt>
                <dd className="col-sm-9">
                  {new Date(user.premium_since).toLocaleDateString()}
                </dd>
              </>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;