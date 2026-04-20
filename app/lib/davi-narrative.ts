/**
 * Sistema de Narrativa para Carrosséis de Alta Conversão
 * Baseado em princípios de transformação e storytelling
 */

export type CarouselType = 'transformacao' | 'autoridade' | 'ideologico' | 'educacional' | 'vendas';

export interface NarrativeTemplate {
  type: CarouselType;
  name: string;
  description: string;
  structure: string[];
  hooks: string[];
  transitions: string[];
  ctas: string[];
  philosophy: string;
}

/**
 * Detecta o tipo de carrossel baseado na ideia
 */
export function detectCarouselType(idea: string): CarouselType {
  const lowerIdea = idea.toLowerCase();

  // Transformação: palavras-chave sobre mudança, jornada, resultado
  if (
    /mudar|transfor|mude|vira|ficou|consegui|alcançar|jornada|resultado|antes|depois|crescer|evoluir|melhora/i.test(
      lowerIdea
    )
  ) {
    return 'transformacao';
  }

  // Autoridade: palavras sobre expertise, conhecimento, experiência
  if (/aprendi|descobri|sistema|método|framework|estratégia|anos de|experiência|expert/i.test(lowerIdea)) {
    return 'autoridade';
  }

  // Ideológico: palavras sobre filosofia, valores, mindset
  if (/acredito|verdade|mindset|filosofia|princípio|valor|essência|autenticidade/i.test(lowerIdea)) {
    return 'ideologico';
  }

  // Educacional: palavras sobre aprender, entender, conceitos
  if (/aprenda|entenda|conceito|como|técnica|passo|guia|tutorial|saiba/i.test(lowerIdea)) {
    return 'educacional';
  }

  // Vendas: palavras sobre problema, solução, investimento
  if (/problema|solução|preço|investir|oferta|limitado|agora|rápido/i.test(lowerIdea)) {
    return 'vendas';
  }

  // Default
  return 'transformacao';
}

/**
 * Templates Narrativos de Davi
 */
