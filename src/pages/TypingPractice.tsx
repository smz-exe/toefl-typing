import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Passage,
  TypingSession,
  TypingError,
  TypingSettings,
  PassageFormat,
} from '../types/typing.js';
import { TypingInterface } from '../components/typing/TypingInterface.js';
import { TypingMetrics } from '../components/typing/TypingMetrics.js';
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
  const [currentSession, setCurrentSession] = useState<{
    wpm: number;
    accuracy: number;
    errors: TypingError[];
    elapsedTime?: number;
  } | null>(null);
  const [pastSessions, setPastSessions] = useState<TypingSession[]>([]);
  const [settings, setSettings] = useState<TypingSettings>(typingService.getSettings());
  const [availablePassages, setAvailablePassages] = useState<Passage[]>(passages);
  const [selectedFormat, setSelectedFormat] = useState<PassageFormat>(settings.preferredFormat);

  // Filter passages by format
  useEffect(() => {
    const filteredPassages = typingService.getPassagesByFormat(selectedFormat, passages);
    setAvailablePassages(filteredPassages);

    // Save the format preference
    typingService.saveSettings({ preferredFormat: selectedFormat });
  }, [selectedFormat]);

  // Load passage based on ID from URL params
  useEffect(() => {
    if (passageId) {
      const foundPassage = passages.find((p) => p.id === passageId);
      if (foundPassage) {
        setPassage(foundPassage);
        setSelectedFormat(foundPassage.format);

        // Load past sessions for this passage
        const sessions = typingService.getSessionsByPassage(passageId);
        setPastSessions(sessions);
      } else {
        // Passage not found, redirect to passage selection
        navigate('/passages');
      }
    } else {
      // No passage ID provided, use a random passage from filtered list
      const filteredPassages = typingService.getPassagesByFormat(selectedFormat, passages);
      if (filteredPassages.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredPassages.length);
        setPassage(filteredPassages[randomIndex]);
      } else {
        // Fallback to any passage if no passages match the selected format
        const randomIndex = Math.floor(Math.random() * passages.length);
        setPassage(passages[randomIndex]);
      }
    }
  }, [passageId, navigate, selectedFormat]);

  // Timer functionality removed as requested

  // Handle typing completion
  const handleTypingComplete = (wpm: number, accuracy: number, errors: TypingError[]) => {
    // Create session data
    const now = new Date();
    const startTime = new Date(now.getTime() - 60000); // Assume 1 minute for stats

    // Save session
    if (passage) {
      const session = typingService.saveSession(passage.id, wpm, accuracy, errors, startTime, now);

      // Update state
      setCurrentSession({
        wpm,
        accuracy,
        errors,
        elapsedTime: Math.floor((now.getTime() - startTime.getTime()) / 1000),
      });

      // Add to past sessions
      setPastSessions((prev) => [session, ...prev]);
    }
  };

  // Handle retry
  const handleRetry = () => {
    setCurrentSession(null);
  };

  // Handle settings change
  const handleSettingsChange = (newSettings: TypingSettings) => {
    setSettings(newSettings);
    if (newSettings.preferredFormat !== selectedFormat) {
      setSelectedFormat(newSettings.preferredFormat);
    }
  };

  // Handle format change
  const handleFormatChange = (format: PassageFormat) => {
    setSelectedFormat(format);
    setCurrentSession(null);
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
    <div className="w-full px-4">
      {/* Passage info */}
      <div className="mb-10">
        <h1 className="text-2xl font-medium mb-3">{passage.title}</h1>
        <div className="flex flex-wrap gap-3 mb-4">
          <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
            {passage.difficulty.charAt(0).toUpperCase() + passage.difficulty.slice(1)}
          </span>
          <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
            {passage.type.charAt(0).toUpperCase() + passage.type.slice(1)}
          </span>
          <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
            {passage.domain.charAt(0).toUpperCase() + passage.domain.slice(1)}
          </span>
          <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
            {passage.wordCount} words
          </span>
          <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
            {passage.format === 'complete_essay' ? 'Complete Essay' : 'Single Paragraph'}
          </span>
        </div>
      </div>

      {/* Format selector */}
      {!currentSession && (
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-3">Passage Format</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => handleFormatChange('complete_essay')}
              className={`btn ${
                selectedFormat === 'complete_essay' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              Complete Essay
            </button>
            <button
              onClick={() => handleFormatChange('single_paragraph')}
              className={`btn ${
                selectedFormat === 'single_paragraph' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              Single Paragraph
            </button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {selectedFormat === 'complete_essay'
              ? 'Practice with full essays to build endurance and comprehensive understanding.'
              : 'Focus on single paragraphs for targeted practice and quicker sessions.'}
          </p>
        </div>
      )}

      {/* Session completed view */}
      {currentSession ? (
        <div className="space-y-8">
          <TypingMetrics
            currentSession={currentSession}
            pastSessions={pastSessions}
            showDetails={true}
            passageContent={passage.content}
          />

          <div className="flex justify-center space-x-4 mt-8">
            <button onClick={handleRetry} className="btn btn-primary">
              Practice Again
            </button>
            <button
              onClick={() => navigate('/passages')}
              className="btn border border-border text-foreground hover:bg-secondary"
            >
              Choose Another Passage
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Typing interface - expanded to fill the space */}
          <div className="py-8">
            <TypingInterface passage={passage} onComplete={handleTypingComplete} />
          </div>

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
