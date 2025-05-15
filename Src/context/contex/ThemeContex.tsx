import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  error: string;
  success: string;
  custom: string;
}

interface ThemeContextData {
  theme: ThemeType;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeType) => void;
}

const lightColors: ThemeColors = {
  primary: 'rgba(240, 234, 234, 0.95)',
  secondary: '#5A67D8',
  background: '#FFFFFF',
  card: '#F3F4F6',
  text: '#1F2937',
  border: '#E5E7EB',
  notification: '#EF4444',
  error: '#DC2626',
  success: '#10B981',
  custom: '#877DFC',
};

const darkColors: ThemeColors = {
  primary: 'rgba(8, 5, 5, 0.53)',
  secondary: '#6D7AFF',
  background: '#121212',
  card: '#242424',
  text: 'white',
  border: '#374151',
  notification: '#EF4444',
  error: '#DC2626',
  success: '#10B981',
  custom: '#E2F659',
};

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeType>('system');
  
  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@theme_mode');
        if (savedTheme) {
          setThemeMode(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    
    loadTheme();
  }, []);

  
  const isDark = 
    themeMode === 'system' 
      ? systemColorScheme === 'dark'
      : themeMode === 'dark';


  const colors = isDark ? darkColors : lightColors;

  
  const toggleTheme = () => {
    const newTheme = themeMode === 'light' 
      ? 'dark' 
      : themeMode === 'dark'
        ? 'system'
        : 'light';
    
    setThemeMode(newTheme);
    AsyncStorage.setItem('@theme_mode', newTheme);
  };
  
  
  const setThemeModeHandler = (mode: ThemeType) => {
    setThemeMode(mode);
    AsyncStorage.setItem('@theme_mode', mode);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: themeMode,
        colors,
        isDark,
        toggleTheme,
        setThemeMode: setThemeModeHandler,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};