import API_URL from "../services/api";
import { useState } from "react";

function NewHabitModel({
  onClose,
  onHabitCreated
}) {

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    hardness: "Easy"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Input changes
  // --------------------------------------------------

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // --------------------------------------------------
  // Create Habit API
  // --------------------------------------------------

  const handleNewHabit = async (e) => {

    e.preventDefault();

    setError("");

    if (!form.name.trim()) {

      setError("Habit name is required");

      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/api/habits`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          credentials: "include",

          body: JSON.stringify({
            name: form.name,
            description: form.description,
            image: form.image,
            hardness: form.hardness
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setError(
          data.error || "Could not create habit"
        );

        setLoading(false);

        return;
      }

      // Send newly created habit to parent
      onHabitCreated(data);

    }
    catch (error) {

      console.error(
        "Create habit error:",
        error
      );

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
              Add New Habit
            </h5>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            >
            </button>

          </div>

          {/* Error */}

          {error && (
            <div className="alert alert-danger m-3 mb-0">
              {error}
            </div>
          )}

          {/* Form */}

          <form onSubmit={handleNewHabit}>

            <div className="modal-body">

              {/* Habit Name */}

              <div className="mb-3">

                <label className="form-label">
                  Habit Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: Walking"
                  required
                />

              </div>

              {/* Description */}

              <div className="mb-3">

                <label className="form-label">
                  Description
                </label>

                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this habit"
                >
                </textarea>

              </div>

              {/* Image */}

              <div className="mb-3">

                <label className="form-label">
                  Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  className="form-control"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="/assets/walking.svg"
                />

              </div>

              {/* Hardness */}

              <div className="mb-3">

                <label className="form-label">
                  Hardness
                </label>

                <select
                  name="hardness"
                  className="form-select"
                  value={form.hardness}
                  onChange={handleChange}
                >

                  <option value="Easy">
                    Easy
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="Hard">
                    Hard
                  </option>

                </select>

              </div>

            </div>

            {/* Footer */}

            <div className="modal-footer">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >

                {loading
                  ? "Adding..."
                  : "Add Habit"
                }

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default NewHabitModel;




