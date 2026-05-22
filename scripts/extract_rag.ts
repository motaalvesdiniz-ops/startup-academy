/**
 * Script para gerar conteúdo dos módulos 6.4-10.3 usando os livros da pasta Base como RAG real.
 * Cada módulo tem mapeamento de quais livros são relevantes e quais trechos extrair.
 */

import * as fs from 'fs';
import * as path from 'path';

const BASE_DIR = path.join(__dirname, '../Base');
const OUTPUT_FILE = path.join(__dirname, '../public/generated_content.json');
const ESSAYS_DIR = path.join(BASE_DIR, 'Paul Graham/graham-essays/essays');

// Mapa de arquivos por apelido
const BOOKS: Record<string, string> = {
  leanStartup: path.join(BASE_DIR, 'The Lean Startup - Erick Ries.md'),
  momTest: path.join(BASE_DIR, 'The-Mom-Test-by-@robfitz.md'),
  zeroToOne: path.join(BASE_DIR, '01-11-2020-203418Zero to One.md'),
  hooked: path.join(BASE_DIR, 'Hooked-How-to-Build-Habit-Forming-Products-_Nir-Eyal_.md'),
  fourSteps: path.join(BASE_DIR, '14.The Four Steps to the Epiphany (Steve Blank) 2013.md'),
  crossingChasm: path.join(BASE_DIR, 'Crossing the Chasm 3rd Edition.md'),
  leanAnalytics: path.join(BASE_DIR, '_OceanofPDF.com_Lean_Analytics_-_Alistair_Croll_Benjamin_Yoskovitz.md'),
  foundersDilemmas: path.join(BASE_DIR, 'the-founders-dilemmas-anticipating-and-avoiding-the-pitfalls-that-can-sink-a-startup-9781400841936_compress.md'),
  hackingGrowth: path.join(BASE_DIR, 'toaz.info-hacking-growthpdf-pdf-free-pr_2ad9f2e6204b8c9e8b0539354ce119e7.md'),
  hardThings: path.join(BASE_DIR, 'toaz.info-the-hard-thing-about-hard-things-pr_358adf1fa3b6e1944a27738c08383e04.md'),
  receitaPrevisivel: path.join(BASE_DIR, 'feismo.com-receita-previsivel-pr_1067493d6a851b8244e460ccc8b29808.md'),
  businessModelGen: path.join(BASE_DIR, 'Business-model-generation-_-a-handbook-for-visionaries-game-changers-and-challengers-PDFDrive-1.md'),
  ventureCapital: path.join(BASE_DIR, 'venture-capital-strategy-how-to-think-like-a-venture-capitalist-1089935226-9781089935223_compress.md'),
  sprint: path.join(BASE_DIR, 'Sprint-HowtoSolveBigProblemsandTestJakeKnapp.md'),
  dokumen: path.join(BASE_DIR, 'dokumen.md'),
  dokumen2: path.join(BASE_DIR, 'dokumen 2 .md'),
};

const PG_ESSAYS: Record<string, string> = {
  doThingsDontScale: path.join(ESSAYS_DIR, '153_do_things_that_dont_scale.md'),
  howToRaiseMoney: path.join(ESSAYS_DIR, '156_how_to_raise_money.md'),
  startupGrowth: path.join(ESSAYS_DIR, '149_startup__growth.md'),
  defaultAlive: path.join(ESSAYS_DIR, '169_default_alive_or_default_dead.md'),
  howToStartStartup: path.join(ESSAYS_DIR, '039_how_to_start_a_startup.md'),
  beforeStartup: path.join(ESSAYS_DIR, '157_before_the_startup.md'),
  howGetStartupIdeas: path.join(ESSAYS_DIR, '151_how_to_get_startup_ideas.md'),
  howFundStartup: path.join(ESSAYS_DIR, '053_how_to_fund_a_startup.md'),
  frighteninglyAmbitious: path.join(ESSAYS_DIR, '143_frighteningly_ambitious_startup_ideas.md'),
  founderControl: path.join(ESSAYS_DIR, '136_founder_control.md'),
  equityEquation: path.join(ESSAYS_DIR, '078_the_equity_equation.md'),
  howConvinceInvestors: path.join(ESSAYS_DIR, '154_how_to_convince_investors.md'),
  howPresentInvestors: path.join(ESSAYS_DIR, '067_how_to_present_to_investors.md'),
  founderMode: path.join(ESSAYS_DIR, '224_founder_mode.md'),
  howNotToDie: path.join(ESSAYS_DIR, '081_how_not_to_die.md'),
};

