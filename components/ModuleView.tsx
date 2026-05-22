"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  findModule,
  getAdjacentModules,
} from "@/lib/curriculum";
import { ragKnowledgeBase } from "@/lib/rag";
import { Section, loadingMessages } from "@/lib/prompts";
import {
  getContent,
  saveContent,
  deleteContent,
  hasContent,
  getProgress,
  markModuleDone,
  QuizQuestion,
  getIncomplete,
  setIncomplete,
} from "@/lib/storage";
import SectionTabs from "./SectionTabs";
import QuizView from "./QuizView";
import LoadingSteps from "./LoadingSteps";

const CustomMarkdownComponents: import("react-markdown").Components = {
  h1: ({ node, ...props }) => (
    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-8 pb-4 border-b border-blue-500/20" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <div className="mt-16 mb-8 flex items-center gap-4">
      <div className="h-px bg-blue-500/30 flex-1"></div>
      <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-widest px-2" {...props} />
      <div className="h-px bg-blue-500/30 flex-1"></div>
    </div>
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-xl font-bold text-white mt-10 mb-4" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="text-[17px] text-gray-300 leading-[1.8] mb-6 font-light tracking-wide" {...props} />
  ),
  blockquote: ({ node, children, ...props }) => (
    <blockquote className="my-10 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c1a2e] to-[#0A121E] border border-blue-500/30 p-6 md:p-8 shadow-2xl" {...props}>
      <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
      <div className="text-lg text-blue-100 font-medium leading-relaxed relative z-10 flex gap-4 items-start">
        <div className="flex-1">{children}</div>
      </div>
    </blockquote>
  ),
  ul: ({ node, ...props }) => <ul className="my-8 space-y-4" {...props} />,
  li: ({ node, children, ...props }) => (
    <li className="flex gap-4 items-start bg-[#101E2E]/60 p-5 rounded-xl border border-[#1a2a3f] shadow-sm hover:border-blue-500/30 transition-colors" {...props}>
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm mt-1">✓</span>
      <div className="text-gray-300 text-[17px] leading-relaxed flex-1">{children}</div>
    </li>
  ),
  strong: ({ node, ...props }) => <strong className="text-white font-semibold" {...props} />,
  a: ({ node, ...props }) => <a className="text-blue-400 hover:text-blue-300 underline underline-offset-4" {...props} />,
};

interface ModuleViewProps {
  moduleId: string;
}

