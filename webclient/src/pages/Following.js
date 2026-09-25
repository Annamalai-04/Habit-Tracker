import API_URL from "../services/api";
import { useEffect, useState } from "react";

export default function Following({
  followingHabits,
  onUnfollow,
  onTodayTask,
  user,
}) {
  const [tracking, setTracking] = useState({
    completed: {},
    incomplete: {},
    skipped: {},
  });

  // ==================================================
  // LOAD TRACKING
  // ==================================================

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const loadTracking = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/users/${user.id}/tracking`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Could not load tracking");
        }

        const data = await response.json();

        setTracking({
          completed: data.completed || {},
          incomplete: data.incomplete || {},
          skipped: data.skipped || {},
        });
      } catch (error) {
        console.error("Tracking loading error:", error);
      }
    };

    loadTracking();
  }, [user]);

  // ==================================================
  // TODAY
  // ==================================================

  const today = new Date().toISOString().split("T")[0];

  // ==================================================
  // CHECK ACTIVE FOLLOW PERIOD
  // ==================================================

  const isActiveToday = (habit) => {
    const start = habit.dateFollowed || habit.startedAt;

    const end = habit.endAt;

    if (!start || !end) {
      return false;
    }

    return today >= start && today <= end;
  };

  // ==================================================
  // COUNT STATUS
  // ==================================================

  const getCount = (map, habitId) => {
    return map?.[habitId]?.length || 0;
  };

  // ==================================================
  // TODAY STATUS
  // ==================================================

  const getTodayStatus = (habitId) => {
    const d = new Date();

    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(d.getDate()).padStart(2, "0")}`;

    const completed = tracking.completed?.[habitId] || [];

    const incomplete = tracking.incomplete?.[habitId] || [];

    const skipped = tracking.skipped?.[habitId] || [];

    if (completed.some((date) => date.substring(0, 10) === today)) {
      return "completed";
    }

    if (incomplete.some((date) => date.substring(0, 10) === today)) {
      return "incomplete";
    }

    if (skipped.some((date) => date.substring(0, 10) === today)) {
      return "skipped";
    }

    return "";
  };

  // ==================================================
  // NO FOLLOWING HABITS
  // ==================================================

  if (!followingHabits || followingHabits.length === 0) {
    return (
      <div className="container py-5">
        <h1 className="text-white">Following</h1>

        <div className="alert alert-info mt-4 text-white">
          You are not following any habits yet.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-4">
        <h1 className="text-white">Following</h1>

        <p className="text-secondary text-white">Habits you are currently following.</p>
      </div>

      {/* ==================================================
          HABITS
      ================================================== */}

      <div className="row g-4">
        {followingHabits.map((habit) => {
          const activeToday = isActiveToday(habit);

          const status = getTodayStatus(habit.id);

          const completedCount = getCount(tracking.completed, habit.id);

          const incompleteCount = getCount(tracking.incomplete, habit.id);

          const skippedCount = getCount(tracking.skipped, habit.id);

          const todayStatus = getTodayStatus(habit.id);

          return (
            <div className="col-12 col-md-6 col-lg-4" key={habit.id}>
              <div className="card shadow-sm h-100">
                {/* IMAGE */}

                <img
                  src={habit.image}
                  className="card-img-top"
                  alt={habit.name}
                  style={{
                    height: "180px",
                    objectFit: "cover",
                  }}
                />

                <div className="card-body">
                  {/* NAME */}

                  <div className="d-flex justify-content-between align-items-start">
                    <h4 className="card-title">{habit.name}</h4>

                    <span
                      className={`badge ${
                        habit.hardness === "Hard"
                          ? "text-bg-danger"
                          : habit.hardness === "Medium"
                            ? "text-bg-warning"
                            : "text-bg-success"
                      }`}
                    >
                      {habit.hardness}
                    </span>
                  </div>

                  {/* DESCRIPTION */}

                  <p className="text-secondary">{habit.description}</p>

                  {/* FOLLOW DATES */}

                  <div className="small text-secondary mb-3">
                    <div>
                      Followed: {habit.dateFollowed || habit.startedAt || "-"}
                    </div>

                    <div>Ends: {habit.endAt || "-"}</div>
                  </div>

                  {/* ==================================================
                      TODAY STATUS
                  ================================================== */}

                  {status === "completed" && (
                    <div className="alert alert-success py-2">
                      ✓ Today's task completed
                    </div>
                  )}

                  {status === "incomplete" && (
                    <div className="alert alert-warning py-2">
                      ! Today's task incomplete
                    </div>
                  )}

                  {status === "skipped" && (
                    <div className="alert alert-danger py-2">
                      × Today's task skipped
                    </div>
                  )}

                  {!status && activeToday && (
                    <div className="alert alert-light border py-2">
                      Today's task not marked yet.
                    </div>
                  )}

                  {/* ==================================================
                      COUNTS
                  ================================================== */}

                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className="badge bg-success">
                      Completed: {completedCount}
                    </span>

                    <span className="badge bg-warning text-dark">
                      Incomplete: {incompleteCount}
                    </span>

                    <span className="badge bg-danger">
                      Skipped: {skippedCount}
                    </span>
                  </div>

                  {/* ==================================================
                      TODAY'S TASK
                  ================================================== */}

                  {activeToday ? (
                    <button
                      className="btn btn-primary w-100 mb-2"
                      onClick={() => onTodayTask(habit)}
                      disabled={!!todayStatus}
                    >
                      {todayStatus
                        ? `Today's Task - ${todayStatus}`
                        : "Today's Task"}
                    </button>
                  ) : (
                    <button className="btn btn-secondary w-100 mb-2" disabled>
                      Follow period ended
                    </button>
                  )}

                  {/* ==================================================
                      UNFOLLOW
                  ================================================== */}

                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={() => onUnfollow(habit.id)}
                  >
                    Unfollow
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}





