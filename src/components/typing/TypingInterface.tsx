import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Passage, TypingError } from '../../types/typing.js';

interface TypingInterfaceProps {
  passage: Passage;
  onComplete: (wpm: number, accuracy: number, errors: TypingError[]) => void;
  timerDuration?: number; // in seconds, optional
}

/**
 * The main typing interface component that handles user input and provides real-time feedback
 * Optimized for performance with integrated display and input
 */
export const TypingInterface: React.FC<TypingInterfaceProps> = ({
  passage,
  onComplete,
  timerDuration,
}) => {
  // State for tracking user input and progress
  const [input, setInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [errors, setErrors] = useState<TypingError[]>([]);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(timerDuration || null);
  const [visibleLines, setVisibleLines] = useState<number[]>([0, 1, 2]); // Track which lines are visible (max 3)

  // Refs
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const interfaceRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastInputLengthRef = useRef<number>(0);

  // Split passage content into lines for windowed rendering
  const passageLines = useMemo(() => {
    // Split by natural line breaks or create artificial ones for long paragraphs
    const lines: string[] = [];
    const words = passage.content.split(' ');
    let currentLine = '';

    // Approximately 15-20 words per line depending on word length
    for (const word of words) {
      if (currentLine.length + word.length + 1 > 100) {
        // Approximate character limit per line
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    }

    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }

    return lines;
  }, [passage.content]);

  // Focus the input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle timer countdown if timerDuration is provided
  useEffect(() => {
    if (timerDuration && startTime && !endTime) {
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = timerDuration - elapsed;

        if (remaining <= 0) {
          setTimeLeft(0);
          handleComplete();
          clearInterval(intervalRef.current as NodeJS.Timeout);
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startTime, endTime, timerDuration]);

  // Calculate WPM and accuracy in real-time (optimized with throttling)
  useEffect(() => {
    if (startTime && !endTime && input.length > 0) {
      // Only update metrics every 5 characters to reduce performance impact
      if (input.length % 5 !== 0 && input.length !== passage.content.length) {
        return;
      }

      const timeElapsed = (Date.now() - startTime) / 60000; // in minutes
      const wordsTyped = input.trim().split(/\s+/).length;
      const currentWpm = Math.round(wordsTyped / timeElapsed);

      // Only update if we have a reasonable value
      if (currentWpm < 400) {
        // Sanity check for very high WPM
        setWpm(currentWpm);
      }

      // Calculate accuracy - optimized to avoid unnecessary string splitting
      let correctChars = 0;
      for (let i = 0; i < input.length; i++) {
        if (i < passage.content.length && input[i] === passage.content[i]) {
          correctChars++;
        }
      }

      const currentAccuracy = Math.round((correctChars / input.length) * 100);
      setAccuracy(currentAccuracy);
    }
  }, [input, startTime, endTime, passage.content]);

  // Update visible lines based on current position
  useEffect(() => {
    if (input.length === 0) {
      setVisibleLines([0, 1, 2]);
      return;
    }

    // Find which line the current position is in
    let totalChars = 0;
    let currentLineIndex = 0;

    for (let i = 0; i < passageLines.length; i++) {
      totalChars += passageLines[i].length + 1; // +1 for the space between lines
      if (currentPosition <= totalChars) {
        currentLineIndex = i;
        break;
      }
    }

    // Update visible lines to show current line and next two lines
    const newVisibleLines = [
      currentLineIndex,
      Math.min(currentLineIndex + 1, passageLines.length - 1),
      Math.min(currentLineIndex + 2, passageLines.length - 1),
    ];

    setVisibleLines(newVisibleLines);
  }, [currentPosition, passageLines]);

  // Optimized error checking - only check new characters
  const updateErrors = useCallback(
    (newInput: string) => {
      const startIdx = lastInputLengthRef.current;
      const newErrors = [...errors];

      // Remove errors that are no longer relevant (if backspacing)
      if (newInput.length < lastInputLengthRef.current) {
        return newErrors.filter((error) => error.index < newInput.length);
      }

      // Only check new characters
      for (let i = startIdx; i < newInput.length; i++) {
        if (i < passage.content.length && newInput[i] !== passage.content[i]) {
          newErrors.push({
            index: i,
            expected: passage.content[i],
            actual: newInput[i],
          });
        }
      }

      return newErrors;
    },
    [errors, passage.content],
  );

  // Handle input changes - optimized
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newInput = e.target.value;

      // Start the timer on first input
      if (!startTime && newInput.length > 0) {
        setStartTime(Date.now());
      }

      // Update input state
      setInput(newInput);
      setCurrentPosition(newInput.length);

      // Optimized error checking
      const newErrors = updateErrors(newInput);
      setErrors(newErrors);

      // Update reference for next check
      lastInputLengthRef.current = newInput.length;

      // Check if typing is complete
      if (newInput.length >= passage.content.length) {
        handleComplete();
      }
    },
    [startTime, passage.content, updateErrors],
  );

  // Handle completion of typing
  const handleComplete = useCallback(() => {
    if (!isCompleted && startTime) {
      const endTimeValue = Date.now();
      setEndTime(endTimeValue);
      setIsCompleted(true);

      // Calculate final metrics
      const timeElapsedMinutes = (endTimeValue - startTime) / 60000;
      const wordsTyped = input.trim().split(/\s+/).length;
      const finalWpm = Math.round(wordsTyped / timeElapsedMinutes);

      // Calculate final accuracy
      let correctChars = 0;
      for (let i = 0; i < input.length; i++) {
        if (i < passage.content.length && input[i] === passage.content[i]) {
          correctChars++;
        }
      }

      const finalAccuracy = Math.round((correctChars / input.length) * 100);

      // Call the onComplete callback with the results
      onComplete(finalWpm, finalAccuracy, errors);
    }
  }, [isCompleted, startTime, input, passage.content, errors, onComplete]);

  // Get the visible portion of the passage
  const visiblePassageContent = useMemo(() => {
    let content = '';
    for (const lineIndex of visibleLines) {
      if (lineIndex < passageLines.length) {
        content += passageLines[lineIndex] + ' ';
      }
    }
    return content.trim();
  }, [visibleLines, passageLines]);

  // Get the start index of the visible content in the full passage
  const visibleStartIndex = useMemo(() => {
    let startIndex = 0;
    for (let i = 0; i < visibleLines[0]; i++) {
      startIndex += passageLines[i].length + 1; // +1 for the space between lines
    }
    return startIndex;
  }, [visibleLines, passageLines]);

  // Render the visible passage with highlighting for current position and errors
  const renderVisiblePassage = useCallback(() => {
    const chars = visiblePassageContent.split('');
    const absoluteStartIndex = visibleStartIndex;

    return chars.map((char, relativeIndex) => {
      const absoluteIndex = absoluteStartIndex + relativeIndex;
      let className = '';

      if (absoluteIndex < input.length) {
        // Character has been typed
        if (input[absoluteIndex] === passage.content[absoluteIndex]) {
          className = 'text-green-600 dark:text-green-400'; // Correct
        } else {
          className = 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'; // Error
        }
      } else if (absoluteIndex === input.length) {
        className = 'bg-gray-300 dark:bg-gray-600 animate-pulse'; // Current position
      }

      return (
        <span key={`${absoluteIndex}-${char}`} className={className}>
          {char}
        </span>
      );
    });
  }, [visiblePassageContent, visibleStartIndex, input, passage.content]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Metrics display */}
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow">
            <span className="text-gray-500 dark:text-gray-400">WPM: </span>
            <span className="font-bold">{wpm}</span>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow">
            <span className="text-gray-500 dark:text-gray-400">Accuracy: </span>
            <span className="font-bold">{accuracy}%</span>
          </div>
          {errors.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow">
              <span className="text-gray-500 dark:text-gray-400">Errors: </span>
              <span className="font-bold text-red-600 dark:text-red-400">{errors.length}</span>
            </div>
          )}
        </div>

        {timeLeft !== null && (
          <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow">
            <span className="text-gray-500 dark:text-gray-400">Time: </span>
            <span className={`font-bold ${timeLeft < 10 ? 'text-red-600 dark:text-red-400' : ''}`}>
              {timeLeft}s
            </span>
          </div>
        )}
      </div>

      {/* Integrated typing interface - combines display and input */}
      <div
        ref={interfaceRef}
        className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow font-mono text-lg leading-relaxed border-2 border-primary cursor-text min-h-[200px] focus-within:border-blue-500 transition-colors"
        onClick={() => inputRef.current?.focus()}
      >
        {isCompleted ? (
          <div className="text-green-600 dark:text-green-400 font-bold">
            Completed! WPM: {wpm} | Accuracy: {accuracy}%
          </div>
        ) : (
          <div className="relative">
            {/* Visible passage with highlighting */}
            <div className="whitespace-pre-wrap">{renderVisiblePassage()}</div>

            {/* Progress indicator */}
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300 ease-out"
                style={{
                  width: `${Math.min(100, (input.length / passage.content.length) * 100)}%`,
                }}
              />
            </div>

            {/* Hidden textarea for capturing input */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              className="opacity-0 absolute h-1 w-1 -z-10"
              disabled={isCompleted}
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
        {isCompleted ? (
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            onClick={() => window.location.reload()}
          >
            Practice Again
          </button>
        ) : (
          <p>Type the text above. Your progress and metrics will be tracked in real-time.</p>
        )}
      </div>
    </div>
  );
};
