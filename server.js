const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  static: './public'
});

// Configure CORS for your Smart Goal Planner frontend
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://carltonshiyai.github.io',
    'https://smart-goal-planner.vercel.app',
    'https://your-frontend-domain.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

server.use(cors(corsOptions));

// Add custom middleware for Smart Goals
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom routes for Smart Goal Planner
server.use((req, res, next) => {
  // Add timestamp to new goals
  if (req.method === 'POST' && req.path === '/goals') {
    req.body.createdAt = new Date().toISOString();
    req.body.updatedAt = new Date().toISOString();
  }
  
  // Update timestamp on goal updates
  if ((req.method === 'PUT' || req.method === 'PATCH') && req.path.startsWith('/goals/')) {
    req.body.updatedAt = new Date().toISOString();
  }
  
  next();
});

// Custom endpoint to get goals by status
server.get('/goals/completed', (req, res) => {
  const db = router.db;
  const completedGoals = db.get('goals').filter(goal => goal.completed === true).value();
  res.json(completedGoals);
});

server.get('/goals/pending', (req, res) => {
  const db = router.db;
  const pendingGoals = db.get('goals').filter(goal => goal.completed === false).value();
  res.json(pendingGoals);
});

// Custom endpoint for goal statistics
server.get('/stats', (req, res) => {
  const db = router.db;
  const goals = db.get('goals').value();
  
  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.completed).length,
    pending: goals.filter(g => !g.completed).length,
    overdue: goals.filter(g => !g.completed && new Date(g.dueDate) < new Date()).length,
    categories: [...new Set(goals.map(g => g.category))].length
  };
  
  res.json(stats);
});

// Use default router for all other routes
server.use(router);

// Health check endpoint
server.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Smart Goal Planner API'
  });
});

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`🎯 Smart Goal Planner API is running on port ${port}`);
  console.log(`📡 API Endpoints:`);
  console.log(`   • Goals: http://localhost:${port}/goals`);
  console.log(`   • Categories: http://localhost:${port}/categories`);
  console.log(`   • Stats: http://localhost:${port}/stats`);
  console.log(`   • Health: http://localhost:${port}/health`);
});