/**
 * Types for the TOEFL typing application
 */

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type EssayType = 'integrated' | 'independent';
export type PassageFormat = 'complete_essay' | 'single_paragraph';
export type ThematicDomain =
  | 'science'
  | 'humanities'
  | 'social'
  | 'technology'
  | 'environment'
  | 'education';

/**
 * Represents a TOEFL passage for typing practice
 */
export interface Passage {
  id: string;
  title: string;
  content: string;
  difficulty: DifficultyLevel;
  type: EssayType;
  format: PassageFormat;
  domain: ThematicDomain;
  wordCount: number;
  source?: string;
}

/**
 * Represents a typing error
 */
export interface TypingError {
  index: number;
  expected: string;
  actual: string;
}

/**
 * Represents a typing session
 */
export interface TypingSession {
  id: string;
  passageId: string;
  startTime: Date;
  endTime?: Date;
  wpm: number;
  accuracy: number;
  errors: TypingError[];
  completed: boolean;
}

/**
 * Typing statistics for analytics
 */
export interface TypingStats {
  averageWpm: number;
  averageAccuracy: number;
  totalPracticeTime: number; // in minutes
  sessionsCompleted: number;
  mostCommonErrors: string[];
}

/**
 * User settings for the typing application
 */
export interface TypingSettings {
  theme: 'light' | 'dark' | 'system';
  fontFamily: string;
  fontSize: number;
  showWpm: boolean;
  showAccuracy: boolean;
  highlightErrors: boolean;
  soundEffects: boolean;
  preferredFormat: PassageFormat;
}

/**
 * Detailed feedback for typing performance
 */
export interface DetailedFeedback {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  commonErrorPatterns: {
    pattern: string;
    count: number;
    examples: string[];
  }[];
  performanceRating: {
    speed: number; // 1-10
    accuracy: number; // 1-10
    consistency: number; // 1-10
    overall: number; // 1-10
  };
}
