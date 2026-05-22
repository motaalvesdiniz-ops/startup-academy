import { findModule } from "@/lib/curriculum";
import type { Metadata } from "next";
import ApostilaView from "@/components/ApostilaView";

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
    title: `Apostila: ${found.module.id} ${found.module.title} — Startup Academy`,
  };
}

export default async function ApostilaPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#e5e7eb]">
      <ApostilaView moduleId={id} />
    </main>
  );
}
