import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section bg-dark text-white py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Decode Any BMW VIN
                <span className="text-primary">.</span>
              </h1>
              <p className="lead mb-4">
                Get instant access to detailed vehicle information, 
                factory options, and technical specifications for any BMW.
                Perfect for enthusiasts, buyers, and professionals.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/decode" className="btn btn-primary btn-lg">
                  <i className="fas fa-bolt me-2"></i>
                  Decode VIN Now
                </Link>
                {!isAuthenticated && (
                  <Link to="/register" className="btn btn-outline-light btn-lg">
                    <i className="fas fa-user-plus me-2"></i>
                    Sign Up Free
                  </Link>
                )}
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="position-relative">
                <img 
                  src="https://images.unsplash.com/photo-1603712610494-7e0d50a08b3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                  alt="BMW Vehicle" 
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
                />
                <div className="position-absolute top-0 start-0 bg-primary text-white px-3 py-2 rounded-end">
                  <i className="fas fa-car me-2"></i>VIN Decoder
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Choose BimmerVIN?</h2>
            <p className="text-muted lead">Powerful features for BMW enthusiasts and professionals</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: '80px', height: '80px'}}>
                    <i className="fas fa-search fa-2x text-primary"></i>
                  </div>
                  <h5 className="card-title">Instant VIN Decoding</h5>
                  <p className="card-text text-muted">
                    Decode any BMW VIN in seconds with our comprehensive database 
                    covering all models and years.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: '80px', height: '80px'}}>
                    <i className="fas fa-list-alt fa-2x text-success"></i>
                  </div>
                  <h5 className="card-title">Detailed Specifications</h5>
                  <p className="card-text text-muted">
                    Get complete technical specs, engine details, transmission info, 
                    and performance data.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: '80px', height: '80px'}}>
                    <i className="fas fa-cogs fa-2x text-info"></i>
                  </div>
                  <h5 className="card-title">Factory Options</h5>
                  <p className="card-text text-muted">
                    Discover all original factory options and packages that came 
                    with the vehicle from production.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h3 className="fw-bold mb-3">Ready to decode your BMW?</h3>
              <p className="text-muted mb-4 mb-lg-0">
                Join thousands of BMW enthusiasts who trust BimmerVIN for accurate 
                and detailed vehicle information.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/decode" className="btn btn-primary btn-lg">
                Start Decoding Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-4">
              <div className="display-4 fw-bold text-primary">10,000+</div>
              <p className="text-muted">VINs Decoded</p>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="display-4 fw-bold text-success">500+</div>
              <p className="text-muted">BMW Models</p>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="display-4 fw-bold text-info">2,000+</div>
              <p className="text-muted">Happy Users</p>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="display-4 fw-bold text-warning">24/7</div>
              <p className="text-muted">Support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;