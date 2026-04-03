"use client";

import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DogAdviceResponse } from "@/lib/ai";
import TreatCard from "./TreatCard";

interface ResultCardProps {
  result: DogAdviceResponse;
  query: string;
  onBack: () => void;
}

// Map status to visual style
const STATUS_CONFIG: Record<string, { icon: typeof CheckCircle; bg: string; text: string; border: string }> = {
  Safe: {
    icon: CheckCircle,
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  Recommendation: {
    icon: CheckCircle,
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  Normal: {
    icon: CheckCircle,
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  Limited: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  Monitor: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  "Attention Needed": {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  Unsafe: {
    icon: XCircle,
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  Urgent: {
    icon: XCircle,
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  "Consult Vet": {
    icon: XCircle,
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

const DEFAULT_CONFIG = {
  icon: Info,
  bg: "bg-blue-50",
  text: "text-blue-700",
  border: "border-blue-200",
};

export default function ResultCard({ result, query, onBack }: ResultCardProps) {
  const config = STATUS_CONFIG[result.status] || DEFAULT_CONFIG;
  const StatusIcon = config.icon;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Ask another question
      </button>

      {/* Query echo */}
      <p className="text-sm text-gray-500">
        You asked: <span className="font-medium text-gray-700">&ldquo;{query}&rdquo;</span>
      </p>

      {/* Status badge */}
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border",
          config.bg,
          config.text,
          config.border
        )}
      >
        <StatusIcon className="h-4 w-4" />
        {result.status}
      </div>

      {/* Explanation */}
      <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
        <p className="text-gray-700 leading-relaxed">{result.explanation}</p>
      </div>

      {/* Action steps */}
      {result.actions && result.actions.length > 0 && (
        <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 uppercase tracking-wide">
            What to do
          </h3>
          <ul className="space-y-2.5">
            {result.actions.map((action, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                  {i + 1}
                </span>
                <span className="text-gray-600 text-sm leading-relaxed">
                  {action}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Treat Card */}
      <TreatCard />
    </div>
  );
}
