import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Search, Plus, Filter, ArrowUpDown, Pencil } from 'lucide-react';
import { TransactionCategory, TransactionType } from '../types';

interface TransactionsSectionProps {
  onAdd: () => void;
  onEdit: (id: string) => void;
}

export const TransactionsSection = ({ onAdd, onEdit }: TransactionsSectionProps) => {
  const { transactions, filters, setFilters, role } = useDashboard();

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

  // Sort Logic
  filteredTransactions.sort((a, b) => {
    if (filters.sortBy === 'Amount') {
      return b.amount - a.amount;
    } else {
      // Sort by Date
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-[16px] font-semibold text-finance-text-primary m-0 tracking-tight">Transactions</h2>
        {role === 'admin' && (
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 bg-finance-primary hover:bg-finance-primary/90 transition-all duration-200 text-white px-4 py-2 rounded-[8px] text-sm font-medium shadow-[0_2px_8px_rgba(79,110,247,0.3)] hover:shadow-[0_4px_12px_rgba(79,110,247,0.4)] hover:-translate-y-[1px]"
          >
            <Plus size={16} /> Add Transaction
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 bg-finance-surface p-4 rounded-[12px] shadow-[0_1px_4px_rgba(0,0,0,0.07)]">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-finance-text-secondary" />
          <input 
            type="text" 
            placeholder="Search by category or amount..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-3 py-2 bg-finance-bg border border-finance-border rounded-[8px] text-sm focus:outline-none focus:border-finance-primary transition-colors text-finance-text-primary"
          />
        </div>
        
        <div className="flex gap-3">
          <select 
            value={filters.category}
            onChange={handleCategoryChange}
            className="bg-finance-bg border border-finance-border rounded-[8px] px-3 py-2 text-sm text-finance-text-primary focus:outline-none focus:border-finance-primary"
          >
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

          <select 
            value={filters.type}
            onChange={handleTypeChange}
            className="bg-finance-bg border border-finance-border rounded-[8px] px-3 py-2 text-sm text-finance-text-primary focus:outline-none focus:border-finance-primary"
          >
            <option value="All">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select 
            value={filters.sortBy}
            onChange={handleSortChange}
            className="bg-finance-bg border border-finance-border rounded-[8px] px-3 py-2 text-sm text-finance-text-primary focus:outline-none focus:border-finance-primary"
          >
            <option value="Date">Sort by Date</option>
            <option value="Amount">Sort by Amount</option>
          </select>
        </div>
      </div>

      <div className="bg-finance-surface rounded-[12px] shadow-[0_1px_4px_rgba(0,0,0,0.07)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[12px] uppercase tracking-[0.05em] text-finance-text-secondary border-b border-finance-border bg-finance-hover">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                {role === 'admin' && <th className="px-6 py-4 font-semibold text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-finance-border">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-finance-hover group transition-colors duration-150 rounded-[6px]">
                    <td className="px-6 py-4 text-finance-text-primary">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-finance-bg border border-finance-border text-finance-text-primary">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        tx.type === 'income' ? 'bg-[#22C55E1A] text-finance-success' : 'bg-[#EF44441A] text-finance-danger'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-semibold ${tx.type === 'income' ? 'text-finance-success' : 'text-finance-text-primary'}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </td>
                    {role === 'admin' && (
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => onEdit(tx.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-finance-text-secondary hover:text-finance-primary hover:bg-finance-bg transition-all duration-200 hover:scale-110 opacity-70 group-hover:opacity-100"
                        >
                          <Pencil size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === 'admin' ? 5 : 4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-finance-text-secondary animate-in fade-in duration-300">
                      <Filter size={40} className="mb-4 opacity-30 text-finance-primary" />
                      <p className="text-[15px] font-semibold text-finance-text-primary">No transactions match your filters</p>
                      <p className="text-sm mt-1 mb-5 opacity-80">Try adjusting filters or add a new transaction</p>
                      <button 
                        onClick={() => setFilters({ search: '', category: 'All', type: 'All', sortBy: 'Date' })}
                        className="px-4 py-2 text-sm font-medium text-finance-text-primary bg-finance-surface border border-finance-border rounded-[8px] hover:bg-finance-hover hover:border-finance-text-secondary/30 transition-all duration-200"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
