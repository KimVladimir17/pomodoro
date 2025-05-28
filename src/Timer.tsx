import React, { useEffect, useRef, useState } from "react";
import { TaskStatus } from "./App";

type TimerProps = {
  initialTime: number;
  taskName: string;
  isRunning: boolean;
  setIsRunning: (value: boolean) => void;
  onChangeStatus: (status: TaskStatus) => void;
};

const Timer: React.FC<TimerProps> = ({
  initialTime,
  taskName,
  isRunning,
  setIsRunning,
  onChangeStatus,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime * 60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    setTimeLeft(initialTime * 60);
  }, [initialTime]);

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 0) return prev - 1;
          setTimeout(() => {
            onChangeStatus("completed");
            setIsRunning(false);
          }, 0);
          stopInterval();
          return 0;
        });
      }, 1000);
    } else {
      stopInterval();
    }
    return stopInterval;
  }, [isRunning, onChangeStatus]);

  return (
    <div className="timer">
      <p>{taskName}</p>
      <p>{formatTime(timeLeft)}</p>
    </div>
  );
};

export default Timer;
