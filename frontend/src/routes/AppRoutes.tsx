import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import TasksPage from "../pages/TasksPage";
import NotFoundPage from "../pages/NotFoundPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Standalone Login Page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Main Layout routes */}
      <Route element={<AppLayout />}>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
