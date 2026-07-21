import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ListTodo,
  Clock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Layers,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { getDashboardStats } from "../services/dashboard.service";
import type { DashboardStats } from "../types";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err: unknown) {
      let message = "Failed to load dashboard statistics";
      if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's a summary of your task status and priorities today.
          </p>
        </div>
        <Link to="/tasks">
          <Button variant="primary" size="md" className="shrink-0">
            <span>Manage Tasks</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="min-h-[40vh] flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 p-12">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-600">Loading metrics...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full text-red-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-red-900">Unable to load metrics</h3>
          <p className="text-sm text-red-600 max-w-md mx-auto">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchStats} className="mt-2">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            <span>Try again</span>
          </Button>
        </div>
      )}

      {/* Dashboard Stats Grid */}
      {!loading && !error && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Tasks */}
          <Card className="hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Tasks
              </span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <ListTodo className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-slate-900">
                {stats.totalTasks}
              </span>
              <p className="text-xs text-slate-400 mt-1">All tasks created</p>
            </div>
          </Card>

          {/* Card 2: Pending Tasks */}
          <Card className="hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pending
              </span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-amber-600">
                {stats.pendingTasks}
              </span>
              <p className="text-xs text-slate-400 mt-1">Waiting to start</p>
            </div>
          </Card>

          {/* Card 3: In Progress Tasks */}
          <Card className="hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                In Progress
              </span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-indigo-600">
                {stats.inProgressTasks}
              </span>
              <p className="text-xs text-slate-400 mt-1">Currently working on</p>
            </div>
          </Card>

          {/* Card 4: Completed Tasks */}
          <Card className="hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Completed
              </span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-emerald-600">
                {stats.completedTasks}
              </span>
              <p className="text-xs text-slate-400 mt-1">Finished tasks</p>
            </div>
          </Card>

          {/* Card 5: High Priority */}
          <Card className="hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                High Priority
              </span>
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-rose-600">
                {stats.highPriorityTasks}
              </span>
              <p className="text-xs text-slate-400 mt-1">Urgent items</p>
            </div>
          </Card>

          {/* Card 6: Medium Priority */}
          <Card className="hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Medium Priority
              </span>
              <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                <Layers className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-sky-600">
                {stats.mediumPriorityTasks}
              </span>
              <p className="text-xs text-slate-400 mt-1">Normal items</p>
            </div>
          </Card>

          {/* Card 7: Low Priority */}
          <Card className="hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Low Priority
              </span>
              <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                <Layers className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-slate-700">
                {stats.lowPriorityTasks}
              </span>
              <p className="text-xs text-slate-400 mt-1">Minor items</p>
            </div>
          </Card>

          {/* Card 8: Overdue Tasks */}
          <Card className="hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Overdue
              </span>
              <div className="p-2 bg-red-100 text-red-700 rounded-lg">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-red-700">
                {stats.overdueTasks}
              </span>
              <p className="text-xs text-slate-400 mt-1">Past due date</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
