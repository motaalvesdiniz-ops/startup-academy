import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { promptConfigs, Section } from "@/lib/prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface GenerateRequest {
  moduleId: string;
  moduleTitle: string;
  section: Section;
  ragContext: string;
  previousContent?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { moduleTitle, section, ragContext } = body;

    if (!moduleTitle || !section || !ragContext) {
      return NextResponse.json(
        { error: "Campos obrigatórios: moduleTitle, section, ragContext" },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        {
          error:
            "ANTHROPIC_API_KEY não configurada. Adicione em .env.local",
        },
        { status: 500 }
      );
    }

    const config = promptConfigs[section];
    if (!config) {
      return NextResponse.json(
        { error: `Seção inválida: ${section}` },
        { status: 400 }
      );
    }

    const userMessage = config.userTemplate(moduleTitle, ragContext);

    const messages: any[] = [{ role: "user", content: userMessage }];
    if (body.previousContent) {
      messages.push({ role: "assistant", content: body.previousContent });
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: config.maxTokens,
      system: config.system,
      messages: messages,
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const content = textBlock ? textBlock.text : "";
    const isIncomplete = response.stop_reason === "max_tokens";

    // For quiz, try to parse the JSON
    if (section === "quiz" && !isIncomplete) {
      try {
        // Strip potential markdown code block wrappers
        let jsonStr = content.trim();
        if (jsonStr.startsWith("```")) {
          jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
        }
        const parsed = JSON.parse(jsonStr);
        return NextResponse.json({ content: parsed, isIncomplete: false });
      } catch {
        // If JSON parsing fails, return the raw content and let the client handle it
        return NextResponse.json({ content, parseError: true, isIncomplete: false });
      }
    }

    return NextResponse.json({ content, isIncomplete });
  } catch (error: unknown) {
    console.error("Generation error:", error);

    const message =
      error instanceof Error ? error.message : "Erro desconhecido na geração";

    return NextResponse.json(
      { error: `Erro ao gerar conteúdo: ${message}` },
      { status: 500 }
    );
  }
}