const narrativeTemplates: Record<CarouselType, NarrativeTemplate> = {
  transformacao: {
    type: 'transformacao',
    name: 'Carrossel de Transformação',
    description: 'Conta uma jornada de mudança pessoal/profissional',
    structure: ['Hook Impactante', 'O Problema', 'A Realização', 'A Solução', 'O Resultado', 'A Promessa', 'CTA'],
    hooks: [
      'Você está fazendo TUDO ERRADO.',
      'Ninguém te contou ISSO sobre {{topic}}.',
      'A maioria nunca descobrir esse segredo.',
      'Eu desperdicei {{time}} antes de entender isso.',
      'Este foi o erro que mais me custou caro.',
      'Isso vai mudar sua forma de pensar.',
    ],
    transitions: [
      'O problema é que...',
      'Aqui está a verdade que ninguém fala:',
      'Tudo mudou quando eu entendi que...',
      'O segredo estava em:',
      'E foi assim que eu descobri:',
      'A transformação começou quando:',
    ],
    ctas: [
      'Salva esse carrossel',
      'Compartilha com quem precisa',
      'Marca quem deveria ver isso',
      'Guarda essa lição',
      'Comenta: SIM se foi útil',
      'Comece agora',
    ],
    philosophy: 'Mostrar que transformação é possível através de ações concretas',
  },

  autoridade: {
    type: 'autoridade',
    name: 'Carrossel de Autoridade',
    description: 'Demonstra expertise e credibilidade',
    structure: [
      'Quem Eu Sou',
      'Minha Experiência',
      'O Que Aprendi',
      'Lição Chave',
      'Aplicação Prática',
      'Resultado Comprovado',
      'CTA',
    ],
    hooks: [
      'Em {{years}} de {{expertise}}, descobri isso:',
      '{{exp_count}} pessoas já testaram e confirmaram:',
      'Os melhores fazem dessa forma:',
      'Isso é o que separar os bons dos excelentes:',
      'Só descobrir isso depois de muito investimento:',
    ],
    transitions: [
      'O padrão que observei foi:',
      'Os que tiveram resultado fazem assim:',
      'Deixa eu te explicar por que funciona:',
      'A ciência por trás disso é:',
      'Quando entendi o sistema, tudo mudou:',
    ],
    ctas: [
      'Qual sua experiência nisso?',
      'Você já testou?',
      'Deixa um comentário com sua historia',
      'Compartilha com sua rede',
      'Me marca quando aplicar',
    ],
    philosophy: 'Construir credibilidade através de conhecimento real e experiência',
  },

  ideologico: {
    type: 'ideologico',
    name: 'Carrossel Ideológico',
    description: 'Defende uma visão de mundo ou manifesto',
    structure: [
      'O Manifesto',
      'Por que acredito',
      'A Realidade Atual',
      'O Problema Maior',
      'O Futuro Que Quero',
      'Como Podemos Começar',
      'CTA',
    ],
    hooks: [
      'VERDADE: {{truth}}',
      'A maioria está errada sobre isso.',
      'Precisamos falar sobre isso:',
      'Se você acredita em {{value}}, leia:',
      'O futuro pertence a quem entende isso:',
    ],
    transitions: [
      'Porque acredito que:',
      'A realidade que ninguém vê é:',
      'E isso significa que:',
      'Logo, precisamos de:',
      'E começa quando:',
    ],
    ctas: [
      'Você concorda?',
      'Marca alguém que precisa ouvir isso',
      'Compartilha se acredita também',
      'Deixa um comentário com sua visão',
      'Faça parte dessa movimento',
    ],
    philosophy: 'Inspirar através de uma visão diferente do mundo',
  },

  educacional: {
    type: 'educacional',
    name: 'Carrossel Educacional',
    description: 'Ensina um conceito, técnica ou habilidade',
    structure: [
      'O Conceito',
      'Por que Importa',
      'Os 3 Pilares',
      'Exemplo Prático',
      'Erro Comum',
      'Como Aplicar',
      'CTA',
    ],
    hooks: [
      'Se você quer aprender {{skill}}, estude:',
      'Os melhores sabem dessas {{quantity}} técnicas:',
      'Este é o framework que {{result}}:',
      'Raramente alguém ensina {{concept}} corretamente:',
    ],
    transitions: [
      'Deixa eu explicar como funciona:',
      'O passo 1 é entender:',
      'Em seguida, você precisa:',
      'E finalmente:',
      'O resultado será:',
    ],
    ctas: [
      'Salva para estudar depois',
      'Aplica esse sistema',
      'Tira sua dúvida nos comentários',
      'Marca quem deveria aprender isso',
      'Compartilha e aprenda junto',
    ],
    philosophy: 'Democratizar conhecimento de valor através de educação clara',
  },

  vendas: {
    type: 'vendas',
    name: 'Carrossel de Vendas',
    description: 'Convida para uma ação (compra, inscrição, etc)',
    structure: [
      'Apresentação do Problema',
      'Dor Específica',
      'Por que Falhou Antes',
      'A Solução Exata',
      'Prova de Resultado',
      'Oferta + Limitação',
      'CTA Urgente',
    ],
    hooks: [
      'Se você sofre com {{problem}}, essa é pra você.',
      'Identifiquei 3 razões por que você ainda não {{result}}:',
      'A maioria tenta errado. O jeito certo é:',
      'Apenas {{days}} para você {{action}}:',
    ],
    transitions: [
      'O problema é que:',
      'E isso te custa:',
      'Mas existe um caminho:',
      'Eis exatamente como funciona:',
      'E aqui está a oportunidade:',
    ],
    ctas: [
      'Link na bio',
      'Vagas limitadas',
      'Aproveita que ainda tem',
      'Quero dentro',
      'Já começar agora',
    ],
    philosophy: 'Oferecer solução real para um problema real identificado',
  },
};

/**
 * Gera conteúdo narrativo para um card específico
 */
