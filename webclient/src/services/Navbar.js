import React, { useState } from "react";
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
  const [activePage, setActivePage] = useState("");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark position-fixed w-100 z-3">
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
                className={`nav-link ${
                  activePage === "habits" ? "text-info" : "text-white"
                }`}
                to="/habits"
                onClick={() => setActivePage("habits")}
              >
                Habits
              </Link>
            </li>

            {/* Following */}
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link ${
                  activePage === "following" ? "text-info" : "text-white"
                }`}
                onClick={() => {
                  setActivePage("following");
                  onFollowing();
                }}
              >
                Following
              </button>
            </li>

            {/* Tracking */}
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link ${
                  activePage === "tracking" ? "text-info" : "text-white"
                }`}
                onClick={() => {
                  setActivePage("tracking");
                  onTracking();
                }}
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

                <button className="btn btn-primary" onClick={onSignUp}>
                  Create Account
                </button>
              </>
            ) : (
              <>
                <span className="text-white me-3">{user?.name}</span>

                <button className="btn btn-outline-light" onClick={onLogout}>
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
