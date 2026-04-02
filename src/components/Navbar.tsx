import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Role } from '../types';

export const Navbar = () => {
  const { role, setRole } = useDashboard();

  return (
    <nav className="sticky top-0 z-50 bg-finance-surface shadow-[0_1px_4px_rgba(0,0,0,0.07)] border-b border-finance-border px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-finance-primary flex items-center justify-center text-white font-bold">
          F
        </div>
        <h1 className="text-[20px] font-semibold text-finance-text-primary m-0">Finance Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-3 relative">
        <label htmlFor="role-select" className="text-finance-text-secondary text-sm font-medium">Role:</label>
        <select
          id="role-select"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="bg-finance-bg border border-finance-border text-finance-text-primary rounded-[8px] px-3 py-1.5 focus:outline-none focus:border-finance-primary focus:ring-1 focus:ring-finance-primary text-sm font-medium transition-colors"
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </nav>
  );
};