export function generateNarrativeContent(
  idea: string,
  carouselType: CarouselType = detectCarouselType(idea),
  cardIndex: number,
  totalCards: number
): { headline: string; text: string; cta: string } {
  const template = narrativeTemplates[carouselType];
  const progressRatio = totalCards > 1 ? cardIndex / (totalCards - 1) : 0;

  let headline = '';
  let text = '';
  let cta = '';

  // Card 1: Hook
  if (cardIndex === 0) {
    headline = template.hooks[Math.floor(Math.random() * template.hooks.length)].replace('{{topic}}', idea);
    text = template.philosophy;
    cta = 'Continua →';
  }
  // Último card: CTA
  else if (cardIndex === totalCards - 1) {
    headline = 'Próximo passo';
    text = 'Você tem o poder de mudar. Comece agora.';
    cta = template.ctas[Math.floor(Math.random() * template.ctas.length)];
  }
  // Cards do meio - Gerar conteúdo REAL baseado na ideia
  else {
    const middlePhase = Math.floor(progressRatio * template.transitions.length);
    text = template.transitions[middlePhase] || template.transitions[0];

    // Gerar headline real baseado na ideia e fase
    const phases = [
      generatePhaseContent(idea, 'beginning'),
      generatePhaseContent(idea, 'problem'),
      generatePhaseContent(idea, 'solution'),
      generatePhaseContent(idea, 'benefit'),
      generatePhaseContent(idea, 'urgency'),
    ];

    const phaseIndex = Math.min(cardIndex - 1, phases.length - 1);
    headline = phases[phaseIndex];
    cta = 'Próximo →';
  }

  return {
    headline: headline.substring(0, 50), // Limit to max 50 chars
    text: text.substring(0, 300), // Limit to max 300 chars
    cta: cta.substring(0, 50), // Limit to max 50 chars
  };
}

/**
 * Gera conteúdo real para cada fase
 */
function generatePhaseContent(idea: string, phase: string): string {
  const phasePrompts: Record<string, string[]> = {
    beginning: [
      `A verdade sobre ${idea}`,
      `Você sabia que ${idea}?`,
      `A maioria erra em ${idea}`,
      `O segredo do ${idea}`,
    ],
    problem: [
      `O problema real com ${idea}`,
      `Por que ${idea} é difícil`,
      `Você sofre com ${idea}?`,
      `A raiz do problema no ${idea}`,
    ],
    solution: [
      `Como resolver ${idea}`,
      `O jeito certo de ${idea}`,
      `A solução para ${idea}`,
      `O passo que faz diferença`,
    ],
    benefit: [
      `O resultado quando você ${idea}`,
      `Como isso muda sua vida`,
      `O poder de entender ${idea}`,
      `Transformação através do ${idea}`,
    ],
    urgency: [
      `Comece hoje com ${idea}`,
      `Seu futuro depende disso`,
      `Não espere mais`,
      `A hora é agora`,
    ],
  };

  const options = phasePrompts[phase] || phasePrompts.beginning;
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Get design colors based on carousel type (Davi's palette)
 */
export function getDesignColors(type: CarouselType): { bg: string; text: string; accent: string } {
  const colors: Record<CarouselType, { bg: string; text: string; accent: string }> = {
    transformacao: {
      bg: '#FFFFFF', // Branco
      text: '#0C1014', // Cinza escuro (Davi)
      accent: '#405DE6', // Instagram Blue
    },
    autoridade: {
      bg: '#0C1014', // Cinza escuro
      text: '#FFFFFF', // Branco
      accent: '#FFC040', // Gold accent
    },
    ideologico: {
      bg: '#FFFFFF',
      text: '#0C1014',
      accent: '#E1306C', // Instagram Pink
    },
    educacional: {
      bg: '#FFFFFF',
      text: '#0C1014',
      accent: '#5B51D8', // Purple
    },
    vendas: {
      bg: '#FF5722', // Deep Orange (urgency)
      text: '#FFFFFF',
      accent: '#FFD700', // Gold
    },
  };

  return colors[type];
}
