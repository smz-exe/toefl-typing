import {
  TypingSession,
  TypingError,
  TypingStats,
  TypingSettings,
  Passage,
  DetailedFeedback,
  PassageFormat,
} from '../types/typing.js';

// We'll use a simple random ID generator instead of uuid to avoid the dependency
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Local storage keys
const SESSIONS_STORAGE_KEY = 'toefl-typing-sessions';
const SETTINGS_STORAGE_KEY = 'toefl-typing-settings';

/**
 * Default typing settings
 */
const DEFAULT_SETTINGS: TypingSettings = {
  theme: 'system',
  fontFamily: 'monospace',
  fontSize: 16,
  showWpm: true,
  showAccuracy: true,
  highlightErrors: true,
  soundEffects: true,
  preferredFormat: 'complete_essay',
};

/**
 * Service for managing typing sessions and settings
 */
export const typingService = {
  /**
   * Save a new typing session
   */
  saveSession: (
    passageId: string,
    wpm: number,
    accuracy: number,
    errors: TypingError[],
    startTime: Date,
    endTime: Date,
  ): TypingSession => {
    const sessions = typingService.getSessions();

    const newSession: TypingSession = {
      id: generateId(),
      passageId,
      wpm,
      accuracy,
      errors,
      startTime,
      endTime,
      completed: true,
    };

    sessions.push(newSession);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));

    return newSession;
  },

  /**
   * Get all saved typing sessions
   */
  getSessions: (): TypingSession[] => {
    const sessionsJson = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!sessionsJson) return [];

    try {
      const sessions = JSON.parse(sessionsJson) as TypingSession[];

      // Convert string dates to Date objects
      return sessions.map((session) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined,
      }));
    } catch (error) {
      console.error('Error parsing typing sessions:', error);
      return [];
    }
  },

  /**
   * Get sessions for a specific passage
   */
  getSessionsByPassage: (passageId: string): TypingSession[] => {
    const sessions = typingService.getSessions();
    return sessions.filter((session: TypingSession) => session.passageId === passageId);
  },

  /**
   * Clear all typing session data
   */
  clearSessions: (): void => {
    localStorage.removeItem(SESSIONS_STORAGE_KEY);
  },

  /**
   * Calculate typing statistics
   */
  getTypingStats: (): TypingStats => {
    const sessions = typingService.getSessions();

    if (sessions.length === 0) {
      return {
        averageWpm: 0,
        averageAccuracy: 0,
        totalPracticeTime: 0,
        sessionsCompleted: 0,
        mostCommonErrors: [],
      };
    }

    // Calculate average WPM and accuracy
    const averageWpm = Math.round(
      sessions.reduce((sum: number, session: TypingSession) => sum + session.wpm, 0) /
        sessions.length,
    );

    const averageAccuracy = Math.round(
      sessions.reduce((sum: number, session: TypingSession) => sum + session.accuracy, 0) /
        sessions.length,
    );

    // Calculate total practice time in minutes
    const totalPracticeTime = Math.round(
      sessions.reduce((sum: number, session: TypingSession) => {
        if (session.startTime && session.endTime) {
          return sum + (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60);
        }
        return sum;
      }, 0),
    );

    // Find most common errors
    const errorMap = new Map<string, number>();

    sessions.forEach((session: TypingSession) => {
      session.errors.forEach((error: TypingError) => {
        const key = `${error.expected} → ${error.actual}`;
        errorMap.set(key, (errorMap.get(key) || 0) + 1);
      });
    });

    const mostCommonErrors = Array.from(errorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([error]) => error);

    return {
      averageWpm,
      averageAccuracy,
      totalPracticeTime,
      sessionsCompleted: sessions.length,
      mostCommonErrors,
    };
  },

  /**
   * Get user settings
   */
  getSettings: (): TypingSettings => {
    const settingsJson = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!settingsJson) return DEFAULT_SETTINGS;

    try {
      const settings = JSON.parse(settingsJson) as Partial<TypingSettings>;
      return { ...DEFAULT_SETTINGS, ...settings };
    } catch (error) {
      console.error('Error parsing typing settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  /**
   * Get passages filtered by format
   */
  getPassagesByFormat: (format: PassageFormat, passages: Passage[]): Passage[] => {
    return passages.filter((passage) => passage.format === format);
  },

  /**
   * Generate detailed feedback based on typing performance
   */
  generateDetailedFeedback: (session: TypingSession, passageContent: string): DetailedFeedback => {
    const strengths = [];
    const weaknesses = [];
    const suggestions = [];
    const errorPatterns = new Map();

    // Analyze speed
    const speedRating = Math.min(10, Math.max(1, Math.floor(session.wpm / 15)));
    if (session.wpm > 60) {
      strengths.push('Excellent typing speed');
    } else if (session.wpm > 40) {
      strengths.push('Good typing speed');
    } else {
      weaknesses.push('Typing speed could be improved');
      suggestions.push('Practice regular typing exercises to build muscle memory');
    }

    // Analyze accuracy
    const accuracyRating = Math.min(10, Math.max(1, Math.floor(session.accuracy / 10)));
    if (session.accuracy > 95) {
      strengths.push('Exceptional typing accuracy');
    } else if (session.accuracy > 85) {
      strengths.push('Good typing accuracy');
    } else {
      weaknesses.push('Accuracy needs improvement');
      suggestions.push('Focus on precision over speed in practice sessions');
    }

    // Analyze error patterns
    session.errors.forEach((error) => {
      const context = passageContent.substring(
        Math.max(0, error.index - 10),
        Math.min(passageContent.length, error.index + 10),
      );

      const key = `${error.expected} → ${error.actual}`;
      if (!errorPatterns.has(key)) {
        errorPatterns.set(key, { count: 0, examples: [] });
      }

      const pattern = errorPatterns.get(key);
      pattern.count++;
      if (pattern.examples.length < 3) {
        pattern.examples.push(context);
      }
    });

    // Convert error patterns to array and sort
    const commonErrorPatterns = Array.from(errorPatterns.entries())
      .map(([pattern, data]) => ({
        pattern,
        count: data.count,
        examples: data.examples,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Add specific suggestions based on error patterns
    if (commonErrorPatterns.length > 0) {
      weaknesses.push(`Frequent errors with: ${commonErrorPatterns[0].pattern}`);
      suggestions.push('Practice words containing these problematic character combinations');
    }

    // Calculate consistency rating based on error distribution
    const consistencyRating = Math.min(
      10,
      Math.max(1, 10 - Math.floor(commonErrorPatterns.length / 2)),
    );

    // Calculate overall rating
    const overallRating = Math.round((speedRating + accuracyRating + consistencyRating) / 3);

    return {
      strengths,
      weaknesses,
      suggestions,
      commonErrorPatterns,
      performanceRating: {
        speed: speedRating,
        accuracy: accuracyRating,
        consistency: consistencyRating,
        overall: overallRating,
      },
    };
  },

  /**
   * Save user settings
   */
  saveSettings: (settings: Partial<TypingSettings>): TypingSettings => {
    const currentSettings = typingService.getSettings();
    const newSettings = { ...currentSettings, ...settings };

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    return newSettings;
  },

  /**
   * Reset settings to defaults
   */
  resetSettings: (): TypingSettings => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  },
};

// Use a namespace-style export for better TypeScript support
export default typingService;
