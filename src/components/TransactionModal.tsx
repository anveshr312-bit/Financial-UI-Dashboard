import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Transaction, TransactionCategory, TransactionType } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tx: Omit<Transaction, 'id'> | Transaction) => void;
  initialData?: Transaction;
}

export const TransactionModal = ({ isOpen, onClose, onSubmit, initialData }: TransactionModalProps) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Other');
  const [type, setType] = useState<TransactionType>('expense');
  const [error, setError] = useState('');

  useEffect(() => {
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

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {error && <div className="text-[13px] text-finance-danger bg-[#EF44441A] p-3 rounded-[8px]">{error}</div>}
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-finance-text-primary">Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 py-2 rounded-[8px] text-sm font-medium transition-colors border ${
                  type === 'expense' 
                    ? 'bg-[#EF44441A] border-finance-danger/30 text-finance-danger' 
                    : 'bg-white border-finance-border text-finance-text-secondary hover:bg-finance-bg'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 py-2 rounded-[8px] text-sm font-medium transition-colors border ${
                  type === 'income' 
                    ? 'bg-[#22C55E1A] border-finance-success/30 text-finance-success' 
                    : 'bg-white border-finance-border text-finance-text-secondary hover:bg-finance-bg'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="amount" className="text-[13px] font-medium text-finance-text-primary">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-finance-text-secondary">$</span>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-finance-bg border border-finance-border rounded-[8px] pl-7 pr-3 py-2 text-sm text-finance-text-primary focus:outline-none focus:border-finance-primary focus:ring-1 focus:ring-finance-primary transition-shadow"
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
              className="w-full bg-finance-bg border border-finance-border rounded-[8px] px-3 py-2 text-sm text-finance-text-primary focus:outline-none focus:border-finance-primary focus:ring-1 focus:ring-finance-primary transition-shadow"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-[13px] font-medium text-finance-text-primary">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TransactionCategory)}
              className="w-full bg-finance-bg border border-finance-border rounded-[8px] px-3 py-2 text-sm text-finance-text-primary focus:outline-none focus:border-finance-primary focus:ring-1 focus:ring-finance-primary transition-shadow"
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

          <div className="pt-2 flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[8px] text-sm font-medium text-finance-text-secondary hover:bg-finance-bg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-[8px] text-sm font-medium bg-finance-primary text-white hover:bg-blue-600 transition-colors shadow-sm"
            >
              {initialData ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
