// File: App.jsx
// Author: montey
// Description: Main application component for the React Robust Error Handling Demo. Demonstrates robust error handling in React using an ErrorBoundary, user profile fetching, and a registration form. Includes UI controls to simulate errors and switch users.

import React, { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { UserProfile } from './components/UserProfile';
import { UserRegistrationForm } from './components/UserRegistrationForm';

export default function App() {
  // State to track the current user ID for the profile component
  const [userId, setUserId] = useState(1);

  // State to simulate a rendering error when set to true
  const [breakUI, setBreakUI] = useState(false);
  // If breakUI is true, throw an error to test the ErrorBoundary
  if (breakUI) throw new Error("Simulated render crash!");

  return (
    <div style={{ fontFamily: "sans-serif", margin: 24 }}>
      {/* Application Title */}
      <h2>React Robust Error Handling Demo</h2>
      {/* ErrorBoundary wraps all error-prone UI below */}
      <ErrorBoundary>
        <div>
          <label>
            {/* User ID input and navigation controls */}
            User ID:&nbsp;
            <input
              type="number"
              min="1"
              max="10"
              value={userId}
              onChange={e => setUserId(Number(e.target.value))}
            />
            <button onClick={() => setUserId(u => u === 10 ? 1 : u + 1)}>
              Next User
            </button>
            {/* Button to simulate a render crash for error boundary testing */}
            <button
              style={{ marginLeft: 8, color: "red" }}
              onClick={() => setBreakUI(true)}
            >
              Simulate Render Crash
            </button>
          </label>
        </div>
        {/* UserProfile displays user data for the selected userId */}
        <UserProfile userId={userId} />
        <hr />
        {/* UserRegistrationForm allows new user registration */}
        <UserRegistrationForm />
      </ErrorBoundary>
    </div>
  );
}
