import React, { useState, useEffect, useRef } from 'react';

interface TypingTimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isActive?: boolean;
  isPaused?: boolean;
}

/**
 * Component for managing timed typing sessions
 */
export const TypingTimer: React.FC<TypingTimerProps> = ({
  duration,
  onTimeUp,
  isActive = false,
  isPaused = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [isRunning, setIsRunning] = useState<boolean>(isActive && !isPaused);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start/stop timer based on isActive and isPaused props
  useEffect(() => {
    if (isActive && !isPaused) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [isActive, isPaused]);

  // Handle timer countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsRunning(false);
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning && timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft, onTimeUp]);

  // Reset timer to initial duration
  const resetTimer = () => {
    setTimeLeft(duration);
    setIsRunning(false);
  };

  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = (timeLeft / duration) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Time Remaining</h3>
          <div
            className={`text-2xl font-bold ${
              timeLeft < 30 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
          <div
            className={`h-2.5 rounded-full ${
              timeLeft < 30
                ? 'bg-red-500'
                : timeLeft < duration / 3
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Controls */}
        <div className="flex justify-end space-x-2">
          {!isActive && (
            <button
              onClick={resetTimer}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Component for selecting a timer duration
 */
interface TimerSelectorProps {
  onSelectDuration: (duration: number) => void;
  selectedDuration?: number;
}

export const TimerSelector: React.FC<TimerSelectorProps> = ({
  onSelectDuration,
  selectedDuration,
}) => {
  // Common TOEFL-like durations
  const durations = [
    { label: '5 minutes', value: 5 * 60 },
    { label: '10 minutes', value: 10 * 60 },
    { label: '20 minutes', value: 20 * 60 },
    { label: '30 minutes', value: 30 * 60 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Select Practice Duration
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {durations.map((duration) => (
            <button
              key={duration.value}
              onClick={() => onSelectDuration(duration.value)}
              className={`p-3 rounded-lg text-center transition-colors ${
                selectedDuration === duration.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {duration.label}
            </button>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>
            Select a duration that matches your practice goals. The TOEFL writing section typically
            allows 20-30 minutes per essay.
          </p>
        </div>
      </div>
    </div>
  );
};
