import React from 'react';

interface StrengthIndicatorProps {
  password: string;
}

const MasterPasswordStrengthIndicator: React.FC<StrengthIndicatorProps> = ({ password }) => {
  const calculateStrength = (): { label: string; color: string; width: string } => {
    let score = 0;
    if (!password) return { label: 'EMPTY', color: 'bg-slate-300 dark:bg-brand-outline', width: 'w-0' };

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    // Penalize short passwords regardless of complexity
    if (password.length < 8 && score > 2) score = 2; 

    if (score <= 2) return { label: 'VERY WEAK', color: 'bg-red-500', width: 'w-1/4' };
    if (score <= 3) return { label: 'WEAK', color: 'bg-orange-500', width: 'w-2/4' };
    if (score <= 4) return { label: 'MEDIUM', color: 'bg-yellow-500', width: 'w-3/4' };
    return { label: 'STRONG', color: 'bg-green-500', width: 'w-full' };
  };

  const { label, color, width } = calculateStrength();

  return (
    <div className="flex items-center justify-between gap-2 pt-2">
      <div className="w-full h-2 bg-slate-200 dark:bg-brand-bg rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${color} ${width}`}></div>
      </div>
      <span className="text-sm font-medium text-slate-600 dark:text-brand-text-secondary w-24 text-right">{label}</span>
    </div>
  );
};

export default MasterPasswordStrengthIndicator;