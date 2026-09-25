import API_URL from "./api";
// ======================================================
// ROUTES + NAVBAR
// ======================================================

import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import Navbar from "./Navbar";

import Habits from "../pages/Habits";
import Following from "../pages/Following";
import TaskPage from "../components/TaskCard";
import Tracking from "../pages/Tracking";

import SignInModal from "../components/SignInModel";
import SignUpModal from "../components/SignupModel";

export default function AppRoutes({
  // Following
  following,
  add,
  remove,

  // Authentication
  isSignedIn,
  user,

  // Authentication helper
  requireSignIn,

  // Popup controls
  openSignIn,
  openSignUp,
  logout,

  showSignIn,
  showSignUp,

  closeAuth,

  // Authentication success callbacks
  onLoginSuccess,
  onSignupSuccess,
}) {
  const navigate = useNavigate();

  // ==================================================
  // FOLLOW HABIT
  // ==================================================

  const handleFollow = async (habit, days) => {
    if (!user?.id) {
      requireSignIn(() => handleFollow(habit, days));
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/users/${user.id}/following`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            habitId: habit.id,
            days: days,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Follow failed:", errorText);

        alert("Could not follow habit");
        return;
      }

      const savedFollowing = await response.json();

      // Add the backend-generated follow dates
      add(
        {
          ...habit,
          dateFollowed: savedFollowing.dateFollowed,
          startedAt: savedFollowing.startedAt,
          endAt: savedFollowing.endAt,
        },
        days,
      );
    } catch (error) {
      console.error("Follow error:", error);
      alert("Cannot connect to Spring Boot server");
    }
  };

  // ==================================================
  // UNFOLLOW
  // ==================================================

  const handleUnfollow = (id) => {
    requireSignIn(async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/users/${user.id}/following/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          },
        );

        if (!response.ok) {
          const errorText = await response.text();

          console.error("Unfollow failed:", errorText);

          alert("Could not unfollow habit");

          return;
        }

        remove(id);
      } catch (error) {
        console.error("Unfollow error:", error);

        alert("Cannot connect to Spring Boot server");
      }
    });
  };

  // ==================================================
  // NEW HABIT CREATED
  // ==================================================

  const handleHabitCreated = (newHabit) => {
    console.log("New habit created:", newHabit);

    // Close the Add Habit popup
    // The Habits page handles this callback.
    // This callback is passed through AppRouter.
  };

  // ==================================================
  // FOLLOWING
  // ==================================================

  const openFollowing = () => {
    requireSignIn(() => {
      navigate("/following");
    });
  };

  // ==================================================
  // TRACKING
  // ==================================================

  const openTracking = () => {
    requireSignIn(() => {
      navigate("/tracking");
    });
  };

  // ==================================================
  // PROFILE
  // ==================================================

  const openProfile = () => {
    requireSignIn(() => {
      navigate("/profile");
    });
  };

  // ==================================================
  // TODAY'S TASK
  // ==================================================

  const openTask = (habit) => {
    requireSignIn(() => {
      navigate(`/following/task/${habit.id}`, {
        state: {
          habit: habit,
        },
      });
    });
  };

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = async () => {
    try {
      // Logout from Spring Boot session
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout API error:", error);
    }

    // Clear React state
    logout();

    // Go back to Habits page
    navigate("/habits", {
      replace: true,
    });

    // Refresh page
    window.location.reload();
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <>
      {/* ==================================================
          NAVBAR
      ================================================== */}

      <Navbar
        isSignedIn={isSignedIn}
        user={user}
        onFollowing={openFollowing}
        onTracking={openTracking}
        onProfile={openProfile}
        onSignIn={openSignIn}
        onSignUp={openSignUp}
        onLogout={handleLogout}
      />

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="page-container">
        <Routes>
          {/* HOME */}

          <Route path="/" element={<Navigate to="/habits" replace />} />

          {/* HABITS */}

          <Route
            path="/habits"
            element={
              <Habits
                followingHabits={following}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
                isSignedIn={isSignedIn}
                onHabitCreated={handleHabitCreated}
                requireSignIn={requireSignIn}
              />
            }
          />

          {/* FOLLOWING */}

          <Route
            path="/following"
            element={
              isSignedIn ? (
                <Following
                  followingHabits={following}
                  onUnfollow={handleUnfollow}
                  onTodayTask={openTask}
                  user={user}
                />
              ) : (
                <Navigate to="/habits" replace />
              )
            }
          />

          {/* TASK PAGE */}

          <Route
            path="/following/task/:habitId"
            element={
              isSignedIn ? (
                <TaskPage followingHabits={following} user={user} />
              ) : (
                <Navigate to="/habits" replace />
              )
            }
          />

          {/* TRACKING */}

          <Route
            path="/tracking"
            element={
              isSignedIn ? (
                <Tracking followingHabits={following} user={user} />
              ) : (
                <Navigate to="/habits" replace />
              )
            }
          />

          {/* UNKNOWN URL */}

          <Route path="*" element={<Navigate to="/habits" replace />} />
        </Routes>
      </main>

      {/* ==================================================
          SIGN IN POPUP
      ================================================== */}

      {showSignIn && (
        <SignInModal
          onClose={closeAuth}
          onLoginSuccess={onLoginSuccess}
          onOpenSignUp={openSignUp}
        />
      )}

      {/* ==================================================
          SIGN UP POPUP
      ================================================== */}

      {showSignUp && (
        <SignUpModal
          onClose={closeAuth}
          onSignupSuccess={onSignupSuccess}
          onOpenSignIn={openSignIn}
        />
      )}
    </>
  );
}





