/**
 * Design System baseado na análise de Davi Ribas
 * Minimalismo funcional + Acessibilidade 100%
 */

export const DAVI_DESIGN_SYSTEM = {
  // Paleta de cores (baseada em análise real do Davi)
  colors: {
    // Cores principais (Minimalismo Davi)
    white: '#FFFFFF',
    darkGray: '#0C1014', // Cinza escuro (main text color do Davi)
    lightGray: '#F5F5F5',

    // Accents (Instagram + profissional)
    instagram: {
      blue: '#405DE6',
      pink: '#E1306C',
      orange: '#F77737',
      purple: '#833AB4',
      gold: '#FFC040',
    },

    // Status colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },

  // Tipografia (System fonts como Davi)
  typography: {
    fontFamily: '-apple-system, "system-ui", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',

    // Para Instagram Stories (1080x1920)
    sizes: {
      // Headline - Principal
      h1: {
        fontSize: '72px',
        lineHeight: '1.1',
        fontWeight: '900',
        letterSpacing: '-1px',
      },

      // Subtitle - Secundário
      h2: {
        fontSize: '48px',
        lineHeight: '1.2',
        fontWeight: '700',
        letterSpacing: '-0.5px',
      },

      // Body text
      body: {
        fontSize: '32px',
        lineHeight: '1.4',
        fontWeight: '400',
        letterSpacing: '0px',
      },

      // Small text
      small: {
        fontSize: '24px',
        lineHeight: '1.3',
        fontWeight: '500',
        letterSpacing: '0.5px',
      },

      // CTA Button
      cta: {
        fontSize: '28px',
        lineHeight: '1.2',
        fontWeight: '700',
        letterSpacing: '0px',
      },
    },
  },

  // Espaçamento (baseado em múltiplos de 8)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },

  // Sombras (minimalistas)
  shadows: {
    subtle: '0 2px 8px rgba(0, 0, 0, 0.08)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.12)',
    strong: '0 8px 24px rgba(0, 0, 0, 0.16)',
  },

  // Raio de borda
  borderRadius: {
    none: '0',
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    full: '9999px',
  },

  // Breakpoints
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
  },
};

/**
 * Renderiza um card Instagram-ready (1080x1920)
 * Retorna CSS e layout para canvas rendering
 */
export function getInstagramCardLayout(position: 'top' | 'middle' | 'bottom' = 'middle') {
  const layouts: Record<string, any> = {
    top: {
      headlineY: 300,
      textY: 600,
      ctaY: 1700,
      headlineSize: 80,
      textSize: 40,
      ctaSize: 36,
    },
    middle: {
      headlineY: 500,
      textY: 900,
      ctaY: 1700,
      headlineSize: 80,
      textSize: 40,
      ctaSize: 36,
    },
    bottom: {
      headlineY: 700,
      textY: 1100,
      ctaY: 1700,
      headlineSize: 72,
      textSize: 36,
      ctaSize: 36,
    },
  };

  return layouts[position];
}

/**
 * Gera style para card HTML (preview)
 */
export function getCardPreviewStyle(
  bgColor: string,
  textColor: string,
  accentColor: string
): React.CSSProperties {
  return {
    background: bgColor,
    color: textColor,
    fontFamily: DAVI_DESIGN_SYSTEM.typography.fontFamily,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    padding: '60px 40px',
    minHeight: '400px',
    borderRadius: DAVI_DESIGN_SYSTEM.borderRadius.lg,
    boxShadow: DAVI_DESIGN_SYSTEM.shadows.medium,
    gap: DAVI_DESIGN_SYSTEM.spacing.lg,
  };
}

/**
 * Estilos para Headline
 */
export function getHeadlineStyle(textColor: string): React.CSSProperties {
  return {
    fontSize: '32px',
    fontWeight: 900,
    lineHeight: 1.1,
    letterSpacing: '-0.5px',
    color: textColor,
    margin: 0,
    wordBreak: 'break-word',
  };
}

/**
 * Estilos para Body Text
 */
export function getBodyStyle(textColor: string): React.CSSProperties {
  return {
    fontSize: '18px',
    fontWeight: 400,
    lineHeight: 1.4,
    color: textColor,
    opacity: 0.9,
    margin: 0,
    wordBreak: 'break-word',
  };
}

/**
 * Estilos para CTA Button
 */
export function getCtaStyle(bgColor: string, textColor: string): React.CSSProperties {
  return {
    fontSize: '16px',
    fontWeight: 700,
    padding: '12px 24px',
    backgroundColor: adjustBrightness(bgColor, -30),
    color: textColor,
    border: 'none',
    borderRadius: DAVI_DESIGN_SYSTEM.borderRadius.full,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: DAVI_DESIGN_SYSTEM.shadows.subtle,
  };
}

/**
 * Utility: Ajusta brilho de uma cor hex
 */
export function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);

  let R = Math.max(0, Math.min(255, (num >> 16) + amt));
  let G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
  let B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));

  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

/**
 * Utility: Calcula contraste (WCAG AAA compliant)
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const getLuminance = (hex: string) => {
    const [r, g, b] = [
      parseInt(hex.substring(1, 3), 16),
      parseInt(hex.substring(3, 5), 16),
      parseInt(hex.substring(5, 7), 16),
    ].map((x) => {
      x = x / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Valida se cor tem contraste suficiente (AAA = 7:1, AA = 4.5:1)
 */
export function validateContrast(
  bgColor: string,
  textColor: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  const ratio = getContrastRatio(bgColor, textColor);
  return ratio >= (level === 'AAA' ? 7 : 4.5);
}
