"use client";

import { useState, useEffect } from "react";

interface LoadingStepsProps {
  messages: string[];
}

export default function LoadingSteps({ messages }: LoadingStepsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= messages.length - 1) return;
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 2500);
    return () => clearTimeout(timer);
  }, [currentIndex, messages.length]);

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      {/* Spinner */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-[#1a2a3f] border-t-blue-500 animate-spin" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-b-blue-400/30 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
      </div>

      {/* Messages */}
      <div className="flex flex-col items-center gap-2 min-h-[80px]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 transition-all duration-500 ${
              i < currentIndex
                ? "text-green-400/70 scale-95"
                : i === currentIndex
                ? "text-blue-400 scale-100"
                : "text-[#2a3f5f] scale-95"
            }`}
          >
            {i < currentIndex ? (
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : i === currentIndex ? (
              <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              </span>
            ) : (
              <span className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
