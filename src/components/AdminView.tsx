import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { downloadCSV } from '../utils/export';

export const AdminView = () => {
  const { resetData, transactions } = useDashboard();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleExportAll = () => {
    downloadCSV(transactions, 'full_dataset_export.csv');
  };

  const handleReset = () => {
    resetData();
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Admin Controls</h2>
        <p className="text-sm text-on-surface-variant font-medium mt-1">Manage system data, configure deep settings, and authorize access.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm flex flex-col items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">download</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface">Export Full Dataset</h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Download a complete CSV log of all stored transactions. Use this for backing up the system state offline.</p>
          </div>
          <button 
            onClick={handleExportAll}
            className="mt-auto px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary/90 transition-colors"
          >
            Download CSV Array
          </button>
        </div>

        <div className="bg-error-container/20 p-6 rounded-2xl border border-error/20 flex flex-col items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center">
            <span className="material-symbols-outlined text-error">warning</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-error">Danger Zone: Reset Data</h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">This destructive action erases all current transactions and restores the original system mock data. Cannot be reverted.</p>
          </div>
          <button 
            onClick={() => setIsResetConfirmOpen(true)}
            className="mt-auto px-6 py-2.5 bg-error text-white text-sm font-bold rounded-full hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm text-white">restart_alt</span>
            Factory Reset Data
          </button>
        </div>
      </div>

      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-outline-variant/20 relative animate-in zoom-in-95">
             <div className="w-16 h-16 rounded-full bg-error-container mx-auto flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-error text-3xl">delete_forever</span>
             </div>
             <h3 className="text-xl font-bold text-center text-on-surface mb-2">Are you fully sure?</h3>
             <p className="text-sm text-on-surface-variant text-center mb-8">This will erase all data. This action is irreversible.</p>
             
             <div className="flex gap-3">
               <button 
                 onClick={() => setIsResetConfirmOpen(false)}
                 className="flex-1 py-3 bg-surface-container-high rounded-xl text-on-surface font-bold text-sm hover:bg-surface-container-highest transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleReset}
                 className="flex-1 py-3 bg-error text-white rounded-xl font-bold text-sm shadow-lg shadow-error/20 hover:opacity-90 active:scale-95 transition-all"
               >
                 Yes, Erase All
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
