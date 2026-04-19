---
name: podcast-ad-script
description: "Writes host-read and pre-produced podcast ad scripts with natural integration points and tracking URLs. Use when creating podcast advertising spots or sponsorship reads."
allowed-tools: Read Write Glob
metadata:
  author: matthewhitcham
  version: "1.0"
---

# Podcast Ad Script

## When to Use This Skill

Use this skill when you need to:
- Write host-read ad scripts for podcast sponsorships
- Create pre-produced (announcer-read) podcast ad spots
- Develop ad scripts for pre-roll, mid-roll, or post-roll placements
- Produce multiple script variations for different podcast shows

**DO NOT** use this skill for podcast episode outlines, show notes, or radio commercials. This is specifically for podcast advertising scripts.

---

## Core Principle

THE BEST PODCAST ADS SOUND LIKE THE HOST GENUINELY RECOMMENDING SOMETHING TO A FRIEND — NOT READING A CORPORATE SCRIPT.

---

## Phase 1: Brief

### Required Inputs

| Input | What to Ask | Default |
|-------|------------|---------|
| **Product/service** | "What are you advertising?" | No default — must be provided |
| **Ad type** | "Host-read or pre-produced?" | Host-read |
| **Placement** | "Pre-roll (60s), mid-roll (60-90s), or post-roll (30s)?" | Mid-roll (60 seconds) |
| **Offer/CTA** | "What is the offer? (discount code, URL, free trial)" | No default — must be provided |
| **Key talking points** | "What 2-3 points must be mentioned?" | No default — must be provided |
| **Podcast genre** | "What type of podcast will this run on? (business, comedy, true crime, health)" | Business/entrepreneurship |

**GATE: Do not proceed until the product, offer, and key talking points are confirmed.**

---

## Phase 2: Script Framework

Select the framework based on ad type and placement.

### Host-Read Structure

**Pre-Roll (30-60 seconds)**
- Personal connection or use case (10s)
- What the product does and why it matters (20s)
- Offer + tracking URL/code (10s)

**Mid-Roll (60-90 seconds)**
- Story or personal experience with the product (20-30s)
- Key benefits — maximum 3 (20-30s)
- Offer + tracking URL/code + repeat (15-20s)

**Post-Roll (15-30 seconds)**
- Quick reminder of the sponsor and offer (10s)
- Tracking URL/code (5-10s)

### Pre-Produced Structure

- Announcer intro with brand name (5s)
- Problem + solution framing (15-20s)
- Key benefit + proof point (15-20s)
- Offer + CTA + URL (10-15s)

---

## Phase 3: Write Scripts

Deliver 2 script variations with different angles.

### Script Format

```
## Script [A/B]: [Angle Name]

**Type:** Host-read / Pre-produced
**Placement:** Mid-roll
**Duration:** ~60 seconds
**Word count:** ~150 words (aim for 2.5 words/second)

---

[HOST TALKING POINTS — not a word-for-word script]

• Open with: [Personal story or relatable situation]
  Example: "So I've been using [Product] for about three months now, and I have to tell you..."

• Bridge to product: [How the product connects to the story]
  Example: "What I love about it is [specific benefit] — I was doing [old way] before and it took me [time]."

• Key benefits (hit these naturally):
  1. [Benefit 1 — most relevant to this audience]
  2. [Benefit 2]
  3. [Benefit 3 — optional]

• Offer: [Exact offer language]
  "Go to [tracking URL] or use code [CODE] at checkout for [discount]."

• Repeat URL/code: [Say it twice, spell it out if needed]

---

**Tracking URL:** [vanity URL]
**Promo code:** [CODE]
**Must-mention:** [Any required legal or brand language]
```

---

## Phase 4: Polish

### Delivery Notes for Hosts

- **Tone guidance:** Conversational, like recommending to a friend. Do not read verbatim.
- **Talking points, not teleprompter:** Bullet points allow natural delivery — word-for-word scripts sound stiff.
- **Personal touch:** Encourage the host to add their own experience if they have used the product.
- **Pacing:** 150 words = ~60 seconds at natural podcast speaking pace.

### Tracking Setup Checklist

```
- [ ] Vanity URL created and redirecting properly
- [ ] Promo code active and tested
- [ ] Attribution tracking in place (UTM parameters or unique landing page)
- [ ] Code expiration date set (if applicable)
- [ ] Host has received product/service to try (for authentic host-read)
```

---

## Example: Project Management SaaS Mid-Roll

**Script A — Personal Experience:**
```
• Open: "Real quick — I want to tell you about [Product]. My team started using it
  last quarter when we were drowning in Slack messages and losing track of deadlines."

• Bridge: "What makes it different is everything lives in one place — tasks, docs,
  timelines. I literally stopped scheduling 'status update' meetings because everyone
  can see progress in real time."

• Benefits: All-in-one workspace, saves 5+ hours/week on meetings, free tier available

• Offer: "Go to product.com/podname — that's product.com/podname — and you'll get
  your first 3 months free on any paid plan."
```

---

## Anti-Patterns

- **Writing word-for-word scripts for host-reads** — hosts sound robotic reading scripts. Provide talking points.
- **Too many talking points** — 3 benefits maximum. More than that and the host rushes or the listener tunes out.
- **Forgetting to repeat the URL/code** — always say the tracking URL or promo code at least twice.
- **Generic openings** — "This episode is brought to you by..." is the fastest way to trigger a skip. Lead with a story.
- **No tracking mechanism** — every ad must have a unique URL, code, or landing page for attribution.

---

## Recovery

- **Host has not used the product:** Write the script as a third-person recommendation with social proof instead of personal experience. "Over 50,000 teams use [Product] to..."
- **Very short time slot (15 seconds):** Strip to brand name, one benefit, and the URL. No story — just the punch.
- **Multiple podcasts with different audiences:** Write separate scripts tailored to each audience. A business podcast and a comedy podcast need different hooks.
- **No promo code or offer:** Create urgency with a limited-time landing page or exclusive content. Every podcast ad needs a reason to act now.
