// File: ErrorBoundary.jsx
// Author: montey
// Description: React error boundary component that catches JavaScript errors in child components, displays a fallback UI, and optionally shows stack traces in development mode.

import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Initialize state to track error and error info
    this.state = { hasError: false, error: null, info: null };
  }
  // Update state when an error is thrown in a child component
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  // Capture error details and component stack for debugging/logging
  componentDidCatch(error, info) {
    // Could log to an external service here
    this.setState({ info });
  }
  render() {
    // If an error has occurred, show fallback UI
    if (this.state.hasError) {
      return (
        <div style={{ background: "#ffe0e0", padding: 24, borderRadius: 8 }}>
          <h2>Something went wrong.</h2>
          {/* Display error message */}
          <pre>{this.state.error?.message}</pre>
          {/* Show stack trace and component stack in development mode */}
          {process.env.NODE_ENV === 'development' && (
            <details>
              <summary>Stack trace</summary>
              <pre>{this.state.error?.stack}</pre>
              <pre>{this.state.info?.componentStack}</pre>
            </details>
          )}
          {/* Reload button to refresh the app */}
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    // If no error, render children as usual
    return this.props.children;
  }
}
