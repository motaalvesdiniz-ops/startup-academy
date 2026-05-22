import * as fs from 'fs';
import * as path from 'path';
import { ragKnowledgeBase } from '../lib/rag';
import { curriculum } from '../lib/curriculum';
import { promptConfigs } from '../lib/prompts';

const outDir = path.join(__dirname, '../notebooklm_kit');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

// 1. Export RAG Base
let ragMd = '# Base de Conhecimento RAG - Startup Academy\n\n';
for (const [id, text] of Object.entries(ragKnowledgeBase)) {
  ragMd += `## Módulo ${id}\n\n${text}\n\n---\n\n`;
}
fs.writeFileSync(path.join(outDir, '01_RAG_Source.md'), ragMd);

// 2. Export Master Prompt
const masterPrompt = `Você é um instrutor de startups sênior da 'Startup Academy'. Você atuará como um gerador de conteúdo de curso sob demanda.

**CRÍTICO: Você DEVE basear todo o seu conteúdo e teoria no documento Fonte (01_RAG_Source.md).** Não invente metodologias ou frameworks que não estejam descritos lá para o respectivo módulo.

Sua função é gerar as abas de conteúdo baseado na minha solicitação. Eu enviarei o número do módulo e o comando da aba desejada na mesma frase (ex: "módulo 6.4 e 1" ou "Módulo 7.1 e 3").

Abaixo estão as diretrizes de sistema que você deve seguir fielmente para cada comando numérico (1, 2, 3 ou 4):

**Comando 1 (Teoria):**
${promptConfigs['teoria'].system}

**Comando 2 (Prática):**
${promptConfigs['pratica'].system}

**Comando 3 (Quiz):**
${promptConfigs['quiz'].system}
(NOTA IMPORTANTE PARA O QUIZ: O formato DEVE ser **exclusivamente** um array JSON válido, ex: [{"q": "...", "opts": ["A","B","C","D"], "correct": 0, "exp": "..."}])

**Comando 4 (Projeto):**
${promptConfigs['projeto'].system}

Ao receber a minha mensagem com o módulo e o comando (ex: "módulo 6.4 e 1"), busque a referência na Fonte e apenas gere a resposta final formatada em Markdown, correspondente à aba solicitada.
`;
fs.writeFileSync(path.join(outDir, '00_PROMPT_MESTRE.md'), masterPrompt);

// 3. Export Remaining Modules List
let remaining = '# Módulos Restantes (A partir do 6.4)\n\nCopie a linha abaixo e envie para o NotebookLM para gerar o conteúdo de cada aba:\n\n';
let foundBreak = false;
for (const phase of curriculum) {
  for (const mod of phase.modules) {
    if (mod.id === '6.4') foundBreak = true;
    if (foundBreak) {
      remaining += `### ${mod.id} - ${mod.title}\n`;
      remaining += `módulo ${mod.id} e 1\n`;
      remaining += `módulo ${mod.id} e 2\n`;
      remaining += `módulo ${mod.id} e 3\n`;
      remaining += `módulo ${mod.id} e 4\n\n`;
    }
  }
}
fs.writeFileSync(path.join(outDir, '02_Modulos_Restantes.txt'), remaining);

console.log('Arquivos do NotebookLM gerados com sucesso!');
