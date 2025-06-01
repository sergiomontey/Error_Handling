
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
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for fetching data with retry and error handling.
 */
export function useFetchData(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  const refetch = useCallback(() => setReloadFlag(f => f + 1), []);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json();
      })
      .then(data => !ignore && setData(data))
      .catch(err => !ignore && setError(err))
      .finally(() => !ignore && setLoading(false));

    return () => { ignore = true; };
  }, [url, reloadFlag]);

  return { data, loading, error, refetch };
}
```

---

### 2. `/components/ErrorBoundary.jsx`

```jsx
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
```

---

### 3. `/components/UserProfile.jsx`

```jsx
import React from 'react';
import { useFetchData } from '../hooks/useFetchData';

export function UserProfile({ userId }) {
  const { data, loading, error, refetch } = useFetchData(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  if (loading) return <div aria-busy="true">Loading user...</div>;
  if (error) {
    return (
      <div role="alert" style={{ color: "red" }}>
        Failed to load user: {error.message}
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }
  if (!data) return null;
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
import React, { useState } from 'react';

// Simulate server responses for demo
async function fakeRegister({ username, email, password }) {
  await new Promise(res => setTimeout(res, 700));
  if (!username || !email || !password) {
    return { status: 400, message: "All fields required." };
  }
  if (username === "testfail") {
    return { status: 400, message: "Username not allowed." };
  }
  if (username === "serverfail") {
    return { status: 500, message: "Server error. Try again." };
  }
  return { status: 200, user: { username, email } };
}

export function UserRegistrationForm() {
  const [values, setValues] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!values.username) errs.username = "Username required";
    if (!values.email || !/\S+@\S+\.\S+/.test(values.email)) errs.email = "Valid email required";
    if (!values.password || values.password.length < 6) errs.password = "Password too short";
    return errs;
  };

  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
    setServerError(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setServerError(null);
    setSuccess(false);
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
      {serverError && <div role="alert" style={{ color: "red" }}>{serverError}</div>}
      {success && <div style={{ color: "green" }}>Registration successful!</div>}
      <button type="submit" disabled={submitting}>{submitting ? "Registering..." : "Register"}</button>
    </form>
  );
}
```

---

### 5. `/App.jsx`

```jsx
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
```

---

## 📜 License

MIT © 2025 Sergio Montecinos
