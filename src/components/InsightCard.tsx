import React from 'react';

interface InsightCardProps {
  title: string;
  value: string;
  description?: string;
}

export const InsightCard = ({ title, value, description }: InsightCardProps) => {
  return (
    <div className="bg-finance-surface rounded-[12px] p-[20px] shadow-[0_1px_4px_rgba(0,0,0,0.07)] transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex flex-col justify-between">
      <div>
        <h3 className="text-[12px] uppercase tracking-[0.05em] text-finance-text-secondary font-semibold mb-2">{title}</h3>
        <p className="text-[18px] font-bold text-finance-text-primary leading-tight">{value}</p>
      </div>
      {description && (
        <p className="text-[13px] text-finance-text-secondary mt-3">{description}</p>
      )}
    </div>
  );
};
