---
name: retargeting-strategy
description: "Designs retargeting campaigns with audience segmentation, messaging by funnel stage, and frequency caps. Use when re-engaging website visitors who didn't convert."
allowed-tools: Read Write Glob
metadata:
  author: matthewhitcham
  version: "1.0"
---

# Retargeting Strategy

## When to Use This Skill

Use this skill when you need to:
- Design retargeting campaigns across Meta, Google, or other ad platforms
- Segment retargeting audiences by behavior and funnel stage
- Create messaging strategies specific to where prospects dropped off
- Set frequency caps and exclusions to avoid ad fatigue

**DO NOT** use this skill for cold audience targeting, email retargeting sequences, or organic remarketing. This is for paid ad retargeting of website visitors and engaged audiences.

---

## Core Principle

RETARGETING IS NOT SHOWING THE SAME AD TO EVERYONE WHO VISITED YOUR SITE — IT IS DELIVERING THE RIGHT MESSAGE BASED ON HOW FAR THEY GOT IN YOUR FUNNEL AND WHY THEY STOPPED.

---

## Phase 1: Brief

### Required Inputs

| Input | What to Ask | Default |
|-------|------------|---------|
| **Website traffic** | "How many monthly website visitors do you get?" | No default — must be provided |
| **Pixel/tracking** | "Do you have Meta Pixel and/or Google Tag installed?" | Needs verification |
| **Conversion action** | "What counts as a conversion? (purchase, signup, booking)" | Purchase |
| **Funnel stages** | "What pages do people visit before converting?" | Homepage → Product → Checkout |
| **Ad platforms** | "Where will you run retargeting? (Meta, Google, both)" | Meta (Facebook/Instagram) |
| **Budget for retargeting** | "What budget can you allocate to retargeting specifically?" | 20% of total ad budget |

**GATE: Confirm before designing the retargeting architecture.**

---

## Phase 2: Audience Segmentation

### Retargeting Audience Tiers

```
## Audience Segments

**Tier 1: Cart/Checkout Abandoners** (Hottest)
- Definition: Added to cart or reached checkout but didn't purchase
- Window: Last 7 days
- Priority: Highest — closest to conversion
- Budget: 40% of retargeting budget

**Tier 2: Product/Sales Page Viewers**
- Definition: Viewed product or sales page but didn't add to cart
- Window: Last 14 days
- Priority: High — showed strong interest
- Budget: 25% of retargeting budget

**Tier 3: Content Engagers**
- Definition: Read blog posts, watched videos, or spent 30+ seconds on site
- Window: Last 30 days
- Priority: Medium — interested but not ready
- Budget: 20% of retargeting budget

**Tier 4: General Visitors**
- Definition: Any website visitor not in Tiers 1-3
- Window: Last 60 days
- Priority: Lower — awareness level
- Budget: 15% of retargeting budget
```

### Exclusions

```
## Critical Exclusions

- Recent purchasers (last 30 days) — do NOT retarget buyers with the same product
- Existing customers — separate them into cross-sell audiences if applicable
- Bounced visitors (under 5 seconds on site) — they left immediately, not worth retargeting
- People who already converted on this campaign
```

**GATE: Approve audience segments before writing ad creative.**

---

## Phase 3: Messaging by Segment

### Tier 1: Cart Abandoners

```
Ad angle: Urgency + objection handling
Copy: "You left something behind. Complete your order and get [incentive]."
Creative: Show the specific product they abandoned (dynamic ads)
CTA: Return to Cart
Incentive: Free shipping, 10% off, or limited-time bonus
Frequency cap: 1 impression per day
```

### Tier 2: Sales Page Viewers

```
Ad angle: Social proof + benefit reinforcement
Copy: "Still thinking about [product]? Here's what [customer name] said about it..."
Creative: Testimonial-focused image or video
CTA: Learn More / Shop Now
Frequency cap: 1 impression per day
```

### Tier 3: Content Engagers

```
Ad angle: Value-first + soft CTA
Copy: "Liked our guide on [topic]? Here's how to take the next step..."
Creative: Educational content or lead magnet offer
CTA: Download / Sign Up / Read More
Frequency cap: 1 impression every 2 days
```

### Tier 4: General Visitors

```
Ad angle: Brand awareness + credibility
Copy: "[Brand] helps [audience] achieve [result]. See how."
Creative: Brand story or overview video
CTA: Learn More
Frequency cap: 1 impression every 3 days
```

### Dynamic Retargeting (E-commerce)

If applicable, set up dynamic product ads:
- Show the exact products they viewed
- Include price, product image, and short description
- Add "Back in stock" or "Low stock" urgency if true

---

## Phase 4: Polish

### 1. Frequency Management

```
## Frequency Caps

- Cart abandoners: max 1/day for 7 days, then stop
- Sales page viewers: max 1/day for 14 days
- Content engagers: max 1/every 2 days for 30 days
- General visitors: max 1/every 3 days for 60 days

If frequency exceeds 4 without conversion, move to a "cool down" period (exclude for 14 days).
```

### 2. Creative Refresh Schedule

- Refresh ad creative every 2-3 weeks
- Rotate between 3-4 creative variations per audience
- Retire creatives when CTR drops below 0.5%

### 3. Performance Benchmarks

| Metric | Cold Audience | Retargeting | Target |
|--------|-------------|-------------|--------|
| CTR | 0.5-1.5% | 2-5% | Higher for retargeting |
| CPC | $1-3 | $0.50-2 | Lower for retargeting |
| Conversion rate | 1-3% | 5-15% | Much higher for retargeting |
| ROAS | 1-3x | 5-15x | Retargeting is your best ROAS |

---

## Anti-Patterns

- **One audience, one ad for everyone** — a first-time visitor and a cart abandoner need completely different messages.
- **No frequency caps** — showing the same ad 20 times creates annoyance, not conversions. Cap at 1-2 per day.
- **Retargeting buyers with the same product** — congratulations, you already sold them. Exclude purchasers or move them to cross-sell campaigns.
- **Too-long retargeting windows** — someone who visited 90 days ago has forgotten you. Windows longer than 60 days for most segments waste budget.
- **No pixel installed** — you cannot retarget without tracking. Install pixels before driving any paid traffic.

---

## Recovery

- **Low website traffic (under 1,000/month):** Retargeting audiences will be too small. Focus on building traffic first, then activate retargeting when audiences reach 1,000+ per segment.
- **No pixel data yet:** Install the pixel now and let it collect data for 2-4 weeks before launching retargeting campaigns.
- **High frequency, low conversions:** The messaging is wrong or the audience has decided no. Refresh creative, change the offer, or exclude and move on.
- **Ad fatigue across all creatives:** Pause retargeting for 2 weeks to let audiences cool down, then re-launch with completely new creative angles.
