export type Role = 'viewer' | 'admin';

export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'Food' 
  | 'Transport' 
  | 'Utilities' 
  | 'Entertainment' 
  | 'Health'
  | 'Salary'
  | 'Freelance'
  | 'Other';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
}

export interface Filters {
  search: string;
  category: string;
  type: string;
  sortBy: string;
}
