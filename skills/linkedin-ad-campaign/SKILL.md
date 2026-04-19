---
name: linkedin-ad-campaign
description: "Plans LinkedIn ad campaigns with audience targeting, ad formats, lead gen form design, and budget recommendations. Use when running B2B advertising campaigns on LinkedIn."
allowed-tools: Read Write Glob
metadata:
  author: matthewhitcham
  version: "1.0"
---

# LinkedIn Ad Campaign

## When to Use This Skill

Use this skill when you need to:
- Plan a LinkedIn advertising campaign from targeting to creative
- Design lead gen form campaigns for B2B lead generation
- Select the right LinkedIn ad formats for your business goal
- Create a budget and bidding strategy for LinkedIn ads

**DO NOT** use this skill for organic LinkedIn content, LinkedIn profile optimization, or non-LinkedIn paid advertising. This is specifically for LinkedIn's paid advertising platform.

---

## Core Principle

LINKEDIN ADS ARE EXPENSIVE PER CLICK — EVERY CAMPAIGN MUST TARGET A SPECIFIC DECISION-MAKER WITH A SPECIFIC OFFER WORTH THE PREMIUM CPM.

---

## Phase 1: Campaign Brief

### Required Inputs

| Input | What to Ask | Default |
|-------|------------|---------|
| **Campaign objective** | "What is the goal? (lead gen, website traffic, brand awareness, event registrations)" | Lead generation |
| **Target audience** | "Who are you targeting? (job titles, industries, company sizes)" | No default — must be provided |
| **Offer** | "What are you offering? (whitepaper, demo, webinar, free trial)" | No default — must be provided |
| **Monthly budget** | "What is your monthly LinkedIn ad budget?" | $3,000/month |
| **Geographic targets** | "Which regions?" | United States |
| **Landing page or lead gen form** | "Do you want to send traffic to a landing page or use LinkedIn's native lead gen forms?" | LinkedIn lead gen forms |

**GATE: Do not proceed until audience, offer, and objective are confirmed.**

---

## Phase 2: Audience Build

Design the targeting strategy using LinkedIn's targeting options.

### Targeting Layers

Build 2-3 audience segments to test:

```
## Audience Segment 1: [Name]
- Job Titles: [Specific titles]
- Industries: [Industries]
- Company Size: [Employee ranges]
- Seniority: [Entry, Senior, Manager, Director, VP, C-Suite]
- Estimated audience size: [Target 50,000-500,000]

## Audience Segment 2: [Name]
- [Different targeting combination]
```

### Targeting Best Practices

- Audience size sweet spot: 50,000-500,000 for lead gen
- Do not stack more than 3 targeting dimensions — overly narrow audiences drive up CPM
- Use exclusions: competitors, current customers, job seekers
- Matched Audiences: upload customer lists for exclusion or lookalikes

**GATE: Present audience segments for user approval.**

---

## Phase 3: Campaign Build

### Ad Format Selection

| Format | Best For | Avg CPC |
|--------|----------|---------|
| Single Image | Lead gen, traffic | $5-12 |
| Carousel | Multi-feature showcase | $4-10 |
| Video | Brand awareness, demos | $6-15 |
| Document | Thought leadership | $3-8 |
| Message/InMail | High-value offers, events | $0.50-1.00/send |
| Text Ads | Low-budget awareness | $2-5 |

### Ad Copy Framework

```
## Ad Variation [A/B/C]

**Format:** Single Image
**Headline (70 chars max):** [Benefit-driven headline]
**Description (100 chars max):** [Supporting detail]
**Intro text (600 chars max):**
[Hook — question or bold statement]
[Problem acknowledgment — 1-2 sentences]
[Solution — what they get]
[CTA — clear next step]

**CTA button:** [Download / Learn More / Sign Up / Register]
**Image specs:** 1200x627px, minimal text overlay
```

### Lead Gen Form Design (if applicable)

```
## Lead Gen Form

**Form name:** [Descriptive name]
**Headline (60 chars):** [Value proposition]
**Description (160 chars):** [What they get + urgency]
**Fields:**
1. First Name (pre-filled)
2. Last Name (pre-filled)
3. Work Email (pre-filled)
4. Company Name (pre-filled)
5. [1 custom question max — keep friction low]

**Privacy policy URL:** [Required]
**Thank you message:** [Confirmation + next step]
**Thank you URL:** [Link to resource or landing page]
```

---

## Phase 4: Budget and Launch Plan

### Budget Allocation

```
## Budget Plan

**Monthly budget:** $[amount]
**Campaign duration:** [Ongoing / Fixed dates]

### Allocation
- Testing phase (Week 1-2): $[amount] across [X] ad variations
- Optimization (Week 3-4): Shift budget to top performer
- Scale (Month 2+): Increase daily budget on winning combinations

### Bidding Strategy
- Objective: Maximum delivery (recommended for testing)
- Switch to: Target cost after 50+ conversions
- Target CPL: $[amount based on offer value]

### KPI Targets
| Metric | Target |
|--------|--------|
| CTR | >0.4% |
| CPL | <$[amount] |
| Lead form completion rate | >10% |
| Cost per MQL | <$[amount] |
```

---

## Example: B2B SaaS Webinar Campaign

**Audience:** Marketing Directors at companies with 50-500 employees in SaaS/Technology.

**Ad copy excerpt:**
```
Intro text: "67% of marketing teams waste 10+ hours/week on manual reporting.

Join our live workshop and see how to build automated dashboards in 30 minutes — no code, no data team required.

Seats limited to 100. Register free."

Headline: Build Marketing Dashboards in 30 Minutes
CTA: Register
```

---

## Anti-Patterns

- **Targeting too broadly** — "all marketers in the US" wastes budget. Narrow by title + seniority + industry.
- **Too many form fields** — every field beyond 4 drops completion rate significantly. Pre-filled fields reduce friction.
- **Running one ad variation** — always launch 3-4 variations to identify winning copy and creative.
- **Using "Learn More" for everything** — match the CTA button to the action: Download, Register, Sign Up.
- **Ignoring the offer** — LinkedIn users expect value in exchange for their info. A "contact us" form will not convert at $8+ CPC.

---

## Recovery

- **Budget under $1,500/month:** Focus on one audience segment and one ad format. LinkedIn requires minimum daily budgets. If under $500/month, suggest a different platform.
- **No lead magnet or offer:** Help the user identify a valuable asset — checklist, template, mini-course, or calculator — before building the campaign.
- **Audience too small (<20,000):** Broaden one targeting dimension. Expand from exact job titles to job functions, or widen company size range.
- **No LinkedIn Company Page:** A Company Page is required to run LinkedIn ads. Help the user set one up before proceeding.
