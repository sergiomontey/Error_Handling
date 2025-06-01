
# 🛡️ Robust Error Handling in React UI – Complete Source Code

This file contains the full source code for a robust React UI demonstrating best practices in error handling, including async fetch handling, form validation, server errors, and UI error boundaries.

---

## 📁 Project Structure Overview

```
src/
├── App.jsx
├── components/
│   ├── UserProfile.jsx
│   ├── UserRegistrationForm.jsx
│   └── ErrorBoundary.jsx
└── hooks/
    └── useFetchData.js
```

---

## 🔍 Component-by-Component Source Code

---

### 1. `/hooks/useFetchData.js`

```jsx
/*
 * File: useFetchData.js
 * Author: Sergio Montecinos
 * Description: Custom React hook for fetching data asynchronously with loading, error, and retry management.
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for fetching data with robust error handling and manual retry.
 * @param {string} url - The endpoint to fetch data from.
 * @returns {object} - { data, loading, error, refetch }
 */
export function useFetchData(url) {
  // Store the fetched data
  const [data, setData] = useState(null);
  // Loading state to manage spinner/UI feedback
  const [loading, setLoading] = useState(true);
  // Error state captures fetch or HTTP errors
  const [error, setError] = useState(null);
  // Used to force re-fetching by changing the value
  const [reloadFlag, setReloadFlag] = useState(0);

  // refetch: triggers a reload by updating reloadFlag
  const refetch = useCallback(() => setReloadFlag(f => f + 1), []);

  useEffect(() => {
    let ignore = false; // Prevents state updates if component unmounts

    setLoading(true);
    setError(null);

    fetch(url)
      .then(res => {
        // Catch HTTP errors (not just network errors)
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => { if (!ignore) setData(data); })
      .catch(err => { if (!ignore) setError(err); })
      .finally(() => { if (!ignore) setLoading(false); });

    // Cleanup function for component unmount or URL change
    return () => { ignore = true; };
  }, [url, reloadFlag]);

  return { data, loading, error, refetch };
}

```

---

### 2. `/components/ErrorBoundary.jsx`

```jsx
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

```

---

### 3. `/components/UserProfile.jsx`

```jsx
/*
 * File: UserProfile.jsx
 * Author: Sergio Montecinos
 * Description: Displays user profile data, handling async loading, errors, and retry using the useFetchData hook.
 */

import React from 'react';
import { useFetchData } from '../hooks/useFetchData';

/**
 * Fetches and displays user profile data from the API.
 * Shows a loading spinner, error message with retry, or user details.
 */
export function UserProfile({ userId }) {
  // Fetch user data using the custom hook
  const { data, loading, error, refetch } = useFetchData(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  // Display loading indicator with ARIA support
  if (loading) return <div aria-busy="true">Loading user...</div>;

  // If error, show message and retry option (role=alert for accessibility)
  if (error) {
    return (
      <div role="alert" style={{ color: "red" }}>
        Failed to load user: {error.message}
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  // No data fetched yet, don't render
  if (!data) return null;

  // Display fetched user details
  return (
    <div className="user-profile" aria-live="polite">
      <h3>{data.name}</h3>
      <p>Email: {data.email}</p>
      <p>Phone: {data.phone}</p>
      <p>Website: <a href={`http://${data.website}`}>{data.website}</a></p>
    </div>
  );
}

```

---

### 4. `/components/UserRegistrationForm.jsx`

```jsx
/*
 * File: UserRegistrationForm.jsx
 * Author: Sergio Montecinos
 * Description: Registration form demonstrating client-side validation, simulated server-side errors, and accessible error feedback.
 */

import React, { useState } from 'react';

// Simulate API responses (for demo: fake error scenarios)
async function fakeRegister({ username, email, password }) {
  await new Promise(res => setTimeout(res, 700)); // Simulate network delay
  if (!username || !email || !password) {
    return { status: 400, message: "All fields required." };
  }
  if (username === "testfail") {
    return { status: 400, message: "Username not allowed." };
  }
  if (username === "serverfail") {
    return { status: 500, message: "Server error. Try again." };
  }
  // Success!
  return { status: 200, user: { username, email } };
}

/**
 * Registration form with validation, server error handling, and accessibility features.
 */
