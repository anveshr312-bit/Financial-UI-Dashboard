import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Filters, Role, Theme } from '../types';
import { initialTransactions } from '../data/mockData';

interface DashboardContextType {
  transactions: Transaction[];
  filters: Filters;
  role: Role;
  setFilters: (filters: Partial<Filters>) => void;
  setRole: (role: Role) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [filters, setFiltersState] = useState<Filters>({
    search: '',
    category: 'All',
    type: 'All',
    sortBy: 'Date',
  });
  const [role, setRole] = useState<Role>('admin');

  const setFilters = (newFilters: Partial<Filters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const [theme, setTheme] = useState<Theme>('light');

  // Load and apply theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('finance_theme') as Theme;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('finance_theme', theme);
  }, [theme]);

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx = { ...tx, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [...prev, newTx]);
  };

  const updateTransaction = (id: string, tx: Omit<Transaction, 'id'>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...tx, id } : t));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <DashboardContext.Provider value={{ transactions, filters, role, setFilters, setRole, addTransaction, updateTransaction, deleteTransaction, theme, setTheme }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
