"use client";

import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-5 animate-in fade-in duration-200">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
        <div>
          <p className="font-medium text-red-700">Something went wrong</p>
          <p className="mt-1 text-sm text-red-600">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
