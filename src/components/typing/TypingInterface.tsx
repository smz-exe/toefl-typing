import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Passage, TypingError } from '../../types/typing.js';

interface TypingInterfaceProps {
  passage: Passage;
  onComplete: (wpm: number, accuracy: number, errors: TypingError[]) => void;
}

/**
 * The main typing interface component that handles user input and provides real-time feedback
 * Optimized for performance with integrated display and input
 */
export const TypingInterface: React.FC<TypingInterfaceProps> = ({ passage, onComplete }) => {
  // State for tracking user input and progress
  const [input, setInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [errors, setErrors] = useState<TypingError[]>([]);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [visibleLines, setVisibleLines] = useState<number[]>([0, 1, 2]); // Track which lines are visible (exactly 3)

  // Refs
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const interfaceRef = useRef<HTMLDivElement>(null);
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

  // Update visible lines based on current position - optimized for stability
  useEffect(() => {
    if (input.length === 0) {
      // Show exactly 3 lines initially
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

    // Only update visible lines when the current line changes
    // This prevents unnecessary re-renders and keeps the text stable
    const newVisibleLines = [
      currentLineIndex,
      Math.min(currentLineIndex + 1, passageLines.length - 1),
      Math.min(currentLineIndex + 2, passageLines.length - 1),
    ];

    // Check if the visible lines have actually changed before updating state
    if (
      newVisibleLines[0] !== visibleLines[0] ||
      newVisibleLines[1] !== visibleLines[1] ||
      newVisibleLines[2] !== visibleLines[2]
    ) {
      setVisibleLines(newVisibleLines);
    }
  }, [currentPosition, passageLines, visibleLines]);

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
  // Optimized to minimize DOM updates and prevent unnecessary re-renders
  const renderVisiblePassage = useCallback(() => {
    const chars = visiblePassageContent.split('');
    const absoluteStartIndex = visibleStartIndex;

    return chars.map((char, relativeIndex) => {
      const absoluteIndex = absoluteStartIndex + relativeIndex;
      let className = 'char-untyped'; // Default class for untyped text

      if (absoluteIndex < input.length) {
        // Character has been typed
        if (input[absoluteIndex] === passage.content[absoluteIndex]) {
          className = 'char-correct'; // Correct
        } else {
          className = 'char-incorrect'; // Error
        }
      } else if (absoluteIndex === input.length) {
        className = 'char-current'; // Current position
      }

      // Use a stable key to prevent unnecessary re-renders
      // Using only absoluteIndex as the key is more stable
      return (
        <span key={absoluteIndex} className={className}>
          {char}
        </span>
      );
    });
  }, [visiblePassageContent, visibleStartIndex, input, passage.content]);

  return (
    <div className="w-full mx-auto">
      {/* Full width container */}
      {/* Metrics display - simplified without timer */}
      <div className="metrics-container">
        <div className="metric-item">
          <span className="metric-label">WPM</span>
          <span className="metric-value">{wpm}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Accuracy</span>
          <span className="metric-value">{accuracy}%</span>
        </div>
        {errors.length > 0 && (
          <div className="metric-item">
            <span className="metric-label">Errors</span>
            <span className="metric-value text-destructive">{errors.length}</span>
          </div>
        )}
      </div>
      {/* Integrated typing interface - combines display and input */}
      <div
        ref={interfaceRef}
        className="typing-container typing-text cursor-text min-h-[280px] w-full focus-within:border-primary transition-colors"
        onClick={() => inputRef.current?.focus()}
      >
        {isCompleted ? (
          <div className="text-center py-10">
            <div className="text-3xl font-bold mb-4" style={{ color: '#006699' }}>
              Completed!
            </div>
            <div className="text-xl">
              <span className="mr-6">
                WPM: <strong>{wpm}</strong>
              </span>
              <span>
                Accuracy: <strong>{accuracy}%</strong>
              </span>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Visible passage with highlighting - removed transitions for stability */}
            <div className="whitespace-pre-wrap leading-relaxed">{renderVisiblePassage()}</div>

            {/* Progress indicator - kept transition only for progress bar which doesn't affect typing */}
            <div className="progress-bar">
              <div
                className="progress-value"
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
      <div className="mt-6 text-sm text-muted-foreground text-center">
        {isCompleted ? (
          <button className="mt-4 btn btn-primary" onClick={() => window.location.reload()}>
            Practice Again
          </button>
        ) : (
          <p>Type the text above. Your progress and metrics will be tracked in real-time.</p>
        )}
      </div>
    </div>
  );
};
