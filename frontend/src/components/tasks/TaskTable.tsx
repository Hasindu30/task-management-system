import React from "react";
import type { Task } from "../../types";
import { Badge } from "../ui/Badge";
import { formatDate } from "../../utils/format";

interface TaskTableProps {
  tasks: Task[];
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks }) => {
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
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3.5 max-w-[280px]">
                <p className="font-medium text-slate-900 truncate">{task.title}</p>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
