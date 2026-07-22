import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Pencil,
  Trash2,
  FileText,
} from "lucide-react";
import type { Task } from "../types";
import {
  getTaskById,
  updateTask,
  deleteTask,
  type CreateTaskPayload,
} from "../services/task.service";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { TaskForm } from "../components/tasks/TaskForm";
import { ToastContainer, type ToastMessage } from "../components/ui/Toast";
import { TaskDetailsSkeleton } from "../components/ui/Skeleton";
import { ErrorCard } from "../components/ui/ErrorCard";
import { formatDate } from "../utils/format";

const TaskDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useDocumentTitle("Task Details");

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Delete state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error", message: string) => {
    const toastId = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id: toastId, type, message }]);
  };

  const dismissToast = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  const fetchTask = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTaskById(id);
      setTask(data);
    } catch (err: unknown) {
      let message = "Task not found or failed to load details";
      if (err instanceof Error) message = err.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleUpdate = async (payload: CreateTaskPayload) => {
    if (!task) return;
    try {
      const updated = await updateTask(task.id, payload);
      setTask(updated);
      setIsEditOpen(false);
      addToast("success", "Task updated successfully!");
    } catch (err: unknown) {
      let message = "Failed to update task";
      if (err instanceof Error) message = err.message;
      addToast("error", message);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      setIsDeleteOpen(false);
      addToast("success", "Task deleted successfully!");
      // Redirect to tasks page after small delay for toast visibility
      setTimeout(() => {
        navigate("/tasks", { replace: true });
      }, 500);
    } catch (err: unknown) {
      let message = "Failed to delete task";
      if (err instanceof Error) message = err.message;
      addToast("error", message);
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation Back Link */}
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg px-2 py-1 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Tasks</span>
        </Link>

        {/* Loading State */}
        {loading && <TaskDetailsSkeleton />}

        {/* Error State */}
        {error && !loading && (
          <ErrorCard
            title="Unable to load task"
            message={error}
            onRetry={fetchTask}
          />
        )}

        {/* Task Details Content */}
        {!loading && !error && task && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Header Section */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge type="priority" value={task.priority} />
                    <Badge type="status" value={task.status} />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 break-words leading-snug">
                    {task.title}
                  </h1>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditOpen(true)}
                  >
                    <Pencil className="h-4 w-4 mr-1.5" aria-hidden="true" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setIsDeleteOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" aria-hidden="true" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Description Section */}
              <div className="pt-6 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Description</span>
                </div>
                {task.description ? (
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {task.description}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                    No description provided
                  </p>
                )}
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                    Due Date
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatDate(task.dueDate)}
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                    <Clock className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                    Created On
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatDate(task.createdAt)}
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                    <Clock className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                    Last Updated
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatDate(task.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {task && (
        <Modal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Edit Task"
          maxWidth="md"
        >
          <TaskForm
            initialData={task}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditOpen(false)}
          />
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${task?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
};

export default TaskDetailsPage;
