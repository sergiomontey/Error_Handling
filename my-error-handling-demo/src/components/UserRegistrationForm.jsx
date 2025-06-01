// File: UserRegistrationForm.jsx
// Author: montey
// Description: User registration form component for the error handling demo. Handles form state, validation, simulated server responses, and displays error/success messages.

import React, { useState } from 'react';

// Simulate server responses for demo registration
async function fakeRegister({ username, email, password }) {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 700));
  // Validate required fields
  if (!username || !email || !password) {
    return { status: 400, message: "All fields required." };
  }
  // Simulate specific username errors
  if (username === "testfail") {
    return { status: 400, message: "Username not allowed." };
  }
  if (username === "serverfail") {
    return { status: 500, message: "Server error. Try again." };
  }
  // Simulate successful registration
  return { status: 200, user: { username, email } };
}

export function UserRegistrationForm() {
  // Form field values
  const [values, setValues] = useState({ username: "", email: "", password: "" });
  // Field-level validation errors
  const [errors, setErrors] = useState({});
  // Server error message
  const [serverError, setServerError] = useState(null);
  // Success state
  const [success, setSuccess] = useState(false);
  // Submission state
  const [submitting, setSubmitting] = useState(false);

  // Validate form fields and return errors object
  const validate = () => {
    const errs = {};
    if (!values.username) errs.username = "Username required";
    if (!values.email || !/\S+@\S+\.\S+/.test(values.email)) errs.email = "Valid email required";
    if (!values.password || values.password.length < 6) errs.password = "Password too short";
    return errs;
  };

  // Handle input changes, clear field errors and server error
  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
    setServerError(null);
  };

  // Handle form submission: validate, call fakeRegister, update UI based on response
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
      {/* Username field and error */}
      <div>
        <label>
          Username:
          <input name="username" value={values.username} onChange={handleChange}
            aria-invalid={!!errors.username} aria-describedby="username-error" />
        </label>
        {errors.username && <div id="username-error" role="alert" style={{ color: "red" }}>{errors.username}</div>}
      </div>
      {/* Email field and error */}
      <div>
        <label>
          Email:
          <input name="email" value={values.email} onChange={handleChange}
            aria-invalid={!!errors.email} aria-describedby="email-error" />
        </label>
        {errors.email && <div id="email-error" role="alert" style={{ color: "red" }}>{errors.email}</div>}
      </div>
      {/* Password field and error */}
      <div>
        <label>
          Password:
          <input type="password" name="password" value={values.password} onChange={handleChange}
            aria-invalid={!!errors.password} aria-describedby="password-error" />
        </label>
        {errors.password && <div id="password-error" role="alert" style={{ color: "red" }}>{errors.password}</div>}
      </div>
      {/* Server error message */}
      {serverError && <div role="alert" style={{ color: "red" }}>{serverError}</div>}
      {/* Success message */}
      {success && <div style={{ color: "green" }}>Registration successful!</div>}
      {/* Submit button, disabled while submitting */}
      <button type="submit" disabled={submitting}>{submitting ? "Registering..." : "Register"}</button>
    </form>
  );
}
