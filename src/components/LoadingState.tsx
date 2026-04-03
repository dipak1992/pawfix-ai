"use client";

import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-4 py-12 animate-in fade-in duration-200">
      <div className="relative">
        <div className="h-16 w-16 rounded-full bg-brand-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        </div>
      </div>
      <div className="text-center">
        <p className="font-semibold text-gray-700">Analyzing...</p>
        <p className="mt-1 text-sm text-gray-400">
          Getting the best advice for your pup
        </p>
      </div>
    </div>
  );
}
