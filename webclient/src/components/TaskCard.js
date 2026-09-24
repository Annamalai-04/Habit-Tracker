import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function TaskPage({ user }) {

  const navigate = useNavigate();

  const { state } = useLocation();

  const habit = state?.habit;

  const [form, setForm] = useState({
    status: "",
    duration: "",
    note: ""
  });

  const [saving, setSaving] = useState(false);

  // ==================================================
  // NO HABIT
  // ==================================================

  if (!habit) {

    return (
      <div className="container py-5">

        <div className="alert alert-warning">
          Task not found. Go back to Following.
        </div>

      </div>
    );
  }

  // ==================================================
  // INPUT CHANGE
  // ==================================================

  const change = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // ==================================================
  // SAVE TODAY'S TASK
  // ==================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    // No default status
    if (!form.status) {

      alert("Please select task status.");

      return;
    }

    if (!user?.id) {

      alert("Please sign in again.");

      return;
    }

    setSaving(true);

    try {

      const response = await fetch(
        `http://localhost:8080/api/users/${user.id}/tasks`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          credentials: "include",

          body: JSON.stringify({
            habitId: habit.id,

            status: form.status,

            durationMinutes:
              form.duration
                ? Number(form.duration)
                : null,

            note: form.note
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        console.error(
          "Task save failed:",
          data
        );

        alert(
          data.error ||
          "Could not save today's task"
        );

        return;
      }

      console.log(
        "Today's task saved:",
        data
      );

      // Go back to Following after save
      navigate("/following");

    }
    catch (error) {

      console.error(
        "Task save error:",
        error
      );

      alert(
        "Cannot connect to Spring Boot server"
      );

    }
    finally {

      setSaving(false);
    }
  };

  return (

    <div className="task-overlay-backdrop">

      <div className="task-overlay p-4">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div className="d-flex align-items-center gap-3">

            <img
              src={habit.image}
              width="70"
              height="70"
              className="rounded-3"
              style={{
                objectFit: "cover"
              }}
              alt={habit.name}
            />

            <div>

              <h3 className="mb-1">
                {habit.name}
              </h3>

              <span className="badge text-bg-primary">
                Today's Task
              </span>

            </div>

          </div>

          <button
            className="close-task"
            onClick={() =>
              navigate("/following")
            }
          >
            ×
          </button>

        </div>

        {/* ==================================================
            FORM
        ================================================== */}

        <form onSubmit={handleSubmit}>

          {/* STATUS */}

          <div className="mb-3">

            <label className="form-label fw-semibold">
              Task Status
            </label>

            <select
              name="status"
              className="form-select"
              value={form.status}
              onChange={change}
              required
            >

              <option value="">
                Select status
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="incomplete">
                Incomplete
              </option>

              <option value="skipped">
                Skipped
              </option>

            </select>

          </div>

          {/* DURATION */}

          <div className="mb-3">

            <label className="form-label fw-semibold">
              Duration
            </label>

            <div className="input-group">

              <input
                type="number"
                min="0"
                name="duration"
                className="form-control"
                value={form.duration}
                onChange={change}
                placeholder="30"
              />

              <span className="input-group-text">
                minutes
              </span>

            </div>

          </div>

          {/* NOTE */}

          <div className="mb-4">

            <label className="form-label fw-semibold">
              Details / Note
            </label>

            <textarea
              name="note"
              rows="5"
              className="form-control"
              value={form.note}
              onChange={change}
              placeholder="Write your details..."
            />

          </div>

          {/* BUTTONS */}

          <div className="d-flex gap-2">

            <button
              type="button"
              className="btn btn-outline-secondary flex-fill"
              onClick={() =>
                navigate("/following")
              }
            >
              Close
            </button>

            <button
              type="submit"
              className="btn btn-success flex-fill"
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : "Save Task"
              }

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}