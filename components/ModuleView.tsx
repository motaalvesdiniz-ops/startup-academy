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
  hasContent,
  getProgress,
  markModuleDone,
  QuizQuestion,
} from "@/lib/storage";
import SectionTabs from "./SectionTabs";
import QuizView from "./QuizView";

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

const PrintMarkdownComponents: import("react-markdown").Components = {
  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-6 text-black" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-8 mb-4 border-b border-gray-200 pb-2 text-black" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-6 mb-3 text-black" {...props} />,
  p: ({ node, ...props }) => <p className="mb-4 text-black text-base leading-relaxed" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 text-black" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 text-black" {...props} />,
  li: ({ node, ...props }) => <li className="mb-2 text-black" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-bold text-black" {...props} />,
  blockquote: ({ node, children, ...props }) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-gray-700 bg-gray-50" {...props}>
      {children}
    </blockquote>
  ),
};

export default function ModuleView({ moduleId }: ModuleViewProps) {
  const [activeSection, setActiveSection] = useState<Section>("teoria");
  const [content, setContent] = useState<string | QuizQuestion[] | null>(null);
  const [fullContent, setFullContent] = useState<Record<string, string | QuizQuestion[]>>({});
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

    // Check which sections are generated and load full content
    const sections: Section[] = ["teoria", "pratica", "quiz", "projeto"];
    const generated = new Set<string>();
    const loadedFull: Record<string, string | QuizQuestion[]> = {};
    
    sections.forEach((s) => {
      if (hasContent(moduleId, s)) {
        generated.add(s);
      }
      const savedSection = getContent(moduleId, s);
      if (savedSection) loadedFull[s] = savedSection;
    });
    setGeneratedSections(generated);
    setFullContent(loadedFull);

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
          
          // Update full content for print
          const loadedFull: Record<string, string | QuizQuestion[]> = {};
          ["teoria", "pratica", "quiz", "projeto"].forEach(s => {
            if (newCache[`${moduleId}_${s}`]) {
              loadedFull[s] = newCache[`${moduleId}_${s}`];
            }
          });
          setFullContent(loadedFull);
        }
      })
      .catch(e => console.log("Erro ao buscar JSON em ModuleView", e));
  }, [moduleId]);

  // Load content when section changes
  useEffect(() => {
    if (!mounted) return;
    const saved = getContent(moduleId, activeSection);
    setContent(saved);
  }, [activeSection, moduleId, mounted]);



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
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-[#1a2a3f] text-gray-300 hover:text-white hover:bg-[#2a3f5f] transition-colors text-sm font-medium border border-[#2a3f5f] flex items-center gap-2"
            >
              <span>🖨️</span>
              <span className="hidden sm:inline">Exportar PDF</span>
            </button>
            {isDone && (
              <span className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-sm font-medium border border-green-500/20">
                ✓ Concluído
              </span>
            )}
          </div>
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
        {content ? (
          <div className="p-6 md:p-8">
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
              Este conteúdo ainda não está disponível ou não foi carregado.
            </p>
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

      {/* Hidden Print View for Entire Module */}
      <div className="hidden print:block text-black bg-white">
        <div className="mb-12 border-b-2 border-black pb-4">
          <h1 className="text-4xl font-extrabold text-black mb-2">{module.id} - {module.title}</h1>
          <p className="text-xl text-gray-700">Fase {phase.id}: {phase.title}</p>
        </div>
        
        {(["teoria", "pratica", "projeto", "quiz"] as Section[]).map((section) => {
          if (!fullContent[section]) return null;
          return (
            <div key={section} className="page-break mb-12">
              <h2 className="text-3xl font-bold uppercase mb-6 text-black bg-gray-100 p-3 rounded-lg border-l-8 border-gray-800">
                {section === "teoria" ? "Teoria" : section === "pratica" ? "Prática" : section === "projeto" ? "Projeto" : "Quiz"}
              </h2>
              {section === "quiz" && Array.isArray(fullContent[section]) ? (
                 <QuizView questions={fullContent[section] as QuizQuestion[]} />
              ) : (
                <div className="max-w-none text-black">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={PrintMarkdownComponents}
                  >
                    {fullContent[section] as string}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
