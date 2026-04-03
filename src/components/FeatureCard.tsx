"use client";

import { cn } from "@/lib/utils";

interface FeatureCardProps {
  emoji: string;
  label: string;
  color: string;
  onClick: () => void;
}

export default function FeatureCard({
  emoji,
  label,
  color,
  onClick,
}: FeatureCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-2xl p-4 transition-all",
        "shadow-sm hover:shadow-md active:scale-[0.97]",
        "border border-gray-100 bg-white",
        "min-h-[100px] w-full"
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl text-2xl",
          color
        )}
      >
        {emoji}
      </span>
      <span className="text-sm font-medium text-gray-700 text-center leading-tight">
        {label}
      </span>
    </button>
  );
}
