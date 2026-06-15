import React, { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  className?: string;
  children?: React.ReactNode;
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500",
    secondary: "bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-950 dark:text-zinc-50 focus:ring-gray-300",
    danger: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
export default Button;
