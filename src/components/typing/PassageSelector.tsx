import React, { useState, useMemo } from 'react';
import { Passage, DifficultyLevel, EssayType, ThematicDomain } from '../../types/typing.js';

interface PassageSelectorProps {
  passages: Passage[];
  onSelectPassage: (passage: Passage) => void;
}

/**
 * Component for selecting passages from the library based on filters
 */
export const PassageSelector: React.FC<PassageSelectorProps> = ({ passages, onSelectPassage }) => {
  // Filter states
  const [difficulty, setDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [type, setType] = useState<EssayType | 'all'>('all');
  const [domain, setDomain] = useState<ThematicDomain | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Get unique values for each filter
  const difficulties = useMemo(
    () => ['all', ...new Set(passages.map((p) => p.difficulty))] as (DifficultyLevel | 'all')[],
    [passages],
  );

  const types = useMemo(
    () => ['all', ...new Set(passages.map((p) => p.type))] as (EssayType | 'all')[],
    [passages],
  );

  const domains = useMemo(
    () => ['all', ...new Set(passages.map((p) => p.domain))] as (ThematicDomain | 'all')[],
    [passages],
  );

  // Filter passages based on selected filters
  const filteredPassages = useMemo(() => {
    return passages.filter((passage) => {
      // Apply difficulty filter
      if (difficulty !== 'all' && passage.difficulty !== difficulty) {
        return false;
      }

      // Apply type filter
      if (type !== 'all' && passage.type !== type) {
        return false;
      }

      // Apply domain filter
      if (domain !== 'all' && passage.domain !== domain) {
        return false;
      }

      // Apply search query filter
      if (searchQuery && !passage.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [passages, difficulty, type, domain, searchQuery]);

  // Format label for display
  const formatLabel = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Select a Passage</h2>

      {/* Search and filters */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Difficulty filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel | 'all')}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d === 'all' ? 'All Difficulties' : formatLabel(d)}
                </option>
              ))}
            </select>
          </div>

          {/* Type filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Essay Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as EssayType | 'all')}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === 'all' ? 'All Types' : formatLabel(t)}
                </option>
              ))}
            </select>
          </div>

          {/* Domain filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Thematic Domain
            </label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value as ThematicDomain | 'all')}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d === 'all' ? 'All Domains' : formatLabel(d)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Passage list */}
      <div className="space-y-4">
        {filteredPassages.length === 0 ? (
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">No passages match your filters.</p>
          </div>
        ) : (
          filteredPassages.map((passage) => (
            <div
              key={passage.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border-l-4 border-transparent hover:border-primary"
              onClick={() => onSelectPassage(passage)}
            >
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                {passage.title}
              </h3>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                  {formatLabel(passage.difficulty)}
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                  {formatLabel(passage.type)}
                </span>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                  {formatLabel(passage.domain)}
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full">
                  {passage.wordCount} words
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                {passage.content.substring(0, 150)}...
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
