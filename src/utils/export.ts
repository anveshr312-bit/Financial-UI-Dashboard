import { Transaction } from '../types';

export const downloadFile = (data: string, filename: string, type: string) => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadCSV = (transactions: Transaction[], filename: string) => {
  const headers = 'Date,Category,Type,Amount\n';
  const csvRows = transactions.map(tx => `${tx.date},${tx.category},${tx.type},${tx.amount}`).join('\n');
  downloadFile(headers + csvRows, filename, 'text/csv');
};

export const downloadJSON = (transactions: Transaction[], filename: string) => {
  downloadFile(JSON.stringify(transactions, null, 2), filename, 'application/json');
};
