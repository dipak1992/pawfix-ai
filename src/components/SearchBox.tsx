"use client";

import { useState, useRef, type FormEvent } from "react";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBoxProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export default function SearchBox({
  onSubmit,
  isLoading,
  placeholder = "Ask anything about your dog...",
}: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed && !isLoading) {
      onSubmit(trimmed);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={cn(
          "relative flex items-center rounded-2xl border-2 bg-white shadow-sm transition-all",
          "focus-within:border-brand-400 focus-within:shadow-md focus-within:shadow-brand-100",
          "border-gray-200"
        )}
      >
        <Search className="absolute left-4 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          maxLength={500}
          className={cn(
            "w-full rounded-2xl bg-transparent py-4 pl-12 pr-24 text-base",
            "placeholder:text-gray-400 focus:outline-none",
            "disabled:opacity-60"
          )}
        />
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className={cn(
            "absolute right-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all",
            "bg-brand-500 hover:bg-brand-600 active:scale-95",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Ask"
          )}
        </button>
      </div>
    </form>
  );
}
