import { TypingSession, TypingError, TypingStats, TypingSettings } from '../types/typing.js';

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
