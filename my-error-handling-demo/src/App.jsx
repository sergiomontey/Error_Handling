/*
 * File: App.jsx
 * Author: Sergio Montecinos
 * Description: Root component for the robust error handling demo. Integrates user profile, registration form, and error boundary for comprehensive error management.
 */

import React, { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { UserProfile } from './components/UserProfile';
import { UserRegistrationForm } from './components/UserRegistrationForm';

/**
 * Main app component demonstrating robust error handling in React.
 */
export default function App() {
  // Track current userId for UserProfile demo
  const [userId, setUserId] = useState(1);
  // Simulate a rendering error (triggers ErrorBoundary)
  const [breakUI, setBreakUI] = useState(false);

  // If breakUI is true, throw an error to test the error boundary
  if (breakUI) throw new Error("Simulated render crash!");

  return (
    <div style={{ fontFamily: "sans-serif", margin: 24 }}>
      <h2>React Robust Error Handling Demo</h2>
      <ErrorBoundary>
        <div>
          <label>
            User ID:&nbsp;
            <input type="number" min="1" max="10" value={userId}
              onChange={e => setUserId(Number(e.target.value))} />
            <button onClick={() => setUserId(u => u === 10 ? 1 : u + 1)}>
              Next User
            </button>
            <button style={{marginLeft:8, color:"red"}} onClick={() => setBreakUI(true)}>
              Simulate Render Crash
            </button>
          </label>
        </div>
        {/* User profile demo with error and retry */}
        <UserProfile userId={userId} />
        <hr />
        {/* Registration form demo with full validation */}
        <UserRegistrationForm />
      </ErrorBoundary>
    </div>
  );
}
