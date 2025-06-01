import React, { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { UserProfile } from './components/UserProfile';
import { UserRegistrationForm } from './components/UserRegistrationForm';

export default function App() {
  const [userId, setUserId] = useState(1);

  // Simulate a rendering error
  const [breakUI, setBreakUI] = useState(false);
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
        <UserProfile userId={userId} />
        <hr />
        <UserRegistrationForm />
      </ErrorBoundary>
    </div>
  );
}
