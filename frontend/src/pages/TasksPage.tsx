import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  ListTodo,
  SlidersHorizontal,
  Plus,
} from "lucide-react";
import type { TaskListParams, TaskListData, Task, Status, Priority } from "../types";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  type CreateTaskPayload,
} from "../services/task.service";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { TaskTable } from "../components/tasks/TaskTable";
import { TaskCard } from "../components/tasks/TaskCard";
import { PaginationBar } from "../components/ui/PaginationBar";
import { EmptyState } from "../components/ui/EmptyState";
import { Modal } from "../components/ui/Modal";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { TaskForm } from "../components/tasks/TaskForm";
import { ToastContainer, type ToastMessage } from "../components/ui/Toast";
import { Button } from "../components/ui/Button";
import { TaskRowSkeleton, TaskCardSkeleton } from "../components/ui/Skeleton";
import { ErrorCard } from "../components/ui/ErrorCard";

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_OPTIONS: Array<{ label: string; value: Status | "ALL" }> = [
  { label: "All Statuses", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
];

const PRIORITY_OPTIONS: Array<{ label: string; value: Priority | "ALL" }> = [
  { label: "All Priorities", value: "ALL" },
  { label: "High", value: "HIGH" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Low", value: "LOW" },
];

const SORT_OPTIONS: Array<{ label: string; value: "createdAt" | "updatedAt" | "dueDate" }> = [
  { label: "Created Date", value: "createdAt" },
  { label: "Updated Date", value: "updatedAt" },
  { label: "Due Date", value: "dueDate" },
];

const LIMIT_OPTIONS = [5, 10, 20];

// ─── Component ────────────────────────────────────────────────────────────────

const TasksPage: React.FC = () => {
  useDocumentTitle("Tasks");

  // ── Filter state ──────────────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<Status | "ALL">("ALL");
  const [priority, setPriority] = useState<Priority | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "dueDate">("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  // ── Data state ────────────────────────────────────────────────────────────
  const [data, setData] = useState<TaskListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Modal state ───────────────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // ── Delete state ──────────────────────────────────────────────────────────
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Toast state ───────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error", message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Debounce search ───────────────────────────────────────────────────────
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
  };

  // ── Filter handlers ───────────────────────────────────────────────────────
  const handleStatusChange = (val: Status | "ALL") => { setStatus(val); setPage(1); };
  const handlePriorityChange = (val: Priority | "ALL") => { setPriority(val); setPage(1); };
  const handleSortByChange = (val: "createdAt" | "updatedAt" | "dueDate") => { setSortBy(val); setPage(1); };
  const handleOrderChange = (val: "asc" | "desc") => { setOrder(val); setPage(1); };
  const handleLimitChange = (val: number) => { setLimit(val); setPage(1); };

  // ── Fetch tasks ───────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: TaskListParams = { page, limit, sortBy, order };
      if (status !== "ALL") params.status = status;
      if (priority !== "ALL") params.priority = priority;
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

      const result = await getTasks(params);
      setData(result);
    } catch (err: unknown) {
      let message = "Failed to load tasks";
      if (err instanceof Error) message = err.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, priority, debouncedSearch, sortBy, order]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  // ── Create ────────────────────────────────────────────────────────────────
  const openCreateForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleCreate = async (payload: CreateTaskPayload) => {
    await createTask(payload);
    setIsFormOpen(false);
    addToast("success", "Task created successfully!");
    await fetchTasks();
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleUpdate = async (payload: CreateTaskPayload) => {
    if (!editingTask) return;
    await updateTask(editingTask.id, payload);
    setIsFormOpen(false);
    setEditingTask(null);
    addToast("success", "Task updated successfully!");
    await fetchTasks();
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const openDeleteConfirm = (task: Task) => {
    setDeletingTask(task);
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    setIsDeleting(true);
    try {
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
      addToast("success", "Task deleted successfully!");
      if (data?.tasks.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        await fetchTasks();
      }
    } catch (err: unknown) {
      let message = "Failed to delete task";
      if (err instanceof Error) message = err.message;
      addToast("error", message);
      setDeletingTask(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const tasks = data?.tasks ?? [];
  const pagination = data?.pagination;

  return (
    <>
      <div className="space-y-5">
        {/* Page Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ListTodo className="h-6 w-6 text-blue-600" aria-hidden="true" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {pagination
                  ? `${pagination.total} task${pagination.total !== 1 ? "s" : ""} total`
                  : "Loading tasks..."}
              </p>
            </div>
          </div>
          <Button variant="primary" size="md" onClick={openCreateForm}>
            <Plus className="h-4 w-4 mr-1.5" aria-hidden="true" />
            New Task
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Filters &amp; Search</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search tasks..."
                aria-label="Search tasks"
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Status Filter */}
            <select
              value={status}
              aria-label="Filter by status"
              onChange={(e) => handleStatusChange(e.target.value as Status | "ALL")}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 transition-colors"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priority}
              aria-label="Filter by priority"
              onChange={(e) => handlePriorityChange(e.target.value as Priority | "ALL")}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 transition-colors"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Sort + Order */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                aria-label="Sort by field"
                onChange={(e) =>
                  handleSortByChange(e.target.value as "createdAt" | "updatedAt" | "dueDate")
                }
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 transition-colors"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                value={order}
                aria-label="Sort order"
                onChange={(e) => handleOrderChange(e.target.value as "asc" | "desc")}
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 transition-colors"
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
          </div>

          {/* Page Size */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-slate-500">Rows per page:</span>
            <div className="flex gap-1.5" role="group" aria-label="Select rows per page">
              {LIMIT_OPTIONS.map((l) => (
                <button
                  key={l}
                  onClick={() => handleLimitChange(l)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-all duration-150 focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    limit === l
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skeleton Loading */}
        {loading && (
          <>
            <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-200 bg-white" aria-busy="true">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Title</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Priority</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Due Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Created</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TaskRowSkeleton key={i} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:hidden" aria-busy="true">
              {Array.from({ length: 3 }).map((_, i) => (
                <TaskCardSkeleton key={i} />
              ))}
            </div>
          </>
        )}

        {/* Error State */}
        {error && !loading && (
          <ErrorCard
            title="Unable to load tasks"
            message={error}
            onRetry={fetchTasks}
          />
        )}

        {/* Task List Data */}
        {!loading && !error && data && (
          <>
            {tasks.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs">
                <EmptyState
                  title="No tasks found"
                  description={
                    debouncedSearch || status !== "ALL" || priority !== "ALL"
                      ? "No tasks match your current search or filter criteria."
                      : "You haven't created any tasks yet."
                  }
                  action={
                    !debouncedSearch && status === "ALL" && priority === "ALL" ? (
                      <Button variant="primary" size="md" onClick={openCreateForm}>
                        <Plus className="h-4 w-4 mr-1.5" aria-hidden="true" />
                        Create Task
                      </Button>
                    ) : undefined
                  }
                />
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden sm:block">
                  <TaskTable tasks={tasks} onEdit={openEditForm} onDelete={openDeleteConfirm} />
                </div>

                {/* Mobile Cards */}
                <div className="grid grid-cols-1 gap-3 sm:hidden">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={openEditForm}
                      onDelete={openDeleteConfirm}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="bg-white rounded-xl border border-slate-200 px-4">
                    <PaginationBar pagination={pagination} onPageChange={setPage} />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingTask ? "Edit Task" : "Create New Task"}
        maxWidth="md"
      >
        <TaskForm
          key={editingTask?.id ?? "create"}
          initialData={editingTask ?? undefined}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onCancel={handleCloseForm}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingTask)}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingTask(null)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
};

export default TasksPage;
