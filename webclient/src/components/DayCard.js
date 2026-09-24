export default function DayCard({
  date,
  status,
  active
}) {

  const dayNumber =
    Number(date.substring(8, 10));

  let className =
    "border rounded p-2 text-center";

  let statusText = "";

  // ==================================================
  // COMPLETED
  // ==================================================

  if (status === "completed") {

    className +=
      " bg-success text-white";

    statusText = "Completed";
  }

  // ==================================================
  // INCOMPLETE
  // ==================================================

  else if (status === "incomplete") {

    className +=
      " bg-warning text-dark";

    statusText = "Incomplete";
  }

  // ==================================================
  // SKIPPED
  // ==================================================

  else if (status === "skipped") {

    className +=
      " bg-danger text-white";

    statusText = "Skipped";
  }

  // ==================================================
  // FOLLOWING DAY WITH NO ACTION
  // ==================================================

  else if (active) {

    className +=
      " border-primary bg-light";

    statusText = "No action";
  }

  // ==================================================
  // OUTSIDE FOLLOW PERIOD
  // ==================================================

  else {

    className +=
      " bg-light text-secondary";
  }

  return (

    <div
      className={className}
      title={statusText}
      style={{
        minWidth: "45px",
        minHeight: "50px"
      }}
    >

      <div className="fw-bold">
        {dayNumber}
      </div>

      {status && (
        <small>
          {status === "completed"
            ? "✓"
            : status === "incomplete"
            ? "!"
            : "×"
          }
        </small>
      )}

    </div>
  );
}