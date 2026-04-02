import React from 'react';

interface InsightCardProps {
  title: string;
  value: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
}

export const InsightCard = ({ title, value, description, icon }: InsightCardProps) => {
  return (
    <div className="card-transition bg-finance-surface rounded-[12px] p-[20px] shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex flex-col justify-between border border-transparent hover:border-finance-border/50 group">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-[12px] uppercase tracking-[0.05em] text-finance-text-secondary font-semibold">{title}</h3>
          {icon && <div className="text-finance-text-secondary opacity-40 group-hover:opacity-70 transition-opacity">{icon}</div>}
        </div>
        <p className="text-[22px] font-extrabold text-finance-text-primary tracking-tight leading-tight mt-1">{value}</p>
      </div>
      {description && (
        <div className="text-[13px] text-finance-text-secondary mt-4 leading-relaxed">{description}</div>
      )}
    </div>
  );
};
