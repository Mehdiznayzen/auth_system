import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30',
  secondary:
    'bg-white/5 text-slate-100 border border-white/10 hover:bg-white/10 backdrop-blur',
  ghost: 'text-slate-300 hover:bg-white/5 hover:text-white',
};

export default function Button({
  variant = 'primary',
  fullWidth = false,
  loading = false,
  leftIcon,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        h-12 px-5
        rounded-xl
        text-sm font-semibold
        transition-all duration-200
        active:scale-[0.98]
        disabled:opacity-50
        disabled:pointer-events-none
        cursor-pointer
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        leftIcon
      )}

      {children}
    </button>
  );
}
