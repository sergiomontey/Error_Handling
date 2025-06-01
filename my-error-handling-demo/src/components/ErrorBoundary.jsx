/*
 * File: ErrorBoundary.jsx
 * Author: Sergio Montecinos
 * Description: React error boundary for catching and displaying unexpected render-time errors in the UI.
 */

import React from 'react';

/**
 * Class-based error boundary. Catches errors in children and displays a fallback UI.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Track error state and extra info for debugging
    this.state = { hasError: false, error: null, info: null };
  }

  // Update state on render error to show fallback UI
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Capture component stack trace, could also log error remotely
  componentDidCatch(error, info) {
    this.setState({ info });
    // (Optional) Log error to monitoring service here
  }

  render() {
    if (this.state.hasError) {
      // Render a friendly fallback with details in development mode
      return (
        <div style={{ background: "#ffe0e0", padding: 24, borderRadius: 8 }}>
          <h2>Something went wrong.</h2>
          <pre>{this.state.error?.message}</pre>
          {process.env.NODE_ENV === 'development' && (
            <details>
              <summary>Stack trace</summary>
              <pre>{this.state.error?.stack}</pre>
              <pre>{this.state.info?.componentStack}</pre>
            </details>
          )}
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    // No error: render children as normal
    return this.props.children;
  }
}
