import React, { useState } from 'react';
import { TypingSettings as TypingSettingsType } from '../types/typing.js';
import { TypingSettings as TypingSettingsComponent } from '../components/typing/TypingSettings.js';
import typingService from '../services/typingService.js';

/**
 * Page for customizing application settings
 */
export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<TypingSettingsType>(typingService.getSettings());
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Handle settings change
  const handleSettingsChange = (newSettings: TypingSettingsType) => {
    setSettings(newSettings);
    setSaveMessage('Settings saved successfully!');

    // Clear message after 3 seconds
    setTimeout(() => {
      setSaveMessage(null);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
          Customize your typing experience to match your preferences. Adjust the appearance, display
          options, and behavior of the typing interface.
        </p>
      </div>

      {/* Save message */}
      {saveMessage && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 px-4 py-3 rounded transition-colors duration-200">
          {saveMessage}
        </div>
      )}

      {/* Settings component */}
      <TypingSettingsComponent onSettingsChange={handleSettingsChange} />

      {/* About section */}
      <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          About TOEFL Typing Practice
        </h2>

        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            TOEFL Typing Practice is designed to help you improve your typing skills while
            familiarizing yourself with the style and content of TOEFL writing tasks. Regular
            practice will help you develop:
          </p>

          <ul className="list-disc pl-5 space-y-2">
            <li>Faster typing speed for the TOEFL writing section</li>
            <li>Greater accuracy and fewer errors in your writing</li>
            <li>Familiarity with academic vocabulary and sentence structures</li>
            <li>Improved ability to express complex ideas in written English</li>
            <li>Better time management during the actual TOEFL test</li>
          </ul>

          <p>
            We recommend practicing regularly with a variety of passages across different difficulty
            levels and thematic domains. Start with shorter, easier passages and gradually work your
            way up to more challenging content.
          </p>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Version 1.0.0 • © 2025 TOEFL Typing Practice
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
