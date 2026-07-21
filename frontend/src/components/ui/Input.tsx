import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-700">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:border-blue-500"
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
