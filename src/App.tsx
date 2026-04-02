import React from 'react';
import { DashboardProvider } from './context/DashboardContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <DashboardProvider>
      <div className="min-h-[100svh] bg-finance-bg font-sans bg-finance-bg text-finance-text-primary">
        <Navbar />
        <Dashboard />
      </div>
    </DashboardProvider>
  );
}

export default App;
