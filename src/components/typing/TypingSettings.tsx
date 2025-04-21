import React, { useState } from 'react';
import { TypingSettings as TypingSettingsType } from '../../types/typing.js';
import typingService from '../../services/typingService.js';

interface TypingSettingsProps {
  onSettingsChange: (settings: TypingSettingsType) => void;
}

/**
 * Component for customizing typing settings
 */
export const TypingSettings: React.FC<TypingSettingsProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<TypingSettingsType>(typingService.getSettings());

  // Available font families
  const fontFamilies = [
    { value: 'monospace', label: 'Monospace' },
    { value: 'serif', label: 'Serif' },
    { value: 'sans-serif', label: 'Sans Serif' },
    { value: 'system-ui', label: 'System UI' },
  ];

  // Font size options
  const fontSizes = [
    { value: 14, label: 'Small' },
    { value: 16, label: 'Medium' },
    { value: 18, label: 'Large' },
    { value: 20, label: 'Extra Large' },
  ];

  // Handle setting changes
  const handleSettingChange = <K extends keyof TypingSettingsType>(
    key: K,
    value: TypingSettingsType[K],
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Save to local storage and notify parent
    const savedSettings = typingService.saveSettings({ [key]: value });
    onSettingsChange(savedSettings);
  };

  // Reset settings to defaults
  const handleResetSettings = () => {
    const defaultSettings = typingService.resetSettings();
    setSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          Customize Your Typing Experience
        </h2>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
              Appearance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) =>
                    handleSettingChange('theme', e.target.value as 'light' | 'dark' | 'system')
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {fontFamilies.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Size
                </label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {fontSizes.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label} ({size.value}px)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Content Preferences */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
              Content Preferences
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Passage Format
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="formatComplete"
                    name="preferredFormat"
                    value="complete_essay"
                    checked={settings.preferredFormat === 'complete_essay'}
                    onChange={() => handleSettingChange('preferredFormat', 'complete_essay')}
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <label
                    htmlFor="formatComplete"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Complete Essays
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="formatParagraph"
                    name="preferredFormat"
                    value="single_paragraph"
                    checked={settings.preferredFormat === 'single_paragraph'}
                    onChange={() => handleSettingChange('preferredFormat', 'single_paragraph')}
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <label
                    htmlFor="formatParagraph"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Single Paragraphs
                  </label>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {settings.preferredFormat === 'complete_essay'
                  ? 'Complete essays provide comprehensive practice with longer texts, ideal for building endurance.'
                  : 'Single paragraphs offer focused practice in shorter sessions, perfect for targeted improvement.'}
              </p>
            </div>
          </div>

          {/* Display Settings */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
              Display Options
            </h3>

            <div className="space-y-4">
              {/* Show WPM */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showWpm"
                  checked={settings.showWpm}
                  onChange={(e) => handleSettingChange('showWpm', e.target.checked)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label
                  htmlFor="showWpm"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Show WPM while typing
                </label>
              </div>

              {/* Show Accuracy */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showAccuracy"
                  checked={settings.showAccuracy}
                  onChange={(e) => handleSettingChange('showAccuracy', e.target.checked)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label
                  htmlFor="showAccuracy"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Show accuracy while typing
                </label>
              </div>

              {/* Highlight Errors */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="highlightErrors"
                  checked={settings.highlightErrors}
                  onChange={(e) => handleSettingChange('highlightErrors', e.target.checked)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label
                  htmlFor="highlightErrors"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Highlight errors while typing
                </label>
              </div>

              {/* Sound Effects */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="soundEffects"
                  checked={settings.soundEffects}
                  onChange={(e) => handleSettingChange('soundEffects', e.target.checked)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label
                  htmlFor="soundEffects"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Enable sound effects
                </label>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Preview</h3>

            <div
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              style={{
                fontFamily: settings.fontFamily,
                fontSize: settings.fontSize,
              }}
            >
              <p className="mb-2">This is how your text will appear while typing:</p>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                <span className="text-green-600 dark:text-green-400">The quick brown fox </span>
                <span className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30">
                  jumps
                </span>
                <span className="text-green-600 dark:text-green-400"> over the lazy dog.</span>
                <span className="bg-gray-300 dark:bg-gray-600 animate-pulse">|</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleResetSettings}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
