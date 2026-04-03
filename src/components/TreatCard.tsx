"use client";

import { Star, ExternalLink } from "lucide-react";

/** Recommended treat card — placeholder for future ecommerce integration */
export default function TreatCard() {
  return (
    <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-600">
        Recommended Treat
      </p>
      <div className="flex gap-4">
        {/* Product image placeholder */}
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 to-orange-200 text-3xl">
          🧀
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-gray-900">Yak Cheese Chew</h4>
            <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
              100% natural, long-lasting chew. Great for dental health &amp; keeping
              your dog busy.
            </p>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">4.9 (2.3k reviews)</span>
          </div>
        </div>
      </div>
      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-amber-600 active:scale-[0.98]">
        View Product
        <ExternalLink className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
