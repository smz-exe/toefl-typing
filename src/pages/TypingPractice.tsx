import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Passage, TypingSession, TypingError, TypingSettings } from '../types/typing.js';
import { TypingInterface } from '../components/typing/TypingInterface.js';
import { TypingMetrics } from '../components/typing/TypingMetrics.js';
import { TypingTimer, TimerSelector } from '../components/typing/TypingTimer.js';
import { passages } from '../data/passages.js';
import typingService from '../services/typingService.js';

/**
 * The main typing practice page
 */
export const TypingPractice: React.FC = () => {
  const navigate = useNavigate();
  const { passageId } = useParams<{ passageId: string }>();

  // State
  const [passage, setPassage] = useState<Passage | null>(null);
  const [timerDuration, setTimerDuration] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentSession, setCurrentSession] = useState<{
    wpm: number;
    accuracy: number;
    errors: TypingError[];
    elapsedTime?: number;
  } | null>(null);
  const [pastSessions, setPastSessions] = useState<TypingSession[]>([]);
  const [settings, setSettings] = useState<TypingSettings>(typingService.getSettings());

  // Load passage based on ID from URL params
  useEffect(() => {
    if (passageId) {
      const foundPassage = passages.find((p) => p.id === passageId);
      if (foundPassage) {
        setPassage(foundPassage);

        // Load past sessions for this passage
        const sessions = typingService.getSessionsByPassage(passageId);
        setPastSessions(sessions);
      } else {
        // Passage not found, redirect to passage selection
        navigate('/passages');
      }
    } else {
      // No passage ID provided, use a random passage
      const randomIndex = Math.floor(Math.random() * passages.length);
      setPassage(passages[randomIndex]);
    }
  }, [passageId, navigate]);

  // Handle timer selection
  const handleTimerSelect = (duration: number) => {
    setTimerDuration(duration);
  };

  // Handle timer start
  const handleStartTimer = () => {
    setIsTimerActive(true);
  };

  // Handle timer pause/resume
  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  // Handle timer completion
  const handleTimeUp = () => {
    // Timer is up, but we'll let the typing interface handle completion
    setIsTimerActive(false);
  };

  // Handle typing completion
  const handleTypingComplete = (wpm: number, accuracy: number, errors: TypingError[]) => {
    // Create session data
    const now = new Date();
    const startTime = new Date(now.getTime() - (timerDuration ? timerDuration * 1000 : 0));

    // Save session
    if (passage) {
      const session = typingService.saveSession(passage.id, wpm, accuracy, errors, startTime, now);

      // Update state
      setCurrentSession({
        wpm,
        accuracy,
        errors,
        elapsedTime: timerDuration || Math.floor((now.getTime() - startTime.getTime()) / 1000),
      });

      // Add to past sessions
      setPastSessions((prev) => [session, ...prev]);
    }

    // Reset timer
    setIsTimerActive(false);
    setIsPaused(false);
  };

  // Handle retry
  const handleRetry = () => {
    setCurrentSession(null);
    setTimerDuration(null);
    setIsTimerActive(false);
    setIsPaused(false);
  };

  // Handle settings change
  const handleSettingsChange = (newSettings: TypingSettings) => {
    setSettings(newSettings);
  };

  // If no passage is loaded yet, show loading
  if (!passage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Passage info */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{passage.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
            {passage.difficulty.charAt(0).toUpperCase() + passage.difficulty.slice(1)}
          </span>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
            {passage.type.charAt(0).toUpperCase() + passage.type.slice(1)}
          </span>
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
            {passage.domain.charAt(0).toUpperCase() + passage.domain.slice(1)}
          </span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full">
            {passage.wordCount} words
          </span>
        </div>
      </div>

      {/* Session completed view */}
      {currentSession ? (
        <div className="space-y-8">
          <TypingMetrics
            currentSession={currentSession}
            pastSessions={pastSessions}
            showDetails={true}
          />

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Practice Again
            </button>
            <button
              onClick={() => navigate('/passages')}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Choose Another Passage
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Timer selection (if not active) */}
          {!isTimerActive && (
            <TimerSelector
              onSelectDuration={handleTimerSelect}
              selectedDuration={timerDuration || undefined}
            />
          )}

          {/* Timer (if duration selected) */}
          {timerDuration && (
            <div className="mb-8">
              <TypingTimer
                duration={timerDuration}
                onTimeUp={handleTimeUp}
                isActive={isTimerActive}
                isPaused={isPaused}
              />

              {!isTimerActive && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleStartTimer}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Start Timed Practice
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Typing interface */}
          <TypingInterface
            passage={passage}
            onComplete={handleTypingComplete}
            timerDuration={isTimerActive ? timerDuration || undefined : undefined}
          />

          {/* Past performance (if available) */}
          {pastSessions.length > 0 && (
            <div className="mt-12">
              <TypingMetrics pastSessions={pastSessions} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TypingPractice;
