import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CheckSquare, LayoutDashboard, LogIn, LogOut, ListTodo, User as UserIcon } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export const AppLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-blue-600 font-bold text-lg">
            <CheckSquare className="h-6 w-6" />
            <span>TaskManager</span>
          </Link>

          <nav className="flex items-center space-x-1 sm:space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/dashboard")
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/tasks"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/tasks")
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <ListTodo className="h-4 w-4" />
                  <span>Tasks</span>
                </Link>

                <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-700">
                  <UserIcon className="h-3.5 w-3.5 text-slate-500" />
                  <span>{user?.name || user?.email}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/login")
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        Task Management System &copy; {new Date().getFullYear()} — Full Stack Internship Assessment
      </footer>
    </div>
  );
};
