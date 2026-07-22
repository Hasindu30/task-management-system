import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Layers,
  AlertCircle,
  BarChart2,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { StatCardSkeleton } from "../components/ui/Skeleton";
import { ErrorCard } from "../components/ui/ErrorCard";
import { EmptyState } from "../components/ui/EmptyState";
import { useAuth } from "../hooks/useAuth";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { getDashboardStats } from "../services/dashboard.service";
import type { DashboardStats } from "../types";

// ── Stat card config ──────────────────────────────────────────────────────────

interface StatConfig {
  label: string;
  key: keyof DashboardStats;
  icon: React.ReactNode;
  iconBg: string;
  valueColor: string;
  subLabel: string;
}

const STAT_CARDS: StatConfig[] = [
  {
    label: "Total Tasks",
    key: "totalTasks",
    icon: <ListTodo className="h-5 w-5" aria-hidden="true" />,
    iconBg: "bg-blue-50 text-blue-600",
    valueColor: "text-slate-900",
    subLabel: "All tasks created",
  },
  {
    label: "Pending",
    key: "pendingTasks",
    icon: <Clock className="h-5 w-5" aria-hidden="true" />,
    iconBg: "bg-amber-50 text-amber-600",
    valueColor: "text-amber-600",
    subLabel: "Waiting to start",
  },
  {
    label: "In Progress",
    key: "inProgressTasks",
    icon: <TrendingUp className="h-5 w-5" aria-hidden="true" />,
    iconBg: "bg-indigo-50 text-indigo-600",
    valueColor: "text-indigo-600",
    subLabel: "Currently active",
  },
  {
    label: "Completed",
    key: "completedTasks",
    icon: <CheckCircle2 className="h-5 w-5" aria-hidden="true" />,
    iconBg: "bg-emerald-50 text-emerald-600",
    valueColor: "text-emerald-600",
    subLabel: "Finished tasks",
  },
  {
    label: "High Priority",
    key: "highPriorityTasks",
    icon: <AlertTriangle className="h-5 w-5" aria-hidden="true" />,
    iconBg: "bg-rose-50 text-rose-600",
    valueColor: "text-rose-600",
    subLabel: "Urgent items",
  },
  {
    label: "Medium Priority",
    key: "mediumPriorityTasks",
    icon: <Layers className="h-5 w-5" aria-hidden="true" />,
    iconBg: "bg-sky-50 text-sky-600",
    valueColor: "text-sky-600",
    subLabel: "Normal priority",
  },
  {
    label: "Low Priority",
    key: "lowPriorityTasks",
    icon: <Layers className="h-5 w-5" aria-hidden="true" />,
    iconBg: "bg-slate-100 text-slate-600",
    valueColor: "text-slate-700",
    subLabel: "Minor items",
  },
  {
    label: "Overdue",
    key: "overdueTasks",
    icon: <AlertCircle className="h-5 w-5" aria-hidden="true" />,
    iconBg: "bg-red-100 text-red-700",
    valueColor: "text-red-700",
    subLabel: "Past due date",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

const DashboardPage: React.FC = () => {
  useDocumentTitle("Dashboard");

  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const isAllZero =
    stats !== null && Object.values(stats).every((v) => v === 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's a summary of your task status and priorities today.
          </p>
        </div>
        <Link to="/tasks" tabIndex={-1}>
          <Button variant="primary" size="md" className="shrink-0 group">
            <span>Manage Tasks</span>
            <ArrowRight
              className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 transition-transform"
              aria-hidden="true"
            />
          </Button>
        </Link>
      </div>

      {/* Skeleton Loading */}
      {loading && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          aria-label="Loading statistics"
          aria-busy="true"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <ErrorCard
          title="Unable to load statistics"
          message={error}
          onRetry={fetchStats}
        />
      )}

      {/* Empty State */}
      {!loading && !error && isAllZero && (
        <div className="bg-white rounded-xl border border-slate-200">
          <EmptyState
            title="No statistics available"
            description="Create your first task to start seeing your progress here."
            icon={<BarChart2 className="h-8 w-8" aria-hidden="true" />}
            action={
              <Link to="/tasks">
                <Button variant="primary" size="md">
                  Create your first task
                  <ArrowRight className="h-4 w-4 ml-1.5" aria-hidden="true" />
                </Button>
              </Link>
            }
          />
        </div>
      )}

      {/* Stats Grid */}
      {!loading && !error && stats && !isAllZero && (
        <section aria-label="Task statistics">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STAT_CARDS.map((cfg) => (
              <Card
                key={cfg.key}
                className="hover:border-slate-300 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {cfg.label}
                  </span>
                  <div className={`p-2 rounded-lg transition-transform group-hover:scale-110 duration-200 ${cfg.iconBg}`}>
                    {cfg.icon}
                  </div>
                </div>
                <div className="mt-3">
                  <span className={`text-3xl font-extrabold tabular-nums ${cfg.valueColor}`}>
                    {stats[cfg.key]}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{cfg.subLabel}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DashboardPage;
