import React from "react";

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Loader({ size = "md", className = "" }: LoaderProps) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin`}
      />
    </div>
  );
}
export default Loader;
