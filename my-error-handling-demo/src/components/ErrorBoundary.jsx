import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // Could log to an external service here
    this.setState({ info });
  }
  render() {
    if (this.state.hasError) {
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
    return this.props.children;
  }
}
