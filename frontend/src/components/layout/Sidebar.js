import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/profile', icon: 'fas fa-user', label: 'Profile' },
    { path: '/decode', icon: 'fas fa-search', label: 'Decode VIN' },
    { path: '/history', icon: 'fas fa-history', label: 'History' },
    { path: '/pricing', icon: 'fas fa-crown', label: 'Upgrade' },
    { path: '/settings', icon: 'fas fa-cog', label: 'Settings' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar bg-dark text-white" style={{width: '250px', minHeight: '100vh'}}>
      <div className="p-3">
        <h5 className="text-center mb-4">
          <i className="fas fa-car me-2"></i>
          BimmerVIN
        </h5>
        
        <nav className="nav flex-column">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`nav-link text-white mb-2 rounded ${isActive(item.path) ? 'bg-primary' : 'hover-bg-gray-800'}`}
            >
              <i className={`${item.icon} me-2`}></i>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-5 pt-5 border-top">
          <div className="text-center">
            <small className="text-muted">BimmerVIN v1.0</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;