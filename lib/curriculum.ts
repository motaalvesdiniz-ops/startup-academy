export interface Module {
  id: string;
  title: string;
}

export interface Phase {
  id: number;
  title: string;
  color: string;
  modules: Module[];
}

export const curriculum: Phase[] = [
  {
    id: 1,
    title: "Fundamentos",
    color: "#3B82F6",
    modules: [
      { id: "1.1", title: "O que é uma startup de tecnologia" },
      { id: "1.2", title: "Mentalidade empreendedora e First Principles" },
      { id: "1.3", title: "Ecossistema: VCs, aceleradoras e atores" },
    ],
  },
  {
    id: 2,
    title: "Descoberta do Problema",
    color: "#F59E0B",
    modules: [
      { id: "2.1", title: "Customer Discovery — Steve Blank" },
      { id: "2.2", title: "Jobs to Be Done — Clayton Christensen" },
      { id: "2.3", title: "The Mom Test — entrevistas sem viés" },
      { id: "2.4", title: "Segmentação, priorização e Early Adopters" },
    ],
  },
  {
    id: 3,
    title: "Solução & MVP",
    color: "#10B981",
    modules: [
      { id: "3.1", title: "Lean Startup — Build-Measure-Learn" },
      { id: "3.2", title: "MVP — tipos, estratégias e armadilhas" },
      { id: "3.3", title: "Design Thinking aplicado a produtos" },
      { id: "3.4", title: "Product Discovery e hipóteses de risco" },
    ],
  },
  {
    id: 4,
    title: "Modelo de Negócio",
    color: "#8B5CF6",
    modules: [
      { id: "4.1", title: "Lean Canvas e Business Model Canvas" },
      { id: "4.2", title: "Modelos de monetização em tecnologia" },
      { id: "4.3", title: "Unit Economics: LTV, CAC, Churn" },
      { id: "4.4", title: "Estratégia de pricing" },
    ],
  },
  {
    id: 5,
    title: "Validação & PMF",
    color: "#EF4444",
    modules: [
      { id: "5.1", title: "Product-Market Fit — o que é e como medir" },
      { id: "5.2", title: "AARRR Pirate Metrics e OMTM" },
      { id: "5.3", title: "Retention como fundação do crescimento" },
    ],
  },
  {
    id: 6,
    title: "Go-to-Market",
    color: "#F97316",
    modules: [
      { id: "6.1", title: "Estratégias de lançamento" },
      { id: "6.2", title: "Traction — 19 canais e Bullseye Framework" },
      { id: "6.3", title: "Growth Hacking e growth loops" },
      { id: "6.4", title: "Sales para startups early-stage" },
    ],
  },
  {
    id: 7,
    title: "Time & Organização",
    color: "#06B6D4",
    modules: [
      { id: "7.1", title: "Co-founders, equity e vesting" },
      { id: "7.2", title: "Primeiras contratações e cultura" },
      { id: "7.3", title: "Liderança em startups e OKRs" },
    ],
  },
  {
    id: 8,
    title: "Captação de Recursos",
    color: "#EC4899",
    modules: [
      { id: "8.1", title: "Fundamentos de fundraising e tipos de investimento" },
      { id: "8.2", title: "Pitch deck e narrativa de investimento" },
      { id: "8.3", title: "Term sheets, dilution e cap table" },
    ],
  },
  {
    id: 9,
    title: "Escala",
    color: "#84CC16",
    modules: [
      { id: "9.1", title: "Crossing the Chasm — cruzando o abismo" },
      { id: "9.2", title: "Blitzscaling — quando e como escalar" },
      { id: "9.3", title: "Network effects e plataformas" },
      { id: "9.4", title: "Internacionalização de startups" },
    ],
  },
  {
    id: 10,
    title: "Avançado",
    color: "#A78BFA",
    modules: [
      { id: "10.1", title: "Zero to One — monopólios e segredos" },
      { id: "10.2", title: "Estratégia competitiva e fossos (moats)" },
      { id: "10.3", title: "M&A, exits e lifecycle venture-backed" },
    ],
  },
];

/** Get all module IDs as a flat array */
export function getAllModuleIds(): string[] {
  return curriculum.flatMap((phase) => phase.modules.map((m) => m.id));
}

/** Find a module by ID, returning the module and its parent phase */
export function findModule(moduleId: string): {
  module: Module;
  phase: Phase;
} | null {
  for (const phase of curriculum) {
    const module = phase.modules.find((m) => m.id === moduleId);
    if (module) return { module, phase };
  }
  return null;
}

/** Get adjacent modules for navigation */
export function getAdjacentModules(moduleId: string): {
  prev: Module | null;
  next: Module | null;
} {
  const allModules = curriculum.flatMap((p) => p.modules);
  const index = allModules.findIndex((m) => m.id === moduleId);
  return {
    prev: index > 0 ? allModules[index - 1] : null,
    next: index < allModules.length - 1 ? allModules[index + 1] : null,
  };
}

/** Check if a phase is unlocked based on progress */
export function isPhaseUnlocked(
  phaseId: number,
  progress: Record<string, string>
): boolean {
  // O usuário solicitou que todos os módulos fiquem desbloqueados
  return true;
}

/** Check if a specific module is accessible */
export function isModuleAccessible(
  moduleId: string,
  progress: Record<string, string>
): boolean {
  // O usuário solicitou que todos os módulos fiquem desbloqueados
  return true;
}

/** Get module status */
export type ModuleStatus = "locked" | "available" | "done";

export function getModuleStatus(
  moduleId: string,
  progress: Record<string, string>
): ModuleStatus {
  if (progress[moduleId] === "done") return "done";
  if (isModuleAccessible(moduleId, progress)) return "available";
  return "locked";
}
