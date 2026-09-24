import React from "react";
import { Link } from "react-router-dom";

function Navbar({
  isSignedIn,
  user,
  onFollowing,
  onTracking,
  onSignIn,
  onSignUp,
  onLogout,
}) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand" to="/habits">
          Habit Tracker
        </Link>

        {/* Mobile button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#habitNav"
          aria-controls="habitNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="habitNav">

          <ul className="navbar-nav ms-auto">

            {/* Habits - always public */}
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/habits"
              >
                Habits
              </Link>
            </li>

            {/* Following */}
            <li className="nav-item">
              <button
                className="nav-link btn btn-link"
                onClick={onFollowing}
              >
                Following
              </button>
            </li>

            {/* Tracking */}
            <li className="nav-item">
              <button
                className="nav-link btn btn-link"
                onClick={onTracking}
              >
                Tracking
              </button>
            </li>

          </ul>

          {/* Right side */}
          <div className="ms-lg-3">

            {!isSignedIn ? (
              <>
                <button
                  className="btn btn-outline-light me-2"
                  onClick={onSignIn}
                >
                  Sign In
                </button>

                <button
                  className="btn btn-primary"
                  onClick={onSignUp}
                >
                  Create Account
                </button>
              </>
            ) : (
              <>
                <span className="text-white me-3">
                  {user?.name}
                </span>

                <button
                  className="btn btn-outline-light"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;