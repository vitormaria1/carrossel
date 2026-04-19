---
name: ad-performance-report
description: "Creates ad performance reporting templates with ROAS analysis, creative insights, and optimization recommendations. Use when you need structured ad campaign reports."
allowed-tools: Read Write Glob
metadata:
  author: matthewhitcham
  version: "1.0"
---

# Ad Performance Report

## When to Use This Skill

Use this skill when you need to:
- Create a weekly or monthly ad performance report
- Analyze ROAS, CPA, and other key advertising metrics
- Deliver creative performance insights and optimization recommendations
- Build a reusable reporting template for ongoing campaigns

**DO NOT** use this skill for organic social media analytics, SEO reports, or general business dashboards. This is specifically for paid advertising performance reporting.

---

## Core Principle

EVERY METRIC IN THE REPORT MUST LEAD TO AN ACTION — IF A NUMBER DOES NOT INFORM A DECISION, REMOVE IT.

---

## Phase 1: Report Setup

### Required Inputs

| Input | What to Ask | Default |
|-------|------------|---------|
| **Ad platforms** | "Which platforms? (Meta, Google, TikTok, LinkedIn, all)" | Meta + Google |
| **Reporting period** | "What date range? (weekly, monthly, custom)" | Last 30 days |
| **Campaign goals** | "Primary KPI? (ROAS, CPA, leads, traffic)" | ROAS |
| **Budget spent** | "What was the total spend this period?" | No default — must be provided |
| **Revenue or conversions** | "What revenue or conversion count resulted?" | No default — must be provided |
| **Comparison period** | "Compare against what? (previous period, same period last year)" | Previous period |

**GATE: Do not proceed without spend and conversion/revenue data.**

---

## Phase 2: Metrics Analysis

Calculate and present core metrics with context.

### Metric Calculations

```
## Core Metrics

| Metric | This Period | Last Period | Change |
|--------|------------|-------------|--------|
| Total Spend | $X | $X | +/-X% |
| Revenue | $X | $X | +/-X% |
| ROAS | X.Xx | X.Xx | +/-X% |
| CPA/CPL | $X | $X | +/-X% |
| Impressions | X | X | +/-X% |
| Clicks | X | X | +/-X% |
| CTR | X.X% | X.X% | +/-X% |
| CPC | $X.XX | $X.XX | +/-X% |
| Conversions | X | X | +/-X% |
| Conversion Rate | X.X% | X.X% | +/-X% |
```

### Platform Breakdown

If running on multiple platforms, break metrics down per platform:

```
## Platform Performance

| Platform | Spend | Revenue | ROAS | CPA | CTR |
|----------|-------|---------|------|-----|-----|
| Meta | $X | $X | X.Xx | $X | X.X% |
| Google | $X | $X | X.Xx | $X | X.X% |
```

### Benchmarks

Compare against industry benchmarks and the account's historical averages. Flag any metric that is significantly above or below benchmark.

---

## Phase 3: Insights and Recommendations

### Creative Performance

```
## Top Performing Creatives

1. [Creative name/ID] — ROAS: X.Xx, Spend: $X, CPA: $X
   Why it works: [Analysis of hook, format, messaging]

2. [Creative name/ID] — ROAS: X.Xx, Spend: $X, CPA: $X
   Why it works: [Analysis]

## Underperforming Creatives

1. [Creative name/ID] — ROAS: X.Xx, Spend: $X, CPA: $X
   Recommendation: [Pause / revise hook / change audience]
```

### Optimization Recommendations

Provide 3-5 specific, prioritized actions:

```
## Recommended Actions

1. **[Action]** — [Rationale] — Expected impact: [High/Med/Low]
2. **[Action]** — [Rationale] — Expected impact: [High/Med/Low]
3. **[Action]** — [Rationale] — Expected impact: [High/Med/Low]
```

---

## Phase 4: Executive Summary

Write a 3-5 sentence summary for stakeholders who will not read the full report.

```
## Executive Summary

[1-2 sentences on overall performance vs. goal]
[1 sentence on the biggest win]
[1 sentence on the biggest concern or opportunity]
[1 sentence on next steps]
```

### Report Delivery Format

```
report/
└── ad-performance-[YYYY-MM].md
```

Include: Executive summary, core metrics table, platform breakdown, creative analysis, recommendations, and raw data appendix.

---

## Example: Monthly Meta + Google Report

**Executive Summary:**
"Total ad spend of $8,400 generated $29,400 in revenue for a blended ROAS of 3.5x — up from 2.8x last month. The top-performing Meta creative (UGC testimonial video) drove 42% of all conversions at a $12 CPA. Google Search CPA increased 18% due to rising keyword competition — recommend expanding to branded terms and adding negative keywords. Priority for next month: scale the UGC creative format on Meta and audit Google keyword match types."

---

## Anti-Patterns

- **Data dumps without insight** — a table of numbers is not a report. Every metric needs context and a recommendation.
- **Reporting on vanity metrics** — impressions and reach without tying to revenue are noise. Lead with ROAS or CPA.
- **Missing comparison context** — raw numbers mean nothing without period-over-period or benchmark comparison.
- **Burying the recommendations** — lead with what to do, then support with data. Stakeholders read the top, not the bottom.
- **Reporting too infrequently** — monthly is minimum. Weekly for campaigns spending $5K+/month.

---

## Recovery

- **Incomplete data:** Note which metrics are missing and why. Provide analysis on available data with caveats.
- **ROAS below 1.0:** Flag immediately. Recommend pausing underperformers, reallocating budget, or revising creative before next spend cycle.
- **No conversion tracking:** Cannot produce a meaningful report. Help the user set up conversion tracking as a prerequisite.
- **First month of ads (no comparison data):** Use industry benchmarks as the comparison baseline. Flag that historical context will improve future reports.
