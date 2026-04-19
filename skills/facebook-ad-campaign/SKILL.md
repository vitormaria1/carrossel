---
name: facebook-ad-campaign
description: "Plans Facebook/Meta ad campaigns with audience targeting, ad creative briefs, budget allocation, and testing strategy. Use when running paid ads on Meta platforms."
allowed-tools: Read Write Glob
metadata:
  author: matthewhitcham
  version: "1.0"
---

# Facebook Ad Campaign

## When to Use This Skill

Use this skill when you need to:
- Plan a Facebook or Instagram advertising campaign from scratch
- Define audience targeting, ad creative, and budget allocation
- Build a testing strategy for ad sets, audiences, and creatives
- Create ad copy and creative briefs for multiple ad variations

**DO NOT** use this skill for organic social media strategy, Google Ads, or influencer marketing. This is specifically for paid Meta (Facebook/Instagram) advertising.

---

## Core Principle

PROFITABLE FACEBOOK ADS ARE BUILT ON THREE PILLARS: THE RIGHT AUDIENCE, A COMPELLING OFFER, AND CREATIVE THAT STOPS THE SCROLL — GET ALL THREE RIGHT AND THE ALGORITHM DOES THE REST.

---

## Phase 1: Campaign Brief

### Required Inputs

| Input | What to Ask | Default |
|-------|------------|---------|
| **Campaign objective** | "What is the goal? (leads, sales, traffic, awareness)" | No default — must be provided |
| **Offer** | "What are you promoting? (product, lead magnet, service)" | No default — must be provided |
| **Landing page** | "Where does the ad send people?" | No default — must be provided |
| **Budget** | "What is your daily or monthly ad budget?" | $20-50/day |
| **Target audience** | "Who is your ideal customer? (demographics, interests, behaviors)" | No default — must be provided |
| **Previous ad experience** | "Have you run Meta ads before? Any data?" | No previous data |

**GATE: Confirm the brief before building the campaign.**

---

## Phase 2: Campaign Architecture

### Campaign Structure

```
## Campaign Setup

**Campaign Level:**
- Objective: [Conversions / Leads / Traffic]
- Campaign Budget Optimization: ON
- Daily budget: $[X]

**Ad Set 1: Interest-Based Targeting**
- Audience: [Interest targets]
- Age: [Range]
- Location: [Countries/regions]
- Placements: Automatic (let Meta optimize)
- Budget allocation: 40%

**Ad Set 2: Lookalike Audience** (if data available)
- Source: [Customer list / website visitors / video viewers]
- Lookalike: 1-3%
- Budget allocation: 40%

**Ad Set 3: Retargeting**
- Audience: Website visitors (last 30 days) + engaged (last 90 days)
- Exclude: customers who already purchased
- Budget allocation: 20%
```

### Audience Targeting Details

```
## Audience Research

**Core Audiences (Interest-Based):**
- Interests: [List 5-10 relevant interests]
- Behaviors: [Online shopping, business owners, etc.]
- Demographics: [Age, gender, location, language]
- Audience size target: 500K-5M (not too broad, not too narrow)

**Exclusions:**
- Existing customers (upload customer email list)
- People who already converted on this offer
- [Any other exclusions]
```

**GATE: Approve the campaign structure and audiences before writing creative.**

---

## Phase 3: Ad Creative

### Ad Copy Variations (3-5 per ad set)

Write multiple ad copy angles:

**Angle 1: Problem-Agitate**
```
Headline: [Benefit or outcome] (40 chars max)
Primary text: [Pain point hook. Agitate. Introduce solution. CTA.]
Description: [Supporting benefit] (25 chars)
CTA button: [Learn More / Sign Up / Shop Now]
```

**Angle 2: Social Proof**
```
Headline: [Result or testimonial]
Primary text: ["Quote from customer." Context on the result. CTA.]
Description: [Credibility signal]
```

**Angle 3: Direct Benefit**
```
Headline: [Clear offer statement]
Primary text: [What you get. Why it matters. How to get it.]
Description: [Urgency or bonus]
```

### Creative Format Briefs

```
## Ad Creative Formats to Test

**Format 1: Static Image**
- Visual: [Description of image concept]
- Text overlay: [3-5 words max on the image]
- Dimensions: 1080x1080 (square) + 1080x1920 (story)

**Format 2: Video (15-30 seconds)**
- Hook (first 3 seconds): [Visual and text hook]
- Problem (seconds 3-10): [Show the pain]
- Solution (seconds 10-20): [Introduce your offer]
- CTA (final seconds): [Clear next step]

**Format 3: Carousel**
- Card 1: [Hook image + headline]
- Card 2: [Benefit 1]
- Card 3: [Benefit 2]
- Card 4: [Social proof]
- Card 5: [CTA]
```

### Ad Copy Rules

- Primary text: 125 characters for optimal display (up to 3 lines before "See more")
- Headline: 40 characters max
- Hook in the first line — most people only see the first sentence
- One CTA per ad — do not split attention
- Speak to one person, not a crowd ("You" not "People")

---

## Phase 4: Polish

### 1. Testing Plan

```
## Week 1-2: Creative Testing
- Test 3-5 ad copies against each other
- Same audience, different creative
- Winner = lowest cost per result

## Week 3-4: Audience Testing
- Take winning creative
- Test across different audience segments
- Winner = best ROAS or lowest CPA

## Ongoing: Scale Winners
- Increase budget 20-30% every 3-4 days on winners
- Kill underperformers (2x target CPA after $20+ spent)
- Introduce new creative every 2 weeks to combat fatigue
```

### 2. Budget Allocation Guidelines

- Testing phase: $20-50/day for 2-4 weeks minimum
- Scaling phase: increase budget only on proven ad sets
- Never increase budget more than 30% in a single day
- Allocate 20% of budget to testing new creative/audiences

### 3. Metrics to Track

| Metric | Target | Action if Below |
|--------|--------|----------------|
| CTR | >1% | Test new creative |
| CPC | <$[X] | Refine targeting |
| Conversion rate | >2% | Improve landing page |
| ROAS | >2x | Review offer and funnel |
| Frequency | <3 | Expand audience or refresh creative |

---

## Anti-Patterns

- **Boosting posts instead of running campaigns** — Ads Manager gives you targeting, testing, and optimization that Boost does not.
- **One ad, one audience, one creative** — you need variations to test. Start with 3-5 creative variations minimum.
- **Killing ads too early** — give each ad $20-50 in spend before judging. Small samples are unreliable.
- **Targeting too narrowly** — audiences under 100K are often too small for Meta's algorithm to optimize. Let the algorithm find your buyers.
- **No retargeting** — retargeting warm audiences (website visitors, video viewers) converts at 3-5x the rate of cold audiences.
- **Ignoring creative fatigue** — when frequency exceeds 3 and CTR drops, your audience has seen the ad too many times. Refresh creative.

---

## Recovery

- **No pixel data or customer list:** Start with interest-based targeting only. Build retargeting audiences by running traffic campaigns first.
- **Budget under $10/day:** Focus on one ad set with 2-3 creative variations. Testing is limited at low budgets.
- **High CPC/low CTR:** The creative is not stopping the scroll. Test new hooks, images, or video formats.
- **Good CTR but no conversions:** The landing page is the problem, not the ad. Review offer, page speed, and conversion path.
- **Ad account restricted:** Review Meta's ad policies, appeal if appropriate, and ensure landing pages comply with advertising standards.
