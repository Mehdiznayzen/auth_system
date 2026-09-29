import React from "react";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = ({
  label,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={props.name}
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* LEFT ICON */}
        {leftIcon && (
          <span
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              z-10
              pointer-events-none
              text-slate-500
            "
          >
            {leftIcon}
          </span>
        )}

        <input
          {...props}
          id={props.name}
          className={`
            w-full
            h-12

            rounded-xl
            border
            border-slate-700
            bg-slate-950/70

            ${leftIcon ? "!pl-12" : "!pl-4"}
            ${rightIcon ? "!pr-12" : "!pr-4"}

            text-sm
            text-white
            placeholder:text-slate-600

            outline-none
            transition-all
            duration-200

            hover:border-slate-600

            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/20

            disabled:cursor-not-allowed
            disabled:opacity-50

            ${className}
          `}
        />

        {/* RIGHT ICON */}
        {rightIcon && (
          <span
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              z-10
            "
          >
            {rightIcon}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;