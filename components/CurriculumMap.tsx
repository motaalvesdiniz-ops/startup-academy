"use client";

import { useEffect, useState } from "react";
import { curriculum, isPhaseUnlocked } from "@/lib/curriculum";
import { getProgress, countCompleted } from "@/lib/storage";
import PhaseCard from "./PhaseCard";
import ProgressBar from "./ProgressBar";

export default function CurriculumMap() {
  const [progress, setProgress] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProgress(getProgress());
    setMounted(true);
  }, []);

  // Listen for storage changes from other tabs or module pages
  useEffect(() => {
    const handleStorage = () => {
      setProgress(getProgress());
    };
    window.addEventListener("storage", handleStorage);
    // Also listen for custom event
    window.addEventListener("progressUpdate", handleStorage);

    // Try to load pre-generated content if available, bypassing browser cache
    fetch(`/generated_content.json?t=${new Date().getTime()}`)
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data) {
          const currentCacheRaw = localStorage.getItem("sa_content");
          const currentCache = currentCacheRaw ? JSON.parse(currentCacheRaw) : {};
          // O JSON externo é a fonte de verdade. Ele deve sobrepor o cache atual.
          const newCache = { ...currentCache, ...data };
          localStorage.setItem("sa_content", JSON.stringify(newCache));
        }
      })
      .catch((e) => console.log("Nenhum cache pré-gerado encontrado", e));

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("progressUpdate", handleStorage);
    };
  }, []);

  const totalModules = curriculum.reduce(
    (acc, phase) => acc + phase.modules.length,
    0
  );
  const completed = mounted ? countCompleted() : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          🎓 Startup Academy
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Domine os fundamentos de startups de tecnologia com uma trilha de{" "}
          <span className="text-white font-medium">{totalModules} módulos</span>{" "}
          gerados por IA, baseados em conhecimento real de autores consagrados.
        </p>

        {/* Overall progress */}
        <div className="max-w-md mx-auto pt-2">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Progresso geral</span>
            <span className="text-white font-medium">
              {Math.round((completed / totalModules) * 100)}%
            </span>
          </div>
          <ProgressBar
            current={completed}
            total={totalModules}
            color="#8B5CF6"
            size="lg"
            showLabel={false}
          />
        </div>
      </div>

      {/* Phase cards */}
      <div className="space-y-3">
        {curriculum.map((phase) => {
          const unlocked = isPhaseUnlocked(phase.id, progress);
          const hasAvailableUncompleted =
            unlocked &&
            phase.modules.some((m) => progress[m.id] !== "done");

          return (
            <PhaseCard
              key={phase.id}
              phase={phase}
              progress={progress}
              defaultExpanded={hasAvailableUncompleted}
            />
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-gray-600 text-sm">
          Conteúdo gerado por IA com base em conhecimento de autores como Steve Blank,
          Eric Ries, Clayton Christensen, Peter Thiel e outros.
        </p>
      </div>
    </div>
  );
}
