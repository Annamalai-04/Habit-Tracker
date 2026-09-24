import { useState } from "react";

export default function DaysModal({
  habit,
  onClose,
  onConfirm
}) {

  const [days, setDays] = useState("");

  const validDays =
    Number(days) >= 1 &&
    Number(days) <= 365;

  return (

    <div
      className="days-modal-backdrop"
      onMouseDown={onClose}
    >

      <div
        className="days-modal p-4"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >

        <div className="d-flex justify-content-between">

          <div>

            <h4>
              Follow {habit.name}
            </h4>

            <p className="text-secondary">
              How many days do you want to follow this habit?
            </p>

          </div>

          <button
            className="btn-close"
            onClick={onClose}
          />

        </div>

        <label className="form-label fw-semibold">
          Number of days
        </label>

        <input
          type="number"
          min="1"
          max="365"
          className="form-control form-control-lg"
          value={days}
          onChange={(e) =>
            setDays(e.target.value)
          }
          placeholder="Enter number of days"
        />

        <div className="d-flex flex-wrap gap-2 mt-3">

          {[7, 21, 30, 60, 90].map((n) => (

            <button
              type="button"
              className={`btn ${
                Number(days) === n
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              key={n}
              onClick={() =>
                setDays(n)
              }
            >
              {n} days
            </button>

          ))}

        </div>

        <div className="d-flex gap-2 mt-4">

          <button
            className="btn btn-outline-secondary flex-fill"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn btn-primary flex-fill"
            disabled={!validDays}
            onClick={() =>
              onConfirm(Number(days))
            }
          >
            Start following
          </button>

        </div>

      </div>

    </div>
  );
}