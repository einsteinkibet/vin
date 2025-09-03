import React from 'react';

const AboutPage = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="fw-bold">About BimmerVIN</h1>
            <p className="lead text-muted">The ultimate BMW VIN decoding platform</p>
          </div>

          <div className="card mb-4">
            <div className="card-body p-5">
              <h3 className="card-title mb-4">Our Story</h3>
              <p className="card-text">
                BimmerVIN was born from a passion for BMW vehicles and the need for 
                accurate, comprehensive vehicle information. As BMW enthusiasts ourselves, 
                we understand the importance of knowing exactly what features and 
                specifications your vehicle came with from the factory.
              </p>
              <p className="card-text">
                Our mission is to provide BMW owners, buyers, and enthusiasts with 
                the most accurate and detailed VIN decoding service available. We've 
                built a comprehensive database that covers every BMW model and year, 
                ensuring you get the information you need.
              </p>
            </div>
          </div>

          <div className="row mb-5">
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="fas fa-database fa-3x text-primary mb-3"></i>
                  <h5>Comprehensive Database</h5>
                  <p className="text-muted">
                    Our database includes detailed information on every BMW model 
                    from 1970 to present day.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                  <h5>Accuracy Guaranteed</h5>
                  <p className="text-muted">
                    We maintain a 99.8% accuracy rate through continuous verification 
                    and multiple data sources.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body p-5">
              <h3 className="card-title mb-4">Why Choose Us?</h3>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <h6><i className="fas fa-bolt text-warning me-2"></i>Instant Results</h6>
                  <p className="text-muted small">Get detailed vehicle information in seconds</p>
                </div>
                <div className="col-md-6 mb-3">
                  <h6><i className="fas fa-crown text-success me-2"></i>Premium Features</h6>
                  <p className="text-muted small">Advanced reports and unlimited access</p>
                </div>
                <div className="col-md-6 mb-3">
                  <h6><i className="fas fa-shield-alt text-primary me-2"></i>Secure & Private</h6>
                  <p className="text-muted small">Your data is always protected</p>
                </div>
                <div className="col-md-6 mb-3">
                  <h6><i className="fas fa-headset text-info me-2"></i>24/7 Support</h6>
                  <p className="text-muted small">Expert help whenever you need it</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;