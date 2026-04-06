import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Filters, Role, Theme, DashboardView, Notification } from '../types';
import { initialTransactions } from '../data/mockData';

interface DashboardContextType {
  transactions: Transaction[];
  filters: Filters;
  role: Role;
  activeView: DashboardView;
  setFilters: (filters: Partial<Filters>) => void;
  setRole: (role: Role) => void;
  setActiveView: (view: DashboardView) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  resetData: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isLoadingData: boolean;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const DUMMY_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'System Update', message: 'Version 2.0 has been deployed successfully.', time: '2 mins ago', isRead: false },
  { id: '2', title: 'New Login', message: 'Detected login from new device (MacBook Pro).', time: '1 hour ago', isRead: false },
  { id: '3', title: 'Weekly Report', message: 'Your weekly financial summary is ready to view.', time: '1 day ago', isRead: true },
  { id: '4', title: 'Goal Achieved', message: 'You have hit your savings target for the month!', time: '2 days ago', isRead: true }
];

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [filters, setFiltersState] = useState<Filters>({
    search: '',
    category: 'All',
    type: 'All',
    sortBy: 'Date',
  });
  const [role, setRoleState] = useState<Role>('admin');
  const [activeView, setActiveViewState] = useState<DashboardView>('overview');
  const [notifications, setNotifications] = useState<Notification[]>(DUMMY_NOTIFICATIONS);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const setFilters = (newFilters: Partial<Filters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem('finance_role', newRole);
    if (newRole !== 'admin' && activeView === 'admin') {
       setActiveViewState('overview'); // Kick out of admin view if downgraded
    }
  };

  const setActiveView = (newView: DashboardView) => {
    setActiveViewState(newView);
    localStorage.setItem('finance_active_view', newView);
    setSidebarOpen(false); // Close sidebar on mobile when navigating
  };

  const [theme, setTheme] = useState<Theme>('light');

  // Async mock data hydration
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedTransactions = localStorage.getItem('finance_transactions');
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      } else {
        setTransactions(initialTransactions);
      }

      const savedRole = localStorage.getItem('finance_role') as Role;
      if (savedRole && (savedRole === 'admin' || savedRole === 'viewer')) {
        setRoleState(savedRole);
      }

      const savedView = localStorage.getItem('finance_active_view') as DashboardView;
      if (savedView && ['overview', 'transactions', 'analytics', 'reports', 'admin'].includes(savedView)) {
        setActiveViewState(savedView);
      }
      
      setIsInitialized(true);
      setIsLoadingData(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // Sync state to local storage exclusively when initial hydrate completes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('finance_transactions', JSON.stringify(transactions));
    }
  }, [transactions, isInitialized]);

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
  
  const resetData = () => {
    setTransactions(initialTransactions);
  };
  
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <DashboardContext.Provider value={{ 
       transactions, filters, role, activeView, setFilters, setRole, setActiveView, 
       addTransaction, updateTransaction, deleteTransaction, resetData, 
       theme, setTheme, isLoadingData, notifications, markNotificationRead,
       isSidebarOpen, setSidebarOpen 
    }}>
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
