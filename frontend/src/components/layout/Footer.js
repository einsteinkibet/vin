import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">
              <i className="fas fa-car me-2"></i>
              BimmerVIN
            </h5>
            <p className="text-muted">
              The ultimate BMW VIN decoder for enthusiasts and professionals. 
              Get detailed vehicle information instantly.
            </p>
          </div>
          
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold">Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-muted text-decoration-none">Home</Link></li>
              <li><Link to="/decode" className="text-muted text-decoration-none">Decode VIN</Link></li>
              <li><Link to="/pricing" className="text-muted text-decoration-none">Pricing</Link></li>
              <li><Link to="/about" className="text-muted text-decoration-none">About</Link></li>
            </ul>
          </div>
          
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold">Support</h6>
            <ul className="list-unstyled">
              <li><Link to="/faq" className="text-muted text-decoration-none">FAQ</Link></li>
              <li><Link to="/contact" className="text-muted text-decoration-none">Contact</Link></li>
              <li><Link to="/privacy" className="text-muted text-decoration-none">Privacy</Link></li>
              <li><Link to="/terms" className="text-muted text-decoration-none">Terms</Link></li>
            </ul>
          </div>
          
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold">Connect With Us</h6>
            <div className="d-flex gap-3 mb-3">
              <a href="#" className="text-muted"><i className="fab fa-facebook fa-lg"></i></a>
              <a href="#" className="text-muted"><i className="fab fa-twitter fa-lg"></i></a>
              <a href="#" className="text-muted"><i className="fab fa-instagram fa-lg"></i></a>
              <a href="#" className="text-muted"><i className="fab fa-linkedin fa-lg"></i></a>
            </div>
            <p className="text-muted small">
              © 2024 BimmerVIN. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;