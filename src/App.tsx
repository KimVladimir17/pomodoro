import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Tasks, TaskStatus } from "./types/Task";
import Timer from "./Timer";

let DEFAULT_INPUT = { title: "", time: "" };

function App() {
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [taskInput, setTaskInput] = useState(DEFAULT_INPUT);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentTask, setCurrentTask] = useState<Tasks | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || !currentTask) return;
    const intervalId = setInterval(() => {
      setTasks((prevTasks: Tasks[]) =>
        prevTasks.map((task) => {
          if (task.id === currentTask.id && task.timeLeft > 0) {
            const updated = task.timeLeft - 1;
            if (updated === 0) {
              setIsRunning(false);
              handleChangeTaskStatus(task.id, "completed");
            }
            return { ...task, timeLeft: updated };
          }
          return task;
        })
      );
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isRunning, currentTask]);

  const handleAddTask = () => {
    const { title, time } = taskInput;

    if (title && time) {
      const minutes = Number(time);
      if (minutes < 0) {
        alert("Time should not be negative");
        setTaskInput(DEFAULT_INPUT);
        return;
      }
      const newTask: Tasks = {
        id: uuidv4(),
        title,
        time: minutes,
        timeLeft: minutes * 60,
        status: "pending",
      };
      setTasks([...tasks, newTask]);
      setTaskInput(DEFAULT_INPUT);
      setErrorMessage("");
    } else {
      setErrorMessage("Please enter title and minutes");
    }
  };

  useEffect(() => {
    if (currentTask) {
      const uptadet = tasks.find((t) => t.id === currentTask.id);
      if (uptadet) setCurrentTask(uptadet);
    }
  }, [tasks]);

  const handleChangeTaskStatus = (id: string, status: TaskStatus) => {
    if (status === "running") {
      const found = tasks.find((t) => t.id === id);
      if (found) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === id
              ? { ...task, status: "running", timeLeft: task.time * 60 }
              : task.status !== "completed"
              ? { ...task, status: "pending" }
              : task
          )
        );
        setCurrentTask({ ...found, timeLeft: found.time * 60 });
        setIsRunning(true);
      }
    } else if (status === "pending") {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? { ...task, status: "pending", timeLeft: task.time * 60 }
            : task
        )
      );
      setIsRunning(false);
      setCurrentTask(null);
    } else if (status === "completed") {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, status: "completed" } : task
        )
      );
      setIsRunning(false);
      setCurrentTask(null);
    }
  };
  const formatTime = (sec: number): string => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m)} min ${String(s).padStart(2, "0")} sec`;
  };

  const getButtonClass = (task: Tasks, currentTask?: Tasks | null) => {
    let classes = ["task-button"];
    if (task.id === currentTask?.id) classes.push("active");
    if (task.status === "completed") classes.push("disabled");
    return classes.join(" ");
  };

  return (
    <div className="App">
      <div className="container">
        <div className="tasks-blog">
          <h1>Pomodoro-style task manager</h1>
          <div className="new-task">
            <input
              type="text"
              id="taskTitle"
              placeholder="Task Title"
              value={taskInput.title}
              onChange={(e) =>
                setTaskInput({ ...taskInput, title: e.target.value })
              }
            />
            <input
              type="number"
              id="taskMinutes"
              placeholder="Minute"
              value={taskInput.time}
              onChange={(e) =>
                setTaskInput({ ...taskInput, time: e.target.value })
              }
            />
            <button onClick={handleAddTask}>Add Task</button>
            {errorMessage && (
              <div className="error-message" aria-live="polite">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
        <div className="task-board">
          <div className="task-titles">
            <p>Task title</p>
            <p>Duration (minutes)</p>
            <p>Status</p>
          </div>
          <ul className="task-list">
            {tasks.map((task: Tasks) => (
              <li className="task-item" key={task.id}>
                <p>{task.title}</p>
                {task.status === "running" ? (
                  <p className="task-timer">{formatTime(task.timeLeft)}</p>
                ) : (
                  <p>{task.time} min</p>
                )}
                <button
                  className={getButtonClass(task, currentTask)}
                  disabled={task.status === "completed"}
                  onClick={() =>
                    handleChangeTaskStatus(
                      task.id,
                      task.status === "running" ? "pending" : "running"
                    )
                  }
                >
                  {task.status}
                </button>
              </li>
            ))}
          </ul>
          <Timer
            taskName={currentTask?.title || "No active task"}
            isRunning={isRunning}
            counterStart={formatTime(currentTask?.timeLeft || 0)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
