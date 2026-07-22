import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorCardProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
  title = "Something went wrong",
  message,
  onRetry,
}) => (
  <div
    className="bg-red-50 border border-red-200 rounded-xl p-8 text-center space-y-4"
    role="alert"
    aria-live="assertive"
  >
    <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-full">
      <AlertCircle className="h-7 w-7 text-red-600" aria-hidden="true" />
    </div>
    <div>
      <h3 className="text-base font-semibold text-red-900 mb-1">{title}</h3>
      <p className="text-sm text-red-600 max-w-md mx-auto">{message}</p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-red-300 bg-white text-red-700 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 transition-colors"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Try again
      </button>
    )}
  </div>
);
