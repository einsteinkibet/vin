import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PaymentButton from './../components/payment/PaymentButton';

const PricingPage = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for occasional VIN checks",
      features: [
        "5 VIN decodes per month",
        "Basic vehicle information",
        "Model and year details",
        "Engine and transmission info",
        "Community support"
      ],
      buttonText: isAuthenticated ? "Current Plan" : "Get Started",
      buttonVariant: "outline-primary",
      disabled: isAuthenticated && !user.premium_status
    },
    {
      name: "Premium",
      price: "$5",
      period: "per month",
      description: "For enthusiasts and regular users",
      features: [
        "Unlimited VIN decodes",
        "Full vehicle specifications",
        "Complete option packages",
        "Production details",
        "PDF report generation",
        "Priority support",
        "No advertisements"
      ],
      buttonText: user?.premium_status ? "Current Plan" : "Upgrade Now",
      buttonVariant: "primary",
      highlighted: true,
      disabled: user?.premium_status
    },
    {
      name: "Professional",
      price: "$20",
      period: "per month",
      description: "For mechanics and businesses",
      features: [
        "Everything in Premium",
        "API access (1000 calls/month)",
        "Bulk VIN decoding",
        "Commercial license",
        "White-label reports",
        "Dedicated account manager",
        "Custom data exports"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline-primary",
      disabled: false
    }
  ];

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Simple, Transparent Pricing</h1>
        <p className="lead text-muted">Choose the plan that works best for you</p>
      </div>

      <div className="row g-4">
        {plans.map((plan, index) => (
          <div key={index} className="col-lg-4">
            <div className={`card h-100 border-0 shadow-sm ${plan.highlighted ? 'border-primary border-2' : ''}`}>
              {plan.highlighted && (
                <div className="card-header bg-primary text-white text-center py-3">
                  <span className="badge bg-white text-primary">MOST POPULAR</span>
                </div>
              )}
              <div className="card-body p-4">
                <h3 className="card-title fw-bold">{plan.name}</h3>
                <div className="my-4">
                  <span className="display-4 fw-bold">{plan.price}</span>
                  <span className="text-muted">/{plan.period}</span>
                </div>
                <p className="text-muted">{plan.description}</p>
                
                <ul className="list-unstyled mb-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="d-grid">
                  {plan.name === "Professional" ? (
                    <a 
                      href="mailto:sales@bimmervin.com" 
                      className={`btn btn-${plan.buttonVariant} btn-lg`}
                    >
                      {plan.buttonText}
                    </a>
                  ) : (
                    <Link 
                      to={isAuthenticated ? "/payment" : "/register"} 
                      className={`btn btn-${plan.buttonVariant} btn-lg ${plan.disabled ? 'disabled' : ''}`}
                    >
                      {plan.buttonText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-5">
        <div className="col-lg-8 mx-auto">
          <div className="card border-0 bg-light">
            <div className="card-body p-4 text-center">
              <h5 className="card-title">Need a custom plan?</h5>
              <p className="card-text text-muted">
                We offer enterprise solutions for dealerships, insurance companies, 
                and automotive businesses with custom pricing and features.
              </p>
              <a href="mailto:enterprise@bimmervin.com" className="btn btn-outline-primary">
                Contact Enterprise Sales
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-lg-10 mx-auto">
          <div className="text-center">
            <h4 className="mb-4">Frequently Asked Questions</h4>
            <div className="row text-start">
              <div className="col-md-6 mb-4">
                <h6>Can I change plans anytime?</h6>
                <p className="text-muted small">
                  Yes, you can upgrade or downgrade your plan at any time. 
                  Changes take effect immediately.
                </p>
              </div>
              <div className="col-md-6 mb-4">
                <h6>Is there a free trial?</h6>
                <p className="text-muted small">
                  The Free plan is always free. Premium plans come with a 
                  7-day money-back guarantee.
                </p>
              </div>
              <div className="col-md-6 mb-4">
                <h6>What payment methods do you accept?</h6>
                <p className="text-muted small">
                  We accept all major credit cards, PayPal, and bank transfers 
                  for enterprise customers.
                </p>
              </div>
              <div className="col-md-6 mb-4">
                <h6>How accurate is your data?</h6>
                <p className="text-muted small">
                  Our data comes from multiple reliable sources and is constantly 
                  verified for accuracy. We maintain a 99.8% accuracy rate.
                </p>
              </div>
                    <div className="col-md-4 mb-4">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">Premium Report</h5>
            <p className="price">KES 500</p>
            <PaymentButton 
              planId="premium" 
              amount={500}
              description="Premium VIN Report"
            />
          </div>
        </div>
      </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
