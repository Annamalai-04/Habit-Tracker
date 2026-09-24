export default function HabitCard({
  habit,
  isFollowing,
  onFollow,
  onUnfollow,
}) {
  const badge = {
    Easy: "text-bg-success",
    Medium: "text-bg-warning",
    Hard: "text-bg-danger",
  }[habit.hardness];
  return (
    <div className="card habit-card h-100 shadow-sm">
      <div className="habit-image-wrap">
        <img src={habit.image} alt={habit.name} className="habit-image" />
      </div>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between gap-2">
          <h5>{habit.name}</h5>
          <span className={`badge ${badge}`}>{habit.hardness}</span>
        </div>
        <p className="text-secondary small flex-grow-1">{habit.description}</p>
        <p className="text-secondary small">
          <i className="bi bi-people me-1" />
          {habit.followers} following
        </p>
        {isFollowing ? (
          <button
            className="btn btn-outline-danger w-100"
            onClick={() => onUnfollow(habit.id)}
          >
            Unfollow
          </button>
        ) : (
          <button
            className="btn btn-primary w-100"
            onClick={() => onFollow(habit)}
          >
            Follow
          </button>
        )}
      </div>
    </div>
  );
}
