import * as fs from 'fs';
import * as path from 'path';
import { curriculum } from '../lib/curriculum';
import { ragKnowledgeBase } from '../lib/rag';

const targetPhaseIds = [7, 8, 9, 10];
let content = '# Descrição dos Módulos (Fase 7 a 10)\n\n';

for (const phase of curriculum) {
  if (targetPhaseIds.includes(phase.id)) {
    content += `## Fase ${phase.id}: ${phase.title}\n\n`;
    for (const mod of phase.modules) {
      content += `### Módulo ${mod.id}: ${mod.title}\n\n`;
      const ragText = ragKnowledgeBase[mod.id] || "Conteúdo não disponível.";
      
      content += `**Contexto / Resumo (Extraído da RAG):**\n`;
      content += ragText + `\n\n---\n\n`;
    }
  }
}

fs.writeFileSync(path.join(__dirname, '../notebooklm_kit/Modulos_7_ao_10_Descricao.md'), content);
console.log('Arquivo gerado: notebooklm_kit/Modulos_7_ao_10_Descricao.md');
