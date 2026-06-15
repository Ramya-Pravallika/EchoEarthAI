import React, { ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800">
      {icon && <div className="text-gray-400 mb-3">{icon}</div>}
      <h4 className="font-semibold text-gray-900 dark:text-zinc-50 mb-1">{title}</h4>
      {description && <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-sm mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
export default EmptyState;
