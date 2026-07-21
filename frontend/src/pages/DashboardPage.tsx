import React from "react";
import { LayoutDashboard } from "lucide-react";
import { Card } from "../components/ui/Card";

const DashboardPage: React.FC = () => {
  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <LayoutDashboard className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      </div>

      <p className="text-slate-500 mb-8">
        Overview of your tasks and progress.
      </p>

      {/* Stats placeholder grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {["Total Tasks", "Pending", "In Progress", "Completed"].map((label) => (
          <Card key={label} className="flex flex-col gap-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
            <p className="text-3xl font-bold text-slate-800">—</p>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card title="Statistics">
          <p className="text-sm text-slate-500">
            Dashboard statistics will be loaded here once authentication is connected.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
