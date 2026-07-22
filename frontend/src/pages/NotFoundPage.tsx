import React from "react";
import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const NotFoundPage: React.FC = () => {
  useDocumentTitle("Page Not Found");

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6 text-slate-400">
        <FileQuestion className="h-10 w-10" aria-hidden="true" />
      </div>
      <h1 className="text-5xl font-extrabold text-slate-800 mb-3">404</h1>
      <h2 className="text-xl font-semibold text-slate-700 mb-2">Page not found</h2>
      <p className="text-slate-500 mb-8 max-w-sm leading-relaxed">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" size="lg">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
