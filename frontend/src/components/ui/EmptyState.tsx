import React, { type ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Nothing here yet",
  description = "Try adjusting your search or filters.",
  icon,
  action,
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center px-4">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-5 text-slate-400">
      {icon ?? <Inbox className="h-8 w-8" aria-hidden="true" />}
    </div>
    <h3 className="text-sm font-semibold text-slate-700 mb-1">{title}</h3>
    <p className="text-sm text-slate-400 max-w-xs leading-relaxed">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);