/** Lê um arquivo e retorna os primeiros N caracteres */
function readChunk(filePath: string, maxChars = 30000): string {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.substring(0, maxChars);
  } catch {
    return '';
  }
}

/** Busca trechos relevantes por palavras-chave em um arquivo grande */
function extractRelevant(filePath: string, keywords: string[], charsPerHit = 2000, maxHits = 5): string {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const results: string[] = [];
    const lowerContent = content.toLowerCase();
    
    for (const kw of keywords) {
      let pos = 0;
      let hits = 0;
      while (hits < 2) {
        const idx = lowerContent.indexOf(kw.toLowerCase(), pos);
        if (idx === -1) break;
        const start = Math.max(0, idx - 200);
        const end = Math.min(content.length, idx + charsPerHit);
        results.push(content.substring(start, end));
        pos = end;
        hits++;
      }
      if (results.length >= maxHits * 2) break;
    }
    
    return results.slice(0, maxHits).join('\n\n---\n\n');
  } catch {
    return '';
  }
}

// Carregar JSON existente
const existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));

// Mapa de módulos que faltam, com suas fontes e palavras-chave
interface ModuleSpec {
  id: string;
  title: string;
  sources: { file: string; keywords: string[]; }[];
}

const MISSING_MODULES: ModuleSpec[] = [
  {
    id: '6.4',
    title: 'Sales para startups early-stage',
    sources: [
      { file: BOOKS.receitaPrevisivel, keywords: ['vendas', 'prospect', 'cold email', 'SDR', 'pipeline', 'outbound', 'inbound', 'revenue'] },
      { file: PG_ESSAYS.doThingsDontScale, keywords: ['sales', 'customer', 'recruit', 'manual'] },
      { file: BOOKS.fourSteps, keywords: ['customer validation', 'sales', 'earlyvangelists', 'sell'] },
    ]
  },
  {
    id: '7.1',
    title: 'Co-founders, equity e vesting',
    sources: [
      { file: BOOKS.foundersDilemmas, keywords: ['co-founder', 'equity', 'vesting', 'cliff', 'split', 'founder', 'agreement'] },
      { file: PG_ESSAYS.founderControl, keywords: ['control', 'founder', 'equity', 'dilution'] },
      { file: PG_ESSAYS.equityEquation, keywords: ['equity', 'founder', 'option'] },
    ]
  },
  {
    id: '7.2',
    title: 'Primeiras contratações e cultura',
    sources: [
      { file: BOOKS.hardThings, keywords: ['hiring', 'culture', 'employee', 'first', 'contrat'] },
      { file: PG_ESSAYS.howToStartStartup, keywords: ['hire', 'team', 'culture', 'people'] },
      { file: PG_ESSAYS.founderMode, keywords: ['management', 'people', 'founder mode'] },
    ]
  },
  {
    id: '7.3',
    title: 'Liderança em startups e OKRs',
    sources: [
      { file: BOOKS.hardThings, keywords: ['leadership', 'CEO', 'OKR', 'management', 'decision'] },
      { file: BOOKS.dokumen, keywords: ['OKR', 'objetivo', 'leadership', 'liderança', 'startup'] },
      { file: PG_ESSAYS.founderMode, keywords: ['founder mode', 'management', 'delegation'] },
    ]
  },
  {
    id: '8.1',
    title: 'Fundamentos de fundraising e tipos de investimento',
    sources: [
      { file: BOOKS.ventureCapital, keywords: ['venture capital', 'seed', 'angel', 'series', 'investment', 'fund'] },
      { file: PG_ESSAYS.howFundStartup, keywords: ['fund', 'investor', 'angel', 'seed', 'VC'] },
      { file: PG_ESSAYS.howToRaiseMoney, keywords: ['raise', 'investor', 'valuation', 'round', 'fund'] },
    ]
  },
  {
    id: '8.2',
    title: 'Pitch deck e narrativa de investimento',
    sources: [
      { file: PG_ESSAYS.howConvinceInvestors, keywords: ['convince', 'investor', 'pitch', 'narrative'] },
      { file: PG_ESSAYS.howPresentInvestors, keywords: ['present', 'pitch', 'slide', 'investor', 'demo'] },
      { file: BOOKS.ventureCapital, keywords: ['pitch', 'deck', 'narrative', 'story', 'slide'] },
    ]
  },
  {
    id: '8.3',
    title: 'Term sheets, dilution e cap table',
    sources: [
      { file: BOOKS.ventureCapital, keywords: ['term sheet', 'dilution', 'cap table', 'valuation', 'option pool', 'SAFE', 'convertible'] },
      { file: PG_ESSAYS.howFundStartup, keywords: ['term', 'valuation', 'dilution', 'equity', 'convertible'] },
      { file: BOOKS.foundersDilemmas, keywords: ['cap table', 'dilution', 'term sheet', 'preferred', 'liquidation'] },
    ]
  },
  {
    id: '9.1',
    title: 'Crossing the Chasm — cruzando o abismo',
    sources: [
      { file: BOOKS.crossingChasm, keywords: ['chasm', 'early adopter', 'mainstream', 'bowling alley', 'tornado', 'whole product'] },
    ]
  },
  {
    id: '9.2',
    title: 'Blitzscaling — quando e como escalar',
    sources: [
      { file: PG_ESSAYS.startupGrowth, keywords: ['growth', 'scale', 'rate', 'expand', 'blitz'] },
      { file: BOOKS.hackingGrowth, keywords: ['scale', 'growth team', 'experiment', 'channel', 'expand'] },
      { file: BOOKS.dokumen2, keywords: ['scale', 'blitzscaling', 'crescimento', 'hypergrowth'] },
    ]
  },
  {
    id: '9.3',
    title: 'Network effects e plataformas',
    sources: [
      { file: BOOKS.dokumen2, keywords: ['network effect', 'platform', 'marketplace', 'two-sided', 'viral'] },
      { file: PG_ESSAYS.frighteninglyAmbitious, keywords: ['platform', 'network', 'marketplace', 'monopoly'] },
      { file: BOOKS.zeroToOne, keywords: ['network', 'platform', 'monopoly', 'proprietary'] },
    ]
  },
  {
    id: '9.4',
    title: 'Internacionalização de startups',
    sources: [
      { file: BOOKS.crossingChasm, keywords: ['global', 'international', 'market', 'expansion', 'geographic'] },
      { file: BOOKS.dokumen, keywords: ['international', 'global', 'expansion', 'localization', 'país'] },
      { file: PG_ESSAYS.howToRaiseMoney, keywords: ['global', 'international', 'expand', 'market'] },
    ]
  },
  {
    id: '10.1',
    title: 'Zero to One — monopólios e segredos',
    sources: [
      { file: BOOKS.zeroToOne, keywords: ['monopoly', 'secret', 'competition', 'technology', 'proprietary', 'zero to one'] },
    ]
  },
  {
    id: '10.2',
    title: 'Estratégia competitiva e fossos (moats)',
    sources: [
      { file: BOOKS.zeroToOne, keywords: ['moat', 'competition', 'defensible', 'advantage', 'barrier'] },
      { file: PG_ESSAYS.frighteninglyAmbitious, keywords: ['competition', 'monopoly', 'defensible', 'advantage'] },
      { file: BOOKS.dokumen2, keywords: ['competitive advantage', 'moat', 'defensible', 'strategy'] },
    ]
  },
  {
    id: '10.3',
    title: 'M&A, exits e lifecycle venture-backed',
    sources: [
      { file: BOOKS.ventureCapital, keywords: ['exit', 'acquisition', 'IPO', 'M&A', 'liquidity', 'secondary'] },
      { file: BOOKS.foundersDilemmas, keywords: ['exit', 'acquisition', 'IPO', 'sell', 'founder'] },
      { file: PG_ESSAYS.howFundStartup, keywords: ['exit', 'acquisition', 'IPO', 'return'] },
    ]
  },
];

// Montar contexto RAG para cada módulo
for (const mod of MISSING_MODULES) {
  console.log(`\n📚 Preparando contexto RAG para módulo ${mod.id}: ${mod.title}`);
  
  let ragContext = `# Contexto de Referência — Módulo ${mod.id}: ${mod.title}\n\n`;
  
  for (const src of mod.sources) {
    const excerpt = extractRelevant(src.file, src.keywords, 2500, 4);
    if (excerpt) {
      const filename = path.basename(src.file);
      ragContext += `\n## Fonte: ${filename}\n\n${excerpt}\n\n---\n\n`;
    }
  }
  
  // Salvar contexto RAG em arquivo temporário (para inspeção)
  const ragFile = path.join(__dirname, `../notebooklm_kit/rag_${mod.id.replace('.', '_')}.md`);
  fs.writeFileSync(ragFile, ragContext);
  console.log(`   ✅ RAG salvo: ${path.basename(ragFile)} (${ragContext.length} chars)`);
}

console.log('\n✅ Contextos RAG gerados! Execute o próximo passo para gerar o conteúdo dos módulos.');
