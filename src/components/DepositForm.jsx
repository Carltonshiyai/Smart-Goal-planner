import { useState } from 'react';

function DepositForm({ goals, onUpdateGoal }) {
  const [goalId, setGoalId] = useState('');
  const [amount, setAmount] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    const selectedGoal = goals.find(goal => goal.id === goalId);
    if (!selectedGoal) return;

    const updatedAmount = selectedGoal.savedAmount + parseFloat(amount);

    onUpdateGoal(goalId, { savedAmount: updatedAmount });

   
    setGoalId('');
    setAmount('');
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h2>Make a Deposit</h2>

      <div>
        <label>Select Goal:</label>
        <select
          value={goalId}
          onChange={(e) => setGoalId(e.target.value)}
          required
        >
          <option value="">-- Choose a goal --</option>
          {goals.map(goal => (
            <option key={goal.id} value={goal.id}>
              {goal.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          min="1"
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <button type="submit">Deposit</button>
    </form>
  );
}

export default DepositForm;
