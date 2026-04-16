import { useState, useEffect } from "react";
import "./index.css";

const CATEGORIES = ["Personal", "Work", "Health", "Study", "Other"];

function App() {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");

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
      // Note: Passing category to backend. Existing tasks might lack this field initially!
      body: JSON.stringify({ text: task, completed: false, category }),
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

  // Filter tasks based on active category
  const filteredTasks = tasks.filter((t) =>
    activeFilter === "All" ? true : t.category === activeFilter
  );

  return (
    <div className="app-container">
      <div className="glass-card">
        <h1 className="title">My Task App</h1>

        {/* INPUT */}
        <div className="input-group">
          <input
            type="text"
            className="task-input"
            placeholder="What needs to be done?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <select
            className="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button className="add-button" onClick={addTask}>
            Add
          </button>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="filter-scroll-container">
          <div
            className={`filter-pill ${activeFilter === "All" ? "active" : ""}`}
            onClick={() => setActiveFilter("All")}
          >
            All
          </div>
          {CATEGORIES.map((cat) => (
            <div
              key={cat}
              className={`filter-pill ${activeFilter === cat ? "active" : ""}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* COUNTERS */}
        <div className="counters">
          <span>Results: {filteredTasks.length}</span>
          <span>Done: {tasks.filter((t) => t.completed).length}/{tasks.length}</span>
        </div>

        {/* TASK LIST */}
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            {activeFilter === "All"
              ? "All caught up! ✨ No tasks here."
              : `No ${activeFilter} tasks yet.`}
          </div>
        ) : (
          <ul className="task-list">
            {filteredTasks.map((t) => (
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

                  <div className="task-text-group">
                    <span
                      className={`task-text ${t.completed ? "completed" : ""}`}
                    >
                      {t.text}
                    </span>
                    {(t.category) && (
                      <span className="task-category-badge">{t.category}</span>
                    )}
                  </div>
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