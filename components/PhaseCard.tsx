"use client";

import { useState } from "react";
import Link from "next/link";
import { Phase, getModuleStatus, ModuleStatus } from "@/lib/curriculum";
import ProgressBar from "./ProgressBar";

interface PhaseCardProps {
  phase: Phase;
  progress: Record<string, string>;
  defaultExpanded?: boolean;
}

function StatusIcon({ status }: { status: ModuleStatus }) {
  switch (status) {
    case "done":
      return (
        <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">
          ✓
        </span>
      );
    case "locked":
      return (
        <span className="w-6 h-6 rounded-full bg-[#1a2a3f] text-gray-600 flex items-center justify-center text-xs">
          🔒
        </span>
      );
    case "available":
      return (
        <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
        </span>
      );
  }
}

export default function PhaseCard({
  phase,
  progress,
  defaultExpanded = false,
}: PhaseCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const completedCount = phase.modules.filter(
    (m) => progress[m.id] === "done"
  ).length;
  const totalCount = phase.modules.length;

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-300"
      style={{
        borderColor: expanded ? `${phase.color}40` : "#1a2a3f",
        backgroundColor: expanded ? `${phase.color}05` : "#0C1826",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 text-left group transition-colors hover:bg-white/[0.02]"
      >
        {/* Phase number badge */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 transition-transform group-hover:scale-105"
          style={{
            backgroundColor: `${phase.color}15`,
            color: phase.color,
            boxShadow: `0 0 20px ${phase.color}10`,
          }}
        >
          {phase.id}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg">
            Fase {phase.id} — {phase.title}
          </h3>
          <div className="mt-2 max-w-xs">
            <ProgressBar
              current={completedCount}
              total={totalCount}
              color={phase.color}
              size="sm"
              showLabel={true}
            />
          </div>
        </div>

        {/* Expand icon */}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
          style={{
            backgroundColor: `${phase.color}10`,
            color: phase.color,
          }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Module list */}
      {expanded && (
        <div className="px-5 pb-5">
          <div className="space-y-1.5 ml-2 border-l-2 pl-4" style={{ borderColor: `${phase.color}20` }}>
            {phase.modules.map((mod) => {
              const status = getModuleStatus(mod.id, progress);
              const isClickable = status !== "locked";

              const content = (
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isClickable
                      ? "hover:bg-white/[0.03] cursor-pointer group"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <StatusIcon status={status} />
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-sm font-medium ${
                        status === "done"
                          ? "text-gray-400"
                          : status === "available"
                          ? "text-gray-200"
                          : "text-gray-600"
                      }`}
                    >
                      <span className="text-gray-500 mr-2">{mod.id}</span>
                      {mod.title}
                    </span>
                  </div>
                  {isClickable && (
                    <svg
                      className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </div>
              );

              return isClickable ? (
                <Link key={mod.id} href={`/module/${mod.id}`}>
                  {content}
                </Link>
              ) : (
                <div key={mod.id}>{content}</div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
