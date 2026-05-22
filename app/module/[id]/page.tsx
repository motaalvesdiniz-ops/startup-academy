import ModuleView from "@/components/ModuleView";
import { findModule } from "@/lib/curriculum";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const found = findModule(id);

  if (!found) {
    return {
      title: "Módulo não encontrado — Startup Academy",
    };
  }

  return {
    title: `${found.module.id} ${found.module.title} — Startup Academy`,
    description: `Aprenda sobre ${found.module.title} na Fase ${found.phase.id}: ${found.phase.title}. Conteúdo gerado por IA com base em conhecimento real de especialistas em startups.`,
  };
}

export default async function ModulePage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#07101C]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ModuleView moduleId={id} />
      </div>
    </main>
  );
}
