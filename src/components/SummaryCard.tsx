import React from 'react';

interface SummaryCardProps {
  label: string;
  value: string;
  indicatorText: string;
  indicatorType: 'positive' | 'negative' | 'neutral';
}

export const SummaryCard = ({ label, value, indicatorText, indicatorType }: SummaryCardProps) => {
  const indicatorColor = 
    indicatorType === 'positive' ? 'text-finance-success' : 
    indicatorType === 'negative' ? 'text-finance-danger' : 
    'text-finance-text-secondary';

  const indicatorBg = 
    indicatorType === 'positive' ? 'bg-[#22C55E1A]' : 
    indicatorType === 'negative' ? 'bg-[#EF44441A]' : 
    'bg-finance-border border';

  return (
    <div className="bg-finance-surface rounded-[12px] p-[20px] shadow-[0_1px_4px_rgba(0,0,0,0.07)] transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
      <h3 className="text-[12px] uppercase tracking-[0.05em] text-finance-text-secondary font-semibold mb-2">{label}</h3>
      <div className="flex items-end justify-between">
        <span className="text-[28px] font-bold text-finance-text-primary leading-none">{value}</span>
        {indicatorText && (
          <div className={`px-2 py-1 rounded text-xs font-semibold ${indicatorColor} ${indicatorBg}`}>
            {indicatorText}
          </div>
        )}
      </div>
    </div>
  );
};
