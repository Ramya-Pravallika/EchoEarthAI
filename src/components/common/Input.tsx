import React, { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">{label}</label>}
      <input
        className={`px-3.5 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
          error ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500" : ""
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
}
export default Input;
