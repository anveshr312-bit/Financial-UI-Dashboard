import { Transaction } from '../types';

export const initialTransactions: Transaction[] = [
  { id: '1', date: '2026-04-01', amount: 5000, category: 'Salary', type: 'income' },
  { id: '2', date: '2026-04-02', amount: 150, category: 'Food', type: 'expense' },
  { id: '3', date: '2026-04-03', amount: 60, category: 'Transport', type: 'expense' },
  { id: '4', date: '2026-04-05', amount: 300, category: 'Utilities', type: 'expense' },
  { id: '5', date: '2026-04-08', amount: 120, category: 'Entertainment', type: 'expense' },
  { id: '6', date: '2026-04-10', amount: 1000, category: 'Freelance', type: 'income' },
  { id: '7', date: '2026-04-12', amount: 80, category: 'Health', type: 'expense' },
  { id: '8', date: '2026-04-15', amount: 200, category: 'Food', type: 'expense' },
  { id: '9', date: '2026-03-25', amount: 250, category: 'Food', type: 'expense' },
  { id: '10', date: '2026-03-28', amount: 400, category: 'Utilities', type: 'expense' },
];
