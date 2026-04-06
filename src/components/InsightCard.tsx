import React from 'react';

interface InsightCardProps {
  title: string;
  value: string | React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
}

export const InsightCard = ({ title, value, description, icon }: InsightCardProps) => {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest">{title}</span>
        {icon && (
          <span className="text-primary flex items-center justify-center">
            {icon}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-extrabold text-on-surface tracking-tight leading-none tabular-nums mt-1">{value}</h3>
        {description && (
          <div className="text-xs text-on-surface-variant mt-2 font-medium">{description}</div>
        )}
      </div>
    </div>
  );
};
