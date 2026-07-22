import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  ListTodo,
  RefreshCw,
  AlertCircle,
  Loader2,
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
import { TaskTable } from "../components/tasks/TaskTable";
import { TaskCard } from "../components/tasks/TaskCard";
import { PaginationBar } from "../components/ui/PaginationBar";
import { EmptyState } from "../components/ui/EmptyState";
import { Modal } from "../components/ui/Modal";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { TaskForm } from "../components/tasks/TaskForm";
import { ToastContainer, type ToastMessage } from "../components/ui/Toast";
import { Button } from "../components/ui/Button";

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



const TasksPage: React.FC = () => {

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<Status | "ALL">("ALL");
  const [priority, setPriority] = useState<Priority | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "dueDate">("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);


  const [data, setData] = useState<TaskListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);


  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error", message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

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


  const handleStatusChange = (val: Status | "ALL") => { setStatus(val); setPage(1); };
  const handlePriorityChange = (val: Priority | "ALL") => { setPriority(val); setPage(1); };
  const handleSortByChange = (val: "createdAt" | "updatedAt" | "dueDate") => { setSortBy(val); setPage(1); };
  const handleOrderChange = (val: "asc" | "desc") => { setOrder(val); setPage(1); };
  const handleLimitChange = (val: number) => { setLimit(val); setPage(1); };


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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ListTodo className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {pagination
                  ? `${pagination.total} task${pagination.total !== 1 ? "s" : ""} total`
                  : "Loading..."}
              </p>
            </div>
          </div>
          <Button variant="primary" size="md" onClick={openCreateForm}>
            <Plus className="h-4 w-4 mr-1.5" />
            New Task
          </Button>
        </div>

        {/*Filter Controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters & Search</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value as Status | "ALL")}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priority}
              onChange={(e) => handlePriorityChange(e.target.value as Priority | "ALL")}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Sort + Order */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) =>
                  handleSortByChange(e.target.value as "createdAt" | "updatedAt" | "dueDate")
                }
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                value={order}
                onChange={(e) => handleOrderChange(e.target.value as "asc" | "desc")}
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
          </div>

          {/* Page Size */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-slate-500">Rows per page:</span>
            <div className="flex gap-1.5">
              {LIMIT_OPTIONS.map((l) => (
                <button
                  key={l}
                  onClick={() => handleLimitChange(l)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
                    limit === l
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/*  Loading*/}
        {loading && (
          <div className="bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center py-16">
            <Loader2 className="h-7 w-7 text-blue-600 animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-500">Loading tasks...</p>
          </div>
        )}

        {/*  Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full text-red-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-red-900">Unable to load tasks</h3>
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchTasks}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-red-300 bg-white text-red-700 hover:bg-red-50 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try again
            </button>
          </div>
        )}

        {/* Task List */}
        {!loading && !error && data && (
          <>
            {tasks.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs">
                <EmptyState
                  title="No tasks found"
                  description={
                    debouncedSearch || status !== "ALL" || priority !== "ALL"
                      ? "Try adjusting your search or filters."
                      : "Click \"New Task\" to create your first task."
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

      {/*  Create / Edit  */}
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

      {/* Delete */}
      <ConfirmDialog
        isOpen={Boolean(deletingTask)}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingTask(null)}
      />

      
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
};

export default TasksPage;
