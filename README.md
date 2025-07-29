Smart Goal Planner
Project Overview
The Smart Goal Planner is a financial tool designed to help users manage multiple savings goals, allocate deposits across them, and track their progress effectively. This application simulates a full Create, Read, Update, and Delete (CRUD) functionality by interacting with a local db.json file served via json-server.

Core Features
This application provides a comprehensive goal management dashboard where users can:

Add New Financial Goals: Users can create new savings goals (e.g., "Travel Fund", "Emergency Fund") with a name, target amount, category, and deadline.

Track Progress: For each goal, the application displays:

The total amount saved against the target.

The remaining amount needed.

A visual progress bar.

Make Deposits: Users can add an amount and select a specific goal to deposit funds into. This updates the savedAmount for the chosen goal and reflects the progress instantly.

Manage Goals (CRUD Operations):

Create: Add new goals, which are persisted to db.json via POST requests.

Read: The initial list of goals is fetched from db.json upon loading.

Update: Modify existing goals including name, target amount, category, and deadline using PATCH requests.

Delete: Remove goals from the system via DELETE requests.

Overview: A dedicated section provides a summary of all savings activity, including:

Total number of goals.

Total money saved across all goals.

Number of completed goals.

Time remaining for each goal.

Warnings for deadlines within 30 days (if not complete).

Marking goals as "Overdue" if the deadline has passed without reaching the target.

Technologies Used
React: For building the user interface.

JavaScript (ES6+): For application logic.

HTML5 & CSS3: For structuring and styling the web pages.

json-server: A lightweight tool to create a fake REST API from a db.json file, enabling full CRUD operations for local development.

NPM (Node Package Manager): For managing project dependencies.

Setup Instructions
Follow these steps to get the Smart Goal Planner up and running on your local machine.

1. Clone or Create the Project
If you haven't already, create your React project structure.

# Create the main project directory
mkdir smart-goal-planner
cd smart-goal-planner

# Initialize a React application in the current directory
npx create-react-app .

# Install json-server
npm install json-server

2. Create db.json
Create a file named db.json in the root directory of your smart-goal-planner project (the same level as package.json).

touch db.json

Then, open db.json in your code editor and paste the following content:

{
  "goals": [
    {
      "id": "1",
      "name": "Travel Fund - Japan",
      "targetAmount": 5000,
      "savedAmount": 3200,
      "category": "Travel",
      "deadline": "2025-12-31",
      "createdAt": "2024-01-15"
    },
    {
      "id": "2",
      "name": "Emergency Fund",
      "targetAmount": 10000,
      "savedAmount": 7500,
      "category": "Emergency",
      "deadline": "2026-06-30",
      "createdAt": "2023-05-01"
    },
    {
      "id": "3",
      "name": "New Laptop",
      "targetAmount": 1500,
      "savedAmount": 1500,
      "category": "Electronics",
      "deadline": "2024-07-20",
      "createdAt": "2024-03-10"
    },
    {
      "id": "4",
      "name": "Down Payment - House",
      "targetAmount": 50000,
      "savedAmount": 12000,
      "category": "Real Estate",
      "deadline": "2027-12-31",
      "createdAt": "2024-02-01"
    },
    {
      "id": "5",
      "name": "Car Maintenance",
      "targetAmount": 800,
      "savedAmount": 600,
      "category": "Vehicle",
      "deadline": "2025-09-15",
      "createdAt": "2024-06-01"
    },
    {
      "id": "6",
      "name": "Education Fund",
      "targetAmount": 20000,
      "savedAmount": 5000,
      "category": "Education",
      "deadline": "2028-01-01",
      "createdAt": "2024-04-20"
    },
    {
      "id": "7",
      "name": "Holiday Gifts",
      "targetAmount": 1000,
      "savedAmount": 200,
      "category": "Shopping",
      "deadline": "2024-08-10",
      "createdAt": "2024-07-01"
    },
    {
      "id": "8",
      "name": "New Phone",
      "targetAmount": 1200,
      "savedAmount": 0,
      "category": "Electronics",
      "deadline": "2025-01-31",
      "createdAt": "2024-07-10"
    },
    {
      "id": "9",
      "name": "Retirement Savings",
      "targetAmount": 100000,
      "savedAmount": 15000,
      "category": "Retirement",
      "deadline": "2035-01-01",
      "createdAt": "2023-01-01"
    },
    {
      "id": "10",
      "name": "Home Renovation",
      "targetAmount": 7500,
      "savedAmount": 1000,
      "category": "Home",
      "deadline": "2025-03-31",
      "createdAt": "2024-05-15"
    }
  ]
}

3. Create Directories and Empty Files
Run these commands from your project's root directory (smart-goal-planner):

mkdir src/api
touch src/api/goalsApi.js

mkdir src/components
touch src/components/GoalDashboard.js \
      src/components/GoalCard.js \
      src/components/GoalForm.js \
      src/components/DepositForm.js \
      src/components/Overview.js

4. Populate Files with Code
Now, open each of the following files in your code editor and paste the corresponding code provided in the previous responses:

src/api/goalsApi.js

src/App.js (replace existing content)

src/components/GoalDashboard.js

src/components/GoalCard.js

src/components/GoalForm.js

src/components/DepositForm.js

src/components/Overview.js

src/App.css (replace existing content)

5. Run the Application
You need two separate terminal windows for this.

Terminal 1 (for JSON Server):

Navigate to your project's root directory (smart-goal-planner) and run:

json-server --watch db.json --port 3000

This will start your mock API server. You should see output indicating that resources are available at http://localhost:3000/goals.

Terminal 2 (for React App):

Open a new terminal window, navigate to your project's root directory (smart-goal-planner), and run:

npm start

This will compile your React application and open it in your default web browser, typically at http://localhost:3001.

You should now see the Smart Goal Planner dashboard, populated with data from your db.json file. You can interact with the app to add, update, deposit to, and delete goals, and all changes will be persisted to your db.json file.

Usage
View Goals: All your savings goals will be displayed on the dashboard.

Add a New Goal: Use the "Add New Goal" form in the sidebar to create a new goal.

Make a Deposit: Use the "Make a Deposit" form in the sidebar. Select a goal from the dropdown and enter the amount.

Edit a Goal: Click the "Edit" button on any goal card to modify its details.

Delete a Goal: Click the "Delete" button on any goal card to remove it.

Overview: The sidebar provides real-time statistics on your total goals, total saved amount, and completed goals, along with deadline warnings.
