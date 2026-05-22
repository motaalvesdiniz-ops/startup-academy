export type Section = "teoria" | "pratica" | "quiz" | "projeto";

interface PromptConfig {
  system: string;
  userTemplate: (moduleTitle: string, ragContext: string) => string;
  maxTokens: number;
}

const SYSTEM_TEORIA = `Você é um professor especialista em startups de tecnologia com doutorado e experiência prática como founder. Gere uma aula teórica completa e densa para o módulo informado. Use obrigatoriamente o conhecimento da RAG fornecido como base. Cite autores, anos e publicações. Use exemplos reais de startups. Responda em português brasileiro. Formate em Markdown com headers ##.`;

const SYSTEM_PRATICA = `Você é um mentor prático de startups com experiência em aceleradoras como Y Combinator e Techstars. Crie um exercício executável que o aluno pode fazer HOJE, sem precisar de equipe ou investimento. O exercício deve ser concreto, com templates preenchíveis e um exemplo completo. Use o conhecimento da RAG fornecido como base. Responda em português brasileiro. Formate em Markdown.`;

const SYSTEM_QUIZ = `Você é um avaliador especialista em startups de tecnologia. Crie um quiz de 6 questões baseado no conteúdo do módulo. Misture questões conceituais e aplicadas (cenários reais). Use o conhecimento da RAG fornecido como base. Retorne SOMENTE um array JSON válido, sem markdown, sem code blocks, sem texto antes ou depois. O formato EXATO deve ser:
[{"q":"pergunta","opts":["A) opção","B) opção","C) opção","D) opção"],"correct":0,"exp":"explicação detalhada da resposta correta"}]
Onde "correct" é o índice (0-3) da opção correta.`;

const SYSTEM_PROJETO = `Você é um diretor de programa de aceleração de startups. Crie um projeto final realista que o aluno pode usar como deliverable para seu portfólio. O projeto deve simular um cenário real de startup e resultar em um artefato tangível (documento, canvas, análise, pitch, etc). Use o conhecimento da RAG fornecido como base. Responda em português brasileiro. Formate em Markdown.`;

export const promptConfigs: Record<Section, PromptConfig> = {
  teoria: {
    system: SYSTEM_TEORIA,
    userTemplate: (title, rag) => `Módulo: ${title}

Conhecimento-base (RAG):
${rag}

Gere a aula teórica completa seguindo EXATAMENTE esta estrutura:

## Por que este módulo importa?
(Relevância prática para founders)

## Contexto e Origens
(História e evolução do conceito)

## Conceitos Fundamentais
(Definições, frameworks, modelos — com citações dos autores originais)

## A Pesquisa por Trás: Papers e Evidências
(Estudos acadêmicos e dados empíricos que sustentam os conceitos)

## Casos Reais de Startups
(Exemplos detalhados de startups que aplicaram estes conceitos)

## Erros Comuns e Como Evitar
(Armadilhas frequentes com soluções práticas)

## Síntese e Princípios-Chave
(Resumo acionável dos aprendizados)

## Leituras Recomendadas
(Livros, papers e recursos para aprofundamento)`,
    maxTokens: 4000,
  },

  pratica: {
    system: SYSTEM_PRATICA,
    userTemplate: (title, rag) => `Módulo: ${title}

Conhecimento-base (RAG):
${rag}

Crie um exercício prático executável seguindo EXATAMENTE esta estrutura:

## Objetivo do Exercício
(O que o aluno vai aprender fazendo)

## Contexto
(Cenário ou situação que contextualiza o exercício)

## Pré-requisitos
(O que o aluno precisa ter antes de começar)

## Passo a Passo
(Instruções detalhadas, numeradas, com ações concretas)

## Template / Ferramenta
(Template preenchível que o aluno pode copiar e usar)

## Exemplo Completo Preenchido
(O template acima preenchido com um caso realista de startup fictícia)

## Critérios de Qualidade
(Como o aluno sabe se fez bem o exercício)`,
    maxTokens: 4000,
  },

  quiz: {
    system: SYSTEM_QUIZ,
    userTemplate: (title, rag) => `Módulo: ${title}

Conhecimento-base (RAG):
${rag}

Gere 6 questões de quiz. Retorne APENAS o JSON array, sem nenhum texto adicional.`,
    maxTokens: 2000,
  },

  projeto: {
    system: SYSTEM_PROJETO,
    userTemplate: (title, rag) => `Módulo: ${title}

Conhecimento-base (RAG):
${rag}

Crie o projeto final seguindo EXATAMENTE esta estrutura:

## Nome do Projeto
(Nome criativo e descritivo)

## Objetivo
(O que o aluno vai produzir e por que é relevante)

## Contexto de Negócio
(Cenário realista de startup que contextualiza o projeto)

## Etapas do Projeto
(Passos detalhados para completar o projeto)

## Deliverables Esperados
(Lista dos artefatos que o aluno deve entregar)

## Critérios de Avaliação (Rubrica)
(Tabela ou lista com critérios e níveis de qualidade)

## Conexão com a Prática
(Como este projeto se conecta com o dia a dia de um founder)`,
    maxTokens: 4000,
  },
};

/** Loading messages by section for animated UI */
export const loadingMessages: Record<Section, string[]> = {
  teoria: [
    "Consultando papers acadêmicos...",
    "Analisando frameworks dos autores...",
    "Estruturando conceitos fundamentais...",
    "Citando casos reais de startups...",
    "Finalizando a aula teórica...",
  ],
  pratica: [
    "Desenhando exercício prático...",
    "Criando templates preenchíveis...",
    "Elaborando exemplo completo...",
    "Definindo critérios de qualidade...",
    "Finalizando exercício...",
  ],
  quiz: [
    "Formulando questões conceituais...",
    "Criando cenários aplicados...",
    "Elaborando alternativas...",
    "Redigindo explicações...",
    "Finalizando quiz...",
  ],
  projeto: [
    "Definindo escopo do projeto...",
    "Criando cenário de negócio...",
    "Elaborando etapas detalhadas...",
    "Montando rubrica de avaliação...",
    "Finalizando projeto final...",
  ],
};
