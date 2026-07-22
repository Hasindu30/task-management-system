import React from "react";

// Base skeleton block
interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
  <div className={`skeleton ${className}`} aria-hidden="true" />
);

// Dashboard stat card skeleton — matches the real card shape
export const StatCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-5">
    <div className="flex items-center justify-between">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-9 w-9 rounded-lg" />
    </div>
    <div className="mt-4 space-y-2">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-28" />
    </div>
  </div>
);

// Task table row skeleton
export const TaskRowSkeleton: React.FC = () => (
  <tr aria-hidden="true">
    <td className="px-4 py-3.5">
      <Skeleton className="h-4 w-48 mb-1.5" />
      <Skeleton className="h-3 w-32" />
    </td>
    <td className="px-4 py-3.5"><Skeleton className="h-5 w-16 rounded-full" /></td>
    <td className="px-4 py-3.5"><Skeleton className="h-5 w-20 rounded-full" /></td>
    <td className="px-4 py-3.5"><Skeleton className="h-3 w-24" /></td>
    <td className="px-4 py-3.5"><Skeleton className="h-3 w-20" /></td>
    <td className="px-4 py-3.5">
      <div className="flex justify-end gap-1">
        <Skeleton className="h-7 w-7 rounded-lg" />
        <Skeleton className="h-7 w-7 rounded-lg" />
        <Skeleton className="h-7 w-7 rounded-lg" />
      </div>
    </td>
  </tr>
);

// Task card skeleton (mobile)
export const TaskCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3" aria-hidden="true">
    <div className="flex items-start justify-between gap-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-5 w-14 rounded-full" />
    </div>
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-2/3" />
    <div className="flex gap-2 pt-1">
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
  </div>
);

// Task details page skeleton
export const TaskDetailsSkeleton: React.FC = () => (
  <div className="max-w-3xl mx-auto space-y-6" aria-hidden="true">
    <Skeleton className="h-9 w-32 rounded-lg" />
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2 shrink-0">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  </div>
);
