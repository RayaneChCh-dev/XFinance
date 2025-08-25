import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';
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
    // Mock login - in a real application, this would call an API
    if (email === 'pierre@xfinance.app' && password === 'pierre123') {
      const mockTransactions = [
        new Transaction(null, new Date().toISOString(), 2500, 'Salaire', 'Salaire mensuel', 'income'),
        new Transaction(null, new Date().toISOString(), 50, 'Alimentation', 'Courses du mois', 'expense'),
        new Transaction(null, new Date().toISOString(), 30, 'Divertissement', 'Soirée ciné', 'expense'),
      ];

      const mockUser = new User(
        '1',
        'Pierre Chartier',
        email,
        mockTransactions.map(t => t.toJSON())
      );

      await StorageService.saveUser(mockUser.toJSON());
      setUser(mockUser);
      return { success: true };
    }
    return { success: false, error: 'Email ou mot de passe incorrect.' };
  };

  const logout = async () => {
    await StorageService.removeUser();
    setUser(null);
  };

  const updateUser = async (userData) => {
    if (user) {
      const updatedUser = new User(
        user.id,
        userData.name || user.name,
        userData.email || user.email,
        user.transactionsHistory.map(t => t.toJSON())
      );
      await StorageService.saveUser(updatedUser.toJSON());
      setUser(updatedUser);
    }
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