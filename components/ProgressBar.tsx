"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function ProgressBar({
  current,
  total,
  color = "#3B82F6",
  size = "md",
  showLabel = true,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const heightMap = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

  return (
    <div className="flex items-center gap-3 w-full">
      <div
        className={`flex-1 rounded-full overflow-hidden ${heightMap[size]}`}
        style={{ backgroundColor: `${color}15` }}
      >
        <div
          className={`${heightMap[size]} rounded-full transition-all duration-700 ease-out`}
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            boxShadow: percentage > 0 ? `0 0 12px ${color}40` : "none",
          }}
        />
      </div>
      {showLabel && (
        <span
          className="text-xs font-medium tabular-nums whitespace-nowrap"
          style={{ color }}
        >
          {current}/{total}
        </span>
      )}
    </div>
  );
}
