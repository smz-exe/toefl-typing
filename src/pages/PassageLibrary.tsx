import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Passage } from '../types/typing.js';
import { PassageSelector } from '../components/typing/PassageSelector.js';
import { passages } from '../data/passages.js';

/**
 * Page for browsing and selecting passages from the library
 */
export const PassageLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPassage, setSelectedPassage] = useState<Passage | null>(null);

  // Handle passage selection
  const handleSelectPassage = (passage: Passage) => {
    setSelectedPassage(passage);
  };

  // Start practice with the selected passage
  const handleStartPractice = () => {
    if (selectedPassage) {
      navigate(`/practice/${selectedPassage.id}`);
    }
  };

  // Start practice with a random passage
  const handleRandomPractice = () => {
    const randomIndex = Math.floor(Math.random() * passages.length);
    navigate(`/practice/${passages[randomIndex].id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          TOEFL Passage Library
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
          Browse our collection of TOEFL-style passages for typing practice. Filter by difficulty,
          essay type, and thematic domain to find passages that match your study goals.
        </p>
      </div>

      {/* Quick actions */}
      <div className="mb-8 flex flex-wrap gap-4">
        <button
          onClick={handleRandomPractice}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M13.707 7.707a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 101.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z"
              clipRule="evenodd"
            />
          </svg>
          Random Passage
        </button>

        {selectedPassage && (
          <button
            onClick={handleStartPractice}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Start Practice
          </button>
        )}
      </div>

      {/* Selected passage preview */}
      {selectedPassage && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Selected Passage</h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {selectedPassage.title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                {selectedPassage.difficulty.charAt(0).toUpperCase() +
                  selectedPassage.difficulty.slice(1)}
              </span>
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                {selectedPassage.type.charAt(0).toUpperCase() + selectedPassage.type.slice(1)}
              </span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                {selectedPassage.domain.charAt(0).toUpperCase() + selectedPassage.domain.slice(1)}
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full">
                {selectedPassage.wordCount} words
              </span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4 max-h-48 overflow-y-auto">
            <p className="text-gray-700 dark:text-gray-300 text-sm">{selectedPassage.content}</p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleStartPractice}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Practice This Passage
            </button>
          </div>
        </div>
      )}

      {/* Passage selector */}
      <PassageSelector passages={passages} onSelectPassage={handleSelectPassage} />

      {/* Information about TOEFL passages */}
      <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          About TOEFL Writing Passages
        </h2>

        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            The TOEFL (Test of English as a Foreign Language) writing section consists of two tasks:
          </p>

          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Integrated Writing Task
            </h3>
            <p>
              This task requires you to read a short academic passage, listen to a lecture on the
              same topic, and then write an essay that synthesizes information from both sources.
              The essay typically explains how the lecture supports or challenges points made in the
              reading passage.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Independent Writing Task
            </h3>
            <p>
              This task asks you to write an essay expressing and supporting your opinion on an
              issue. You&apos;ll need to use specific reasons and examples to support your position.
            </p>
          </div>

          <p>
            Our passage library contains examples of both types of writing tasks, categorized by
            difficulty level and thematic domain. Regular practice with these passages will help you
            improve both your typing skills and your familiarity with TOEFL-style academic English.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PassageLibrary;
