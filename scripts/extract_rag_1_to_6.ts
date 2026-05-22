import * as fs from 'fs';
import * as path from 'path';

const BASE_DIR = path.join(__dirname, '../Base');
const ESSAYS_DIR = path.join(BASE_DIR, 'Paul Graham/graham-essays/essays');

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

function extractRelevant(filePath: string, keywords: string[], charsPerHit = 2500, maxHits = 5): string {
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

interface ModuleSpec {
  id: string;
  title: string;
  sources: { file: string; keywords: string[]; }[];
}

const MODULES_1_TO_6: ModuleSpec[] = [
  { id: '1.1', title: 'O que é uma startup de tecnologia', sources: [{ file: BOOKS.leanStartup, keywords: ['startup', 'definition', 'uncertainty'] }, { file: PG_ESSAYS.howToStartStartup, keywords: ['startup', 'technology'] }, { file: BOOKS.zeroToOne, keywords: ['technology', 'startup'] }] },
  { id: '1.2', title: 'Mentalidade empreendedora e First Principles', sources: [{ file: BOOKS.zeroToOne, keywords: ['first principles', 'contrarian', 'mindset'] }, { file: PG_ESSAYS.beforeStartup, keywords: ['founder', 'mindset'] }] },
  { id: '1.3', title: 'Ecossistema: VCs, aceleradoras e atores', sources: [{ file: BOOKS.ventureCapital, keywords: ['ecosystem', 'angel', 'accelerator', 'VC'] }, { file: PG_ESSAYS.howFundStartup, keywords: ['investor', 'angel', 'ecosystem'] }] },
  { id: '2.1', title: 'Customer Discovery — Steve Blank', sources: [{ file: BOOKS.fourSteps, keywords: ['customer discovery', 'steve blank', 'customer development'] }] },
  { id: '2.2', title: 'Jobs to Be Done — Clayton Christensen', sources: [{ file: BOOKS.dokumen2, keywords: ['jobs to be done', 'christensen', 'hire', 'milkshake'] }, { file: BOOKS.sprint, keywords: ['jobs to be done', 'interview'] }, { file: BOOKS.leanStartup, keywords: ['customer', 'job'] }] },
  { id: '2.3', title: 'The Mom Test — entrevistas sem viés', sources: [{ file: BOOKS.momTest, keywords: ['mom test', 'interview', 'bias', 'question', 'customer'] }] },
  { id: '2.4', title: 'Segmentação, priorização e Early Adopters', sources: [{ file: BOOKS.crossingChasm, keywords: ['early adopter', 'segment', 'target'] }, { file: BOOKS.leanStartup, keywords: ['early adopter', 'visionary'] }] },
  { id: '3.1', title: 'Lean Startup — Build-Measure-Learn', sources: [{ file: BOOKS.leanStartup, keywords: ['build-measure-learn', 'lean startup', 'validated learning'] }] },
  { id: '3.2', title: 'MVP — tipos, estratégias e armadilhas', sources: [{ file: BOOKS.leanStartup, keywords: ['minimum viable product', 'mvp', 'concierge', 'wizard of oz'] }, { file: PG_ESSAYS.doThingsDontScale, keywords: ['manual', 'mvp'] }] },
  { id: '3.3', title: 'Design Thinking aplicado a produtos', sources: [{ file: BOOKS.sprint, keywords: ['design', 'prototype', 'user test'] }, { file: BOOKS.businessModelGen, keywords: ['design thinking', 'ideation'] }] },
  { id: '3.4', title: 'Product Discovery e hipóteses de risco', sources: [{ file: BOOKS.fourSteps, keywords: ['discovery', 'risk'] }, { file: BOOKS.sprint, keywords: ['map', 'risk', 'hypothesis'] }] },
  { id: '4.1', title: 'Lean Canvas e Business Model Canvas', sources: [{ file: BOOKS.businessModelGen, keywords: ['canvas', 'business model', 'value proposition', 'customer segment'] }] },
  { id: '4.2', title: 'Modelos de monetização em tecnologia', sources: [{ file: BOOKS.businessModelGen, keywords: ['revenue stream', 'pricing', 'subscription', 'freemium'] }] },
  { id: '4.3', title: 'Unit Economics: LTV, CAC, Churn', sources: [{ file: BOOKS.leanAnalytics, keywords: ['LTV', 'CAC', 'churn', 'unit economics', 'metric'] }] },
  { id: '4.4', title: 'Estratégia de pricing', sources: [{ file: BOOKS.leanAnalytics, keywords: ['pricing', 'price', 'value'] }, { file: BOOKS.ventureCapital, keywords: ['pricing', 'revenue'] }] },
  { id: '5.1', title: 'Product-Market Fit — o que é e como medir', sources: [{ file: BOOKS.leanAnalytics, keywords: ['product-market fit', 'PMF', 'measure'] }, { file: PG_ESSAYS.startupGrowth, keywords: ['product-market fit', 'growth'] }] },
  { id: '5.2', title: 'AARRR Pirate Metrics e OMTM', sources: [{ file: BOOKS.leanAnalytics, keywords: ['AARRR', 'acquisition', 'activation', 'retention', 'revenue', 'referral', 'OMTM', 'one metric that matters'] }] },
  { id: '5.3', title: 'Retention como fundação do crescimento', sources: [{ file: BOOKS.hooked, keywords: ['retention', 'habit', 'hook'] }, { file: BOOKS.hackingGrowth, keywords: ['retention', 'cohort', 'churn'] }] },
  { id: '6.1', title: 'Estratégias de lançamento', sources: [{ file: BOOKS.fourSteps, keywords: ['launch', 'customer creation'] }, { file: PG_ESSAYS.doThingsDontScale, keywords: ['launch'] }] },
  { id: '6.2', title: 'Traction — 19 canais e Bullseye Framework', sources: [{ file: BOOKS.dokumen, keywords: ['traction', 'bullseye', 'channels'] }, { file: BOOKS.hackingGrowth, keywords: ['channel', 'acquisition'] }] },
  { id: '6.3', title: 'Growth Hacking e growth loops', sources: [{ file: BOOKS.hackingGrowth, keywords: ['growth hacking', 'loop', 'experiment', 'north star'] }] },
];

for (const mod of MODULES_1_TO_6) {
  console.log(`📚 Módulo ${mod.id}: ${mod.title}`);
  let ragContext = `# Contexto de Referência — Módulo ${mod.id}: ${mod.title}\n\n`;
  for (const src of mod.sources) {
    const excerpt = extractRelevant(src.file, src.keywords, 2500, 4);
    if (excerpt) {
      ragContext += `\n## Fonte: ${path.basename(src.file)}\n\n${excerpt}\n\n---\n\n`;
    }
  }
  const ragFile = path.join(__dirname, `../notebooklm_kit/rag_${mod.id.replace('.', '_')}.md`);
  fs.writeFileSync(ragFile, ragContext);
  console.log(`   ✅ RAG salvo: ${path.basename(ragFile)}`);
}
