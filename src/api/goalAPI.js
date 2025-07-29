const API_URL = "http://localhost:3000/goals";

export async function fetchGoals() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function addGoal(goal) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(goal),
  });
  return res.json();
}

export async function updateGoal(id, updates) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function deleteGoal(id) {
  return fetch(`${API_URL}/${id}`, { method: "DELETE" });
}
