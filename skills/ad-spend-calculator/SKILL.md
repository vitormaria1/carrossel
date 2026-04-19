---
name: ad-spend-calculator
description: "Calculates ad spend budgets based on revenue goals, conversion rates, and cost-per-acquisition targets. Use when planning how much to spend on ads to hit revenue targets."
allowed-tools: Read Write Glob
metadata:
  author: matthewhitcham
  version: "1.0"
---

# Ad Spend Calculator

## When to Use This Skill

Use this skill when you need to:
- Calculate how much ad spend is needed to hit a revenue goal
- Determine viable CPA targets based on product margins
- Build a budget allocation plan across platforms and campaigns
- Model different spend scenarios to find the optimal investment level

**DO NOT** use this skill for organic marketing budgets, general business budgeting, or ad creative strategy. This is specifically for calculating paid advertising budgets.

---

## Core Principle

AD SPEND IS AN INVESTMENT EQUATION — EVERY DOLLAR IN MUST PRODUCE A MEASURABLE RETURN, AND THE MATH MUST WORK BEFORE THE FIRST DOLLAR IS SPENT.

---

## Phase 1: Inputs

### Required Inputs

| Input | What to Ask | Default |
|-------|------------|---------|
| **Revenue goal** | "What is your monthly revenue target from ads?" | No default — must be provided |
| **Average order value (AOV)** | "What is your average sale or order value?" | No default — must be provided |
| **Profit margin** | "What is your profit margin per sale (after COGS)?" | 60% |
| **Current conversion rate** | "What percentage of ad clicks convert to sales?" | 2% (industry average) |
| **Current CPC** | "What is your average cost per click?" | $1.50 (estimate) |
| **Ad platforms** | "Where are you running ads?" | Meta + Google |

**GATE: Do not proceed without revenue goal and AOV.**

---

## Phase 2: Core Calculations

### Funnel Math

```
## Ad Spend Calculator

### Inputs
- Monthly revenue goal: $[X]
- Average order value: $[X]
- Profit margin: [X]%
- Conversion rate: [X]%
- Average CPC: $[X]

### Calculated Metrics

| Metric | Value | Formula |
|--------|-------|---------|
| Sales needed | [X] | Revenue goal / AOV |
| Clicks needed | [X] | Sales needed / Conversion rate |
| Required ad spend | $[X] | Clicks needed x CPC |
| Cost per acquisition (CPA) | $[X] | Ad spend / Sales needed |
| Max viable CPA | $[X] | AOV x Profit margin |
| ROAS needed | [X]x | Revenue goal / Ad spend |
| Profit after ad spend | $[X] | Revenue - COGS - Ad spend |
```

### Viability Check

Flag these automatically:
- CPA exceeds 50% of AOV — warning: tight margins
- CPA exceeds profit margin — alert: losing money on every sale
- Required ROAS exceeds 5x — alert: very aggressive, may not be achievable
- Monthly spend exceeds $10K — note: recommend phased scaling

---

## Phase 3: Scenario Modeling

Present 3 scenarios so the user can choose their risk level.

```
## Scenarios

### Conservative (Lower spend, proven channels only)
| Metric | Value |
|--------|-------|
| Monthly spend | $[X] |
| Expected sales | [X] |
| Expected revenue | $[X] |
| Expected ROAS | [X]x |
| Profit after ads | $[X] |

### Base Case (Moderate spend, balanced approach)
| Metric | Value |
|--------|-------|

### Aggressive (Higher spend, scaling mode)
| Metric | Value |
|--------|-------|
```

### Platform Allocation

```
## Budget Allocation by Platform

| Platform | % of Budget | Monthly Spend | Expected ROAS | Rationale |
|----------|-------------|---------------|---------------|-----------|
| Meta | [X]% | $[X] | [X]x | [Why] |
| Google | [X]% | $[X] | [X]x | [Why] |
| [Other] | [X]% | $[X] | [X]x | [Why] |
```

---

## Phase 4: Action Plan

### Monthly Budget Calendar

```
## Monthly Spend Plan

Week 1: $[X] — Testing phase (3-5 ad sets, $X/day each)
Week 2: $[X] — Evaluate, pause underperformers
Week 3: $[X] — Scale winners, increase daily budgets
Week 4: $[X] — Maintain and optimize

Total: $[X]
```

### Breakeven Checklist

```
- [ ] CPA is below max viable CPA ($[X])
- [ ] ROAS exceeds breakeven ([X]x)
- [ ] Daily budget supports statistical significance ($[X]/day minimum)
- [ ] Conversion tracking is installed and verified
- [ ] Landing page conversion rate is at or above [X]%
```

---

## Example: Course Creator ($10K/month Goal)

**Inputs:** AOV = $197, margin = 85%, conversion rate = 3%, CPC = $2.00

**Results:**
- Sales needed: 51/month
- Clicks needed: 1,700
- Required spend: $3,400/month
- CPA: $66.70
- Max viable CPA: $167.45 (profitable at current CPA)
- ROAS: 2.94x
- Profit after ads: $5,117/month

**Verdict:** Math works well. CPA is 40% of max viable CPA — room to scale.

---

## Anti-Patterns

- **Ignoring profit margin** — revenue ROAS is meaningless without margin context. A 3x ROAS on 20% margins is break-even.
- **Using industry-average conversion rates without testing** — always note that defaults are estimates. Real data replaces assumptions.
- **Calculating without including all costs** — include platform fees, creative costs, landing page tools, and team time.
- **Linear scaling assumptions** — doubling spend rarely doubles results. Factor in diminishing returns at higher spend levels.
- **No minimum daily budget check** — platforms need $20-50/day minimum per ad set for optimization. If budget does not support this, reduce ad sets.

---

## Recovery

- **Math does not work (CPA > margin):** Show the user which lever to pull — increase AOV, improve conversion rate, lower CPC, or add upsells/LTV to change the equation.
- **No historical data:** Use industry benchmarks but clearly label them as estimates. Recommend a $500-1,000 test budget before committing to the full calculated spend.
- **Multiple products at different price points:** Calculate separately for each product, then create a blended portfolio view.
- **Revenue goal seems unrealistic:** Show the spend required and let the user decide. If it requires a ROAS above 5x with no historical data, flag the risk explicitly.
