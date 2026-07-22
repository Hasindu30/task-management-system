import React from "react";
import { Calendar, Clock, Pencil, Trash2 } from "lucide-react";
import type { Task } from "../../types";
import { Badge } from "../ui/Badge";
import { formatDate } from "../../utils/format";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 hover:border-slate-300 transition-colors shadow-xs">
      
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900 leading-snug flex-1">{task.title}</h3>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            title="Edit task"
            className="p-1.5 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(task)}
            title="Delete task"
            className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center flex-wrap gap-2">
        <Badge type="priority" value={task.priority} />
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
