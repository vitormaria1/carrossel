---
name: media-buy-plan
description: "Plans paid media budgets across channels with allocation strategy, expected ROAS, and testing roadmap. Use when managing ad spend across multiple platforms."
allowed-tools: Read Write Glob
metadata:
  author: matthewhitcham
  version: "1.0"
---

# Media Buy Plan

## When to Use This Skill

Use this skill when you need to:
- Allocate advertising budget across multiple paid channels
- Build a media buying strategy with expected ROAS and KPI targets
- Create a testing roadmap for new channels and campaigns
- Plan monthly and quarterly ad spend with performance milestones

**DO NOT** use this skill for organic marketing strategy, individual ad campaign setup, or creative production. This is for strategic budget allocation and media planning across paid channels.

---

## Core Principle

EVERY DOLLAR OF AD SPEND MUST HAVE A JOB — WHETHER IT IS TESTING A NEW CHANNEL, SCALING A PROVEN ONE, OR RETARGETING WARM AUDIENCES, NO BUDGET SHOULD BE SPENT WITHOUT A CLEAR EXPECTED OUTCOME AND MEASUREMENT PLAN.

---

## Phase 1: Brief

### Required Inputs

| Input | What to Ask | Default |
|-------|------------|---------|
| **Total monthly ad budget** | "What is your total monthly advertising budget?" | No default — must be provided |
| **Business model** | "How do you make money? (e-commerce, services, SaaS, info products)" | No default — must be provided |
| **Average order value / deal size** | "What is the average sale value?" | No default — must be provided |
| **Target CPA** | "How much can you afford to spend to acquire a customer?" | Derived from margins |
| **Current channels** | "Where are you advertising now? What results?" | None / starting from scratch |
| **Customer LTV** | "What is a customer worth over their lifetime?" | Single purchase value |
| **Goals** | "What are your monthly revenue or lead goals from ads?" | No default — must be provided |

**GATE: Confirm the brief before building the media plan.**

---

## Phase 2: Channel Strategy

### Channel Selection Matrix

```
## Channel Evaluation

| Channel | Audience Fit | Cost | Complexity | Recommended? |
|---------|-------------|------|-----------|-------------|
| Meta (Facebook/IG) | [High/Med/Low] | [CPC range] | Medium | [Yes/No/Test] |
| Google Search | [High/Med/Low] | [CPC range] | Medium | [Yes/No/Test] |
| Google Display | [Med/Low] | [CPC range] | Low | [Yes/No/Test] |
| YouTube | [High/Med/Low] | [CPV range] | High | [Yes/No/Test] |
| TikTok | [High/Med/Low] | [CPC range] | Medium | [Yes/No/Test] |
| LinkedIn | [High/Med/Low] | [CPC range] | High cost | [Yes/No/Test] |
| Pinterest | [High/Med/Low] | [CPC range] | Low | [Yes/No/Test] |
```

### Budget Allocation Framework

```
## Budget Allocation: $[X]/month

**Proven channels (60-70% of budget):**
Channels with positive ROAS get the majority of spend.
- [Channel 1]: $[X]/month ([X]% of budget)
- [Channel 2]: $[X]/month ([X]% of budget)

**Testing channels (15-20% of budget):**
New channels or audiences being validated.
- [Channel 3]: $[X]/month ([X]% of budget)

**Retargeting (15-20% of budget):**
Warm audience campaigns across all platforms.
- Meta retargeting: $[X]/month
- Google retargeting: $[X]/month

**Reserve (5-10%):**
Held for scaling opportunities or seasonal pushes.
- $[X]/month set aside
```

### Target Economics

```
## Unit Economics for Ad Spend

Average order value (AOV): $[X]
Cost of goods / fulfillment: $[X]
Gross margin per sale: $[X] ([X]%)
Maximum CPA (breakeven): $[X]
Target CPA (profitable): $[X] (leaves [X]% profit)
Target ROAS: [X]x (revenue / ad spend)

Customer LTV: $[X]
LTV-based max CPA: $[X] (if willing to break even on first sale)
```

**GATE: Approve the channel strategy and budget allocation before building the roadmap.**

---

## Phase 3: Media Plan Roadmap

