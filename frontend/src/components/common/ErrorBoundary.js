import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // You can log to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className="card border-danger">
                <div className="card-body py-5">
                  <i className="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                  <h3 className="card-title">Something went wrong</h3>
                  <p className="card-text text-muted">
                    We're sorry, but something unexpected happened. Please try refreshing the page.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => window.location.reload()}
                  >
                    <i className="fas fa-refresh me-2"></i>
                    Refresh Page
                  </button>
                  <div className="mt-3">
                    <button
                      className="btn btn-link text-muted"
                      onClick={() => this.setState({ hasError: false, error: null })}
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;