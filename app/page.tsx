import CurriculumMap from "@/components/CurriculumMap";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Startup Academy — Trilha de Aprendizado",
  description:
    "Domine os fundamentos de startups de tecnologia com 35 módulos gerados por IA, baseados em conhecimento real de autores consagrados como Steve Blank, Eric Ries, Clayton Christensen e Peter Thiel.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07101C]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <CurriculumMap />
      </div>
    </main>
  );
}
