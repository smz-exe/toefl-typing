import React, { useState } from 'react';
import { TypingSession, TypingStats } from '../types/typing.js';
import typingService from '../services/typingService.js';
import { passages } from '../data/passages.js';

/**
 * Page for displaying typing statistics and progress
 */
export const Statistics: React.FC = () => {
  const [stats, setStats] = useState<TypingStats>(typingService.getTypingStats());
  const [sessions, setSessions] = useState<TypingSession[]>(typingService.getSessions());
  const [timeRange, setTimeRange] = useState<'all' | 'week' | 'month'>('all');

  // Filter sessions based on time range
  const filteredSessions = React.useMemo(() => {
    if (timeRange === 'all') {
      return sessions;
    }

    const now = new Date();
    const cutoffDate = new Date();

    if (timeRange === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    }

    return sessions.filter((session) => new Date(session.startTime) >= cutoffDate);
  }, [sessions, timeRange]);

  // Get passage title by ID
  const getPassageTitle = (passageId: string): string => {
    const passage = passages.find((p) => p.id === passageId);
    return passage ? passage.title : 'Unknown Passage';
  };

  // Format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate progress metrics
  const progressMetrics = React.useMemo(() => {
    if (filteredSessions.length < 2) {
      return {
        wpmImprovement: 0,
        accuracyImprovement: 0,
        hasImproved: false,
      };
    }

    // Sort sessions by date
    const sortedSessions = [...filteredSessions].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

    // Get first and last 5 sessions (or fewer if not enough)
    const firstSessions = sortedSessions.slice(
      0,
      Math.min(5, Math.floor(sortedSessions.length / 2)),
    );
    const lastSessions = sortedSessions.slice(-Math.min(5, Math.floor(sortedSessions.length / 2)));

    // Calculate average WPM and accuracy for first and last sessions
    const firstAvgWpm = firstSessions.reduce((sum, s) => sum + s.wpm, 0) / firstSessions.length;
    const lastAvgWpm = lastSessions.reduce((sum, s) => sum + s.wpm, 0) / lastSessions.length;

    const firstAvgAccuracy =
      firstSessions.reduce((sum, s) => sum + s.accuracy, 0) / firstSessions.length;
    const lastAvgAccuracy =
      lastSessions.reduce((sum, s) => sum + s.accuracy, 0) / lastSessions.length;

    // Calculate improvement
    const wpmImprovement = lastAvgWpm - firstAvgWpm;
    const accuracyImprovement = lastAvgAccuracy - firstAvgAccuracy;

    return {
      wpmImprovement,
      accuracyImprovement,
      hasImproved: wpmImprovement > 0 || accuracyImprovement > 0,
    };
  }, [filteredSessions]);

  // Clear all data
  const handleClearData = () => {
    if (
      window.confirm('Are you sure you want to clear all your typing data? This cannot be undone.')
    ) {
      typingService.clearSessions();
      setSessions([]);
      setStats(typingService.getTypingStats());
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Your Typing Statistics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
          Track your progress and performance metrics over time. See how your typing speed and
          accuracy have improved as you practice with TOEFL passages.
        </p>
      </div>

      {/* Time range filter */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Time Range</h2>

            <div className="flex space-x-2">
              <button
                onClick={() => setTimeRange('all')}
                className={`px-3 py-1 rounded-md ${
                  timeRange === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-3 py-1 rounded-md ${
                  timeRange === 'month'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Last Month
              </button>
              <button
                onClick={() => setTimeRange('week')}
                className={`px-3 py-1 rounded-md ${
                  timeRange === 'week'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Last Week
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
            No Data Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven&apos;t completed any typing sessions yet. Start practicing to see your
            statistics here.
          </p>
          <a
            href="/passages"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-block"
          >
            Start Practicing
          </a>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Average WPM
              </h3>
              <div className="flex items-end">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {Math.round(
                    filteredSessions.reduce((sum, s) => sum + s.wpm, 0) / filteredSessions.length,
                  )}
                </span>
                {progressMetrics.wpmImprovement !== 0 && (
                  <span
                    className={`ml-2 text-sm ${
                      progressMetrics.wpmImprovement > 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {progressMetrics.wpmImprovement > 0 ? '+' : ''}
                    {Math.round(progressMetrics.wpmImprovement)}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Average Accuracy
              </h3>
              <div className="flex items-end">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {Math.round(
                    filteredSessions.reduce((sum, s) => sum + s.accuracy, 0) /
                      filteredSessions.length,
                  )}
                  %
                </span>
                {progressMetrics.accuracyImprovement !== 0 && (
                  <span
                    className={`ml-2 text-sm ${
                      progressMetrics.accuracyImprovement > 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {progressMetrics.accuracyImprovement > 0 ? '+' : ''}
                    {Math.round(progressMetrics.accuracyImprovement)}%
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Sessions Completed
              </h3>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {filteredSessions.length}
              </span>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Total Practice Time
              </h3>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {Math.round(
                  filteredSessions.reduce((sum, s) => {
                    if (s.startTime && s.endTime) {
                      return (
                        sum +
                        (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) /
                          (1000 * 60)
                      );
                    }
                    return sum;
                  }, 0),
                )}{' '}
                min
              </span>
            </div>
          </div>

          {/* Performance highlights */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Performance Highlights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Best WPM
                </h3>
                {filteredSessions.length > 0 &&
                  (() => {
                    const bestWpmSession = [...filteredSessions].sort((a, b) => b.wpm - a.wpm)[0];
                    return (
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {bestWpmSession.wpm} WPM
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(new Date(bestWpmSession.startTime))}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                          {getPassageTitle(bestWpmSession.passageId)}
                        </p>
                      </div>
                    );
                  })()}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Best Accuracy
                </h3>
                {filteredSessions.length > 0 &&
                  (() => {
                    const bestAccuracySession = [...filteredSessions].sort(
                      (a, b) => b.accuracy - a.accuracy,
                    )[0];
                    return (
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {bestAccuracySession.accuracy}%
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(new Date(bestAccuracySession.startTime))}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                          {getPassageTitle(bestAccuracySession.passageId)}
                        </p>
                      </div>
                    );
                  })()}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Most Recent Session
                </h3>
                {filteredSessions.length > 0 &&
                  (() => {
                    const mostRecentSession = [...filteredSessions].sort(
                      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
                    )[0];
                    return (
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {mostRecentSession.wpm} WPM / {mostRecentSession.accuracy}%
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(new Date(mostRecentSession.startTime))}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                          {getPassageTitle(mostRecentSession.passageId)}
                        </p>
                      </div>
                    );
                  })()}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Most Practiced Passage
                </h3>
                {filteredSessions.length > 0 &&
                  (() => {
                    // Count sessions by passage ID
                    const passageCounts = filteredSessions.reduce(
                      (counts, session) => {
                        counts[session.passageId] = (counts[session.passageId] || 0) + 1;
                        return counts;
                      },
                      {} as Record<string, number>,
                    );

                    // Find passage with most sessions
                    const mostPracticedId = Object.entries(passageCounts).sort(
                      (a, b) => b[1] - a[1],
                    )[0][0];

                    return (
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {passageCounts[mostPracticedId]} sessions
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                          {getPassageTitle(mostPracticedId)}
                        </p>
                      </div>
                    );
                  })()}
              </div>
            </div>
          </div>

          {/* Recent sessions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Recent Sessions
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Passage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      WPM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Accuracy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Errors
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSessions
                    .sort(
                      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
                    )
                    .slice(0, 10)
                    .map((session, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(new Date(session.startTime))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {getPassageTitle(session.passageId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {session.wpm}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {session.accuracy}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {session.errors.length}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Data management */}
          <div className="flex justify-end">
            <button
              onClick={handleClearData}
              className="px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
