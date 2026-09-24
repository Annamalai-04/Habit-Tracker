import { useEffect, useMemo, useState } from "react";
import HabitCard from "../components/HabitCard";
import DaysModal from "../components/DaysCard";
import NewHabitModel from "../components/NewHabitCard";

export default function Habits({
  followingHabits,
  onFollow,
  onUnfollow,
  requireSignIn,
}) {

  // --------------------------------------------------
  // State
  // --------------------------------------------------

  const [habits, setHabits] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Habit popup
  const [showNewHabit, setShowNewHabit] = useState(false);

  // --------------------------------------------------
  // Get habits from Spring Boot
  // --------------------------------------------------

  useEffect(() => {

    const loadHabits = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/habits"
        );

        if (!response.ok) {

          throw new Error(
            `Failed to load habits. HTTP ${response.status}`
          );

        }

        const data = await response.json();

        setHabits(data);

      }
      catch (err) {

        console.error(
          "Error loading habits:",
          err
        );

        setError(
          "Unable to load habits from server."
        );

      }
      finally {

        setLoading(false);

      }

    };

    loadHabits();

  }, []);

  // --------------------------------------------------
  // Open Add Habit
  // --------------------------------------------------

  const openNewHabit = () => {

    requireSignIn(() => {
      setShowNewHabit(true);
    });

  };

  // --------------------------------------------------
  // New Habit Created
  // --------------------------------------------------

  const handleHabitCreated = (newHabit) => {

    // Add newly created habit to the top
    setHabits((current) => [
      newHabit,
      ...current
    ]);

    // Close popup
    setShowNewHabit(false);

  };

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const filtered = useMemo(() => {

    return habits.filter((h) =>
      h.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [habits, search]);

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {

    return (

      <div className="container py-4">

        <div className="d-flex justify-content-between align-items-center">

          <h1>Habits</h1>

          <button
            className="btn btn-primary"
            onClick={openNewHabit}
          >
            + Add Habit
          </button>

        </div>

        <div className="text-center py-5">

          <div
            className="spinner-border text-primary"
            role="status"
          >

            <span className="visually-hidden">
              Loading...
            </span>

          </div>

          <p className="mt-3 text-secondary">
            Loading habits...
          </p>

        </div>

      </div>

    );

  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error) {

    return (

      <div className="container py-4">

        <div className="d-flex justify-content-between align-items-center">

          <h1>Habits</h1>

          <button
            className="btn btn-primary"
            onClick={openNewHabit}
          >
            + Add Habit
          </button>

        </div>

        <div className="alert alert-danger mt-4">
          {error}
        </div>

      </div>

    );

  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (

    <div className="container py-4">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

        <div>

          <h1>Habits</h1>

          <p className="text-secondary mb-0">
            Choose a habit and decide how many days you want
            to follow it.
          </p>

        </div>

        <div className="d-flex align-items-center gap-2">

          {/* Add Habit */}

          <button
            type="button"
            className="btn btn-primary"
            onClick={openNewHabit}
          >
            + Add Habit
          </button>

          {/* Following count */}

          <span className="badge text-bg-primary p-2">
            {followingHabits.length} following
          </span>

        </div>

      </div>

      {/* ==================================================
          SEARCH
      ================================================== */}

      <div className="input-group mb-4">

        <span className="input-group-text">
          <i className="bi bi-search" />
        </span>

        <input
          className="form-control"
          placeholder="Search habits..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* ==================================================
          HABIT CARDS
      ================================================== */}

      <div className="row g-4">

        {filtered.map((h) => (

          <div
            className="col-12 col-sm-6 col-lg-4 col-xl-3"
            key={h.id}
          >

            <HabitCard

              habit={h}

              isFollowing={followingHabits.some(
                (x) =>
                  String(x.id) === String(h.id)
              )}

              onFollow={setSelected}

              onUnfollow={onUnfollow}

            />

          </div>

        ))}

      </div>

      {/* ==================================================
          NO HABITS
      ================================================== */}

      {filtered.length === 0 && (

        <div className="text-center py-5">

          <p className="text-secondary">
            No habits found.
          </p>

        </div>

      )}

      {/* ==================================================
          DAYS MODAL
      ================================================== */}

      {selected && (

        <DaysModal

          habit={selected}

          onClose={() =>
            setSelected(null)
          }

          onConfirm={(days) => {

            onFollow(
              selected,
              days
            );

            setSelected(null);

          }}

        />

      )}

      {/* ==================================================
          NEW HABIT MODAL
      ================================================== */}

      {showNewHabit && (

        <NewHabitModel

          onClose={() =>
            setShowNewHabit(false)
          }

          onHabitCreated={
            handleHabitCreated
          }

        />

      )}

    </div>

  );
}
