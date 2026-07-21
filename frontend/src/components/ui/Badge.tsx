import React from "react";
import type { Priority, Status } from "../../types";
import { formatStatus, formatPriority } from "../../utils/format";

interface BadgeProps {
  type: "status" | "priority";
  value: Status | Priority;
}

export const Badge: React.FC<BadgeProps> = ({ type, value }) => {
  if (type === "status") {
    const statusStyles: Record<Status, string> = {
      PENDING: "bg-amber-100 text-amber-800 border-amber-200",
      IN_PROGRESS: "bg-indigo-100 text-indigo-800 border-indigo-200",
      COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
          statusStyles[value as Status] || "bg-slate-100 text-slate-800 border-slate-200"
        }`}
      >
        {formatStatus(value)}
      </span>
    );
  }

  const priorityStyles: Record<Priority, string> = {
    LOW: "bg-slate-100 text-slate-700 border-slate-200",
    MEDIUM: "bg-sky-100 text-sky-800 border-sky-200",
    HIGH: "bg-rose-100 text-rose-800 border-rose-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        priorityStyles[value as Priority] || "bg-slate-100 text-slate-800 border-slate-200"
      }`}
    >
      {formatPriority(value)}
    </span>
  );
};
