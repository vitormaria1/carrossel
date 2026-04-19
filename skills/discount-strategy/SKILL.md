---
name: discount-strategy
description: Plans promotional pricing campaigns with discount types, timing, margin-safe guardrails, and promotion calendars. Use this skill when a user wants to run a sale, create a promotional offer, or plan seasonal discounts without destroying their profit margins.
allowed-tools: Read Write Bash(ls)
---

# Discount Strategy

## When to Use This Skill

- User wants to run a sale or promotional pricing campaign
- User needs to choose between discount types (percentage off, BOGO, bundle, etc.)
- User is planning seasonal or holiday promotions
- User is worried about discounting too aggressively and hurting margins
- User wants a structured promotion calendar for the quarter or year

## Core Principle

NEVER DISCOUNT WITHOUT A MARGIN FLOOR — EVERY PROMOTION MUST HAVE A MINIMUM PROFIT THRESHOLD CALCULATED BEFORE LAUNCH.

## Workflow

### Phase 1: Understand the Business Economics

1. Gather baseline numbers:
   - Product/service price point(s)
   - Cost of goods sold (COGS) or service delivery cost
   - Current gross margin percentage
   - Average order value (AOV)
   - Monthly revenue and unit volume
2. Calculate the margin floor: the maximum discount that still leaves a minimum acceptable profit per unit
3. **GATE: If gross margin is below 30%, recommend value-add promotions (bonuses, bundles) instead of price cuts**

### Phase 2: Select Discount Type

4. Recommend one discount type based on business model and goal:

| Discount Type | Best For | Margin Impact | Example |
|--------------|----------|---------------|---------|
| Percentage off | Clearing inventory, seasonal sales | Medium-High | 20% off all candles |
| Dollar amount off | Higher AOV products | Medium | $15 off orders over $75 |
| Bundle discount | Increasing AOV | Low | Buy 3 bars, get 15% off |
| BOGO/Gift with purchase | Moving slow stock | Medium | Buy shampoo, get free travel size |
| Free shipping threshold | Increasing AOV | Low | Free shipping on orders over $50 |
| Early-bird pricing | Launches, courses | Low | $197 for first 50 buyers (reg $297) |
| Tiered discount | Bulk/wholesale | Low-Medium | 10% off 2+, 15% off 4+, 20% off 6+ |
| Limited-time flash | Urgency, email list activation | High | 40% off for 24 hours only |

5. Default recommendation: **Bundle discount or free shipping threshold** — these increase AOV while protecting per-unit margin

### Phase 3: Set Guardrails

6. Define these constraints for every promotion:
   - **Margin floor**: Minimum profit per unit after discount (never go below)
   - **Volume cap**: Maximum units at discount price (prevents runaway losses)
   - **Time limit**: Hard end date (no indefinite sales)
   - **Stacking rules**: Whether discount combines with other offers (default: no stacking)
   - **Exclusions**: Products or categories exempt from discount

7. Calculate break-even volume: how many additional units must sell to offset the margin reduction

### Phase 4: Build the Promotion Plan

8. Write the complete promotion brief:

```
PROMOTION BRIEF

Campaign: [Name]
Type: [Discount type]
Discount: [Specific amount]
Duration: [Start date — End date]
Margin floor: [Minimum profit per unit]
Break-even volume: [X additional units needed]
Volume cap: [Maximum discounted units]
Stacking: [Yes/No]
Exclusions: [Listed products/categories]

Messaging: [One-line promo message]
Channels: [Where it will be promoted]
```

9. If the user wants a multi-promotion calendar, map out up to 4 promotions per quarter with at least 3 weeks between each

### Phase 5: Deliver

10. Output the promotion brief
11. Output margin impact analysis (before vs. during promotion)
12. If applicable, output a quarterly promotion calendar

## Example 1: Handmade Candle Business Running a Holiday Sale

**Business context:**
- Average candle price: $32
- COGS per candle: $9
- Gross margin: 72%
- AOV: $48 (1.5 candles average)
- Monthly volume: 200 units

**Promotion Brief:**

