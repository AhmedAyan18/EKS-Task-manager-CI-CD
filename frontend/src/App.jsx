import { useEffect, useState } from "react";

const API_URL = "/api";

function App() {

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /*
  |--------------------------------------------------------------------------
  | Get Tasks
  |--------------------------------------------------------------------------
  */

  const fetchTasks = async () => {

    try {

      const response = await fetch(
        `${API_URL}/tasks`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();

      setTasks(data);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }
  };


  /*
  |--------------------------------------------------------------------------
  | Load Tasks
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    fetchTasks();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Add Task
  |--------------------------------------------------------------------------
  */

  const addTask = async (event) => {

    event.preventDefault();

    setError("");

    if (!title.trim()) {
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/tasks`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            title,
            description
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const newTask = await response.json();

      setTasks(current => [
        ...current,
        newTask
      ]);

      setTitle("");

      setDescription("");

    } catch (err) {

      setError(err.message);

    }
  };


  /*
  |--------------------------------------------------------------------------
  | Complete / Pending
  |--------------------------------------------------------------------------
  */

  const toggleTask = async (task) => {

    try {

      const response = await fetch(
        `${API_URL}/tasks/${task.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            completed: !task.completed
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();

      setTasks(current =>
        current.map(item =>
          item.id === updatedTask.id
            ? updatedTask
            : item
        )
      );

    } catch (err) {

      setError(err.message);

    }
  };


  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const deleteTask = async (id) => {

    try {

      const response = await fetch(
        `${API_URL}/tasks/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks(current =>
        current.filter(task =>
          task.id !== id
        )
      );

    } catch (err) {

      setError(err.message);

    }
  };


  const completed = tasks.filter(
    task => task.completed
  ).length;

  const pending =
    tasks.length - completed;


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (

    <div className="app">

      <header className="header">

        <div className="header-inner">

          <div className="badge">
            AWS EKS • Docker • CI/CD
          </div>

          <h1>
            DevOps Task Manager
          </h1>

          <p>
            Full-stack application deployed
            with Kubernetes and GitHub Actions.
          </p>

        </div>

      </header>


      <main className="container">


        {error && (
          <div className="error">
            {error}
          </div>
        )}


        {/* Statistics */}

        <section className="stats">

          <div className="stat-card">

            <span>
              Total Tasks
            </span>

            <strong>
              {tasks.length}
            </strong>

          </div>


          <div className="stat-card">

            <span>
              Completed
            </span>

            <strong>
              {completed}
            </strong>

          </div>


          <div className="stat-card">

            <span>
              Pending
            </span>

            <strong>
              {pending}
            </strong>

          </div>

        </section>


        {/* Create Task */}

        <section className="card">

          <h2>
            Create Task
          </h2>

          <form onSubmit={addTask}>

            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={
                e => setTitle(e.target.value)
              }
            />


            <textarea
              placeholder="Task description"
              value={description}
              onChange={
                e =>
                  setDescription(
                    e.target.value
                  )
              }
            />


            <button type="submit">
              Add Task
            </button>

          </form>

        </section>


        {/* Tasks */}

        <section className="card">

          <div className="section-title">

            <h2>
              Tasks
            </h2>

            <span>
              {tasks.length} items
            </span>

          </div>


          {loading ? (

            <p className="muted">
              Loading tasks...
            </p>

          ) : tasks.length === 0 ? (

            <p className="muted">
              No tasks available.
            </p>

          ) : (

            <div className="tasks">

              {tasks.map(task => (

                <div
                  className={
                    `task ${
                      task.completed
                        ? "completed"
                        : ""
                    }`
                  }
                  key={task.id}
                >

                  <div className="task-content">

                    <h3>
                      {task.title}
                    </h3>

                    <p>
                      {
                        task.description ||
                        "No description"
                      }
                    </p>

                  </div>


                  <div className="actions">

                    <button
                      onClick={() =>
                        toggleTask(task)
                      }
                    >

                      {
                        task.completed
                          ? "Mark Pending"
                          : "Complete"
                      }

                    </button>


                    <button
                      className="delete"
                      onClick={() =>
                        deleteTask(task.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default App;