export function UserRegistrationForm() {
  // Form state
  const [values, setValues] = useState({ username: "", email: "", password: "" });
  // Per-field error messages
  const [errors, setErrors] = useState({});
  // Server-side/global error
  const [serverError, setServerError] = useState(null);
  // Success indicator
  const [success, setSuccess] = useState(false);
  // Submitting state for loading indicator/disable
  const [submitting, setSubmitting] = useState(false);

  // Validate all inputs (returns error object)
  const validate = () => {
    const errs = {};
    if (!values.username) errs.username = "Username required";
    if (!values.email || !/\S+@\S+\.\S+/.test(values.email)) errs.email = "Valid email required";
    if (!values.password || values.password.length < 6) errs.password = "Password too short";
    return errs;
  };

  // Handle field value changes
  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null }); // Clear individual error
    setServerError(null); // Clear any server/global error
  };

  // Handle form submit (client and server-side error handling)
  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setServerError(null);
    setSuccess(false);
    // Simulate API call and handle possible server-side errors
    const resp = await fakeRegister(values);
    setSubmitting(false);
    if (resp.status !== 200) {
      setServerError(resp.message);
    } else {
      setSuccess(true);
      setValues({ username: "", email: "", password: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="registration form" noValidate>
      <h4>Register</h4>
      <div>
        <label>
          Username:
          <input name="username" value={values.username} onChange={handleChange}
            aria-invalid={!!errors.username} aria-describedby="username-error" />
        </label>
        {/* Inline field error message with ARIA support */}
        {errors.username && <div id="username-error" role="alert" style={{ color: "red" }}>{errors.username}</div>}
      </div>
      <div>
        <label>
          Email:
          <input name="email" value={values.email} onChange={handleChange}
            aria-invalid={!!errors.email} aria-describedby="email-error" />
        </label>
        {errors.email && <div id="email-error" role="alert" style={{ color: "red" }}>{errors.email}</div>}
      </div>
      <div>
        <label>
          Password:
          <input type="password" name="password" value={values.password} onChange={handleChange}
            aria-invalid={!!errors.password} aria-describedby="password-error" />
        </label>
        {errors.password && <div id="password-error" role="alert" style={{ color: "red" }}>{errors.password}</div>}
      </div>
      {/* Server/global error */}
      {serverError && <div role="alert" style={{ color: "red" }}>{serverError}</div>}
      {/* Success message */}
      {success && <div style={{ color: "green" }}>Registration successful!</div>}
      {/* Button disables when submitting */}
      <button type="submit" disabled={submitting}>{submitting ? "Registering..." : "Register"}</button>
    </form>
  );
}

```

---

### 5. `/App.jsx`

```jsx
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

```
### 6. `/index.css`
```css
/*
 * File: index.css
 * Author: Sergio Montecinos
 * Description: Global and component-specific CSS for Robust Error Handling React Demo.
 * Purpose: Ensures consistent, accessible, and visually appealing UI styling.
 */

/* === Global Resets and Layout === */
body {
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #f8f9fb;
  color: #333;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

#root {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 32px 0;
}

.app-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  max-width: 560px;
  width: 100%;
  padding: 32px 28px 36px 28px;
  margin: auto;
}

h2, h3, h4 {
  margin-top: 0;
  color: #0d69e0;
}

hr {
  border: none;
  border-top: 1.5px solid #e1e4e8;
  margin: 32px 0 24px 0;
}

/* === User Profile Component === */
.user-profile {
  padding: 18px;
  border: 1.5px solid #d1e3f8;
  border-radius: 8px;
  margin-top: 22px;
  min-height: 120px;
  background: #fafdff;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  transition: border-color 0.2s;
}

.user-profile h3 {
  margin-bottom: 6px;
  color: #0d69e0;
}

.user-profile p {
  margin: 0 0 4px 0;
  color: #444;
  font-size: 1rem;
  word-break: break-all;
}

.user-profile a {
  color: #0d69e0;
  text-decoration: underline;
}

.user-profile[aria-busy="true"] {
  opacity: 0.6;
}

.user-profile[aria-live="polite"] {
  border-color: #b5f7cc;
}

.user-profile .success {
  color: #219d38;
}

.user-profile .error {
  color: #e22a2a;
}

/* === Loading and Error States === */
[aria-busy="true"], .loading {
  background: #eaf2fb !important;
  color: #6a7683;
  position: relative;
}

[role="alert"], .error {
  background: #ffe3e3 !important;
  color: #d8000c !important;
  border-color: #ff9999 !important;
  padding: 10px;
  border-radius: 7px;
  margin-top: 8px;
}

/* === Spinner (optional, replace with your own if you wish) === */
.spinner {
  border: 4px solid #e3e3e3;
  border-top: 4px solid #0d69e0;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  animation: spin 0.7s linear infinite;
  margin: 12px auto 0 auto;
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}

/* === Registration Form === */
form[aria-label="registration form"] {
  margin-top: 16px;
  padding: 16px 12px 12px 12px;
  border-radius: 8px;
  background: #f5f7fb;
  border: 1.5px solid #d7e3ef;
}

form[aria-label="registration form"] h4 {
  margin-bottom: 18px;
}

form label {
  font-weight: 500;
  margin-bottom: 2px;
  display: block;
}

form input {
  width: 98%;
  font-size: 1rem;
  padding: 8px;
  margin: 4px 0 0 0;
  border-radius: 5px;
  border: 1.5px solid #c6d6e8;
  background: #fff;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
form input:focus {
  border-color: #0d69e0;
  background: #eaf4ff;
}

[aria-invalid="true"] {
  border-color: #e22a2a !important;
}

button {
  background: #0d69e0;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 18px;
  font-size: 1rem;
  margin-top: 16px;
  cursor: pointer;
  transition: background 0.15s;
}
button:disabled {
  background: #a5c1e8;
  cursor: not-allowed;
}
button:hover:not(:disabled) {
  background: #0653b6;
}

form .success {
  color: #1a8137;
  background: #e0ffe7;
  border-radius: 4px;
  margin-top: 8px;
  padding: 6px 0 6px 7px;
  font-weight: 500;
}

form .error, .form-error {
  color: #e22a2a;
  background: #fff3f3;
  border-radius: 4px;
  margin-top: 6px;
  padding: 5px 0 5px 7px;
  font-weight: 500;
}

/* === Responsive design === */
@media (max-width: 650px) {
  .app-container {
    max-width: 96vw;
    padding: 20px 5vw;
  }
}

@media (max-width: 400px) {
  form input, button {
    font-size: 0.95rem;
    padding: 7px 12px;
  }
}


```
---

## 📜 License

MIT © 2025 Sergio Montecinos
