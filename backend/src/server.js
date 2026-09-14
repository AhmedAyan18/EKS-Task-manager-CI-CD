const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let tasks = [
  {
    id: 1,
    title: "Learn Docker",
    description: "Build and run Docker containers",
    completed: true
  },
  {
    id: 2,
    title: "Deploy to EKS",
    description: "Deploy the application to Amazon EKS",
    completed: false
  },
  {
    id: 3,
    title: "Create CI/CD Pipeline",
    description: "Automate deployment with GitHub Actions",
    completed: false
  }
];

let nextId = 4;


/*
|--------------------------------------------------------------------------
| Root
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.json({
    message: "Task Manager API is running"
  });
});


/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "task-manager-backend",
    timestamp: new Date().toISOString()
  });
});


/*
|--------------------------------------------------------------------------
| Get Tasks
|--------------------------------------------------------------------------
*/

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});


/*
|--------------------------------------------------------------------------
| Create Task
|--------------------------------------------------------------------------
*/

app.post("/api/tasks", (req, res) => {
  const { title, description } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      message: "Task title is required"
    });
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    description: description || "",
    completed: false
  };

  tasks.push(task);

  res.status(201).json(task);
});


/*
|--------------------------------------------------------------------------
| Update Task
|--------------------------------------------------------------------------
*/

app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  if (req.body.title !== undefined) {
    task.title = req.body.title;
  }

  if (req.body.description !== undefined) {
    task.description = req.body.description;
  }

  if (req.body.completed !== undefined) {
    task.completed = req.body.completed;
  }

  res.json(task);
});


/*
|--------------------------------------------------------------------------
| Delete Task
|--------------------------------------------------------------------------
*/

app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const taskExists = tasks.some(task => task.id === id);

  if (!taskExists) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  tasks = tasks.filter(task => task.id !== id);

  res.json({
    message: "Task deleted successfully"
  });
});


/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});