### Monthly Media Plan

```
## Month 1: Foundation

**Goal:** Establish baseline performance on primary channels
**Budget:** $[X]

| Channel | Budget | Campaign Type | Audience | Target CPA |
|---------|--------|--------------|----------|-----------|
| Meta | $[X] | Conversion | Interest-based cold | $[X] |
| Meta | $[X] | Retargeting | Website visitors | $[X] |
| Google Search | $[X] | Search | High-intent keywords | $[X] |

**Success criteria:** Positive ROAS on at least one campaign

---

## Month 2: Optimize and Test

**Goal:** Scale winners, kill losers, test one new channel
**Budget:** $[X]

- Scale: Increase budget 30% on campaigns with target CPA
- Kill: Pause campaigns with 2x+ target CPA after adequate spend
- Test: Launch [new channel] with $[X] test budget

---

## Month 3: Scale

**Goal:** Double down on proven channels, expand audiences
**Budget:** $[X] (increase if Month 2 was profitable)

- Proven: [X]% of budget to best-performing campaigns
- Expand: New audiences on proven channels (lookalikes, new interests)
- Retargeting: Increase retargeting budget as site traffic grows
```

### Quarterly Review Framework

Every 90 days, assess:
1. Which channels hit target ROAS?
2. Which channels should be paused or scaled?
3. What new channels should be tested next quarter?
4. Is the budget allocation still optimal?

---

## Phase 4: Polish

### 1. Performance Dashboard

```
## Weekly Tracking

| Channel | Spend | Revenue | ROAS | CPA | Conversions | CTR |
|---------|-------|---------|------|-----|------------|-----|
| Meta (cold) | $[X] | $[X] | [X]x | $[X] | [X] | [X]% |
| Meta (retarget) | $[X] | $[X] | [X]x | $[X] | [X] | [X]% |
| Google Search | $[X] | $[X] | [X]x | $[X] | [X] | [X]% |
| **Total** | **$[X]** | **$[X]** | **[X]x** | **$[X]** | **[X]** | |
```

### 2. Decision Rules

```
## When to Scale
- ROAS above target for 7+ consecutive days
- Increase budget by 20-30% (not more)
- Monitor for 3-4 days before increasing again

## When to Pause
- CPA exceeds 2x target after $50+ spend per ad set
- ROAS below 1x for 14+ days despite optimization
- CTR below 0.5% on social or below 2% on search

## When to Test New Channels
- Current channels are profitable and scaling
- Have $500+/month available for testing
- Target audience is active on the new platform
```

### 3. Seasonal Adjustments

Note seasonal trends:
- Q4 (holiday): CPMs rise 30-50%. Increase budget or shift to retargeting.
- January: CPMs drop. Good time to test new channels.
- Industry-specific events: plan budget spikes around launches, conferences, or seasonal demand.

---

## Anti-Patterns

- **Spreading budget too thin** — $100/month across 5 channels means none of them get enough data to optimize. Focus on 1-2 channels first.
- **No testing budget** — spending 100% on proven channels means you never discover what else works. Always allocate 15-20% for testing.
- **Scaling too fast** — doubling budget overnight resets the algorithm's learning. Increase 20-30% at a time.
- **No CPA target** — spending without a defined cost-per-acquisition target makes it impossible to know if ads are working.
- **Ignoring attribution** — understand how you're measuring results. Last-click vs. multi-touch attribution can tell very different stories.
- **Emotional budget decisions** — "This channel feels right" is not a strategy. Let the data decide where money goes.

---

## Recovery

- **Very small budget (under $500/month):** Pick ONE channel. Meta for B2C, Google Search for high-intent B2B. All budget on one platform until profitable.
- **Spending with no ROAS tracking:** Set up conversion tracking immediately. Without it, you're flying blind.
- **All channels unprofitable:** Check the offer and landing page before blaming the ads. If the funnel doesn't convert organic traffic either, ads won't fix it.
- **No historical data:** Start with industry benchmark CPAs and ROAS targets. Adjust based on your actual data within the first 30 days.
- **Budget cuts required:** Cut testing and reserve first. Protect the highest-ROAS campaigns. Reduce retargeting last (it's your most efficient spend).
