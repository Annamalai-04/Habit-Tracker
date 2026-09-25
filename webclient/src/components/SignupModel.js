import API_URL from "../services/api";
import React, { useState } from "react";

function SignUpModal({ onClose, onSignupSuccess, onOpenSignIn }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // Input changes
  // --------------------------------------------------

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // --------------------------------------------------
  // Signup API
  // --------------------------------------------------

  const handleSignUp = async (e) => {
    e.preventDefault();

    setError("");

    // Password check
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Password length
    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // -----------------------------------------------
      // Register
      // -----------------------------------------------

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          name: form.name,
          username: form.username,
          email: form.email,
          dob: form.dob,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");

        setLoading(false);
        return;
      }

      // -----------------------------------------------
      // Automatically login after successful signup
      // -----------------------------------------------

      const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        setError(
          loginData.error ||
            "Account created, but automatic login failed. Please sign in.",
        );

        setLoading(false);
        return;
      }

      // -----------------------------------------------
      // Send successful signup + login back to AppRouter
      // -----------------------------------------------

      onSignupSuccess({
        ...loginData,

        name: form.name,
        username: form.username,
        email: form.email,
        dob: form.dob,
      });
    } catch (error) {
      console.error("Registration/login error:", error);

      setError("Cannot connect to Spring Boot server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* Header */}

          <div className="modal-header">
            <h5 className="modal-title">Create Account</h5>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Body */}

          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSignUp}>
              {/* Name */}

              <div className="mb-3">
                <label className="form-label">Name</label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Username */}

              <div className="mb-3">
                <label className="form-label">Username</label>

                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="Choose username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>

              {/* Email */}

              <div className="mb-3">
                <label className="form-label">Email</label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* DOB */}

              <div className="mb-3">
                <label className="form-label">Date of Birth</label>

                <input
                  type="date"
                  name="dob"
                  className="form-control"
                  value={form.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}

              <div className="mb-3">
                <label className="form-label">Password</label>

                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Create password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>

              {/* Confirm Password */}

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>

                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Enter password again"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Create Account */}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Sign In */}

            <div className="text-center mt-3">
              <span>Already have an account?</span>

              <button
                type="button"
                className="btn btn-link"
                onClick={onOpenSignIn}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpModal;




