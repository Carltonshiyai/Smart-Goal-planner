import { useEffect, useState } from 'react';
import { fetchGoals, addGoal, updateGoal, deleteGoal } from './api/goalAPI';
import GoalList from './components/GoalList';
import AddGoalForm from './components/AddGoalForm';
import DepositForm from './components/DepositForm';
import Overview from './components/Overview';
import './App.css'

function App() {
   const [goals, setGoals] = useState([]);

  useEffect(() => {
    fetchGoals().then(setGoals);
  }, []);

  function handleAddGoal(goalData) {
    addGoal(goalData).then(newGoal => {
      setGoals(prev => [...prev, newGoal]);
    });
  }

  function handleUpdateGoal(id, updates) {
    updateGoal(id, updates).then(updatedGoal => {
      setGoals(prev =>
        prev.map(goal => (goal.id === id ? updatedGoal : goal))
      );
    });
  }

  function handleDeleteGoal(id) {
    deleteGoal(id).then(() => {
      setGoals(prev => prev.filter(goal => goal.id !== id));
    });
  }

return (
    <div>
      <h1>Smart Goal Planner</h1>
      <Overview goals={goals} />
      <AddGoalForm onAddGoal={handleAddGoal} />
      <DepositForm goals={goals} onUpdateGoal={handleUpdateGoal} />
      <GoalList
        goals={goals}
        onUpdateGoal={handleUpdateGoal}
        onDeleteGoal={handleDeleteGoal}
      />
    </div>
  );
}
 
export default App

