"use client";

import { useEffect, useState } from "react";
import { findModule } from "@/lib/curriculum";
import { Section } from "@/lib/prompts";
import { QuizQuestion } from "@/lib/storage";
import { getContent } from "@/lib/storage";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import QuizView from "./QuizView";

interface ApostilaViewProps {
  moduleId: string;
}

const PrintMarkdownComponents: import("react-markdown").Components = {
  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-6 mt-8" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-10 mb-4 pb-2 border-b-2 border-gray-100" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-8 mb-3" {...props} />,
  p: ({ node, ...props }) => <p className="mb-5 leading-relaxed text-[15px]" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-5 text-[15px]" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-5 text-[15px]" {...props} />,
  li: ({ node, ...props }) => <li className="mb-2" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
  blockquote: ({ node, children, ...props }) => (
    <blockquote className="border-l-8 border-gray-300 pl-6 py-4 my-6 italic bg-gray-50 rounded-r-lg" {...props}>
      {children}
    </blockquote>
  ),
};

export default function ApostilaView({ moduleId }: ApostilaViewProps) {
  const [fullContent, setFullContent] = useState<Record<string, string | QuizQuestion[]>>({});
  const [mounted, setMounted] = useState(false);

  const found = findModule(moduleId);

  useEffect(() => {
    setMounted(true);
    if (!found) return;

    // Tenta carregar do localStorage primeiro
    const loadedFull: Record<string, string | QuizQuestion[]> = {};
    const sections: Section[] = ["teoria", "pratica", "projeto", "quiz"];
    
    sections.forEach(s => {
      const savedSection = getContent(moduleId, s);
      if (savedSection) loadedFull[s] = savedSection;
    });
    setFullContent(loadedFull);

    // Faz fetch para garantir que está atualizado
    fetch(`/generated_content.json?t=${new Date().getTime()}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          const newLoaded: Record<string, string | QuizQuestion[]> = {};
          sections.forEach(s => {
            if (data[`${moduleId}_${s}`]) {
              newLoaded[s] = data[`${moduleId}_${s}`];
            }
          });
          setFullContent(newLoaded);
        }
      })
      .catch(e => console.log("Erro ao buscar JSON", e));
  }, [moduleId, found]);

  if (!mounted || !found) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <p className="text-gray-500 font-medium">Carregando Apostila...</p>
      </div>
    );
  }

  const { module, phase } = found;

  return (
    <div className="min-h-screen bg-gray-200 py-10 px-4 print:bg-white print:py-0 print:px-0">
      
      {/* Barra de Ferramentas Fixa (não aparece na impressão) */}
      <div className="fixed top-4 left-0 w-full flex justify-center z-50 no-print pointer-events-none">
        <div className="bg-white/90 backdrop-blur shadow-lg rounded-full px-6 py-3 flex items-center gap-6 border border-gray-300 pointer-events-auto">
          <Link href={`/module/${module.id}`} className="text-gray-500 hover:text-black font-medium text-sm transition-colors flex items-center gap-2">
            <span>←</span> Voltar
          </Link>
          <div className="w-px h-5 bg-gray-300"></div>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-md"
          >
            <span>🖨️</span> Imprimir PDF Definitivo
          </button>
        </div>
      </div>

      <div className="print-apostila w-full max-w-[21cm] mx-auto space-y-10 print:space-y-0">
        
        {/* Capa */}
        <div className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] print:shadow-none min-h-[29.7cm] flex flex-col items-center justify-center text-center p-10 border border-gray-300 print:border-none print:min-h-0" style={{ pageBreakAfter: 'always', paddingTop: '5cm', paddingBottom: '5cm' }}>
          <div className="border-4 border-gray-900 p-16 w-[90%] mx-auto relative bg-white">
            <h3 className="text-xl text-gray-500 uppercase tracking-[0.3em] font-semibold mb-10">
              Startup Academy
            </h3>
            <h1 className="text-5xl font-extrabold text-black mb-8 leading-tight">
              {module.title}
            </h1>
            <div className="h-1 w-32 bg-gray-900 mx-auto mb-8"></div>
            <p className="text-3xl text-gray-800 font-medium">
              Fase {phase.id}
            </p>
            <p className="text-2xl text-gray-600 mt-2">
              {phase.title}
            </p>
            <p className="text-lg text-gray-400 mt-20 font-mono">
              MÓDULO {module.id}
            </p>
          </div>
        </div>
        
        {/* Conteúdo */}
        <div className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] print:shadow-none p-12 md:p-16 border border-gray-300 print:border-none print:p-0">
          {(["teoria", "pratica", "projeto", "quiz"] as Section[]).map((section) => {
            if (!fullContent[section]) return null;
            return (
              <div key={section} className="page-break mb-16 pb-8 border-b-2 border-gray-100 last:border-0 last:mb-0">
                <div className="border-b-4 border-gray-900 pb-4 mb-8">
                  <h2 className="text-3xl font-black uppercase tracking-wider text-black">
                    {section === "teoria" ? "1. Teoria" : section === "pratica" ? "2. Prática" : section === "projeto" ? "3. Projeto" : "4. Quiz"}
                  </h2>
                </div>
                {section === "quiz" && Array.isArray(fullContent[section]) ? (
                   <div className="text-black pointer-events-none opacity-90 grayscale">
                     <div className="bg-gray-100 border-l-4 border-gray-400 p-4 mb-6">
                       <p className="text-sm text-gray-700 italic">Nota: O Quiz interativo não é funcional no modo apostila em papel. Esta é apenas uma representação das perguntas.</p>
                     </div>
                     <QuizView questions={fullContent[section] as QuizQuestion[]} />
                   </div>
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
    </div>
  );
}
