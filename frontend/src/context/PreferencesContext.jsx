import React, { createContext, useContext, useState, useEffect } from 'react';

const defaultPreferences = {
  theme: 'light',
  currency: 'USD',
  language: 'en',
  autoLocation: true,
  soundEnabled: true,
};

const PreferencesContext = createContext({
  preferences: defaultPreferences,
  setPreferences: () => {},
  setTheme: () => {},
  setCurrency: () => {},
  setLanguage: () => {},
  setAutoLocation: () => {},
  setSoundEnabled: () => {},
});

export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    const stored = localStorage.getItem('preferences');
    return stored ? JSON.parse(stored) : defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem('preferences', JSON.stringify(preferences));
  }, [preferences]);

  const setTheme = (theme) => setPreferences((p) => ({ ...p, theme }));
  const setCurrency = (currency) => setPreferences((p) => ({ ...p, currency }));
  const setLanguage = (language) => setPreferences((p) => ({ ...p, language }));
  const setAutoLocation = (autoLocation) => setPreferences((p) => ({ ...p, autoLocation }));
  const setSoundEnabled = (soundEnabled) => setPreferences((p) => ({ ...p, soundEnabled }));

  return (
    <PreferencesContext.Provider value={{
      preferences,
      setPreferences,
      setTheme,
      setCurrency,
      setLanguage,
      setAutoLocation,
      setSoundEnabled,
    }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}
