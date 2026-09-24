import { BrowserRouter } from "react-router-dom";
import { useState } from "react";
import AppRoutes from "./services/AppRouter";

export default function App() {

  // --------------------------------------------------
  // Following habits
  // --------------------------------------------------

  const [following, setFollowing] = useState([]);

  // --------------------------------------------------
  // Authentication
  // --------------------------------------------------

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);

  // --------------------------------------------------
  // Authentication popup state
  // --------------------------------------------------

  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // --------------------------------------------------
  // Action waiting for sign in
  // --------------------------------------------------

  const [pendingAction, setPendingAction] = useState(null);

  // --------------------------------------------------
  // Add following habit
  // --------------------------------------------------

  const add = (habit, days) => {
    setFollowing((current) =>
      current.some((x) => x.id === habit.id)
        ? current
        : [...current, { ...habit, followDays: days }]
    );
  };

  // --------------------------------------------------
  // Remove following habit
  // --------------------------------------------------

  const remove = (id) => {
    setFollowing((current) =>
      current.filter((x) => x.id !== id)
    );
  };

  // --------------------------------------------------
  // Authentication helper
  // --------------------------------------------------

  const requireSignIn = (action) => {

    if (!isSignedIn) {

      setPendingAction(() => action);

      setShowSignIn(true);
      setShowSignUp(false);

      return;
    }

    action();
  };

  // --------------------------------------------------
  // Login success
  // --------------------------------------------------

  const handleLoginSuccess = (loginData, followingData) => {

    setUser({
      id: loginData.userId,
      username: loginData.username,
      name: loginData.name,
      email: loginData.email
    });

    // Load following habits
    if (Array.isArray(followingData)) {
      setFollowing(followingData);
    }
    else if (Array.isArray(followingData?.followingHabits)) {
      setFollowing(followingData.followingHabits);
    }
    else if (Array.isArray(followingData?.habits)) {
      setFollowing(followingData.habits);
    }
    else {
      setFollowing([]);
    }

    setIsSignedIn(true);

    setShowSignIn(false);
    setShowSignUp(false);

    // Execute action that was waiting for login
    if (pendingAction) {

      const action = pendingAction;

      setPendingAction(null);

      setTimeout(() => {
        action();
      }, 0);
    }
  };

  // --------------------------------------------------
  // Signup success
  // --------------------------------------------------

  const handleSignupSuccess = (signupData) => {

    const newUser = {
      id: signupData.userId,
      name: signupData.name,
      username: signupData.username,
      email: signupData.email,
      dob: signupData.dob
    };

    setUser(newUser);

    setIsSignedIn(true);

    setShowSignUp(false);
    setShowSignIn(false);

    // Execute pending action
    if (pendingAction) {

      const action = pendingAction;

      setPendingAction(null);

      setTimeout(() => {
        action();
      }, 0);
    }
  };

  // --------------------------------------------------
  // Open Sign In
  // --------------------------------------------------

  const openSignIn = () => {
    setShowSignIn(true);
    setShowSignUp(false);
  };

  // --------------------------------------------------
  // Open Sign Up
  // --------------------------------------------------

  const openSignUp = () => {
    setShowSignUp(true);
    setShowSignIn(false);
  };

  // --------------------------------------------------
  // Close authentication popup
  // --------------------------------------------------

  const closeAuth = () => {
    setShowSignIn(false);
    setShowSignUp(false);
  };

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------

  const logout = () => {

    setUser(null);
    setIsSignedIn(false);

    setFollowing([]);

    setShowSignIn(false);
    setShowSignUp(false);

    setPendingAction(null);
  };

  return (
    <BrowserRouter>

      <AppRoutes

        following={following}
        add={add}
        remove={remove}

        isSignedIn={isSignedIn}
        user={user}

        requireSignIn={requireSignIn}

        openSignIn={openSignIn}
        openSignUp={openSignUp}

        logout={logout}

        showSignIn={showSignIn}
        showSignUp={showSignUp}

        closeAuth={closeAuth}

        onLoginSuccess={handleLoginSuccess}
        onSignupSuccess={handleSignupSuccess}

      />

    </BrowserRouter>
  );
}
