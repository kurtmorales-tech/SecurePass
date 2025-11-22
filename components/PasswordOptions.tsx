import React from 'react';
import { PasswordOptions } from '../types';
import { useTheme } from '../hooks/useTheme';

interface PasswordOptionsProps {
  options: PasswordOptions;
  length: number;
  onOptionChange: <K extends keyof PasswordOptions>(option: K, value: PasswordOptions[K]) => void;
  onLengthChange: (length: number) => void;
}

interface CheckboxProps {
  id: keyof PasswordOptions;
  label: string;
  checked: boolean;
  onChange: (id: keyof PasswordOptions, checked: boolean) => void;
}

const OptionCheckbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange }) => (
  <label htmlFor={id} className="flex items-center gap-3 cursor-pointer select-none text-slate-800 dark:text-brand-text-primary hover:text-slate-900 dark:hover:text-white transition-colors">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(id, e.target.checked)}
      className="appearance-none w-5 h-5 border-2 border-slate-300 dark:border-brand-outline rounded bg-slate-100 dark:bg-brand-bg checked:bg-brand-primary checked:border-brand-primary transition-all duration-200"
    />
     <span className="relative top-[-2px]">
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 absolute left-[-19px] top-[1px] text-white transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
     </span>
    {label}
  </label>
);

const PasswordOptionsComponent: React.FC<PasswordOptionsProps> = ({ options, length, onOptionChange, onLengthChange }) => {
  const { theme } = useTheme();

  const handleCheckboxChange = (id: keyof PasswordOptions, checked: boolean) => {
    onOptionChange(id, checked);
  };
  
  const trackColor = theme === 'dark' ? '#1E293B' : '#e2e8f0'; // slate-800 vs slate-200
  const progress = (length - 8) / (32 - 8) * 100;

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="length" className="text-slate-800 dark:text-brand-text-primary">Password Length</label>
          <span className="font-mono text-2xl text-brand-primary">{length}</span>
        </div>
        <input
          type="range"
          id="length"
          min="8"
          max="32"
          value={length}
          onChange={(e) => onLengthChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-200 dark:bg-brand-bg rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${progress}%, ${trackColor} ${progress}%, ${trackColor} 100%)`
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OptionCheckbox id="includeUppercase" label="Include Uppercase Letters" checked={options.includeUppercase} onChange={handleCheckboxChange} />
        <OptionCheckbox id="includeLowercase" label="Include Lowercase Letters" checked={options.includeLowercase} onChange={handleCheckboxChange} />
        <OptionCheckbox id="includeNumbers" label="Include Numbers" checked={options.includeNumbers} onChange={handleCheckboxChange} />
        <OptionCheckbox id="includeSymbols" label="Include Symbols" checked={options.includeSymbols} onChange={handleCheckboxChange} />
      </div>
    </>
  );
};

export default PasswordOptionsComponent;