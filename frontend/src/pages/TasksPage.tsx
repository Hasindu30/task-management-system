import React from "react";
import { ListTodo, Plus } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const TasksPage: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <ListTodo className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
        </div>
        <Button variant="primary" size="md">
          <Plus className="h-4 w-4 mr-1.5" />
          New Task
        </Button>
      </div>

      <p className="text-slate-500 mb-8">
        Create, manage, and track all your tasks.
      </p>

      {/* Search / filter placeholder */}
      <Card className="mb-4">
        <p className="text-sm text-slate-500">
          Search, filter, and sort controls will appear here.
        </p>
      </Card>

      {/* Task list placeholder */}
      <Card title="Task List">
        <p className="text-sm text-slate-500">
          Tasks will be loaded here once authentication and API connection are set up.
        </p>
      </Card>
    </div>
  );
};

export default TasksPage;
