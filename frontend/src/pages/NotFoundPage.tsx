import React from "react";
import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import { Button } from "../components/ui/Button";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
        <FileQuestion className="h-10 w-10 text-slate-400" />
      </div>
      <h1 className="text-5xl font-bold text-slate-800 mb-3">404</h1>
      <h2 className="text-xl font-semibold text-slate-700 mb-2">Page not found</h2>
      <p className="text-slate-500 mb-8 max-w-sm">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
