import React from 'react';
import { useDashboard } from '../context/DashboardContext';

export const Sidebar = () => {
  const { activeView, setActiveView, role, isSidebarOpen, setSidebarOpen } = useDashboard();

  return (
    <>
      <div 
         className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
         onClick={() => setSidebarOpen(false)}
      ></div>
      <aside className={`bg-slate-950 h-screen w-[240px] fixed left-0 top-0 flex-col py-8 z-50 font-sans antialiased tracking-tight flex transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 mb-10 flex justify-between items-center">
          <div>
            <span className="text-xl font-bold tracking-tighter text-white uppercase">Equitas</span>
            <p className="text-[10px] text-slate-500 tracking-[0.2em] mt-1 uppercase">Institutional Intelligence</p>
          </div>
          <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(false)}>
             <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          <a
            onClick={() => setActiveView('overview')}
            className={`cursor-pointer flex flex-row items-center gap-3 px-6 py-3 transition-all duration-200 group ${activeView === 'overview' ? 'text-primary bg-primary/10 border-r-2 border-primary' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'}`}
          >
            <span className={`material-symbols-outlined ${activeView === 'overview' ? 'text-primary' : 'group-hover:text-primary'}`}>dashboard</span>
            <span className="text-sm font-medium">Overview</span>
          </a>

          <a
            onClick={() => setActiveView('transactions')}
            className={`cursor-pointer flex flex-row items-center gap-3 px-6 py-3 transition-all duration-200 group ${activeView === 'transactions' ? 'text-primary bg-primary/10 border-r-2 border-primary' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'}`}
          >
            <span className={`material-symbols-outlined ${activeView === 'transactions' ? 'text-primary' : 'group-hover:text-primary'}`}>receipt_long</span>
            <span className="text-sm font-medium">Transactions</span>
          </a>

          <a
            onClick={() => setActiveView('analytics')}
            className={`cursor-pointer flex flex-row items-center gap-3 px-6 py-3 transition-all duration-200 group ${activeView === 'analytics' ? 'text-primary bg-primary/10 border-r-2 border-primary' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'}`}
          >
            <span className={`material-symbols-outlined ${activeView === 'analytics' ? 'text-primary' : 'group-hover:text-primary'}`}>insights</span>
            <span className="text-sm font-medium">Insights</span>
          </a>

          <a
            onClick={() => setActiveView('reports')}
            className={`cursor-pointer flex flex-row items-center gap-3 px-6 py-3 transition-all duration-200 group ${activeView === 'reports' ? 'text-primary bg-primary/10 border-r-2 border-primary' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'}`}
          >
            <span className={`material-symbols-outlined ${activeView === 'reports' ? 'text-primary' : 'group-hover:text-primary'}`}>description</span>
            <span className="text-sm font-medium">Reports</span>
          </a>
        </nav>

        {role === 'admin' && (
          <div className="px-4 mt-auto">
            <a
              onClick={() => setActiveView('admin')}
              className={`cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeView === 'admin' ? 'bg-primary text-on-primary' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
            >
              <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
              <span className="text-sm font-bold">Admin Panel</span>
            </a>
          </div>
        )}
      </aside>
    </>
  );
};
