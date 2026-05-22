"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/storage";

interface QuizViewProps {
  questions: QuizQuestion[];
}

export default function QuizView({ questions }: QuizViewProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [showResults, setShowResults] = useState(false);

  const selectAnswer = (questionIndex: number, optionIndex: number) => {
    if (revealed[questionIndex]) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const revealAnswer = (questionIndex: number) => {
    setRevealed((prev) => ({ ...prev, [questionIndex]: true }));
  };

  const score = questions.reduce((acc, q, i) => {
    if (revealed[i] && answers[i] === q.correct) return acc + 1;
    return acc;
  }, 0);

  const allRevealed = questions.every((_, i) => revealed[i]);

  const handleShowResults = () => {
    // Reveal all
    const allReveals: Record<number, boolean> = {};
    questions.forEach((_, i) => {
      allReveals[i] = true;
    });
    setRevealed(allReveals);
    setShowResults(true);
  };

  const handleReset = () => {
    setAnswers({});
    setRevealed({});
    setShowResults(false);
  };

  return (
    <div className="space-y-8">
      {questions.map((q, qi) => (
        <div
          key={qi}
          className="bg-[#0C1826] border border-[#1a2a3f] rounded-xl p-6 transition-all duration-300"
        >
          {/* Question number + text */}
          <div className="flex gap-3 mb-5">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm font-bold">
              {qi + 1}
            </span>
            <p className="text-gray-200 font-medium leading-relaxed pt-1">
              {q.q}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2 ml-11">
            {q.opts.map((opt, oi) => {
              const isSelected = answers[qi] === oi;
              const isCorrect = q.correct === oi;
              const isRevealed = revealed[qi];

              let optionClass =
                "border border-[#1a2a3f] bg-[#101E2E] hover:border-[#2a3f5f] cursor-pointer";
              if (isSelected && !isRevealed) {
                optionClass =
                  "border-blue-500 bg-blue-500/10 cursor-pointer";
              }
              if (isRevealed && isCorrect) {
                optionClass =
                  "border-green-500 bg-green-500/10 cursor-default";
              }
              if (isRevealed && isSelected && !isCorrect) {
                optionClass =
                  "border-red-500 bg-red-500/10 cursor-default";
              }
              if (isRevealed && !isSelected && !isCorrect) {
                optionClass =
                  "border-[#1a2a3f] bg-[#101E2E] opacity-50 cursor-default";
              }

              return (
                <button
                  key={oi}
                  onClick={() => selectAnswer(qi, oi)}
                  disabled={isRevealed}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 ${optionClass}`}
                >
                  <span className="text-gray-300">{opt}</span>
                  {isRevealed && isCorrect && (
                    <span className="ml-2 text-green-400">✓</span>
                  )}
                  {isRevealed && isSelected && !isCorrect && (
                    <span className="ml-2 text-red-400">✗</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Verify button */}
          {answers[qi] !== undefined && !revealed[qi] && (
            <div className="ml-11 mt-4">
              <button
                onClick={() => revealAnswer(qi)}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                Verificar resposta
              </button>
            </div>
          )}

          {/* Explanation */}
          {revealed[qi] && (
            <div className="ml-11 mt-4 p-4 rounded-lg bg-[#07101C] border border-[#1a2a3f]">
              <p className="text-sm text-gray-400">
                <span className="text-blue-400 font-medium">Explicação: </span>
                {q.exp}
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Bottom actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1a2a3f]">
        {allRevealed || showResults ? (
          <>
            <div className="flex items-center gap-3">
              <div
                className={`text-2xl font-bold ${
                  score >= questions.length * 0.7
                    ? "text-green-400"
                    : score >= questions.length * 0.4
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {score}/{questions.length}
              </div>
              <span className="text-sm text-gray-500">
                {score >= questions.length * 0.7
                  ? "Excelente! 🎉"
                  : score >= questions.length * 0.4
                  ? "Bom, revise os erros 📚"
                  : "Revise o conteúdo e tente novamente 💪"}
              </span>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm rounded-lg border border-[#2a3f5f] text-gray-400 hover:text-white hover:border-blue-500 transition-colors"
            >
              Tentar novamente
            </button>
          </>
        ) : (
          <button
            onClick={handleShowResults}
            disabled={Object.keys(answers).length < questions.length}
            className="px-5 py-2.5 text-sm rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed ml-auto"
          >
            Ver resultado final
          </button>
        )}
      </div>
    </div>
  );
}
