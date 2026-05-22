"use client";

import { Section } from "@/lib/prompts";

interface SectionTabsProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  generatedSections: Set<string>;
  phaseColor: string;
}

const tabs: { key: Section; label: string; icon: string }[] = [
  { key: "teoria", label: "Teoria", icon: "📖" },
  { key: "pratica", label: "Prática", icon: "⚙️" },
  { key: "quiz", label: "Quiz", icon: "🎯" },
  { key: "projeto", label: "Projeto", icon: "🚀" },
];

export default function SectionTabs({
  activeSection,
  onSectionChange,
  generatedSections,
  phaseColor,
}: SectionTabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-[#0C1826] rounded-xl border border-[#1a2a3f] overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = activeSection === tab.key;
        const isGenerated = generatedSections.has(tab.key);

        return (
          <button
            key={tab.key}
            onClick={() => onSectionChange(tab.key)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center whitespace-nowrap ${
              isActive
                ? "text-white shadow-lg"
                : "text-gray-500 hover:text-gray-300"
            }`}
            style={
              isActive
                ? {
                    backgroundColor: `${phaseColor}20`,
                    boxShadow: `0 0 20px ${phaseColor}15`,
                  }
                : undefined
            }
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {isGenerated && (
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
            )}
            {isActive && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                style={{ backgroundColor: phaseColor }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
