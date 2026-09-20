import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ApnoCare Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏥</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f766e', marginBottom: '0.5rem' }}>
              ApnoCare
            </h1>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              Something went wrong loading the app.
              <br />
              {this.state.error?.message || 'Please try refreshing the page.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#0f766e',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
