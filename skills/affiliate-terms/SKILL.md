---
name: affiliate-terms
description: "Creates affiliate program terms and conditions with commission rules, prohibited methods, and termination clauses. Use when launching or documenting an affiliate program."
allowed-tools: Read Write Glob
metadata:
  author: matthewhitcham
  version: "1.0"
---

# Affiliate Terms

## When to Use This Skill

Use this skill when you need to:
- Create terms and conditions for an affiliate or referral program
- Define commission structures, payment rules, and prohibited methods
- Establish brand guidelines and promotional restrictions
- Document cookie windows, attribution, and tracking policies

**DO NOT** use this skill for influencer contracts (use influencer-campaign-brief), sales commission plans (use commission-structure), or general partnership agreements. This is for affiliate program terms.

---

## Core Principle

AFFILIATE TERMS PROTECT YOUR BRAND AND YOUR BOTTOM LINE — CLEAR RULES PREVENT FRAUD, BRAND DAMAGE, AND COMMISSION DISPUTES BEFORE THEY START.

---

## Phase 1: Program Details

### Required Inputs

| Input | What to Ask | Default |
|-------|------------|---------|
| **Product/service** | "What product or service will affiliates promote?" | No default — must be provided |
| **Commission rate** | "What percentage or flat fee per sale/lead?" | No default — must be provided |
| **Cookie window** | "How long does attribution last after a click? (30, 60, 90 days)" | 30 days |
| **Payment threshold** | "Minimum payout amount?" | $50 |
| **Payment frequency** | "How often do you pay? (monthly, bi-weekly)" | Monthly |
| **Approval process** | "Auto-approve affiliates or manual review?" | Manual approval |

**GATE: Do not proceed without product, commission rate, and cookie window.**

---

## Phase 2: Terms Document

```
## [Product/Company Name] Affiliate Program Terms and Conditions

**Effective Date:** [Date]
**Last Updated:** [Date]

### 1. Program Overview

The [Company Name] Affiliate Program allows approved participants
("Affiliates") to earn commissions by referring customers to
[Product/Service] through unique tracking links.

### 2. Enrollment and Approval

- Applications are reviewed within [3-5] business days
- [Company] reserves the right to accept or reject any application
  without explanation
- Affiliates must be [18+] years of age
- Affiliates must have an active website, social media presence,
  or email list
- [Company] may terminate any affiliate account at any time

### 3. Commission Structure

| Action | Commission | Notes |
|--------|-----------|-------|
| [Sale / Signup / Lead] | [X]% or $[X] flat | [Per transaction] |
| Recurring commission | [Yes: X% for X months / No] | [If applicable] |

**Commission rules:**
- Commissions are earned when a referred customer completes a
  [qualifying purchase / signup / action]
- Self-referrals are prohibited and will result in commission reversal
  and account termination
- Commission is voided if the customer requests a refund within
  [30] days
- [Company] reserves the right to adjust commission rates with
  [30] days notice

### 4. Tracking and Attribution

- Attribution uses [cookies / last-click / first-click] tracking
- Cookie duration: [30] days from the referral click
- If a customer clears cookies or uses a different device, the
  referral may not be tracked
- [Company] is not responsible for technical issues that prevent
  proper tracking
- Affiliates must use only the tracking links provided through
  the affiliate dashboard

### 5. Payment Terms

| Detail | Terms |
|--------|-------|
| Minimum payout | $[50] |
| Payment schedule | [Monthly, on the 15th] |
| Payment methods | [PayPal / ACH / wire / check] |
| Commission hold period | [30] days after sale (for refund window) |
| Tax requirements | W-9 (US) or W-8BEN (international) required before first payout |

### 6. Permitted Promotional Methods

Affiliates MAY promote using:
- Personal website or blog content
- Email marketing to their own opted-in list
- Social media posts (organic)
- YouTube or podcast content
- Online communities where they are active members (with disclosure)

### 7. Prohibited Methods

Affiliates shall NOT:
- Bid on [Company] branded keywords or variations in paid search
- Use cookie stuffing, click fraud, or other deceptive tracking methods
- Send unsolicited email (spam) using affiliate links
- Make false or misleading claims about the product
- Create websites or domains that impersonate [Company]
- Use pop-ups, pop-unders, or forced redirects
- Offer unauthorized discounts or coupon codes
- Promote on adult, violent, or hate-speech content
- Use the affiliate link for their own purchases
- Sub-affiliate or assign their affiliate account to others

### 8. Brand Guidelines

- Use only approved logos, images, and promotional materials
- Do not modify [Company] trademarks, logos, or branding
- All promotional content must be truthful and not misleading
- Affiliates must include FTC-required disclosure in all content:
  "This post contains affiliate links. I may earn a commission if
  you make a purchase through my link."

### 9. Relationship

Affiliates are independent contractors. This agreement does not create
an employment, agency, or partnership relationship. Affiliates are
responsible for their own taxes and compliance.

### 10. Termination

Either party may terminate at any time with [7] days written notice.
[Company] may terminate immediately for:
- Violation of these terms
- Fraudulent activity
- Brand misrepresentation
- Inactivity for [6] months

Upon termination, unpaid commissions above the minimum threshold
will be paid in the next payment cycle. Pending commissions below
the minimum threshold are forfeited.

### 11. Modifications

[Company] may modify these terms with [30] days notice via email.
Continued participation after the notice period constitutes acceptance.

### 12. Limitation of Liability

[Company]'s total liability to any Affiliate shall not exceed the
total commissions paid in the [12] months preceding the claim.
```

