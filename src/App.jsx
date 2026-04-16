import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  }, []);

  const addTask = () => {
    if (task.trim() === "") return;

    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: task, completed: false }),
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));

    setTask("");
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  };

  const toggleTask = (taskToToggle) => {
    fetch(`http://localhost:5000/tasks/${taskToToggle._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !taskToToggle.completed,
      }),
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  };

  return (
    <div className="app-container">
      <div className="glass-card">
        <h1 className="title">My Task App</h1>

        {/* INPUT */}
        <div className="input-container">
          <input
            type="text"
            className="task-input"
            placeholder="What needs to be done?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button className="add-button" onClick={addTask}>
            Add
          </button>
        </div>

        {/* COUNTERS */}
        <div className="counters">
          <span>Total: {tasks.length}</span>
          <span>Done: {tasks.filter((t) => t.completed).length}</span>
        </div>

        {/* TASK LIST */}
        {tasks.length === 0 ? (
          <div className="empty-state">
            All caught up! ✨ No tasks here.
          </div>
        ) : (
          <ul className="task-list">
            {tasks.map((t) => (
              <li key={t._id} className="task-item">
                <div className="task-content">
                  <div className="task-checkbox-container">
                    <input
                      type="checkbox"
                      className="task-checkbox"
                      checked={t.completed}
                      onChange={() => toggleTask(t)}
                    />
                  </div>

                  <span
                    className={`task-text ${t.completed ? "completed" : ""}`}
                  >
                    {t.text}
                  </span>
                </div>

                <button
                  className="delete-button"
                  onClick={() => deleteTask(t._id)}
                  title="Delete task"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;