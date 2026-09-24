import React, { useState } from "react";

function SignInModal({
  onClose,
  onLoginSuccess,
  onOpenSignUp
}) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Sign In API
  // --------------------------------------------------

  const handleSignIn = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      // -----------------------------------------------
      // Login
      // -----------------------------------------------

      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          credentials: "include",

          body: JSON.stringify({
            username,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setError(
          data.error || "Invalid username or password"
        );

        setLoading(false);

        return;
      }

      // -----------------------------------------------
      // Get user's following habits
      // -----------------------------------------------

      const followingResponse = await fetch(
        `http://localhost:8080/api/users/${data.userId}/following`,
        {
          method: "GET",
          credentials: "include"
        }
      );

      const followingData = await followingResponse.json();

      if (!followingResponse.ok) {

        console.error(
          "Following API error:",
          followingData
        );

        setError("Could not load following habits");

        setLoading(false);

        return;
      }

      // -----------------------------------------------
      // Send successful login back to AppRouter
      // -----------------------------------------------

      onLoginSuccess(
        data,
        followingData
      );

    }
    catch (error) {

      console.error("Sign in error:", error);

      setError(
        "Cannot connect to Spring Boot server"
      );

    }
    finally {

      setLoading(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)"
      }}
    >

      <div className="modal-dialog modal-dialog-centered">

        <div className="modal-content">

          {/* Header */}

          <div className="modal-header">

            <h5 className="modal-title">
              Sign In
            </h5>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            >
            </button>

          </div>

          {/* Body */}

          <div className="modal-body">

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleSignIn}>

              {/* Username */}

              <div className="mb-3">

                <label className="form-label">
                  Username
                </label>

<input
  type="text"
  name="username"
  className="form-control"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  placeholder="Enter username"
  autoComplete="off"
  required
/>

              </div>

              {/* Password */}

              <div className="mb-3">

                <label className="form-label">
                  Password
                </label>
<input
  type="password"
  name="password"
  className="form-control"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Enter password"
  autoComplete="new-password"
  required
/>

              </div>

              {/* Sign In */}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >

                {loading
                  ? "Signing In..."
                  : "Sign In"
                }

              </button>

            </form>

            {/* Create Account */}

            <div className="text-center mt-3">

              <span>
                Don't have an account?
              </span>

              <button
                type="button"
                className="btn btn-link"
                onClick={onOpenSignUp}
              >
                Create Account
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default SignInModal;