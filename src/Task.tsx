import { TaskStatus } from "./App";

interface TaskProps {
  id: string;
  name: string;
  minute: number;
  status: string;
  isRunning: boolean;
  onChangeStatus: (newStatus: TaskStatus) => void;
}

const Task = ({
  name,
  minute,
  status,
  onChangeStatus,
  isRunning,
}: TaskProps) => {
  const handleClick = () => {
    const newStatus =
      status === "pending"
        ? "running"
        : status === "running"
        ? "pending"
        : "pending";

    onChangeStatus(newStatus);
  };

  return (
    <li className="task-item">
      <p>{name}</p>
      <p>{minute} minutes</p>
      <button
        onClick={handleClick}
        className={`task-button ${isRunning ? "active" : ""} ${
          status === "completed" && "disabled"
        }`}
        disabled={status === "completed"}
      >
        {/* {isRunning ? ` ${status}` : `${status}`}
         */}
        {status}
      </button>
    </li>
  );
};

export default Task;
