function Overview({ goals }) {
  const now = new Date();

  const totalGoals = goals.length;

  const totalSaved = goals.reduce((acc, goal) => acc + goal.savedAmount, 0);

  const completedGoals = goals.filter(goal => goal.savedAmount >= goal.targetAmount).length;

  const warnings = goals.filter(goal => {
    const deadline = new Date(goal.deadline);
    const daysLeft = (deadline - now) / (1000 * 60 * 60 * 24);
    return daysLeft <= 30 && goal.savedAmount < goal.targetAmount && daysLeft > 0;
  });

  const overdueGoals = goals.filter(goal => {
    const deadline = new Date(goal.deadline);
    return deadline < now && goal.savedAmount < goal.targetAmount;
  });

  return (
    <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f3f3f3' }}>
      <h2>Overview</h2>
      <p><strong>Total Goals:</strong> {totalGoals}</p>
      <p><strong>Total Saved:</strong> ${totalSaved}</p>
      <p><strong>Completed Goals:</strong> {completedGoals}</p>

      {warnings.length > 0 && (
        <div style={{ color: 'orange' }}>
          <p>⚠️ {warnings.length} goal(s) are due within 30 days and not complete!</p>
        </div>
      )}

      {overdueGoals.length > 0 && (
        <div style={{ color: 'red' }}>
          <p>❗ {overdueGoals.length} goal(s) are overdue and incomplete!</p>
        </div>
      )}
    </div>
  );
}

export default Overview;
