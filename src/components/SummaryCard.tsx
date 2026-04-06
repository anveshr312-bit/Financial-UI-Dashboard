import React from 'react';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';

interface SummaryCardProps {
  label: string;
  rawValue: number;
  indicatorText: string;
  indicatorType: 'positive' | 'negative' | 'neutral';
  tone?: 'primary' | 'success' | 'gold';
  icon?: React.ReactNode;
}

export const SummaryCard = ({
  label,
  rawValue,
  indicatorText,
  indicatorType,
  tone = 'primary',
  icon,
}: SummaryCardProps) => {
  const animatedValue = useAnimatedNumber(rawValue);

  // New Stitch "Equitas" style classes
  const isPrimary = tone === 'primary';
  
  if (isPrimary) {
    return (
      <div className="bg-primary p-8 rounded-xl text-on-primary shadow-lg shadow-primary/30 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <span className="material-symbols-outlined text-9xl">{icon ? 'account_balance_wallet' : 'account_balance_wallet'}</span>
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] opacity-80 mb-2">{label}</p>
        <h2 className="text-4xl font-extrabold mono-nums tracking-tighter">
          ${animatedValue.toLocaleString(undefined, { maximumFractionDigits: 0, minimumFractionDigits: 0 })}
        </h2>
        {indicatorText && (
          <div className="mt-6 flex items-center gap-2">
            <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-bold">{indicatorText}</span>
          </div>
        )}
      </div>
    );
  }

  const isSuccess = indicatorType === 'positive';

  // For the standard card style (Success or Negative)
  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between group transition-all duration-300">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${isSuccess ? 'bg-emerald-50' : 'bg-rose-50'}`}>
            <span className={`material-symbols-outlined ${isSuccess ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isSuccess ? 'trending_up' : 'trending_down'}
            </span>
          </div>
          {indicatorText && (
             <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${isSuccess ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
               {indicatorText}
             </span>
          )}
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-1">{label}</p>
        <h2 className="text-3xl font-extrabold mono-nums tracking-tighter text-on-surface">
          ${animatedValue.toLocaleString(undefined, { maximumFractionDigits: 0, minimumFractionDigits: 0 })}
        </h2>
      </div>
      <div className="h-1 w-full bg-surface-container-low rounded-full mt-6 overflow-hidden">
        <div className={`h-full ${isSuccess ? 'bg-emerald-500 w-[65%]' : 'bg-rose-500 w-[42%]'}`}></div>
      </div>
    </div>
  );
};
