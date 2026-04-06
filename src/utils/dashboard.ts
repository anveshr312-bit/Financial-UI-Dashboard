import { Transaction } from '../types';

export const parseTransactionDate = (value: string) => new Date(`${value}T00:00:00`);

export const formatTransactionDate = (
  value: string,
  options?: Intl.DateTimeFormatOptions,
) => parseTransactionDate(value).toLocaleDateString(undefined, options);

export const sortTransactionsByDateDesc = (transactions: Transaction[]) =>
  [...transactions].sort(
    (a, b) => parseTransactionDate(b.date).getTime() - parseTransactionDate(a.date).getTime(),
  );

export const getLatestTransactions = (transactions: Transaction[], limit = 5) =>
  sortTransactionsByDateDesc(transactions).slice(0, limit);

export const getTransactionTotals = (transactions: Transaction[]) => {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return {
    totalIncome,
    totalExpense,
    totalBalance: totalIncome - totalExpense,
  };
};

export const getMonthKey = (value: string | Date) => {
  const date = typeof value === 'string' ? parseTransactionDate(value) : value;
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${date.getFullYear()}-${month}`;
};

export const getMonthLabel = (monthKey: string) => {
  const [year, month] = monthKey.split('-').map(Number);

  return new Date(year, month - 1, 1).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  });
};

export const getExpenseTotalsByCategory = (
  transactions: Transaction[],
  monthKey?: string,
) =>
  transactions
    .filter((transaction) => transaction.type === 'expense')
    .filter((transaction) => !monthKey || getMonthKey(transaction.date) === monthKey)
    .reduce<Record<string, number>>((totals, transaction) => {
      totals[transaction.category] = (totals[transaction.category] || 0) + transaction.amount;
      return totals;
    }, {});

export const getHighestSpendingCategory = (transactions: Transaction[]) => {
  const totalsByCategory = getExpenseTotalsByCategory(transactions);
  const totalExpense = Object.values(totalsByCategory).reduce((sum, amount) => sum + amount, 0);
  const highestEntry = Object.entries(totalsByCategory).sort(([, left], [, right]) => right - left)[0];

  if (!highestEntry) {
    return {
      category: 'None',
      amount: 0,
      sharePercent: 0,
    };
  }

  return {
    category: highestEntry[0],
    amount: highestEntry[1],
    sharePercent: totalExpense > 0 ? Math.round((highestEntry[1] / totalExpense) * 100) : 0,
  };
};

export const getMonthlyExpenseData = (transactions: Transaction[]) => {
  const totalsByMonth = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce<Record<string, number>>((totals, transaction) => {
      const monthKey = getMonthKey(transaction.date);
      totals[monthKey] = (totals[monthKey] || 0) + transaction.amount;
      return totals;
    }, {});

  return Object.keys(totalsByMonth)
    .sort()
    .map((monthKey) => ({
      monthKey,
      label: getMonthLabel(monthKey),
      total: totalsByMonth[monthKey],
    }));
};

const shiftMonth = (date: Date, amount: number) => new Date(date.getFullYear(), date.getMonth() + amount, 1);

export const getMonthlyComparison = (transactions: Transaction[]) => {
  const monthlyExpenseData = getMonthlyExpenseData(transactions);
  const latestTransaction = sortTransactionsByDateDesc(transactions)[0];
  const baseDate = latestTransaction ? parseTransactionDate(latestTransaction.date) : new Date();

  const currentMonthKey = monthlyExpenseData.at(-1)?.monthKey ?? getMonthKey(baseDate);
  const previousMonthKey =
    monthlyExpenseData.length > 1
      ? monthlyExpenseData.at(-2)?.monthKey ?? getMonthKey(shiftMonth(baseDate, -1))
      : getMonthKey(shiftMonth(parseTransactionDate(`${currentMonthKey}-01`), -1));

  const currentTotal =
    monthlyExpenseData.find((point) => point.monthKey === currentMonthKey)?.total ?? 0;
  const previousTotal =
    monthlyExpenseData.find((point) => point.monthKey === previousMonthKey)?.total ?? 0;

  const deltaAmount = currentTotal - previousTotal;
  const deltaPercent =
    previousTotal > 0
      ? Number(((deltaAmount / previousTotal) * 100).toFixed(1))
      : currentTotal > 0
        ? 100
        : 0;

  return {
    currentMonthKey,
    previousMonthKey,
    currentLabel: getMonthLabel(currentMonthKey),
    previousLabel: getMonthLabel(previousMonthKey),
    currentTotal,
    previousTotal,
    deltaAmount,
    deltaPercent,
  };
};
