function GoalCard({ goal, onDeleteGoal }) {
  const {
    id,
    name,
    targetAmount,
    savedAmount,
    category,
    deadline,
    createdAt,
  } = goal;

  const remaining = targetAmount - savedAmount;
  const progressPercent = Math.min((savedAmount / targetAmount) * 100, 100).toFixed(1);
  const isComplete = savedAmount >= targetAmount;

  return (
    <div style={{ border: '1px solid gray', marginBottom: '1rem', padding: '1rem' }}>
      <h3>{name}</h3>
      <p><strong>Category:</strong> {category}</p>
      <p><strong>Target:</strong> ${targetAmount}</p>
      <p><strong>Saved:</strong> ${savedAmount}</p>
      <p><strong>Remaining:</strong> ${remaining}</p>
      <p><strong>Deadline:</strong> {deadline}</p>
      <p><strong>Created:</strong> {createdAt}</p>

      
      <div style={{ background: '#eee', height: '15px', width: '100%' }}>
        <div
          style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: isComplete ? 'green' : 'dodgerblue',
          }}
        ></div>
      </div>
      <p>{progressPercent}% complete</p>

      <button onClick={() => onDeleteGoal(id)}>Delete</button>
    </div>
  );
}

export default GoalCard;
