import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { getExpenseTotalsByCategory, getMonthlyComparison, getMonthlyExpenseData } from '../utils/dashboard';

interface ChartsSectionProps {
  inlineLayout?: boolean;
}

export const ChartsSection = ({ inlineLayout }: ChartsSectionProps) => {
  const { transactions } = useDashboard();
  const monthlyExpenseData = React.useMemo(() => getMonthlyExpenseData(transactions), [transactions]);
  const comparison = React.useMemo(() => getMonthlyComparison(transactions), [transactions]);
  const currentMonthBreakdown = getExpenseTotalsByCategory(transactions, comparison.currentMonthKey);
  const fallbackBreakdown = getExpenseTotalsByCategory(transactions);
  const expenseByCategory =
    Object.keys(currentMonthBreakdown).length > 0 ? currentMonthBreakdown : fallbackBreakdown;

  const donutData = Object.keys(expenseByCategory).map(key => ({
    name: key,
    value: expenseByCategory[key]
  }));
  const totalSpent = donutData.reduce((acc, curr) => acc + curr.value, 0);

  const COLORS = ['#3525cd', '#14b8a6', '#f59e0b', '#e11d48', '#64748b', '#8B5CF6'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel border border-outline-variant/10 rounded-xl p-3 flex flex-col gap-1.5 text-xs text-on-surface">
          <p className="font-bold m-0 text-on-surface-variant">{label || payload[0].name}</p>
          <p className="text-primary font-bold text-sm m-0">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`grid grid-cols-1 ${inlineLayout ? 'lg:grid-cols-10 gap-6' : 'lg:grid-cols-2 gap-4'}`}>
      <div className={`${inlineLayout ? 'lg:col-span-6' : ''} bg-surface-container-lowest rounded-xl p-8 flex flex-col`}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-on-surface">Balance Trend</h3>
            <p className="text-xs text-on-surface-variant">Performance over the last 30 days</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-[10px] font-bold bg-surface-container-low text-on-surface-variant rounded-lg">30D</button>
            <button className="px-3 py-1.5 text-[10px] font-bold hover:bg-surface-container-low text-on-surface-variant rounded-lg">90D</button>
          </div>
        </div>
        <div className="flex-1 min-h-[300px] w-full">
          {monthlyExpenseData.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={monthlyExpenseData} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#3525cd" stopOpacity={0.1}/>
                     <stop offset="100%" stopColor="#3525cd" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" strokeOpacity={0.15} />
                 <XAxis dataKey="label" stroke="var(--color-on-surface-variant)" fontSize={10} tickLine={false} axisLine={false} dy={10} fontWeight="bold" />
                 <YAxis stroke="var(--color-on-surface-variant)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} fontWeight="bold" />
                 <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                 <Area
                   type="monotone"
                   dataKey="total"
                   stroke="#3525cd"
                   strokeWidth={3.5}
                   strokeLinecap="round"
                   fillOpacity={1}
                   fill="url(#colorBalance)"
                   activeDot={{ r: 6, strokeWidth: 3, stroke: 'var(--color-surface-container-lowest)', fill: '#3525cd' }}
                 />
               </AreaChart>
             </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-on-surface-variant text-sm font-bold uppercase tracking-widest">No spending data</div>
          )}
        </div>
      </div>

      <div className={`${inlineLayout ? 'lg:col-span-4' : ''} bg-surface-container-lowest rounded-xl p-8`}>
        <h3 className="text-lg font-bold tracking-tight text-on-surface mb-6">Spending Breakdown</h3>
        <div className="h-[250px] w-full relative">
          {donutData.length > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
              <span className="text-2xl font-extrabold text-on-surface mono-nums">
                ${totalSpent > 1000 ? (totalSpent/1000).toFixed(1) + 'k' : totalSpent.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pt-1">Total</span>
            </div>
          )}
          {donutData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" className="relative z-10">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={95}
                  paddingAngle={2}
                  cornerRadius={10}
                  dataKey="value"
                  stroke="var(--color-surface-container-lowest)"
                  strokeWidth={4}
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-on-surface-variant text-sm font-bold uppercase tracking-widest relative z-10">No expenses recorded</div>
          )}
        </div>

        {donutData.length > 0 && (
          <div className="grid grid-cols-1 gap-3 mt-8">
            {donutData.slice(0, 5).map((entry, idx) => (
              <div key={entry.name} className="flex items-center justify-between group">
                 <div className="flex items-center gap-3">
                   <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                   <span className="text-xs font-medium text-on-surface">{entry.name}</span>
                 </div>
                 <span className="text-xs font-bold text-on-surface mono-nums">
                   {Math.round((entry.value / totalSpent) * 100)}%
                 </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
