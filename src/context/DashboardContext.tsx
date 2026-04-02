import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, Filters, Role } from '../types';
import { initialTransactions } from '../data/mockData';

interface DashboardContextType {
  transactions: Transaction[];
  filters: Filters;
  role: Role;
  setFilters: (filters: Partial<Filters>) => void;
  setRole: (role: Role) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, tx: Omit<Transaction, 'id'>) => void;
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

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx = { ...tx, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [...prev, newTx]);
  };

  const updateTransaction = (id: string, updatedTx: Omit<Transaction, 'id'>) => {
    setTransactions(prev => prev.map(tx => (tx.id === id ? { ...updatedTx, id } : tx)));
  };

  return (
    <DashboardContext.Provider value={{ transactions, filters, role, setFilters, setRole, addTransaction, updateTransaction }}>
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
