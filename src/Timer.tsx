import React from "react";

type TimerProps = {
  timeLeft: number;
  taskName: string;
  isRunning: boolean;
};

const Timer: React.FC<TimerProps> = ({ timeLeft, taskName, isRunning }) => {
  const formatTime = (sec: number): string => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };
  return (
    <div className="timer">
      <p>{isRunning ? `${taskName}` : "No task running"}</p>
      <p className="big-time">{formatTime(timeLeft)}</p>
    </div>
  );
};

export default Timer;
