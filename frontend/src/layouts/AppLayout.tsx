import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  CheckSquare,
  LayoutDashboard,
  LogIn,
  LogOut,
  ListTodo,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

// Helper: first letter of name/email as avatar
const getInitial = (name?: string, email?: string): string =>
  (name || email || "U").charAt(0).toUpperCase();

export const AppLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
      isActive
        ? "bg-blue-50 text-blue-700 shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-blue-600 font-bold text-lg hover:text-blue-700 transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
            aria-label="TaskManager — go to home"
          >
            <CheckSquare className="h-6 w-6" aria-hidden="true" />
            <span className="hidden sm:inline">TaskManager</span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink to="/tasks" className={navLinkClass}>
                  <ListTodo className="h-4 w-4" aria-hidden="true" />
                  <span>Tasks</span>
                </NavLink>

                {/* Divider */}
                <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" aria-hidden="true" />

                {/* User avatar + name */}
                <div
                  className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                  title={user?.email}
                >
                  <div
                    className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    {getInitial(user?.name, user?.email)}
                  </div>
                  <span className="text-xs font-medium text-slate-700 max-w-[120px] truncate">
                    {user?.name || user?.email}
                  </span>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 transition-all duration-150 cursor-pointer"
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <NavLink to="/login" className={navLinkClass}>
                <LogIn className="h-4 w-4" aria-hidden="true" />
                <span>Login</span>
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────────────── */}
      <main
        id="main-content"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 page-enter"
      >
        <Outlet />
      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        Task Management System &copy; {new Date().getFullYear()} — Built with React &amp; Node.js
      </footer>
    </div>
  );
};
