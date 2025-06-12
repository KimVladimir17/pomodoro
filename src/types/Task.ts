type TaskStatus = "pending" | "running" | "completed";

interface Tasks {
  id: string;
  title: string;
  time: number;
  timeLeft: number;
  status: TaskStatus;
}

export type { TaskStatus, Tasks };
