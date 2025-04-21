import React from 'react';
import { Link } from 'react-router-dom';
import { passages } from '../data/passages.js';
import typingService from '../services/typingService.js';

/**
 * Home page component for the TOEFL typing application
 */
export const Home: React.FC = () => {
  // Get a random passage for quick start
  const getRandomPassage = () => {
    const randomIndex = Math.floor(Math.random() * passages.length);
    return passages[randomIndex];
  };

  // Get user stats if available
  const stats = typingService.getTypingStats();
  const hasPracticed = stats.sessionsCompleted > 0;

  // Features list
  const features = [
    {
      title: 'Authentic TOEFL Content',
      description:
        'Practice with passages that mirror the style and complexity of actual TOEFL writing tasks.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: 'Real-time Feedback',
      description:
        'Get instant feedback on your typing speed, accuracy, and errors as you practice.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      title: 'Timed Practice',
      description:
        'Simulate test conditions with timed practice sessions to improve your speed and efficiency.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Progress Tracking',
      description:
        'Monitor your improvement over time with detailed statistics and performance metrics.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: 'Customizable Experience',
      description:
        'Adjust the appearance and behavior of the typing interface to match your preferences.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Diverse Content Library',
      description:
        'Access a variety of passages categorized by difficulty, essay type, and thematic domain.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-16">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Improve Your TOEFL Writing Skills Through Typing Practice
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Enhance your typing speed and accuracy while familiarizing yourself with TOEFL-style
            academic English passages.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/practice/${getRandomPassage().id}`}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Typing Now
            </Link>
            <Link
              to="/passages"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Browse Passages
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-t-4 border-primary">
            <div className="font-mono text-sm mb-4 bg-gray-50 dark:bg-gray-900 p-4 rounded">
              <span className="text-green-600 dark:text-green-400">
                The acquisition of academic vocabulary{' '}
              </span>
              <span className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30">
                is
              </span>
              <span className="text-green-600 dark:text-green-400">
                {' '}
                essential for success in higher education.
              </span>
              <span className="bg-gray-300 dark:bg-gray-600 animate-pulse">|</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <div>WPM: 65</div>
              <div>Accuracy: 98%</div>
              <div>Time: 01:45</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats section (if user has practiced) */}
      {hasPracticed && (
        <div className="mb-16 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stats.averageWpm}</div>
              <div className="text-gray-600 dark:text-gray-400">Average WPM</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stats.averageAccuracy}%</div>
              <div className="text-gray-600 dark:text-gray-400">Average Accuracy</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stats.sessionsCompleted}</div>
              <div className="text-gray-600 dark:text-gray-400">Sessions Completed</div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link to="/statistics" className="text-primary hover:text-primary/80 transition-colors">
              View Detailed Statistics →
            </Link>
          </div>
        </div>
      )}

      {/* How it works section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Choose a Passage
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Select from our library of TOEFL-style passages based on your level and interests.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Practice Typing
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Type the passage with real-time feedback on your speed, accuracy, and errors.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Track Your Progress
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Review your performance metrics and see how you improve over time.
            </p>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary/10 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Improve Your TOEFL Writing Skills?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Start practicing today and see how your typing speed, accuracy, and familiarity with
          academic English improve over time.
        </p>
        <Link
          to="/passages"
          className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-block"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;