export default function ModuleView({ moduleId }: ModuleViewProps) {
  const [activeSection, setActiveSection] = useState<Section>("teoria");
  const [content, setContent] = useState<string | QuizQuestion[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isIncomplete, setIsIncomplete] = useState(false);
  const [generatedSections, setGeneratedSections] = useState<Set<string>>(
    new Set()
  );
  const [isDone, setIsDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  const found = findModule(moduleId);
  const adjacent = getAdjacentModules(moduleId);

  // Load state from localStorage
  useEffect(() => {
    setMounted(true);
    const progress = getProgress();
    setIsDone(progress[moduleId] === "done");

    // Check which sections are generated
    const sections: Section[] = ["teoria", "pratica", "quiz", "projeto"];
    const generated = new Set<string>();
    sections.forEach((s) => {
      if (hasContent(moduleId, s)) {
        generated.add(s);
      }
    });
    setGeneratedSections(generated);

    // Load current section content
    const saved = getContent(moduleId, "teoria");
    if (saved) setContent(saved);

    // Fetch the latest JSON to ensure we have the most up-to-date formatting
    fetch(`/generated_content.json?t=${new Date().getTime()}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          const currentCacheRaw = localStorage.getItem("sa_content");
          const currentCache = currentCacheRaw ? JSON.parse(currentCacheRaw) : {};
          const newCache = { ...currentCache, ...data };
          localStorage.setItem("sa_content", JSON.stringify(newCache));
          
          // Force update current view if data for this section was just loaded
          const freshContent = newCache[`${moduleId}_${activeSection}`];
          if (freshContent) setContent(freshContent);
        }
      })
      .catch(e => console.log("Erro ao buscar JSON em ModuleView", e));
  }, [moduleId]);

  // Load content when section changes
  useEffect(() => {
    if (!mounted) return;
    const saved = getContent(moduleId, activeSection);
    setContent(saved);
    setIsIncomplete(getIncomplete(moduleId, activeSection));
    setError(null);
  }, [activeSection, moduleId, mounted]);

  const generate = useCallback(
    async (regenerate = false, isContinue = false) => {
      if (!found) return;
      setIsGenerating(true);
      setError(null);

      if (regenerate && !isContinue) {
        deleteContent(moduleId, activeSection);
      }

      const ragContext = ragKnowledgeBase[moduleId] || "Conteúdo não disponível na RAG para este módulo.";

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            moduleId,
            moduleTitle: found.module.title,
            section: activeSection,
            ragContext,
            previousContent: isContinue ? content : undefined,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || `Erro HTTP ${res.status}`);
        }

        const data = await res.json();
        const newContent = isContinue && typeof content === "string" 
          ? content + data.content 
          : data.content;

        // Save to localStorage
        saveContent(moduleId, activeSection, newContent);
        setIncomplete(moduleId, activeSection, data.isIncomplete);
        setContent(newContent);
        setIsIncomplete(data.isIncomplete);
        setGeneratedSections((prev) => new Set([...prev, activeSection]));
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Erro desconhecido ao gerar conteúdo";
        setError(message);
      } finally {
        setIsGenerating(false);
      }
    },
    [found, moduleId, activeSection]
  );

  const handleMarkDone = () => {
    markModuleDone(moduleId);
    setIsDone(true);
    // Dispatch event for other components
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("progressUpdate"));
    }
  };

  if (!found) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-400">
          Módulo não encontrado
        </h2>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-400 hover:underline"
        >
          ← Voltar ao mapa
        </Link>
      </div>
    );
  }

  const { module, phase } = found;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
        <Link href="/" className="hover:text-white transition-colors">
          ← Mapa
        </Link>
        <span className="text-gray-700">|</span>
        <span style={{ color: phase.color }}>
          Fase {phase.id} — {phase.title}
        </span>
        <span className="text-gray-700">|</span>
        <span className="text-gray-300">Módulo {module.id}</span>
      </nav>

      {/* Module header */}
      <div
        className="rounded-2xl p-6 border"
        style={{
          borderColor: `${phase.color}30`,
          background: `linear-gradient(135deg, ${phase.color}08, ${phase.color}03)`,
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0"
            style={{
              backgroundColor: `${phase.color}20`,
              color: phase.color,
            }}
          >
            {module.id}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {module.title}
            </h1>
            <p className="text-gray-400 mt-1">
              Fase {phase.id}: {phase.title}
            </p>
          </div>
          {isDone && (
            <span className="ml-auto px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium border border-green-500/20">
              ✓ Concluído
            </span>
          )}
        </div>
      </div>

      {/* Section tabs */}
      <SectionTabs
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        generatedSections={generatedSections}
        phaseColor={phase.color}
      />

      {/* Content area */}
      <div className="rounded-2xl border border-[#2a3f5f]/40 bg-gradient-to-b from-[#0C1826] to-[#0A121E] min-h-[400px] shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-blue-500/5 blur-[80px] pointer-events-none" />
        {isGenerating ? (
          <LoadingSteps messages={loadingMessages[activeSection]} />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-400 text-center max-w-md">{error}</p>
            <button
              onClick={() => generate()}
              className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : content ? (
          <div className="p-6 md:p-8">
            {/* Regenerate and Continue buttons */}
            <div className="flex justify-end gap-3 mb-4">
              {isIncomplete && (
                <button
                  onClick={() => generate(false, true)}
                  className="flex items-center gap-2 px-4 py-1.5 text-xs rounded-lg border border-blue-500/30 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 hover:text-blue-300 transition-colors shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                >
                  <span>▶️</span> Continuar Geração (Parou no limite)
                </button>
              )}
              <button
                onClick={() => generate(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border border-[#2a3f5f] text-gray-500 hover:text-white hover:border-blue-500 transition-colors"
              >
                <span>↺</span> Regenerar
              </button>
            </div>

            {/* Render content */}
            {activeSection === "quiz" && Array.isArray(content) ? (
              <QuizView questions={content as QuizQuestion[]} />
            ) : (
              <div className="max-w-none relative z-10 pb-10">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={CustomMarkdownComponents}
                >
                  {content as string}
                </ReactMarkdown>
              </div>
            )}

            {/* Mark as done button (only on Projeto tab) */}
            {activeSection === "projeto" && !isDone && (
              <div className="mt-8 pt-6 border-t border-[#1a2a3f]">
                <button
                  onClick={handleMarkDone}
                  className="w-full md:w-auto px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${phase.color}, ${phase.color}cc)`,
                    boxShadow: `0 0 20px ${phase.color}30`,
                  }}
                >
                  ✓ Marcar como concluído
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${phase.color}10` }}
            >
              {activeSection === "teoria"
                ? "📖"
                : activeSection === "pratica"
                ? "⚙️"
                : activeSection === "quiz"
                ? "🎯"
                : "🚀"}
            </div>
            <p className="text-gray-400 text-center">
              Este conteúdo ainda não foi gerado.
              <br />
              <span className="text-gray-500 text-sm">
                Clique abaixo para gerar com IA baseado em conhecimento real.
              </span>
            </p>
            <button
              onClick={() => generate()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${phase.color}, ${phase.color}cc)`,
                boxShadow: `0 0 20px ${phase.color}30`,
              }}
            >
              <span>⚡</span>
              Gerar{" "}
              {activeSection === "teoria"
                ? "Teoria"
                : activeSection === "pratica"
                ? "Prática"
                : activeSection === "quiz"
                ? "Quiz"
                : "Projeto"}
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        {adjacent.prev ? (
          <Link
            href={`/module/${adjacent.prev.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#1a2a3f] text-gray-400 hover:text-white hover:border-[#2a3f5f] transition-colors text-sm"
          >
            <span>←</span>
            <span className="hidden sm:inline">{adjacent.prev.title}</span>
            <span className="sm:hidden">Anterior</span>
          </Link>
        ) : (
          <div />
        )}
        {adjacent.next ? (
          <Link
            href={`/module/${adjacent.next.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#1a2a3f] text-gray-400 hover:text-white hover:border-[#2a3f5f] transition-colors text-sm"
          >
            <span className="hidden sm:inline">{adjacent.next.title}</span>
            <span className="sm:hidden">Próximo</span>
            <span>→</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