---

## Phase 3: Program Setup Checklist

```
## Affiliate Program Launch Checklist

- [ ] Terms and conditions published on website
- [ ] Affiliate signup page created
- [ ] Tracking system configured (affiliate software or platform)
- [ ] Unique link generation working
- [ ] Commission tracking and attribution tested
- [ ] Payment processing set up (PayPal, bank transfers)
- [ ] Affiliate dashboard accessible (links, stats, payouts)
- [ ] Brand assets and promotional materials uploaded
- [ ] Welcome email template created for new affiliates
- [ ] Tax forms collection process ready (W-9/W-8BEN)
```

---

## Phase 4: Delivery

Output the complete affiliate terms document ready for publication on the website and provide the program setup checklist.

---

## Example: Online Course Affiliate Program

**Commission:** 30% per sale ($59.10 on a $197 course). **Cookie:** 60 days. **Recurring:** No (one-time purchase). **Minimum payout:** $100. **Prohibited:** Bidding on brand name in Google Ads, coupon sites, email spam. **Refund policy:** Commission reversed if refund within 30 days.

---

## Anti-Patterns

- **No branded keyword restriction** — affiliates bidding on your brand name in Google Ads costs you money on traffic you would have gotten organically
- **No refund clawback** — without a refund window hold, affiliates can drive low-quality traffic and collect commissions on purchases that get refunded
- **Vague prohibited methods** — be specific about what is not allowed. "No spam" is not enough — define spam, cookie stuffing, and brand impersonation.
- **No FTC disclosure requirement** — affiliates must disclose their financial relationship. If they do not, your brand is at risk.
- **Auto-approving everyone** — manual review prevents coupon sites, spam sites, and brand-damaging affiliates from joining.

---

## Recovery

- **Affiliate violating terms:** Document the violation, suspend their account, reverse any fraudulent commissions, and notify them in writing.
- **Coupon/deal sites scraping your codes:** Add a clause prohibiting unauthorized coupon distribution. Monitor and send cease and desist notices.
- **Commission dispute:** Refer to the tracking data in the affiliate dashboard. The terms should state that your tracking system is the final authority.
- **Need to change commission rates:** Provide 30 days notice. Honor existing rates for sales in the pipeline. Consider grandfathering top affiliates.
