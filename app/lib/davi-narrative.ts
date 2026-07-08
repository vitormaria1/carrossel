/**
 * Sistema de Narrativa para Carrosséis de Alta Conversão
 * Baseado em princípios de transformação e storytelling
 */

export type CarouselType =
  | 'transformacao'
  | 'autoridade'
  | 'ideologico'
  | 'ideologico_detalhado'
  | 'educacional'
  | 'vendas';

export const IDEOLOGICO_DETALHADO_ICP = `
ICP:
- Idade: 28 a 42 anos
- Perfil: empresários, gestores, profissionais liberais e pessoas em cargos de responsabilidade
- Dores: ansiedade constante, sensação de atraso, dificuldade de desligar do trabalho, culpa por não aproveitar a família, insônia e autocobrança excessiva
- Objetivos: equilíbrio emocional, dormir melhor, reduzir ansiedade, melhorar relacionamentos e sentir mais controle da própria vida
- Objeções: falta de tempo, dúvida sobre terapia, percepção de custo e medo de dependência
`.trim();

export const IDEOLOGICO_DETALHADO_INSTRUCTIONS = `
Este formato recebe ideias de origem religiosa, espiritual ou de teor de fé, mas o carrossel final deve sair em linguagem não religiosa, universal e útil para qualquer leitor.

Regras:
- Extraia o princípio humano, emocional ou psicológico por trás do texto
- Não cite Deus, Bíblia, oração, igreja, fé, salvação, evangelho ou termos equivalentes no texto final, a menos que o usuário peça explicitamente o oposto
- Reescreva o conteúdo em linguagem laica, clara e aplicável à vida prática
- Nunca use antítese, contraste forçado ou estrutura do tipo "não X, mas Y"
- Não construa frases a partir de negação para depois afirmar o oposto
- As afirmações devem surgir de forma natural, direta e afirmativa
- Priorize temas como ansiedade, autocobrança, descanso, culpa, limite, presença, constância, equilíbrio e saúde emocional
- O resultado precisa soar acolhedor, inteligente e aplicável para empresários, gestores e profissionais sob pressão
- O texto final pode manter profundidade moral ou existencial, mas sem marcação religiosa explícita
- O objetivo principal é ajudar o leitor no campo psicológico e comportamental, sem pregação
`.trim();

const carouselTypeLabels: Record<CarouselType, string> = {
  transformacao: 'Transformação',
  autoridade: 'Autoridade',
  ideologico: 'Ideológico',
  ideologico_detalhado: 'Ideológico Detalhado',
  educacional: 'Educacional',
  vendas: 'Vendas',
};

const carouselTypeDescriptions: Record<CarouselType, string> = {
  transformacao: 'Jornada de mudança, problema, solução e resultado.',
  autoridade: 'Expertise, credibilidade e convite para ação.',
  ideologico: 'Manifesto, princípios e visão de mundo.',
  ideologico_detalhado:
    'Mesma base do ideológico, com mais contexto, exemplos práticos e aplicação concreta, convertendo temas religiosos em linguagem universal e psicológica.',
  educacional: 'Conceito, desenvolvimento, aplicação e resultado.',
  vendas: 'Problema, agonia, solução, prova e CTA.',
};

export function getCarouselTypeLabel(type: CarouselType): string {
  return carouselTypeLabels[type];
}

export function getCarouselTypeDescription(type: CarouselType): string {
  return carouselTypeDescriptions[type];
}

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

  // Ideológico detalhado: textos de origem religiosa que precisam ser traduzidos para linguagem universal
  if (/deus|jesus|bíblia|biblia|fé|fe|igreja|oração|oracao|crist[aã]o|espiritual|propósito|proposito|evangelho|salmo|versículo|versiculo/i.test(lowerIdea)) {
    return 'ideologico_detalhado';
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

  ideologico_detalhado: {
    type: 'ideologico_detalhado',
    name: 'Carrossel Ideológico Detalhado',
    description: 'Versão aprofundada do ideológico com contexto, exemplo e aplicação para temas de origem religiosa em linguagem universal',
    structure: [
      'Tese',
      'Contexto Real',
      'Princípio Central',
      'Exemplo Prático',
      'Aplicação',
      'Impacto',
      'CTA',
    ],
    hooks: [
      'Existe uma diferença entre concordar e aplicar.',
      'Uma visão forte pede contexto e detalhe.',
      'Princípios sem prática viram discurso.',
      'O detalhe muda a forma como você enxerga isso.',
      'Quando a ideia entra na rotina, tudo fica claro.',
    ],
    transitions: [
      'O contexto que quase ninguém explica é:',
      'Na prática, isso aparece quando:',
      'O detalhe que sustenta essa visão é:',
      'É aqui que a teoria encontra a realidade:',
      'Aplicar isso significa:',
    ],
    ctas: [
      'Salva para revisar depois',
      'Comenta qual princípio mais pesa',
      'Compartilha com quem pensa assim',
      'Leva isso para a prática',
      'Marca alguém que precisa ler',
    ],
    philosophy: 'Aprofundar uma visão de mundo traduzindo temas religiosos em linguagem útil, humana e universal',
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
    headline: headline.trim().slice(0, 50), // Limit to max 50 chars
    text: text.trim(), // Preserve full text so content does not cut mid-sentence
    cta: cta.trim().slice(0, 50), // Limit to max 50 chars
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
    ideologico_detalhado: {
      bg: '#FFFFFF',
      text: '#0C1014',
      accent: '#E1306C', // Mantém a base ideológica com o mesmo contraste
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
