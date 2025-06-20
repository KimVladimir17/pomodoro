type TimerProps = {
  taskName: string;
  isRunning: boolean;
  counterStart: string;
};

const Timer = ({ taskName, isRunning, counterStart }: TimerProps) => {
  return (
    <div className="timer">
      <p>{isRunning ? `${taskName}` : "No task running"}</p>
      <p className="big-time">{counterStart}</p>
    </div>
  );
};

export default Timer;
