---
name: lookalike-audience-plan
description: "Designs lookalike audience strategies with source audience selection, percentage tiers, and testing framework. Use when planning paid ad targeting to find new customers similar to your best existing ones."
allowed-tools: Read Write Glob
metadata:
  author: matthewhitcham
  version: "1.0"
---

# Lookalike Audience Plan

## When to Use This Skill

Use this skill when you need to:
- Build a lookalike audience strategy for Facebook, Google, or other ad platforms
- Select the best source audiences from your existing customer data
- Plan percentage tiers and testing sequences for lookalike expansion
- Create a structured rollout plan for scaling ad spend with lookalikes

**DO NOT** use this skill for interest-based targeting, retargeting setup, or organic audience building. This is specifically for lookalike/similar audience strategies on paid platforms.

---

## Core Principle

THE QUALITY OF A LOOKALIKE AUDIENCE IS ONLY AS GOOD AS THE SOURCE AUDIENCE — START WITH YOUR HIGHEST-VALUE CUSTOMERS, NOT YOUR LARGEST LIST.

---

## Phase 1: Source Audit

Before building lookalikes, identify and evaluate available source audiences.

### Required Inputs

| Input | What to Ask | Default |
|-------|------------|---------|
| **Ad platform** | "Which platform? (Meta, Google, TikTok, LinkedIn)" | Meta (Facebook/Instagram) |
| **Available customer data** | "What customer lists or pixel data do you have? (email lists, purchasers, leads, website visitors)" | No default — must be provided |
| **Average order value / LTV** | "What is your average customer value or lifetime value?" | Unknown |
| **Monthly ad budget** | "What is your monthly ad spend budget?" | $2,000/month |
| **Geographic targets** | "Which countries or regions are you targeting?" | United States |

**GATE: Do not proceed until the user confirms their available data sources and platform.**

---

## Phase 2: Source Audience Strategy

Rank and recommend source audiences based on quality signals.

### Source Audience Hierarchy (Best to Weakest)

1. **Top 25% customers by LTV** — highest value, clearest signal
2. **All purchasers** — proven buyers, strong signal
3. **Repeat purchasers** — loyalty signal, smaller but potent
4. **High-intent leads** — booked calls, started checkout, requested demos
5. **Email subscribers (engaged)** — opened/clicked in last 90 days
6. **All email subscribers** — weaker signal, larger pool
7. **Website visitors (key pages)** — pricing page, product pages
8. **All website visitors** — weakest signal, largest pool

### Minimum Source Size Requirements

| Platform | Minimum Source | Recommended Source |
|----------|---------------|-------------------|
| Meta | 100 people | 1,000-5,000 |
| Google | 100 people | 1,000+ |
| TikTok | 100 people | 1,000+ |
| LinkedIn | 300 people | 1,000+ |

Present recommended source audiences with rationale before proceeding.

**GATE: Confirm source audience selections with the user.**

---

## Phase 3: Lookalike Build Plan

Design the tiered lookalike strategy with testing framework.

### Percentage Tier Strategy

```
## Lookalike Tiers

### Tier 1: Precision (1-2%)
- Closest match to source audience
- Highest expected conversion rate
- Smallest reach, highest CPM
- Use for: Initial testing, limited budgets

### Tier 2: Balanced (3-5%)
- Good match with broader reach
- Strong conversion potential with scale
- Use for: Scaling after Tier 1 validation

### Tier 3: Expansion (6-10%)
- Broadest reach, weakest signal
- Lower conversion rate but lowest CPM
- Use for: Top-of-funnel awareness, large budgets
```

### Testing Sequence

1. Start with best source audience at 1% lookalike
2. Test 1% vs 3% vs 5% of the same source
3. Test winning percentage across different source audiences
4. Layer interest targeting on top of broader lookalikes (5%+)
5. Exclude existing customers and active retargeting audiences

### Budget Allocation

| Phase | Budget Split | Duration |
|-------|-------------|----------|
| Testing | 70% Tier 1, 20% Tier 2, 10% Tier 3 | 2 weeks |
| Scaling | 40% Tier 1, 40% Tier 2, 20% Tier 3 | Ongoing |

---

## Phase 4: Deliverable

Output the complete lookalike audience plan document.

### Plan Format

```
## Lookalike Audience Plan

**Platform:** [Platform]
**Source Audiences:** [List]
**Geographic Target:** [Regions]
**Monthly Budget:** [Amount]

### Source Audience Details
[For each source: name, size, quality score, upload instructions]

### Lookalike Build Matrix
| Source Audience | 1% | 3% | 5% | 10% |
|----------------|----|----|----|----|
| [Source 1] | Build | Build | Test later | Skip |

### Testing Calendar
Week 1-2: [Specific tests]
Week 3-4: [Optimization actions]
Month 2+: [Scaling plan]

### Exclusion Lists
[Audiences to exclude from each campaign]

### Success Metrics
[KPIs and benchmarks for each tier]
```

---

## Example: E-commerce Store Selling Skincare

**Source audiences available:** 3,200 purchasers, 800 repeat purchasers, 12,000 email subscribers, 45,000 monthly website visitors.

**Recommendation:** Lead with repeat purchasers (800) as primary source at 1% — strongest signal despite smaller size. Test all purchasers (3,200) at 1% simultaneously. Skip email subscribers until purchaser lookalikes are validated.

---

## Anti-Patterns

- **Using "all website visitors" as the primary source** — too broad, weak signal. Start with purchasers or high-intent actions.
- **Testing all tiers simultaneously** — burns budget without learning. Test sequentially.
- **Ignoring source audience freshness** — a 3-year-old email list produces worse lookalikes than a 90-day purchaser list.
- **Skipping exclusions** — always exclude existing customers and active retargeting pools.
- **Assuming one source fits all** — different products may need different source audiences.

---

## Recovery

- **Source audience too small:** If under platform minimums, combine related audiences (e.g., merge purchasers with high-intent leads). Note the quality tradeoff.
- **No purchaser data:** Use highest-intent available signal — email engaged subscribers or key page visitors. Recommend building a purchaser list for future use.
- **Multiple products/services:** Create separate source audiences per product line. Do not mix unrelated customer types.
- **No existing customer data at all:** This skill requires some data. Recommend running interest-based campaigns first to build a pixel audience of 500+ converters, then return to build lookalikes.
