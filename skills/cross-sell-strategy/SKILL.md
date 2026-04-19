---
name: cross-sell-strategy
description: "Maps cross-sell opportunities with product pairing logic, timing triggers, and messaging templates. Use when you want to increase revenue from existing customers."
allowed-tools: Read Write Glob
metadata:
  author: matthewhitcham
  version: "1.0"
---

# Cross-Sell Strategy

## When to Use This Skill

Use this skill when you need to:
- Identify cross-sell opportunities across your product catalog
- Design product pairing logic based on purchase behavior
- Create messaging templates for cross-sell emails and on-site recommendations
- Build timing triggers that present the right offer at the right moment

**DO NOT** use this skill for upselling (higher tier of the same product), order bumps at checkout, or new customer acquisition. This is for selling complementary products to existing customers.

---

## Core Principle

CROSS-SELLING IS NOT ABOUT PUSHING MORE PRODUCTS — IT IS ABOUT RECOGNIZING WHAT THE CUSTOMER NEEDS NEXT BASED ON WHAT THEY ALREADY BOUGHT AND PRESENTING IT AS A NATURAL NEXT STEP.

---

## Phase 1: Brief

### Required Inputs

| Input | What to Ask | Default |
|-------|------------|---------|
| **Product catalog** | "List all your products/services with prices." | No default — must be provided |
| **Best sellers** | "Which products sell the most?" | No default — must be provided |
| **Customer data** | "Do you know what customers buy together?" | Anecdotal knowledge |
| **Communication channels** | "How do you reach existing customers? (email, in-app, SMS)" | Email |
| **Average customer purchases** | "How many products does a typical customer buy?" | 1-2 |

**GATE: Confirm before mapping cross-sell opportunities.**

---

## Phase 2: Cross-Sell Map

### Product Pairing Matrix

```
## Cross-Sell Pairings

| If They Bought | Recommend | Why | Timing |
|---------------|-----------|-----|--------|
| [Product A] | [Product C] | [Complementary benefit] | 7 days post-purchase |
| [Product A] | [Product D] | [Next logical step] | 14 days post-purchase |
| [Product B] | [Product A] | [Solves adjacent problem] | After onboarding complete |
| [Product B] | [Product E] | [Enhances results] | 30 days post-purchase |
```

### Timing Triggers

```
## When to Cross-Sell

**Immediate (checkout/thank you page):** Only if the cross-sell is a no-brainer complement
**7 days post-purchase:** After they've had time to use the initial product
**Milestone-based:** After they hit a usage milestone or complete onboarding
**Seasonal:** When a complementary product aligns with a time of year or event
**Behavior-based:** When they view a related product page, open related content, or ask a related support question
```

**GATE: Approve the cross-sell map before writing messaging.**

---

## Phase 3: Write Cross-Sell Messaging

### Email Templates

**Template 1: Natural Next Step**
```
Subject: Now that you've [achieved X], here's what's next

Hi {first_name},

You've been using [Product A] for [X] days now, and based on [milestone or behavior], it looks like you're getting real results.

The natural next step? [Product B] — it [specific benefit that builds on Product A].

[1-2 sentences explaining how the two products work together]

[CTA: Check out Product B →]
```

**Template 2: Customer-Only Offer**
```
Subject: Exclusive for [Product A] customers

{first_name}, because you already have [Product A], I want to give you early access to [Product B] — and a special price.

[Quick description of what Product B does and why it matters to Product A users]

Customer-only price: $[X] (regular price: $[Y])

[CTA: Get Your Customer Price →]
```

### On-Site Recommendation Copy

Write short cross-sell cards for product pages, thank you pages, and customer dashboards:
```
"Customers who bought [Product A] also love [Product B]"
"Complete your toolkit: Add [Product B] for [benefit]"
"Recommended for you based on your purchase"
```

---

## Phase 4: Polish

### 1. Revenue Impact Projection

- Current average order value: $[X]
- Projected cross-sell take rate: 10-20%
- Additional revenue per 100 customers: $[X]
- Annual revenue increase estimate: $[X]

### 2. Implementation Checklist

- [ ] Product pairings defined and documented
- [ ] Timing triggers configured in email platform
- [ ] Email templates written and loaded
- [ ] On-site recommendations added (if applicable)
- [ ] Tracking set up (cross-sell attribution)
- [ ] Exclusions configured (don't recommend products they already own)

### 3. Optimization Cycle

- Monthly: review cross-sell conversion rates per pairing
- Quarterly: add new pairings based on customer behavior data
- Remove or replace pairings with under 3% conversion

---

## Anti-Patterns

- **Recommending products they already own** — check purchase history before every cross-sell touchpoint.
- **Cross-selling immediately after purchase** — let them experience the first product before pushing the next. Wait at least 7 days.
- **Irrelevant pairings** — if the products have no logical connection, the recommendation feels random and salesy.
- **Too many recommendations** — recommend 1-2 products max. A wall of "you might also like" options causes decision paralysis.
- **No customer-only benefit** — existing customers should feel rewarded. A special price or early access makes the cross-sell feel exclusive.

---

## Recovery

- **Only one product:** Cross-selling requires multiple products. Recommend building a complementary product first, then return to this skill.
- **No purchase data:** Start with logical pairings based on product function and customer need, then refine with data over time.
- **Low cross-sell rates (under 3%):** Test different timing, messaging angles, and product pairings. The product match may be wrong.
- **Customers feel over-marketed:** Reduce cross-sell frequency to one touchpoint per product purchased. Quality over quantity.
