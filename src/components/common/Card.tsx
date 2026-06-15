import React, { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Card({ hoverEffect = false, className = "", children, ...props }: CardProps) {
  const hoverClass = hoverEffect ? "hover:shadow-md transition-all duration-300" : "";
  return (
    <div
      className={`bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-5 ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
export default Card;
