import { Anthropic } from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { generateNarrativeContent, detectCarouselType, getDesignColors } from '@/lib/davi-narrative';

const client = new Anthropic();

interface GenerateRequest {
  idea: string;
  prompt: string;
  totalCards: number;
  docIds?: string[];
  // User context
  expertise?: string;
  yearsExperience?: number;
  mainAchievement?: string;
  productName?: string;
  targetAudience?: string;
  toneOfVoice?: string;
  objective?: string;
}

export async function POST(req: NextRequest) {
  try {
    const {
      idea,
      prompt,
      totalCards,
      docIds,
      expertise,
      yearsExperience,
      mainAchievement,
      productName,
      targetAudience,
      toneOfVoice,
      objective,
    } = (await req.json()) as GenerateRequest;

    // Detectar tipo de carrossel baseado na ideia
    const carouselType = detectCarouselType(idea);
    const colors = getDesignColors(carouselType);

    // Mock response quando API_KEY não está configurada
    if (!process.env.ANTHROPIC_API_KEY) {
      const mockCards = Array.from({ length: totalCards }, (_, i) => {
        const narrative = generateNarrativeContent(idea, carouselType, i, totalCards);
        return {
          headline: narrative.headline,
          text: narrative.text,
          cta: narrative.cta,
          colors: {
            bg: colors.bg,
            text: colors.text,
            accent: colors.accent,
          },
        };
      });
      return NextResponse.json({ cards: mockCards });
    }

    // Sistema prompt com narrativa Davi + Contexto do usuário
    const userContext = `
CONTEXTO DO USUÁRIO:
- Expertise: ${expertise || 'não especificada'}
- Experiência: ${yearsExperience || 0} anos
- Conquista principal: ${mainAchievement || 'não especificada'}
- Produto/Serviço: ${productName || 'não especificado'}
- Público-alvo: ${targetAudience || 'não especificado'}
- Tom de voz: ${toneOfVoice || 'inspirador'}
- Objetivo: ${objective || 'leads'}
`.trim();

    let systemPrompt = `Você é um especialista em criar carrosséis para Instagram com narrativa transformacional de alta conversão.

FILOSOFIA: Transformação pessoal através de ação e conhecimento.

TIPO DE CARROSSEL DETECTADO: ${carouselType.toUpperCase()}

${userContext}

PRINCÍPIOS:
1. Minimalismo Funcional - Clean, sem decoração desnecessária
2. Acessibilidade 100% - Alto contraste, fonts legíveis
3. Narrativa Clara - Foco em mensagem, não em design
4. Transformação como Promessa - Mostrar jornada clara
5. Autoridade + Ação - Combinar expertise com call-to-action
6. PERSONALIZAÇÃO - Usar expertise, produto e público-alvo do usuário
7. CONVERSÃO - Otimizar para ${objective}

ESTRUTURA DO CARROSSEL:
- Card 1: HOOK impactante que prende atenção
- Cards 2-${totalCards - 1}: Desenvolvimento com narrativa fluida, mostrando expertise
- Card Final: CTA forte com próximo passo claro para ${objective}

RESTRIÇÕES:
- Headline: máximo 50 caracteres
- Texto: máximo 300 caracteres (desenvolvimento completo, 3-4 frases)
- CTA: máximo 50 caracteres
- Tom: ${toneOfVoice || 'inspirador'}, direto, sem clichês
- Foco: Resolver o problema do público: ${targetAudience || 'alvo geral'}

Gere ${totalCards} cards com copywriting de ALTA CONVERSÃO, PERSONALIZADO para este usuário.`;

    const userPrompt = `Ideia/Conceito: "${idea}"
${prompt ? `Direcionamento adicional: "${prompt}"` : ''}

Retorne APENAS um JSON válido (sem markdown ou explicações):
{
  "cards": [
    { "headline": "...", "text": "...", "cta": "..." }
  ]
}`;

    const messages: any[] = [
      {
        role: 'user',
        content: userPrompt,
      },
    ];

    // Adicionar documentos se fornecidos
    if (docIds && docIds.length > 0) {
      messages[0] = {
        role: 'user',
        content: [
          { type: 'text', text: userPrompt },
          { type: 'text', text: '\n\nUse as informações dos documentos carregados para personalizar o carrossel:' },
        ],
      };

      for (const docId of docIds) {
        (messages[0].content as any[]).push({
          type: 'document',
          source: {
            type: 'file',
            file_id: docId,
          },
        });
      }
    }

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: messages,
      system: systemPrompt,
    } as any);

    if (!response.content || response.content.length === 0) {
      throw new Error('Empty response from Claude API');
    }

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Invalid response type from Claude');

    const jsonText = content.text.replace(/```json\n?|\n?```/g, '').trim();
    const data = JSON.parse(jsonText);

    // Enriquecer cards com cores e metadados
    const enrichedCards = data.cards.map((card: any, idx: number) => ({
      ...card,
      colors: {
        bg: colors.bg,
        text: colors.text,
        accent: colors.accent,
      },
      carouselType,
      cardIndex: idx,
      totalCards,
    }));

    return NextResponse.json({ cards: enrichedCards });
  } catch (error) {
    console.error('Generate error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate carousel';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
