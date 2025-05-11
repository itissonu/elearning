// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextProps {
  isFirstLaunch: boolean;
  isLoggedIn: boolean;
  completeOnboarding: () => void;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isFirstLaunch, setFirstLaunch] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);

  const completeOnboarding = () => setFirstLaunch(false);
  const login = () => setLoggedIn(true);
  const logout = () => setLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isFirstLaunch, isLoggedIn, completeOnboarding, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
