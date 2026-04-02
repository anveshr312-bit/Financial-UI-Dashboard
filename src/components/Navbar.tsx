import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import type { Role } from '../types';
import { Sun, Moon } from 'lucide-react';

export const Navbar = () => {
  const { role, setRole, theme, setTheme } = useDashboard();

  return (
    <nav className="sticky top-0 z-50 bg-finance-surface shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-b border-finance-border px-6 py-4 flex justify-between items-center transition-colors">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-finance-primary flex items-center justify-center text-white font-bold shadow-sm">
          F
        </div>
        <h1 className="text-[20px] font-bold tracking-tight text-finance-text-primary m-0">Finance Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-4 relative">
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-full text-finance-text-secondary hover:text-finance-primary hover:bg-finance-bg transition-all duration-200"
          aria-label="Toggle Dark Mode"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <div className="flex items-center gap-2">
          <label htmlFor="role-select" className="text-finance-text-secondary text-sm font-medium">Role:</label>
          <select
            id="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="bg-finance-bg border border-finance-border text-finance-text-primary rounded-[8px] px-3 py-1.5 focus:outline-none focus:border-finance-primary focus:ring-1 focus:ring-finance-primary text-sm font-medium transition-all duration-200 hover:bg-finance-hover cursor-pointer shadow-sm"
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
    </nav>
  );
};
