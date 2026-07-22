import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import type { Task } from "../../types";
import type { CreateTaskPayload } from "../../services/task.service";

interface TaskFormProps {
  initialData?: Task; 
  onSubmit: (data: CreateTaskPayload) => Promise<void>;
  onCancel: () => void;
}

interface FormErrors {
  title?: string;
  priority?: string;
  status?: string;
  dueDate?: string;
}


const toDateInputValue = (iso?: string | null): string => {
  if (!iso) return "";
  return iso.split("T")[0];
};

export const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const isEditMode = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [priority, setPriority] = useState<CreateTaskPayload["priority"]>(
    initialData?.priority ?? "MEDIUM"
  );
  const [status, setStatus] = useState<CreateTaskPayload["status"]>(
    initialData?.status ?? "PENDING"
  );
  const [dueDate, setDueDate] = useState(toDateInputValue(initialData?.dueDate));

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (title.trim().length > 200) newErrors.title = "Title must not exceed 200 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: CreateTaskPayload = {
        title: title.trim(),
        priority,
        status,
      };
      if (description.trim()) payload.description = description.trim();
      if (dueDate) payload.dueDate = new Date(dueDate).toISOString();

      await onSubmit(payload);
    } catch (err: unknown) {
      let message = "Something went wrong. Please try again.";
      if (err && typeof err === "object" && "response" in err) {
        const responseData = (err as { response?: { data?: { message?: string } } }).response?.data;
        if (responseData?.message) message = responseData.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectClass =
    "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
     
      {apiError && (
        <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {apiError}
        </div>
      )}

      {/* Title */}
      <Input
        label="Title *"
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        placeholder="Enter task title"
        maxLength={200}
      />

      
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-700">Description</label>
        <textarea
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description..."
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-700 placeholder-slate-400 transition-colors"
        />
      </div>

     
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">Priority</label>
          <select
            name="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as CreateTaskPayload["priority"])}
            className={selectClass}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">Status</label>
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as CreateTaskPayload["status"])}
            className={selectClass}
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-700">Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={selectClass}
        />
        {errors.dueDate && <span className="text-xs text-red-600">{errors.dueDate}</span>}
      </div>

      
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          size="md"
          className="flex-1"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="flex-1"
          isLoading={isSubmitting}
        >
          {isEditMode ? "Save Changes" : "Create Task"}
        </Button>
      </div>
    </form>
  );
};
