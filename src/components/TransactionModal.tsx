import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-finance-surface rounded-[12px] shadow-[0_20px_40px_rgba(25,28,34,0.12)] w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-finance-border">
          <h2 className="text-[18px] font-semibold text-finance-text-primary m-0">
            {initialData ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button 
            onClick={onClose}
            className="text-finance-text-secondary hover:text-finance-text-primary transition-colors inline-flex p-1 rounded-full hover:bg-finance-bg"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {isConfirmingDelete ? (
            <div className="flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-[#EF44441A] flex items-center justify-center mb-4">
                <Trash2 size={24} className="text-finance-danger" />
              </div>
              <h3 className="text-[16px] font-semibold text-finance-text-primary mb-2">Delete Transaction</h3>
              <p className="text-[14px] text-finance-text-secondary mb-6">
                Are you sure you want to delete this transaction? This action cannot be undone.
              </p>
              <div className="flex w-full gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="flex-1 px-4 py-2.5 rounded-[8px] text-sm font-medium text-finance-text-primary bg-finance-surface border border-finance-border hover:bg-finance-hover hover:border-finance-text-secondary/30 transition-all duration-200"
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
                  className="flex-1 px-4 py-2.5 rounded-[8px] text-sm font-medium text-white bg-finance-danger hover:bg-finance-danger/90 transition-all duration-200 shadow-[0_2px_8px_rgba(239,68,68,0.3)] hover:shadow-[0_4px_12px_rgba(239,68,68,0.4)] hover:-translate-y-[1px]"
                >
                  Confirm
                </button>
              </div>
            </div>
          ) : (
            <>
              {error && <div className="text-[13px] text-finance-danger bg-[#EF44441A] p-3 rounded-[8px] animate-in slide-in-from-top-1">{error}</div>}
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-finance-text-primary">Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`flex-1 py-2.5 rounded-[8px] text-sm font-medium transition-all duration-200 border ${
                      type === 'expense' 
                        ? 'bg-[#EF44441A] border-finance-danger/30 text-finance-danger scale-[1.02] shadow-sm' 
                        : 'bg-finance-surface border-finance-border text-finance-text-secondary hover:bg-finance-hover hover:scale-[1.01]'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`flex-1 py-2.5 rounded-[8px] text-sm font-medium transition-all duration-200 border ${
                      type === 'income' 
                        ? 'bg-[#22C55E1A] border-finance-success/30 text-finance-success scale-[1.02] shadow-sm' 
                        : 'bg-finance-surface border-finance-border text-finance-text-secondary hover:bg-finance-hover hover:scale-[1.01]'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="amount" className="text-[13px] font-medium text-finance-text-primary">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-finance-text-secondary font-medium">$</span>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-finance-bg border border-finance-border rounded-[8px] pl-7 pr-3 py-2.5 text-sm font-medium text-finance-text-primary focus:outline-none focus:border-finance-primary focus:ring-1 focus:ring-finance-primary transition-all duration-200 hover:border-finance-text-secondary/30"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="date" className="text-[13px] font-medium text-finance-text-primary">Date</label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-finance-bg border border-finance-border rounded-[8px] px-3 py-2.5 text-sm font-medium text-finance-text-primary focus:outline-none focus:border-finance-primary focus:ring-1 focus:ring-finance-primary transition-all duration-200 hover:border-finance-text-secondary/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="category" className="text-[13px] font-medium text-finance-text-primary">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                  className="w-full bg-finance-bg border border-finance-border rounded-[8px] px-3 py-2.5 text-sm font-medium text-finance-text-primary focus:outline-none focus:border-finance-primary focus:ring-1 focus:ring-finance-primary transition-all duration-200 hover:border-finance-text-secondary/30"
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
              </div>

              <div className="pt-4 flex items-center justify-between mt-2 border-t border-finance-border border-dashed">
                {role === 'admin' && initialData ? (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    className="px-4 py-2.5 rounded-[8px] text-sm font-medium text-finance-danger border border-transparent hover:border-finance-danger/30 hover:bg-[#EF44441A] transition-all duration-200"
                  >
                    Delete
                  </button>
                ) : (
                  <div></div>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-[8px] text-sm font-medium text-finance-text-secondary bg-finance-surface border border-finance-border hover:bg-finance-hover hover:text-finance-text-primary transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-[8px] text-sm font-medium bg-finance-primary text-white hover:bg-finance-primary/90 transition-all duration-200 shadow-[0_2px_8px_rgba(79,110,247,0.3)] hover:shadow-[0_4px_12px_rgba(79,110,247,0.4)] hover:-translate-y-[1px]"
                  >
                    {initialData ? 'Save Changes' : 'Add Transaction'}
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
