---
name: affiliate-program
description: "Sets up affiliate and referral program structures with commission tiers, terms and conditions, affiliate onboarding materials, and promotional asset guidelines. Use when a user wants to launch an affiliate program, needs to recruit partners to promote their product, or wants to create a referral incentive system for existing customers."
allowed-tools: Read Write Glob
metadata:
  author: matthewhitcham
  version: "1.0"
---

# Affiliate Program

## When to Use This Skill

Use this skill when:
- A user wants to launch an affiliate or referral program for their product or service
- Someone needs to recruit partners, influencers, or customers to promote their business for a commission
- A user wants commission structures, terms and conditions, or affiliate onboarding materials
- A creator or business owner wants to turn existing customers into referral sources with incentives

**DO NOT** use for joint venture legal agreements, joining other people's affiliate programs, MLM structures, or internal employee commission plans.

---

## Core Principle

EVERY AFFILIATE PROGRAM MUST PAY ENOUGH TO MOTIVATE PROMOTION BUT NEVER ENOUGH TO MAKE THE PRODUCT UNPROFITABLE -- THE COMMISSION STRUCTURE IS THE FOUNDATION, AND EVERY OTHER DECISION FLOWS FROM IT.

---

## Phase 1: Strategy -- Gather Program Requirements

**No brief, no program.** Ask these questions in two groups, waiting for answers between each.

**Group 1 -- Product and Economics (ask all at once):**
1. What product or service are you selling? (digital course, SaaS, physical product, coaching, service)
2. What is the price point? (single price or range)
3. What is your approximate profit margin per sale?
4. Do you have an existing customer base? How large?

**Group 2 -- Program Goals (ask after Group 1):**
5. Primary goal: revenue growth, brand awareness, or audience reach?
6. Who are your ideal affiliates? (influencers, bloggers, existing customers, industry partners)
7. What platform will you manage the program on? (ThriveCart, Gumroad, Rewardful, PartnerStack, manual)
8. Are affiliates bringing their own audience, or promoting to yours?

**GATE: Do not proceed to Phase 2 until you have answers to at least questions 1, 2, 3, and 6.** Default to ThriveCart (digital) or Rewardful (SaaS) and revenue growth if skipped.

### Program Type Reference

| Type | Best For | Commission Model |
|------|----------|-------------------|
| **Standard Affiliate** | Courses, digital products, SaaS | Commission per sale |
| **Referral Program** | E-commerce, services, subscriptions | Reward for referrer + referred |
| **Ambassador Program** | Brands, coaching, communities | Ongoing commission + perks |
| **Joint Venture** | High-ticket courses, events | Revenue share (40-50%) |

**Recommend one type.** Do not present all four as equal options:
- Price under $100 + existing customers = **Referral Program**
- Price $100-997 + influencers/bloggers = **Standard Affiliate**
- Price $100-997 + ongoing relationships = **Ambassador Program**
- Price $1000+ + peer audience = **Joint Venture**

---

## Phase 2: Structure -- Build the Program Framework

### Commission Rates by Product Type

| Product Type | Default Rate | Model |
|-------------|-------------|-------|
| Digital course ($100-997) | 30% per sale | One-time |
| Digital course ($1000+) | 20% per sale | One-time |
| SaaS/subscription | 20% recurring for 12 months | Recurring |
| Physical product ($35-100) | 15% per sale | One-time |
| Physical product ($100+) | 10% per sale | One-time |
| Service/coaching ($500+) | 15-20% per sale | One-time |
| Low-ticket digital ($10-99) | 40-50% per sale | One-time |

**Tiered commissions (recommend for Ambassador programs):** Base (0-10 sales/month): 25%, Silver (11-25): 30%, Gold (26+): 35%. Resets monthly.

**CRITICAL: Run a profitability check before finalizing:**

```
Sale price:          $497
Commission (30%):    -$149.10
Platform fees (~3%): -$14.91
Fulfillment cost:    -$50.00
                     --------
Net per affiliate sale: $283.00
```

