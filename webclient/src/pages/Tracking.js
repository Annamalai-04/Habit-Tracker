import { useEffect, useMemo, useState } from "react";

export default function Tracking({ followingHabits, user }) {
  const [tracking, setTracking] = useState({
    completed: {},
    incomplete: {},
    skipped: {}
  });

  const [loadingTracking, setLoadingTracking] = useState(true);

  // Stores the currently selected month for each habit
  const [selectedMonths, setSelectedMonths] = useState({});

  // --------------------------------------------------
  // Normalize date
  // --------------------------------------------------

  const normalizeDate = (value) => {
    if (!value) return null;

    if (typeof value === "string") {
      return value.substring(0, 10);
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
  };

  // --------------------------------------------------
  // Local date
  // --------------------------------------------------

  const getLocalDate = (date) => {
    return `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
  };

  // --------------------------------------------------
  // Load tracking
  // --------------------------------------------------

  useEffect(() => {
    if (!user?.id) {
      setLoadingTracking(false);
      return;
    }

    const loadTracking = async () => {
      setLoadingTracking(true);

      try {
        const response = await fetch(
          `/api/users/${user.id}/tracking`,
          {
            method: "GET",
            credentials: "include"
          }
        );

        if (!response.ok) {
          throw new Error("Could not load tracking");
        }

        const data = await response.json();

        setTracking({
          completed: data.completed || {},
          incomplete: data.incomplete || {},
          skipped: data.skipped || {}
        });
      } catch (error) {
        console.error(
          "Tracking loading error:",
          error
        );
      } finally {
        setLoadingTracking(false);
      }
    };

    loadTracking();
  }, [user]);

  // --------------------------------------------------
  // Get today's date
  // --------------------------------------------------

  const today = useMemo(() => {
    return getLocalDate(new Date());
  }, []);

  // --------------------------------------------------
  // Get habit start date
  // --------------------------------------------------

  const getStartDate = (habit) => {
    return normalizeDate(
      habit.dateFollowed || habit.startedAt
    );
  };

  // --------------------------------------------------
  // Get habit end date
  // --------------------------------------------------

  const getEndDate = (habit) => {
    return normalizeDate(habit.endAt);
  };

  // --------------------------------------------------
  // Check date inside follow period
  // --------------------------------------------------

  const isInsideFollowPeriod = (
    date,
    startDate,
    endDate
  ) => {
    if (!startDate || !endDate) {
      return false;
    }

    return date >= startDate && date <= endDate;
  };

  // --------------------------------------------------
  // Get all months between two dates
  // --------------------------------------------------

  const getMonthsBetween = (
    startDate,
    endDate
  ) => {
    const start = new Date(
      `${startDate}T00:00:00`
    );

    const end = new Date(
      `${endDate}T00:00:00`
    );

    const months = [];

    let current = new Date(
      start.getFullYear(),
      start.getMonth(),
      1
    );

    const lastMonth = new Date(
      end.getFullYear(),
      end.getMonth(),
      1
    );

    while (current <= lastMonth) {
      months.push({
        year: current.getFullYear(),
        month: current.getMonth()
      });

      current = new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        1
      );
    }

    return months;
  };

  // --------------------------------------------------
  // Get days in selected month
  // --------------------------------------------------

  const getDaysInMonth = (
    year,
    month
  ) => {
    const numberOfDays = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const days = [];

    for (
      let day = 1;
      day <= numberOfDays;
      day++
    ) {
      const date = `${year}-${String(
        month + 1
      ).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;

      days.push({
        day,
        date
      });
    }

    return days;
  };

  // --------------------------------------------------
  // Get month name
  // --------------------------------------------------

  const getMonthName = (
    year,
    month
  ) => {
    return new Date(
      year,
      month,
      1
    ).toLocaleString("default", {
      month: "long",
      year: "numeric"
    });
  };

  // --------------------------------------------------
  // Get status for a particular date
  // --------------------------------------------------

  const getStatus = (
    habitId,
    date
  ) => {
    const completed =
      tracking.completed?.[habitId] || [];

    const incomplete =
      tracking.incomplete?.[habitId] || [];

    const skipped =
      tracking.skipped?.[habitId] || [];

    if (
      completed.some(
        (item) =>
          normalizeDate(item) === date
      )
    ) {
      return "completed";
    }

    if (
      incomplete.some(
        (item) =>
          normalizeDate(item) === date
      )
    ) {
      return "incomplete";
    }

    if (
      skipped.some(
        (item) =>
          normalizeDate(item) === date
      )
    ) {
      return "skipped";
    }

    return "";
  };

  // --------------------------------------------------
  // Count completed/incomplete/skipped
  // --------------------------------------------------

  const getCounts = (habit) => {
    const habitId = habit.id;

    const startDate =
      getStartDate(habit);

    const endDate =
      getEndDate(habit);

    let completed = 0;
    let incomplete = 0;
    let skipped = 0;

    if (!startDate || !endDate) {
      return {
        completed,
        incomplete,
        skipped
      };
    }

    const completedDates =
      tracking.completed?.[habitId] || [];

    const incompleteDates =
      tracking.incomplete?.[habitId] || [];

    const skippedDates =
      tracking.skipped?.[habitId] || [];

    completedDates.forEach(
      (item) => {
        const date =
          normalizeDate(item);

        if (
          date &&
          isInsideFollowPeriod(
            date,
            startDate,
            endDate
          )
        ) {
          completed++;
        }
      }
    );

    incompleteDates.forEach(
      (item) => {
        const date =
          normalizeDate(item);

        if (
          date &&
          isInsideFollowPeriod(
            date,
            startDate,
            endDate
          )
        ) {
          incomplete++;
        }
      }
    );

    skippedDates.forEach(
      (item) => {
        const date =
          normalizeDate(item);

        if (
          date &&
          isInsideFollowPeriod(
            date,
            startDate,
            endDate
          )
        ) {
          skipped++;
        }
      }
    );

    return {
      completed,
      incomplete,
      skipped
    };
  };

  // --------------------------------------------------
  // Day style
  // --------------------------------------------------

  const getDayStyle = (
    status,
    active
  ) => {
    if (!active) {
      return {
        backgroundColor: "#f1f3f5",
        color: "#adb5bd",
        border: "1px solid #dee2e6"
      };
    }

    if (status === "completed") {
      return {
        backgroundColor: "#198754",
        color: "white",
        border: "1px solid #198754"
      };
    }

    if (status === "incomplete") {
      return {
        backgroundColor: "#ffc107",
        color: "#212529",
        border: "1px solid #ffc107"
      };
    }

    if (status === "skipped") {
      return {
        backgroundColor: "#dc3545",
        color: "white",
        border: "1px solid #dc3545"
      };
    }

    return {
      backgroundColor: "#f8f9fa",
      color: "#212529",
      border: "1px solid #0d6efd"
    };
  };

  // --------------------------------------------------
  // Change selected month
  // --------------------------------------------------

  const changeMonth = (
    habitId,
    newIndex
  ) => {
    setSelectedMonths((previous) => ({
      ...previous,
      [habitId]: newIndex
    }));
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loadingTracking) {
    return (
      <div className="container py-5">
        <div className="text-center">

          <div
            className="spinner-border"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <div className="mt-2">
            Loading tracking...
          </div>

        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // No habits
  // --------------------------------------------------

  if (
    !followingHabits ||
    followingHabits.length === 0
  ) {
    return (
      <div className="container py-5">

        <h1>Tracking</h1>

        <div className="alert alert-info mt-4">
          You are not following any habits yet.
        </div>

      </div>
    );
  }

  // --------------------------------------------------
  // Main UI
  // --------------------------------------------------

  return (
    <div className="container py-4">

      <h1 className="mb-2">
        Tracking
      </h1>

      <p className="text-muted mb-4">
        Your complete habit progress
      </p>

      {followingHabits.map(
        (habit) => {
          const habitId = habit.id;

          const startDate =
            getStartDate(habit);

          const endDate =
            getEndDate(habit);

          if (
            !startDate ||
            !endDate
          ) {
            return (
              <div
                key={habitId}
                className="card shadow-sm mb-4"
              >
                <div className="card-body">

                  <h3 className="h5">
                    {habit.name}
                  </h3>

                  <div className="alert alert-warning mb-0">
                    Follow dates are not available.
                  </div>

                </div>
              </div>
            );
          }

          // --------------------------------------------
          // All months for this habit
          // --------------------------------------------

          const months =
            getMonthsBetween(
              startDate,
              endDate
            );

          // --------------------------------------------
          // Default month
          //
          // If today's date is inside the habit period,
          // open today's month.
          //
          // Otherwise open the first month.
          // --------------------------------------------

          const todayMonthIndex =
            months.findIndex(
              ({ year, month }) => {
                const firstDay =
                  `${year}-${String(
                    month + 1
                  ).padStart(2, "0")}-01`;

                const lastDay =
                  `${year}-${String(
                    month + 1
                  ).padStart(2, "0")}-${String(
                    new Date(
                      year,
                      month + 1,
                      0
                    ).getDate()
                  ).padStart(2, "0")}`;

                return (
                  today >= firstDay &&
                  today <= lastDay
                );
              }
            );

          const defaultMonthIndex =
            todayMonthIndex >= 0
              ? todayMonthIndex
              : 0;

          const currentMonthIndex =
            selectedMonths[habitId] ??
            defaultMonthIndex;

          const selectedMonth =
            months[currentMonthIndex];

          const days =
            getDaysInMonth(
              selectedMonth.year,
              selectedMonth.month
            );

          const counts =
            getCounts(habit);

          return (
            <div
              key={habitId}
              className="card shadow-sm mb-4"
            >

              <div className="card-body">

                {/* --------------------------------------
                    HABIT NAME
                -------------------------------------- */}

                <h3 className="h5 mb-1">
                  {habit.name}
                </h3>

                <div className="small text-muted mb-3">
                  Followed from {startDate} to{" "}
                  {endDate}
                </div>

                {/* --------------------------------------
                    MONTH NAVIGATION
                -------------------------------------- */}

                <div className="d-flex justify-content-between align-items-center mb-3">

                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    disabled={
                      currentMonthIndex === 0
                    }
                    onClick={() =>
                      changeMonth(
                        habitId,
                        currentMonthIndex - 1
                      )
                    }
                  >
                    &lt;
                  </button>

                  <h4 className="h6 mb-0">
                    {getMonthName(
                      selectedMonth.year,
                      selectedMonth.month
                    )}
                  </h4>

                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    disabled={
                      currentMonthIndex ===
                      months.length - 1
                    }
                    onClick={() =>
                      changeMonth(
                        habitId,
                        currentMonthIndex + 1
                      )
                    }
                  >
                    &gt;
                  </button>

                </div>

                {/* --------------------------------------
                    DAYS
                -------------------------------------- */}

                <div className="d-flex flex-wrap gap-2">

                  {days.map(
                    ({
                      day,
                      date
                    }) => {

                      const active =
                        isInsideFollowPeriod(
                          date,
                          startDate,
                          endDate
                        );

                      const status =
                        active
                          ? getStatus(
                              habitId,
                              date
                            )
                          : "";

                      const style =
                        getDayStyle(
                          status,
                          active
                        );

                      return (
                        <div
                          key={date}
                          title={
                            active
                              ? `${date}${
                                  status
                                    ? ` - ${status}`
                                    : ""
                                }`
                              : `${date} - outside follow period`
                          }
                          style={{
                            ...style,
                            width: "42px",
                            height: "42px",
                            borderRadius: "6px",
                            display: "flex",
                            flexDirection:
                              "column",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            fontSize: "13px",
                            fontWeight: "600"
                          }}
                        >

                          <span>
                            {day}
                          </span>

                          {status ===
                            "completed" && (
                            <span
                              style={{
                                fontSize:
                                  "12px",
                                lineHeight:
                                  "10px"
                              }}
                            >
                              ✓
                            </span>
                          )}

                          {status ===
                            "incomplete" && (
                            <span
                              style={{
                                fontSize:
                                  "10px",
                                lineHeight:
                                  "10px"
                              }}
                            >
                              !
                            </span>
                          )}

                          {status ===
                            "skipped" && (
                            <span
                              style={{
                                fontSize:
                                  "10px",
                                lineHeight:
                                  "10px"
                              }}
                            >
                              ×
                            </span>
                          )}

                          {date === today &&
                            active &&
                            !status && (
                              <span
                                style={{
                                  fontSize:
                                    "7px",
                                  lineHeight:
                                    "8px"
                                }}
                              >
                                Today
                              </span>
                            )}

                        </div>
                      );
                    }
                  )}

                </div>

                {/* --------------------------------------
                    COUNTS
                -------------------------------------- */}

                <div className="d-flex flex-wrap gap-2 mt-4">

                  <span className="badge text-bg-success">
                    Completed:{" "}
                    {counts.completed}
                  </span>

                  <span className="badge text-bg-warning">
                    Incomplete:{" "}
                    {counts.incomplete}
                  </span>

                  <span className="badge text-bg-danger">
                    Skipped:{" "}
                    {counts.skipped}
                  </span>

                </div>

              </div>
            </div>
          );
        }
      )}

    </div>
  );
}
