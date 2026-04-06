import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { formatTransactionDate, parseTransactionDate } from '../utils/dashboard';
import { downloadCSV, downloadJSON } from '../utils/export';

interface TransactionsSectionProps {
  onAdd: () => void;
  onEdit: (id: string) => void;
}

export const TransactionsSection = ({ onAdd, onEdit }: TransactionsSectionProps) => {
  const { transactions, filters, setFilters, role, deleteTransaction } = useDashboard();
  const [exportOpen, setExportOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ category: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ type: e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ sortBy: e.target.value });
  };

  // Filter Logic
  let filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.category.toLowerCase().includes(filters.search.toLowerCase()) || 
                          t.amount.toString().includes(filters.search);
    const matchesCategory = filters.category === 'All' || t.category === filters.category;
    const matchesType = filters.type === 'All' || t.type === filters.type;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Export Engine
  const handleExportCSV = () => {
    downloadCSV(filteredTransactions, 'finance_export.csv');
    setExportOpen(false);
  };

  const handleExportJSON = () => {
    downloadJSON(filteredTransactions, 'finance_export.json');
    setExportOpen(false);
  };

  // Sort Logic
  filteredTransactions.sort((a, b) => {
    if (filters.sortBy === 'Amount') {
      return b.amount - a.amount;
    } else {
      return parseTransactionDate(b.date).getTime() - parseTransactionDate(a.date).getTime();
    }
  });

  return (
    <div className="space-y-6">
      {/* Filters & Actions Area */}
      <div className="mb-10 space-y-6">
        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input 
             className="w-full h-14 pl-14 pr-6 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-on-surface-variant/60 font-medium" 
             placeholder="Search by category or amount..." 
             type="text"
             value={filters.search}
             onChange={handleSearchChange}
          />
        </div>
        
        {/* Control Row */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Dropdown */}
            <div className="relative">
              <select className="appearance-none h-11 pl-4 pr-10 bg-surface-container-low border-none rounded-lg text-sm font-semibold text-on-surface-variant focus:ring-2 focus:ring-primary/10 cursor-pointer"
                value={filters.category}
                onChange={handleCategoryChange}>
                <option value="All">All Categories</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health</option>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Other">Other</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-on-surface-variant text-sm">expand_more</span>
            </div>
            {/* Type Dropdown */}
            <div className="relative">
              <select className="appearance-none h-11 pl-4 pr-10 bg-surface-container-low border-none rounded-lg text-sm font-semibold text-on-surface-variant focus:ring-2 focus:ring-primary/10 cursor-pointer"
                value={filters.type}
                onChange={handleTypeChange}>
                <option value="All">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-on-surface-variant text-sm">expand_more</span>
            </div>
            {/* Sort Dropdown */}
            <div className="relative">
              <select className="appearance-none h-11 pl-4 pr-10 bg-surface-container-low border-none rounded-lg text-sm font-semibold text-on-surface-variant focus:ring-2 focus:ring-primary/10 cursor-pointer"
                value={filters.sortBy}
                onChange={handleSortChange}>
                <option value="Date">Sort by Date</option>
                <option value="Amount">Sort by Amount</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-on-surface-variant text-sm">swap_vert</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <button 
                  onClick={() => setExportOpen(!exportOpen)}
                  className="h-11 px-5 bg-surface-container-high text-on-surface font-bold text-sm rounded-lg hover:bg-surface-container-highest transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">file_download</span>
                  Export
                </button>
                {exportOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-surface-container-lowest border border-outline-variant/10 shadow-lg rounded-xl flex flex-col py-2 z-20">
                     <button onClick={handleExportCSV} className="text-left px-4 py-2 text-sm text-on-surface font-bold hover:bg-surface-container-low transition-colors">Export CSV</button>
                     <button onClick={handleExportJSON} className="text-left px-4 py-2 text-sm text-on-surface font-bold hover:bg-surface-container-low transition-colors">Export JSON</button>
                  </div>
                )}
             </div>
            {role === 'admin' && (
              <button 
                onClick={onAdd}
                className="h-11 px-6 bg-primary text-on-primary font-bold text-sm rounded-full shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">add</span>
                Add Entry
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-5 text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest">Transaction Date</th>
                <th className="px-8 py-5 text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest">Description & Category</th>
                <th className="px-8 py-5 text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest text-center">Type</th>
                <th className="px-8 py-5 text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest text-right">Amount (USD)</th>
                {role === 'admin' && <th className="px-8 py-5 text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-sm font-semibold text-on-surface">{formatTransactionDate(tx.date)}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{tx.category} Transaction</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${tx.type === 'income' ? 'bg-primary-container' : 'bg-tertiary'}`}></span>
                          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-tight">{tx.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          tx.type === 'income' ? 'bg-primary-fixed text-primary' : 'bg-error-container text-error'
                       }`}>
                          {tx.type}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <p className={`text-sm font-bold mono-nums ${tx.type === 'income' ? 'text-primary' : 'text-error'}`}>
                          {tx.type === 'income' ? '+' : '-'} ${(tx.amount).toLocaleString()}
                       </p>
                       <p className="text-[11px] text-on-surface-variant mono-nums mt-0.5">REF: {tx.id.substring(0,6).toUpperCase()}</p>
                    </td>
                    {role === 'admin' && (
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                             onClick={() => onEdit(tx.id)}
                             className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                             <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button 
                             onClick={() => deleteTransaction(tx.id)}
                             className="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-all">
                             <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={role === 'admin' ? 5 : 4} className="px-8 py-16 text-center">
                     <p className="text-sm font-bold text-on-surface">No transactions match your filters</p>
                     <p className="text-xs text-on-surface-variant mt-2 mb-4">Try adjusting filters or add a new transaction</p>
                     <button
                       onClick={() => setFilters({ search: '', category: 'All', type: 'All', sortBy: 'Date' })}
                       className="px-4 py-2 bg-surface-container-low hover:bg-surface-container-high rounded-xl text-sm font-bold transition-colors">
                       Reset Filters
                     </button>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
