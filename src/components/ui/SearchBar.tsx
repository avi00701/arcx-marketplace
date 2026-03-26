"use client";

import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border transition-all duration-200 ${
        isFocused ? "border-accent shadow-lg shadow-accent/10" : "border-border"
      }`}
    >
      <svg
        className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
          isFocused ? "text-accent" : "text-muted"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search collections, NFTs..."
        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none min-w-0"
        id="search-input"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-muted bg-background rounded border border-border">
        ⌘K
      </kbd>
    </div>
  );
}
