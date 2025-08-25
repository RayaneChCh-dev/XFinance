import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../models/User';
import StorageService from '../services/StorageService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await StorageService.getUser();
      if (userData) {
        setUser(User.fromJSON(userData));
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    // Mock login - en production, ceci ferait appel à une vraie API
    if (email && password) {
      const mockUser = new User(
        '1',
        'John Doe',
        email,
        1500.00
      );
      
      await StorageService.saveUser(mockUser.toJSON());
      setUser(mockUser);
      return { success: true };
    }
    return { success: false, error: 'Email et mot de passe requis' };
  };

  const logout = async () => {
    await StorageService.removeUser();
    setUser(null);
  };

  const updateUser = async (userData) => {
    const updatedUser = { ...user, ...userData };
    await StorageService.saveUser(updatedUser);
    setUser(updatedUser);
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};