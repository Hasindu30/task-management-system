import React from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Task } from "../../types";
import { Badge } from "../ui/Badge";
import { formatDate } from "../../utils/format";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Title
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Created
            </th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-4 py-3.5 max-w-[240px]">
                <Link
                  to={`/tasks/${task.id}`}
                  className="font-medium text-slate-900 hover:text-blue-600 truncate block transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  {task.title}
                </Link>
                {task.description && (
                  <p className="text-xs text-slate-400 truncate mt-0.5">{task.description}</p>
                )}
              </td>
              <td className="px-4 py-3.5">
                <Badge type="priority" value={task.priority} />
              </td>
              <td className="px-4 py-3.5">
                <Badge type="status" value={task.status} />
              </td>
              <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                {formatDate(task.dueDate)}
              </td>
              <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                {formatDate(task.createdAt)}
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    to={`/tasks/${task.id}`}
                    title="View task details"
                    aria-label={`View details for ${task.title}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <button
                    onClick={() => onEdit(task)}
                    title="Edit task"
                    aria-label={`Edit ${task.title}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => onDelete(task)}
                    title="Delete task"
                    aria-label={`Delete ${task.title}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
