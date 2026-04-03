"use client";

import { useState, useCallback } from "react";
import SearchBox from "@/components/SearchBox";
import FeatureCard from "@/components/FeatureCard";
import QuickChip from "@/components/QuickChip";
import ResultCard from "@/components/ResultCard";
import LoadingState from "@/components/LoadingState";
import ErrorMessage from "@/components/ErrorMessage";
import type { DogAdviceResponse } from "@/lib/ai";

// ── Feature definitions ──────────────────────────────────────────────
const FEATURES = [
  { emoji: "🟢", label: "Can my dog eat this?", type: "food" as const },
  { emoji: "🚨", label: "Emergency help", type: "emergency" as const },
  { emoji: "🍖", label: "Daily feeding guide", type: "feeding" as const },
  { emoji: "🧠", label: "Behavior help", type: "behavior" as const },
];

const FEATURE_COLORS: Record<string, string> = {
  food: "bg-green-100",
  emergency: "bg-red-100",
  feeding: "bg-amber-100",
  behavior: "bg-blue-100",
};

const QUICK_SUGGESTIONS = [
  "Can dogs eat banana?",
  "Dog vomiting what to do?",
  "Best treats for puppies",
  "Why is my dog shaking?",
  "Can dogs eat chocolate?",
];

// ── Detect which prompt type best fits a free-text query ─────────────
function detectPromptType(query: string): "food" | "emergency" | "behavior" | "feeding" {
  const q = query.toLowerCase();

  // Emergency keywords
  if (
    q.includes("emergency") ||
    q.includes("vomit") ||
    q.includes("blood") ||
    q.includes("poison") ||
    q.includes("ate chocolate") ||
    q.includes("not breathing") ||
    q.includes("choking") ||
    q.includes("what to do")
  ) {
    return "emergency";
  }

  // Food keywords
  if (
    q.includes("can dog") ||
    q.includes("can my dog") ||
    q.includes("safe to eat") ||
    q.includes("dogs eat") ||
    q.includes("feed my dog") ||
    q.includes("treat") ||
    q.includes("food")
  ) {
    return "food";
  }

  // Feeding keywords
  if (
    q.includes("how much") ||
    q.includes("feeding") ||
    q.includes("diet") ||
    q.includes("meal") ||
    q.includes("portion") ||
    q.includes("weight")
  ) {
    return "feeding";
  }

  // Default to behavior
  return "behavior";
}

// ── Page component ───────────────────────────────────────────────────
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DogAdviceResponse | null>(null);
  const [lastQuery, setLastQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  /** Call the /api/ask endpoint */
  const askQuestion = useCallback(
    async (query: string, type?: string) => {
      setIsLoading(true);
      setResult(null);
      setError(null);
      setLastQuery(query);

      try {
        const promptType = type || detectPromptType(query);

        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: promptType, input: query }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error || `Request failed (${res.status})`);
        }

        const data: DogAdviceResponse = await res.json();
        setResult(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /** Handle feature card clicks */
  const handleFeatureClick = (type: string) => {
    const prompts: Record<string, string> = {
      food: "Can my dog eat ",
      emergency: "My dog needs emergency help",
      feeding: "What should I feed my dog? General daily feeding guide",
      behavior: "My dog is acting strange",
    };
    // For food, just set placeholder focus — for others run the query
    if (type === "food") {
      // Scroll to search and let user type the food
      const el = document.querySelector("input");
      if (el) {
        el.focus();
        el.placeholder = "Type a food name (e.g., banana, chocolate)...";
      }
    } else {
      askQuestion(prompts[type] || "", type);
    }
  };

  /** Reset to home state */
  const handleBack = () => {
    setResult(null);
    setError(null);
    setLastQuery("");
  };

  return (
    <main className="flex flex-col gap-6 px-4 py-6 safe-bottom">
      {/* Header */}
      <header className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-600 mb-3">
          <span>🐾</span> AI-Powered
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          PawFix AI
        </h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Instant answers to all your dog questions
        </p>
      </header>

      {/* Search box */}
      <SearchBox onSubmit={(q) => askQuestion(q)} isLoading={isLoading} />

      {/* Dynamic content area */}
      {isLoading && <LoadingState />}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => askQuestion(lastQuery)}
        />
      )}

      {result && (
        <ResultCard result={result} query={lastQuery} onBack={handleBack} />
      )}

      {/* Show home content only when no result/loading/error */}
      {!isLoading && !result && !error && (
        <>
          {/* Feature cards grid */}
          <section>
            <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map((f) => (
                <FeatureCard
                  key={f.type}
                  emoji={f.emoji}
                  label={f.label}
                  color={FEATURE_COLORS[f.type]}
                  onClick={() => handleFeatureClick(f.type)}
                />
              ))}
            </div>
          </section>

          {/* Quick suggestions */}
          <section>
            <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Popular Questions
            </h2>
            <div className="flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.map((s) => (
                <QuickChip
                  key={s}
                  label={s}
                  onClick={() => askQuestion(s)}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="mt-auto pt-6 pb-2 text-center text-xs text-gray-400">
        PawFix AI &middot; Not a substitute for professional veterinary advice
      </footer>
    </main>
  );
}