**If net per affiliate sale drops below 20% of the sale price, reduce the commission rate.**

### Cookie Duration

| Product Type | Default Cookie |
|-------------|---------------|
| Impulse buy (under $50) | 30 days |
| Considered purchase ($50-500) | 60 days |
| High-ticket ($500+) | 90 days |
| SaaS/subscription | 90 days |

### Payment Terms

Default: $50 minimum payout, monthly (by the 15th), PayPal or bank transfer. Commissions on refunded sales are clawed back. Commissions held 30 days past the refund period before release.

### Terms and Conditions

Generate a terms document covering these 6 sections:

1. **Program overview** -- what it is, who can join, how commissions work
2. **Prohibited marketing** -- no spam, no brand-name PPC bidding, no coupon sites without approval, no misleading claims, no fake reviews, no income guarantees
3. **FTC disclosure** -- affiliates MUST disclose in every post; disclosure must be clear, conspicuous, and before the affiliate link; hashtags alone (#ad) are insufficient without a written statement
4. **Brand guidelines** -- approved descriptions, logo usage rules, approved images only, match brand voice
5. **Termination** -- 30 days notice, immediate for violations, unpaid valid commissions still honored
6. **Liability** -- affiliate responsible for own compliance and taxes

### Tracking Setup

| Platform | Method |
|----------|--------|
| ThriveCart | Built-in affiliate center, auto-generated unique links |
| Gumroad | Unique discount codes per affiliate |
| Rewardful | Stripe-integrated referral links, auto-tracks recurring |
| PartnerStack | Full dashboard, auto-payouts |
| Manual | UTM parameters + spreadsheet |

**GATE: Present the complete structure to the user. Do not proceed until they approve.**

---

## Phase 3: Materials -- Create Affiliate Onboarding Assets

### Asset 1: Welcome Email

Sent immediately after approval. Must include: welcome (1-2 sentences), their unique link/code, commission rate and cookie duration, link to affiliate guide, link to promo assets, contact for questions, single CTA.

**Example -- online course:**

```
Subject: Welcome to the Freelance Mastery Affiliate Program

Hi Alex,

Welcome aboard -- you are officially a Freelance Mastery affiliate.

YOUR DETAILS:
  Affiliate link: https://freelancemastery.com/?ref=alex-chen
  Commission: 30% per sale ($149.10 per enrollment)
  Cookie duration: 60 days

RESOURCES:
  Affiliate Guide: [link]  |  Promotional Assets: [link]

Questions? Reply to this email -- I respond within 24 hours.

Start sharing your link today. Every enrollment earns you $149.10.

-- Jamie, Freelance Mastery
```

**Example -- e-commerce referral:**

```
Subject: You are in! Welcome to the Glow Lab Referral Program

Hi Priya,

Thanks for joining. Your friends save 15%, you earn $10 credit.

YOUR DETAILS:
  Referral code: PRIYA15 (15% off for friends)
  Your reward: $10 store credit per referral
  Cookie: 30 days

RESOURCES:
  Referral Guide: [link]  |  Share Graphics: [link]

Share your code on Instagram, in stories, or text it to friends.

-- The Glow Lab Team
```

### Asset 2: Affiliate Guide

Structure the guide with these sections:
- **How the Program Works** -- link/code, commission rate, payment schedule
- **Commission Structure** -- rates and tiers from Phase 2
- **How to Promote** -- top 5 strategies (personal recommendations, educational content, comparison content, email newsletters, social stories)
- **Do This** -- share honest experience, disclose relationship, use approved assets, create original content
- **Do NOT Do This** -- no income claims, no result guarantees, no spam, no brand PPC, no logo modification, no fake reviews, no coupon sites without approval
- **Payment Schedule** -- from Phase 2
- **FTC Disclosure** -- requirements and examples from terms
- **Contact** -- email and response time

### Asset 3: Promotional Swipe Copy (8 Pieces)

Create all copy tailored to the user's specific product. **Every piece must include FTC disclosure language.**

**3 email templates:**
1. Personal recommendation -- "The [product type] I wish I found sooner" format, one specific result, affiliate disclosure
2. Problem-solution -- "I used to [problem], then I found [product]" format, concrete outcome, disclosure
3. Newsletter mention -- brief endorsement for roundups, disclosure inline with link

**3 social posts:**
1. Instagram/LinkedIn story-based -- "I get asked all the time..." format with 3 benefits, disclosure
2. Twitter/X concise -- one-sentence endorsement with link, disclosure
3. Facebook conversational -- "Has anyone tried..." format, personal experience, disclosure

**2 story/reel scripts:**
1. Quick recommendation (15-30 sec) -- name the product, one result, link in stories, disclosure tag
2. Before/after (30-45 sec) -- show the problem, show the result, credit the product, disclosure

**CRITICAL: Replace all bracket placeholders with the user's actual product details.** Affiliates copy-paste exactly what you give them.

### Asset 4: Promotional Asset Checklist

Tell the user what visual assets to prepare for affiliates: primary logo (PNG, transparent, 500px+), logo on white and dark backgrounds, hero product image (1200x1200), lifestyle image (1200x800), product mockup, Instagram banner (1080x1080), Facebook banner (1200x630), email banner (600x200), product thumbnail (300x300). All in a shared folder. No editable source files.

### Asset 5: Application Form (Curated Programs Only)

9 questions: name/email, website/social URL, platforms used, audience size, audience description, prior product experience, promotion plan, competing affiliates, motivation. Skip for open referral programs -- auto-enroll customers.

**GATE: Present all materials for approval. Do not proceed until confirmed.**

---

## Phase 4: Deliver -- Complete Program Package

Write all components to this structure:

```
affiliate-program/
  program-overview.md
  terms-and-conditions.md
  affiliate-guide.md
  swipe-copy/
    email-templates.md
    social-posts.md
    story-scripts.md
  affiliate-welcome-email.md
  application-form.md (curated programs only)
  launch-checklist.md
```

### Launch Checklist (include in deliverable)

**Setup (Before Recruiting):**
- [ ] Commission structure finalized and profitability verified
- [ ] Affiliate platform configured (tracking links, payout settings)
- [ ] Terms and conditions published
- [ ] Affiliate guide hosted and accessible
- [ ] Promotional assets uploaded to shared folder
- [ ] Swipe copy reviewed and finalized
- [ ] Welcome email loaded into email tool
- [ ] Application form live (if curated)

**Recruitment (Week 1-2):**
- [ ] Announce program to existing customers via email
- [ ] Personally reach out to 10 target affiliates
- [ ] Post about the program on social channels
- [ ] Add "Affiliates" link to website footer

**Ongoing:**
- [ ] Review applications within 48 hours
- [ ] Send welcome email within 24 hours of approval
- [ ] Process payouts by the 15th monthly
- [ ] Spot-check affiliate content for FTC compliance monthly
- [ ] Update swipe copy with new testimonials quarterly

**Confirm delivery:** "Your affiliate program has been saved to [path]. Here is what was created: [list files]. To launch: configure your platform with the commission structure, publish terms, and start recruiting."

---

## Concrete Examples

### Example 1: Online Course -- $497 Affiliate Program

**User:** "I sell a $497 course called Freelance Mastery. I want affiliates targeting coaches and educators. 85% margins. ThriveCart."

**Phase 1:** Standard Affiliate program (digital course + influencer targets). **Phase 2:** 30% commission ($149.10/sale), 60-day cookie, monthly payouts at $50 minimum. Profitability: $497 - $149.10 (commission) - $14.91 (fees) - $74.55 (fulfillment) = $258.44 net (52%) -- healthy. **Phase 3:** Welcome email with ThriveCart link, affiliate guide for educator audience, 8 swipe pieces focused on freelancer transformation, asset checklist with course mockup specs, 9-question application form. **Phase 4:** 8 files to `affiliate-program/`.

### Example 2: E-Commerce Skincare -- Referral Program

**User:** "I run Glow Lab ($35-65 products). I want existing customers to refer friends. 3,000 customers. Shopify."

**Phase 1:** Referral Program (low price + existing customers). **Phase 2:** $10 store credit per referral, 15% off for referred friend, unique codes (PRIYA15), 30-day cookie. Profitability on $50 avg: $50 - $7.50 (discount) - $10 (credit) - $22.50 (COGS) = $10 net (20%) -- acceptable given 3x LTV of referred customers. **Phase 3:** Auto-enrollment welcome email, simplified referral guide, 8 swipe pieces framed as sharing products they love, asset checklist with product photos. No application form. **Phase 4:** 7 files.

---

## Anti-Patterns

- **DO NOT set commissions that make the product unprofitable.** Always run the profitability check. If net drops below 20% of sale price, reduce the rate.
- **DO NOT skip FTC disclosure requirements.** Every program must include FTC language in terms, guide, and swipe copy. Non-negotiable.
- **DO NOT create swipe copy with income claims.** No "I made $10K" or "You will earn six figures." Focus on product benefits and genuine experience only.
- **DO NOT build a curated Ambassador program for users with fewer than 100 customers.** Not enough volume to be selective. Start with Standard or Referral.
- **DO NOT recommend recurring commissions for one-time purchases.** Recurring only applies to subscription/SaaS products.
- **DO NOT create a program without terms and conditions.** Even simple referral programs need basic rules. Skipping creates disputes.
- **DO NOT set cookie durations beyond 90 days.** Attribution becomes unreliable. Cap at 120 days absolute maximum if the user insists.
- **DO NOT promise affiliates exclusive territories.** Creates conflicts. Keep the program open.
- **DO NOT deliver swipe copy without disclosures built in.** Affiliates copy-paste exactly what you provide -- missing disclosures in templates means missing disclosures in their posts.

---

## Recovery

- **User does not know their margin:** Ask for delivery cost per customer. If still unknown, default to: digital 85%, SaaS 75%, physical 50%, services 60%. Flag it: "Verify against actual costs before launching."
- **User wants commissions too high:** Show the math, recommend a sustainable rate. If they insist, build it with a warning: "Review after 90 days."
- **User has no affiliate platform:** Under 20 affiliates -- build manual tracking (UTM links + Google Sheets + PayPal). Scaling -- recommend Rewardful or ThriveCart. Provide structure regardless.
- **User wants to launch before materials are ready:** Minimum viable set: welcome email, one-page guide, 2 email templates. Mark the rest as "add within 30 days."
- **Platform configuration fails:** Provide all program docs anyway plus a manual tracking spreadsheet template.
- **If 3 revision rounds fail:** Save with [REVISIT] tags. "Launch with what we have. Revise based on real affiliate feedback after 30 days."

---

## Pre-Delivery Checklist

- [ ] Commission structure profitable (net above 20% of sale price)
- [ ] Cookie duration matches the product's decision cycle
- [ ] Payment terms include threshold, frequency, method, and refund holdback
- [ ] Terms cover all 6 sections (overview, prohibited methods, FTC, brand, termination, liability)
- [ ] FTC disclosure appears in terms, guide, and every swipe copy piece
- [ ] No swipe copy contains income claims or earnings guarantees
- [ ] Welcome email includes link/code, commission rate, and resource links
- [ ] Affiliate guide covers promotion strategies, rules, payments, and FTC
- [ ] All 8 swipe pieces complete (3 emails, 3 social, 2 stories)
- [ ] Asset checklist specifies sizes and formats
- [ ] Application form included (curated) or intentionally omitted (open referral)
- [ ] Launch checklist covers setup, recruitment, and ongoing management
- [ ] No unfilled placeholders remain
