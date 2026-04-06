import React, { useState, useEffect } from 'react';
import { Transaction, TransactionCategory, TransactionType } from '../types';
import { useDashboard } from '../context/DashboardContext';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tx: Omit<Transaction, 'id'> | Transaction) => void;
  initialData?: Transaction;
}

export const TransactionModal = ({ isOpen, onClose, onSubmit, initialData }: TransactionModalProps) => {
  const { role, deleteTransaction } = useDashboard();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Other');
  const [type, setType] = useState<TransactionType>('expense');
  const [error, setError] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    setIsConfirmingDelete(false);
    if (initialData && isOpen) {
      setDate(initialData.date);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setType(initialData.type);
      setError('');
    } else if (isOpen) {
      setDate(new Date().toISOString().split('T')[0]);
      setAmount('');
      setCategory('Other');
      setType('expense');
      setError('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !amount || parseFloat(amount) <= 0) {
      setError('Please provide a valid date and a positive amount.');
      return;
    }

    const txData = {
      date,
      amount: parseFloat(amount),
      category,
      type,
    };

    if (initialData?.id) {
      onSubmit({ ...txData, id: initialData.id });
    } else {
      onSubmit(txData);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300 ease-out">
      <div className="glass-panel p-8 rounded-2xl w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-300 ease-out border border-outline-variant/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold tracking-tight text-on-surface">
            {initialData ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button 
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {isConfirmingDelete ? (
            <div className="flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-error-container flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-error">delete_forever</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2">Delete Transaction</h3>
              <p className="text-sm text-on-surface-variant mb-6">
                Are you sure you want to delete this transaction? This action cannot be undone.
              </p>
              <div className="flex w-full gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="flex-1 py-3 bg-surface-container-high text-on-surface font-bold text-sm rounded-xl hover:bg-surface-container-highest transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (initialData) {
                      deleteTransaction(initialData.id);
                      onClose();
                    }
                  }}
                  className="flex-1 py-3 bg-error text-on-error font-bold text-sm rounded-xl hover:opacity-90 transition-opacity"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <>
              {error && <div className="text-xs font-bold text-error bg-error-container/50 p-3 rounded-lg flex items-center gap-2"><span className="material-symbols-outlined text-sm">error</span>{error}</div>}
              
              <div className="grid grid-cols-2 gap-3 bg-surface-container-lowest p-1.5 rounded-xl border border-outline-variant/10">
                 <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      type === 'expense' 
                        ? 'bg-error-container text-error shadow-sm' 
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">arrow_outward</span>
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      type === 'income' 
                        ? 'bg-primary-container text-primary shadow-sm' 
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">south_west</span>
                    Income
                  </button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="amount" className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">$</span>
                    <input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full h-12 bg-surface-container-low border-none rounded-xl pl-8 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-on-surface-variant/50"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="date" className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">Date</label>
                    <input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-12 bg-surface-container-low border-none rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 text-on-surface"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="category" className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">Category</label>
                    <div className="relative">
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                        className="appearance-none w-full h-12 bg-surface-container-low border-none rounded-xl pl-4 pr-10 text-sm font-bold focus:ring-2 focus:ring-primary/20 text-on-surface"
                      >
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Health">Health</option>
                        <option value="Salary">Salary</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Other">Other</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-[14px] pointer-events-none text-on-surface-variant text-sm">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                 {role === 'admin' && initialData ? (
                   <button
                     type="button"
                     onClick={() => setIsConfirmingDelete(true)}
                     className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-error-container text-error hover:bg-error hover:text-white transition-colors"
                   >
                     <span className="material-symbols-outlined text-[20px]">delete</span>
                   </button>
                 ) : (
                   <div></div>
                 )}
                 <div className="flex gap-3 flex-1 justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 bg-surface-container-high text-on-surface font-bold text-sm rounded-full hover:bg-surface-container-highest transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-b from-primary to-primary-container text-white font-bold text-sm rounded-full shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                    >
                      {initialData ? 'Save' : 'Confirm'}
                    </button>
                 </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
