import GoalCard from './GoalCard';
function GoalList({ goals, onDeleteGoal }) {
  return (
    <div>
      <h2>All Goals</h2>
      {goals.length === 0 ? (
        <p>No goals yet. Add one above!</p>
      ) : (
        goals.map(goal => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onDeleteGoal={onDeleteGoal}
          />
        ))
      )}
    </div>
  );
}

export default GoalList;
