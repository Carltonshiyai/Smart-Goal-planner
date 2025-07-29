import { useState } from 'react';

function AddGoalForm({ onAddGoal }) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    const newGoal = {
      name,
      targetAmount: parseFloat(targetAmount),
      savedAmount: 0,
      category,
      deadline,
      createdAt: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };

    onAddGoal(newGoal);

    // Clear form
    setName('');
    setTargetAmount('');
    setCategory('');
    setDeadline('');
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h2>Add New Goal</h2>
      
      <div>
        <label>Goal Name:</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)} 
          required
        />
      </div>

      <div>
        <label>Target Amount:</label>
        <input 
          type="number" 
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)} 
          required
        />
      </div>

      <div>
        <label>Category:</label>
        <input 
          type="text" 
          value={category}
          onChange={(e) => setCategory(e.target.value)} 
          required
        />
      </div>

      <div>
        <label>Deadline:</label>
        <input 
          type="date" 
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)} 
          required
        />
      </div>

      <button type="submit">Add Goal</button>
    </form>
  );
}

export default AddGoalForm;
