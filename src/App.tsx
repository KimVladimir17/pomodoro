import "./App.css";
import React, { use, useEffect, useState } from "react";
import Task from "./Task";
import Timer from "./Timer";
import { v4 as uuidv4 } from "uuid";

export type TaskStatus = "pending" | "running" | "completed";

interface Tasks {
  id: string;
  title: string;
  time: number;
  status: TaskStatus;
}

function App() {
  const [tasks, setTasks] = useState<Tasks[]>([
    {
      id: uuidv4(),
      title: "Example",
      time: 25,
      status: "pending",
    },
    {
      id: uuidv4(),
      title: "Example2",
      time: 50,
      status: "pending",
    },
    { id: uuidv4(), title: "Example3", time: 5, status: "pending" },
  ]);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskMinutes, setTaskMinutes] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null);
  const [currentTask, setCurrentTask] = useState<Tasks | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      setRunningTaskId(null);
      setCurrentTask(null);
    }
  }, [isRunning]);

  const handleAddTask = () => {
    if (taskTitle && taskMinutes) {
      const newTask: Tasks = {
        id: uuidv4(),
        title: taskTitle,
        time: Number(taskMinutes),
        status: "pending",
      };
      setTasks([...tasks, newTask]);
      setTaskTitle("");
      setTaskMinutes("");
      setErrorMessage("");
    } else {
      setErrorMessage("Please enter a task title and minutes.");
    }
  };

  const handleChangeTaskStatus = (id: string, newStatus: TaskStatus) => {
    if (newStatus === "running") {
      setRunningTaskId(id);
      const selectedTask = tasks.find((task) => task.id === id);
      if (selectedTask) setCurrentTask(selectedTask);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id && task.status !== "completed"
            ? { ...task, status: "running" }
            : task.status === "completed"
            ? task
            : { ...task, status: "pending" }
        )
      );
      setIsRunning(true);
    } else {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
      setIsRunning(false);
    }
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
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <input
              type="number"
              id="taskMinutes"
              placeholder="minute"
              value={taskMinutes}
              onChange={(e) => setTaskMinutes(e.target.value)}
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
          {tasks.map((task) => (
            <Task
              key={task.id}
              id={task.id}
              name={task.title}
              minute={task.time}
              status={task.status}
              onChangeStatus={(newStatus: TaskStatus) =>
                handleChangeTaskStatus(task.id, newStatus)
              }
              isRunning={runningTaskId === task.id}
            />
          ))}
          <Timer
            initialTime={currentTask?.time || 0}
            taskName={currentTask?.title || "No Task Selected"}
            isRunning={isRunning}
            setIsRunning={(isRunning) => {
              if (!isRunning) setRunningTaskId(null);
            }}
            onChangeStatus={(status) => {
              if (status === "completed" && currentTask) {
                handleChangeTaskStatus(currentTask.id, "completed");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
