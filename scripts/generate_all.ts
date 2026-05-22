import * as fs from "fs";
import * as path from "path";
import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, "../.env.local") });

// We need to use relative imports because we are running with ts-node directly
import { curriculum } from "../lib/curriculum";
import { ragKnowledgeBase } from "../lib/rag";
import { promptConfigs, Section } from "../lib/prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const OUTPUT_FILE = path.join(__dirname, "../public/generated_content.json");

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateSection(
  moduleId: string,
  moduleTitle: string,
  section: Section
): Promise<any> {
  const config = promptConfigs[section];
  const ragContext = ragKnowledgeBase[moduleId] || "Conteúdo não disponível";
  const userMessage = config.userTemplate(moduleTitle, ragContext);

  console.log(`⏳ Gerando [${moduleId}] - ${section}...`);

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: config.maxTokens,
      system: config.system,
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const content = textBlock ? textBlock.text : "";

    if (section === "quiz") {
      try {
        let jsonStr = content.trim();
        if (jsonStr.startsWith("```")) {
          jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
        }
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error(`⚠️ Erro ao parsear JSON do quiz [${moduleId}]:`, e);
        return { content, parseError: true };
      }
    }

    return content;
  } catch (error) {
    console.error(`❌ Erro ao gerar [${moduleId}] - ${section}:`, error);
    throw error;
  }
}

async function run() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ERRO: ANTHROPIC_API_KEY não encontrada no .env.local");
    process.exit(1);
  }

  // Load existing progress if any
  let cache: Record<string, any> = {};
  if (fs.existsSync(OUTPUT_FILE)) {
    cache = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8"));
    console.log(`✅ Carregado cache com ${Object.keys(cache).length} itens.`);
  }

  const sections: Section[] = ["teoria", "pratica", "quiz", "projeto"];
  let count = 0;

  for (const phase of curriculum) {
    for (const mod of phase.modules) {
      for (const section of sections) {
        const key = `${mod.id}_${section}`;
        
        if (cache[key]) {
          console.log(`⏭️ [${key}] já existe, pulando...`);
          continue;
        }

        try {
          const content = await generateSection(mod.id, mod.title, section);
          cache[key] = content;
          
          // Save incrementally
          fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cache, null, 2));
          console.log(`✅ [${key}] salvo com sucesso!`);
          
          count++;
          // Sleep to avoid rate limits (adjust based on tier)
          await sleep(2000); 
        } catch (e) {
          console.error(`🛑 Processo interrompido devido a erro.`);
          process.exit(1);
        }
      }
    }
  }

  console.log(`\n🎉 Geração concluída! ${count} novos itens gerados.`);
  console.log(`O arquivo foi salvo em: ${OUTPUT_FILE}`);
}

run();
