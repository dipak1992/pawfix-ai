"use client";

import { cn } from "@/lib/utils";

interface QuickChipProps {
  label: string;
  onClick: (label: string) => void;
}

export default function QuickChip({ label, onClick }: QuickChipProps) {
  return (
    <button
      onClick={() => onClick(label)}
      className={cn(
        "inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2",
        "text-sm text-gray-600 shadow-sm transition-all",
        "hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
        "active:scale-[0.97]"
      )}
    >
      {label}
    </button>
  );
}
