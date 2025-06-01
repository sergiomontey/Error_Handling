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
