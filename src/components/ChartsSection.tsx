import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export const ChartsSection = () => {
  const { transactions } = useDashboard();

  // Process data for Balance Trend (running sum over time)
  // 1. Sort ascending by date
  const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  let runningBalance = 0;
  const balanceData: { date: string; balance: number }[] = [];
  
  // Create a running balance per day for the chart
  const balanceByDate: Record<string, number> = {};
  
  sortedTx.forEach(tx => {
    if (tx.type === 'income') {
      runningBalance += tx.amount;
    } else {
      runningBalance -= tx.amount;
    }
    // Only keep the latest balance for a specific date if there are multiple tx on same day
    balanceByDate[tx.date] = runningBalance;
  });

  // Convert to array for chart, keeping order
  Object.keys(balanceByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()).forEach(date => {
    // Format date string for display (e.g. "Apr 01")
    const d = new Date(date);
    balanceData.push({
      date: d.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
      balance: balanceByDate[date]
    });
  });

  // Process data for Donut Chart (Expenses by Category)
  const expenses = transactions.filter(t => t.type === 'expense');
  const expenseByCategory: Record<string, number> = {};
  
  expenses.forEach(tx => {
    expenseByCategory[tx.category] = (expenseByCategory[tx.category] || 0) + tx.amount;
  });

  const donutData = Object.keys(expenseByCategory).map(key => ({
    name: key,
    value: expenseByCategory[key]
  }));

  const COLORS = ['#4F6EF7', '#22C55E', '#F59E0B', '#6366f1', '#ec4899', '#8b5cf6', '#14b8a6'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-finance-border flex flex-col gap-1 text-[12px]">
          <p className="font-semibold text-finance-text-primary m-0">{label || payload[0].name}</p>
          <p className="text-finance-primary font-medium m-0">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Balance Trend Area/Line Chart */}
      <div className="bg-finance-surface rounded-[12px] p-[20px] shadow-[0_1px_4px_rgba(0,0,0,0.07)]">
        <h2 className="text-[16px] font-semibold text-finance-text-primary mb-6">Balance Trend</h2>
        <div className="h-[250px] w-full">
          {balanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={balanceData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="balance" stroke="#4F6EF7" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-finance-text-secondary text-sm">No data available</div>
          )}
        </div>
      </div>

      {/* Spending Breakdown Donut Chart */}
      <div className="bg-finance-surface rounded-[12px] p-[20px] shadow-[0_1px_4px_rgba(0,0,0,0.07)]">
        <h2 className="text-[16px] font-semibold text-finance-text-primary mb-6">Spending Breakdown</h2>
        <div className="h-[250px] w-full relative">
          {donutData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-finance-text-secondary text-sm">No expenses recorded</div>
          )}
          {/* Centered Total */}
          {donutData.length > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[12px] text-finance-text-secondary font-semibold uppercase tracking-wider">Total</span>
              <span className="text-[20px] font-bold text-finance-text-primary">
                ${donutData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
