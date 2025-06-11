type TaskStatus = "pending" | "running" | "completed";

interface Tasks {
  id: string;
  title: string;
  time: number;
  timeLeft: number;
  status: TaskStatus;
}

type TimerProps = {
  taskName: string;
  isRunning: boolean;
  counterStart: string;
};
export type { TaskStatus, Tasks, TimerProps };
