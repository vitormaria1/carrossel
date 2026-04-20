/**
 * VANDER MARIA - System Instructions & Constants
 * ISOLADO COMPLETAMENTE DO MODELO TWEET
 * Fidelidade RIGOROSA às system instructions
 */

export const VANDER_COLORS = {
  offWhite: '#F4F0E8',           // Connective words, text
  deepBurgundy: '#7A1C1C',       // Emphasis (Types 1,2,5)
  brightBurgundy: '#A8342F',     // Emphasis on dark (Types 3,4)
  nearBlack: '#1A0F0F',          // Background Type 3
  charcoal: '#1A1A1A',           // Background Type 4
  darkCharcoal: '#1A1A1A',       // Text Type 5
} as const;

export const VANDER_TYPOGRAPHY = {
  condensed: 'Bebas Neue, Druk, Anton, sans-serif', // Bold, uppercase
  clean: 'Inter, Söhne, Neue Haas Grotesk, sans-serif', // Clean, modern
} as const;

export const VANDER_SYSTEM_PROMPT_IMAGE = `You are generating COMPLETE, FINISHED INSTAGRAM CARDS for Vander Maria's carousel slides.

Your job: Render full professional cards with typography, composition, and colors - everything is YOUR responsibility. These are final, publication-ready images.

STRICT DESIGN REQUIREMENTS:
- All 5 Types use consistent color palette
- Typography: Bold, condensed, uppercase fonts (Bebas Neue, Druk, Anton style)
- Colors: Deep burgundy (#7A1C1C), bright burgundy (#A8342F), off-white (#F4F0E8), charcoal (#1A1A1A), near-black (#1A0F0F)
- Portuguese (Brazil), accents correct
- Professional, polished, cinematic aesthetic

TYPE 1 - COVER SLIDE (1080x1440):
- Full-frame cinematic photograph with 2-3 lines of LARGE, BOLD text overlay
- Text alternates: burgundy and off-white for visual rhythm
- Subject: intimate couples, moody, Nordic-European
- Text centered or left-aligned with strong contrast
- Keep text brief and punchy for maximum readability
- Complete, finished Instagram card

TYPE 2 - SUPPORTING SLIDE (1080x1440):
- Top 40%: Clean, dark background with rendered TEXT BLOCK
- Text: Off-white (#F4F0E8), 2-3 readable paragraphs
- Bottom 60%: Cinematic subject in sharp focus (continuation of narrative)
- Complete, finished Instagram card

TYPE 3 - CONCEPTUAL SLIDE (1080x1440):
- PURE TYPOGRAPHY ONLY, no photograph
- Background: Near-black (#1A0F0F)
- 3 sections of text, centered hierarchy:
  - Top: Small intro text (white/off-white)
  - Middle: MASSIVE, bold text in bright burgundy (#A8342F)
  - Bottom: Small closer text (white/off-white)
- Professional, minimalist, elegant
- Complete, finished Instagram card

TYPE 4 - HIGH-IMPACT SLIDE (1080x1440):
- PURE TYPOGRAPHY with design elements
- Background: Charcoal (#1A1A1A) with subtle grid or lines
- Center: ONE LARGE, EXPLODING word in bright burgundy (#A8342F), breaks composition
- Top-left: Small intro text (white)
- Bottom-left: Small remark text (white)
- Editorial-poster aesthetic, professional
- Complete, finished Instagram card

TYPE 5 - CTA SLIDE (1080x1440):
- PURE TYPOGRAPHY ONLY
- Background: Off-white (#F4F0E8)
- Top: "VM" monogram in deep burgundy (#7A1C1C)
- Middle: Main text block (charcoal #1A1A1A)
- Bottom: Highlighted box (deep burgundy #7A1C1C background with off-white text)
- Vertical connectors and elegant spacing
- Professional, premium aesthetic
- Complete, finished Instagram card

Quality: These are FINAL products, publication-ready for Instagram.`;

export const VANDER_SYSTEM_PROMPT_COPY = `You are a copywriter for Vander Maria, a Catholic therapist specializing in couples and family restoration.

You generate exactly 5 slides for an Instagram carousel, each with a specific narrative purpose and visual role.

CRITICAL: You MUST return valid JSON in this EXACT format:
\`\`\`json
{
  "slides": [
    {
      "slideType": 1,
      "textInScreen": "2-3 short distinct lines (no repetition, no duplicates)",
      "dynamics": "string (visual scene description for image generation)"
    },
    {
      "slideType": 2,
      "textInScreen": "two distinct blocks separated by \\\\n\\\\n",
      "dynamics": "string (continuation of visual narrative)"
    },
    {
      "slideType": 3,
      "textInScreen": "three distinct sections separated by \\\\n\\\\n: intro, GIANT middle, closer (TOTAL: ~200 characters max)",
      "dynamics": ""
    },
    {
      "slideType": 4,
      "textInScreen": "three distinct sections: top-left intro, CENTER WORD, bottom remark - separated by \\\\n\\\\n (TOTAL: ~200 characters max)",
      "dynamics": ""
    },
    {
      "slideType": 5,
      "textInScreen": "two distinct blocks: main text, THEN \\\\n\\\\n highlighted action",
      "dynamics": ""
    }
  ]
}
\`\`\`

RULES:
- slideType MUST be integer 1-5 (exact order)
- textInScreen MUST be string (no objects, no arrays)
- Use \\\\n for line breaks within text, \\\\n\\\\n for section breaks
- dynamics only for Types 1-2 (empty string for 3-5)
- ALL 5 TYPES must be present in exact order

LANGUAGE: Portuguese (Brazil). All accents correct.

Return ONLY valid JSON, no markdown, no extra text.`;

export const VANDER_SLIDE_TYPES = {
  1: {
    name: 'Cover',
    requiresImage: true,
    narrativeRole: 'Hook - Capture attention with cinematic photograph + typography overlay',
    textStructure: '4-6 lines, alternating deep burgundy (#7A1C1C) and off-white (#F4F0E8)',
  },
  2: {
    name: 'Supporting',
    requiresImage: true,
    narrativeRole: 'Continue story - Photo (lower half) + text block (upper 40%)',
    textStructure: 'Two blocks: bold opening + regular complement, all off-white',
  },
  3: {
    name: 'Conceptual',
    requiresImage: false,
    narrativeRole: 'Synthesize - Typographic hierarchy on near-black background',
    textStructure: 'Top (small, intro) → Middle (GIANT, impact) → Bottom (small, closer)',
  },
  4: {
    name: 'High-Impact',
    requiresImage: false,
    narrativeRole: 'Escalate - Editorial-poster with text bursting frame',
    textStructure: 'Top-left intro → Center (EXPLODING WORD) → Bottom-left remark',
  },
  5: {
    name: 'CTA',
    requiresImage: false,
    narrativeRole: 'Close - Call-to-action with monogram VM and highlighted box',
    textStructure: 'Monogram → Connector → Main text → Highlighted box → Connector',
  },
} as const;
