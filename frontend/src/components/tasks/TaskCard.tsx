import React from "react";
import { Calendar, Clock } from "lucide-react";
import type { Task } from "../../types";
import { Badge } from "../ui/Badge";
import { formatDate } from "../../utils/format";

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 hover:border-slate-300 transition-colors shadow-xs">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900 leading-snug">{task.title}</h3>
        <Badge type="priority" value={task.priority} />
      </div>

      {task.description && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center flex-wrap gap-2">
        <Badge type="status" value={task.status} />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-100">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(task.dueDate)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {formatDate(task.createdAt)}
        </span>
      </div>
    </div>
  );
};
