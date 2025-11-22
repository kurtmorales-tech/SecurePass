import React from 'react';
import { PasswordOptions } from '../types';

interface StrengthIndicatorProps {
  length: number;
  options: PasswordOptions;
}

const StrengthIndicator: React.FC<StrengthIndicatorProps> = ({ length, options }) => {
  const calculateStrength = (): { label: string; color: string; width: string } => {
    let score = 0;
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (options.includeUppercase) score++;
    if (options.includeLowercase) score++;
    if (options.includeNumbers) score++;
    if (options.includeSymbols) score++;

    if (score <= 2) return { label: 'VERY WEAK', color: 'bg-red-500', width: 'w-1/4' };
    if (score <= 4) return { label: 'WEAK', color: 'bg-orange-500', width: 'w-2/4' };
    if (score <= 6) return { label: 'MEDIUM', color: 'bg-yellow-500', width: 'w-3/4' };
    return { label: 'STRONG', color: 'bg-green-500', width: 'w-full' };
  };

  const { label, color, width } = calculateStrength();

  return (
    <div className="p-4 flex items-center justify-between gap-4 border-t border-slate-200 dark:border-brand-outline">
      <span className="text-slate-500 dark:text-brand-text-secondary font-medium">STRENGTH</span>
      <div className="flex items-center gap-2">
        <span className="text-slate-800 dark:text-brand-text-primary font-bold">{label}</span>
        <div className="w-32 h-3 bg-slate-200 dark:bg-brand-bg rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${color} ${width}`}></div>
        </div>
      </div>
    </div>
  );
};

export default StrengthIndicator;