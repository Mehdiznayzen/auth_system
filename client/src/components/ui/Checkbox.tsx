import { Check } from 'lucide-react';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
}

export default function Checkbox({ label, id, className = '', ...props }: CheckboxProps) {
  const checkboxId = id || `checkbox-${props.name}`;
  return (
    <label htmlFor={checkboxId} className="flex cursor-pointer items-center gap-2.5 select-none">
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          id={checkboxId}
          type="checkbox"
          className="peer absolute h-full w-full cursor-pointer appearance-none rounded-md border border-white/20 bg-slate-900/50 transition-colors checked:border-blue-500 checked:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          {...props}
        />
        <Check className="pointer-events-none relative h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={3} />
      </span>
      <span className="text-sm text-slate-300">{label}</span>
    </label>
  );
}