```
PROMOTION BRIEF

Campaign: Holiday Warmth Bundle
Type: Bundle discount
Discount: Buy any 3 candles, get 20% off the bundle
Duration: November 15 — December 15 (30 days)
Margin floor: $16.60 profit per candle (52% gross margin minimum)
Break-even volume: No additional volume needed — margin stays above floor
Volume cap: 500 candles (prevents inventory stockout before Christmas)
Stacking: No — does not combine with loyalty rewards or other codes
Exclusions: Limited edition holiday collection (sold at full price)

Messaging: "Bundle up for the holidays — 20% off when you grab any 3"
Channels: Email list, Instagram Stories, website banner

MARGIN ANALYSIS:
                    Normal      During Promo
Price per candle:   $32.00      $25.60
COGS:               $9.00       $9.00
Profit per unit:   $23.00      $16.60
Gross margin:        72%         65%
AOV:               $48.00      $76.80 (3 candles bundled)
Profit per order:  $34.50      $49.80 (+44% profit per order)
```

**Result:** Even at 20% off, profit per order increases by 44% because the bundle raises AOV from $48 to $76.80.

## Example 2: Online Course Creator Running Early-Bird Pricing

**Business context:**
- Course price: $497
- Delivery cost: $12 (platform fees, hosting)
- Gross margin: 97.6%
- Target enrollment: 150 students per cohort
- Current list size: 4,200 email subscribers

**Promotion Brief:**

```
PROMOTION BRIEF

Campaign: Founding Members Early Bird
Type: Early-bird pricing
Discount: $297 for first 30 buyers (40% off regular $497)
Duration: February 1 — February 7 (7 days or until 30 spots fill)
Margin floor: $285 profit per seat (96% gross margin)
Break-even volume: N/A — still highly profitable per unit
Volume cap: 30 seats at early-bird price, then reverts to $497
Stacking: No
Exclusions: Payment plans not available at early-bird price (full pay only)

Messaging: "Join as a founding member — $297 (regular $497). Only 30 spots."
Channels: Email sequence (3 emails over 7 days), Instagram countdown

MARGIN ANALYSIS:
                      Regular     Early Bird
Price per seat:       $497        $297
Delivery cost:         $12         $12
Profit per seat:      $485        $285
Gross margin:         97.6%       96.0%
Revenue (30 seats):   $14,910     $8,910
Revenue (remaining 120 at full): $59,640    $59,640
Total cohort revenue: $74,550     $68,550

QUARTERLY PROMOTION CALENDAR (Q1):
Week 1-2 Feb: Early-bird launch (above)
Week 3 Mar: Free workshop funnel (no discount, content-driven)
Week 2 Apr: Alumni referral bonus ($50 credit per referral, no price cut)
```

**Result:** Early-bird generates $8,910 in the first week, creates social proof with 30 enrolled students, and the remaining 120 seats sell at full price. Total revenue impact is only -8% vs. all full price, but cash flow and enrollment velocity are dramatically better.

## Recovery and Fallback

- If the user does not know their COGS, help them estimate: for physical products, add materials + packaging + shipping; for services, use hourly rate x time spent; for digital products, use platform fees only
- If gross margin is below 30%, pivot to value-add promotions instead of price cuts: add a bonus product, extend a warranty, include a free consultation
- If a promotion underperforms at the halfway point, recommend ending it early and redirecting budget to a different channel rather than deepening the discount
- If the user wants to run more than one promotion per month, warn that frequent discounting trains customers to wait for sales — recommend a maximum of one promotion every 3 weeks

## Constraints

- **Never recommend a discount that drops gross margin below 20%** — this is the absolute floor for sustainable business
- Do not recommend percentage-off discounts greater than 40% unless clearing dead inventory
- Every promotion must have a hard end date — no open-ended sales
- Do not recommend discount stacking unless the user explicitly requests it
- Always calculate break-even volume before recommending any price cut
- Discourage site-wide percentage discounts for service businesses — they devalue expertise
- Warn the user if they are running promotions more frequently than every 3 weeks
