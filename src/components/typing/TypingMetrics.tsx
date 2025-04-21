import React from 'react';
import { TypingSession, TypingError } from '../../types/typing.js';

interface TypingMetricsProps {
  currentSession?: {
    wpm: number;
    accuracy: number;
    errors: TypingError[];
    elapsedTime?: number; // in seconds
  };
  pastSessions?: TypingSession[];
  showDetails?: boolean;
}

/**
 * Component for displaying typing metrics and statistics
 */
export const TypingMetrics: React.FC<TypingMetricsProps> = ({
  currentSession,
  pastSessions = [],
  showDetails = false,
}) => {
  // Calculate average metrics from past sessions
  const averageWpm = pastSessions.length
    ? Math.round(pastSessions.reduce((sum, session) => sum + session.wpm, 0) / pastSessions.length)
    : 0;

  const averageAccuracy = pastSessions.length
    ? Math.round(
        pastSessions.reduce((sum, session) => sum + session.accuracy, 0) / pastSessions.length,
      )
    : 0;

  // Get most common errors
  const getCommonErrors = () => {
    if (!currentSession?.errors.length) return [];

    const errorMap = new Map<string, number>();

    currentSession.errors.forEach((error) => {
      const key = `${error.expected} → ${error.actual}`;
      errorMap.set(key, (errorMap.get(key) || 0) + 1);
    });

    return Array.from(errorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([error, count]) => ({ error, count }));
  };

  // Format time from seconds to mm:ss
  const formatTime = (seconds?: number) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Current session metrics */}
      {currentSession && (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Current Session</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">WPM</div>
              <div className="text-2xl font-bold text-primary">{currentSession.wpm}</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Accuracy</div>
              <div className="text-2xl font-bold text-primary">{currentSession.accuracy}%</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Errors</div>
              <div className="text-2xl font-bold text-red-500">{currentSession.errors.length}</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Time</div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {formatTime(currentSession.elapsedTime)}
              </div>
            </div>
          </div>

          {/* Error details */}
          {showDetails && currentSession.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Common Errors
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-gray-400">
                      <th className="pb-2">Error</th>
                      <th className="pb-2">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCommonErrors().map(({ error, count }, index) => (
                      <tr key={index} className="border-t border-gray-200 dark:border-gray-600">
                        <td className="py-2 font-mono">{error}</td>
                        <td className="py-2">{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Historical metrics */}
      {pastSessions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
            Performance History
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Avg WPM</div>
              <div className="text-2xl font-bold text-primary">{averageWpm}</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Avg Accuracy</div>
              <div className="text-2xl font-bold text-primary">{averageAccuracy}%</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Sessions</div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {pastSessions.length}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Best WPM</div>
              <div className="text-2xl font-bold text-green-500">
                {Math.max(...pastSessions.map((s) => s.wpm))}
              </div>
            </div>
          </div>

          {/* Session history table */}
          {showDetails && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Passage</th>
                    <th className="pb-2">WPM</th>
                    <th className="pb-2">Accuracy</th>
                    <th className="pb-2">Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {pastSessions.slice(0, 5).map((session, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2">{new Date(session.startTime).toLocaleDateString()}</td>
                      <td className="py-2 max-w-[200px] truncate">{session.passageId}</td>
                      <td className="py-2 font-medium">{session.wpm}</td>
                      <td className="py-2">{session.accuracy}%</td>
                      <td className="py-2">{session.errors.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
