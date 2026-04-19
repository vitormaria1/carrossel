---
name: ad-creative-brief
description: "Creates detailed ad creative briefs with visual direction, copy variants, dimensions, and platform specifications. Use when producing ads for any paid media channel."
allowed-tools: Read Write Glob
metadata:
  author: matthewhitcham
  version: "1.0"
---

# Ad Creative Brief

## When to Use This Skill

Use this skill when you need to:
- Create a detailed creative brief for ad production (images, video, or carousel)
- Write multiple copy variations for different platforms and formats
- Define visual direction, dimensions, and brand guidelines for ad assets
- Brief a designer, videographer, or AI image tool on ad creative requirements

**DO NOT** use this skill for campaign strategy, audience targeting, or budget planning. This is specifically for the creative assets — what the ad looks, sounds, and reads like.

---

## Core Principle

GREAT AD CREATIVE STOPS THE SCROLL IN UNDER 2 SECONDS — EVERY ELEMENT (IMAGE, HEADLINE, COPY, CTA) MUST WORK TOGETHER TO DELIVER ONE CLEAR MESSAGE THAT COMPELS ACTION.

---

## Phase 1: Brief

### Required Inputs

| Input | What to Ask | Default |
|-------|------------|---------|
| **Product/offer** | "What are you advertising?" | No default — must be provided |
| **Platforms** | "Where will these ads run? (Facebook, Instagram, Google, TikTok, YouTube)" | Facebook + Instagram |
| **Objective** | "What should the ad achieve? (clicks, leads, sales, awareness)" | Conversions |
| **Target audience** | "Who is this ad for? Be specific." | No default — must be provided |
| **Brand guidelines** | "Do you have brand colors, fonts, or style rules?" | No formal guidelines |
| **Number of variations** | "How many creative versions do you need?" | 3-5 variations |
| **Format** | "Static images, video, carousel, or all?" | Static images + video |

**GATE: Confirm before building creative briefs.**

---

## Phase 2: Creative Strategy

### Messaging Angles

Define 3-5 messaging angles to test:

```
## Creative Angles

**Angle 1: Problem-Solution**
Message: "[Pain point they experience] → [Your product fixes it]"
Emotion: Relief, frustration → resolution

**Angle 2: Social Proof**
Message: "[X customers / specific result] achieved with [product]"
Emotion: Trust, FOMO

**Angle 3: Benefit-First**
Message: "[Specific outcome they want] — here's how"
Emotion: Desire, aspiration

**Angle 4: Objection Buster**
Message: "Think [product] isn't for you? Here's why you're wrong."
Emotion: Curiosity, reconsideration

**Angle 5: Urgency/Offer**
Message: "[Discount/bonus] available for [limited time]"
Emotion: Urgency, opportunity
```

### Format Selection

```
## Formats to Produce

| Format | Platform | Dimensions | Use Case |
|--------|----------|-----------|----------|
| Static square | FB/IG feed | 1080x1080 | Primary format |
| Static vertical | IG Stories/Reels | 1080x1920 | Story placements |
| Static horizontal | Facebook feed | 1200x628 | FB-specific |
| Video (15-30s) | FB/IG/TikTok | 1080x1080 + 1080x1920 | Highest engagement |
| Carousel (3-5 cards) | FB/IG feed | 1080x1080 per card | Story-driven ads |
```

**GATE: Approve angles and formats before writing detailed briefs.**

---

## Phase 3: Creative Briefs

### Static Image Brief Template

```
## Creative Brief: [Angle Name]

**Concept:** [One sentence describing the visual idea]
**Dimensions:** [1080x1080 / 1080x1920 / 1200x628]

**Visual Direction:**
- Background: [Color/image/gradient]
- Main visual: [Product shot / lifestyle / graphic / screenshot]
- Text overlay: [3-7 words, large readable font]
- Logo placement: [Top-left corner, subtle]
- Color palette: [Primary, secondary, accent]

**Copy:**
- Text overlay on image: "[Short hook — 3-7 words]"
- Primary text (below image): "[2-3 sentences. Hook. Benefit. CTA.]"
- Headline: "[30-40 chars]"
- CTA button: [Learn More / Shop Now / Sign Up]

**Do's:**
- High contrast text over image (readable at small size)
- One focal point per image
- Faces and people increase engagement

**Don'ts:**
- No more than 20% text on image (Meta guideline)
- No cluttered layouts
- No small, illegible text
```

### Video Brief Template

```
## Video Brief: [Angle Name]

**Length:** [15 / 30 / 60] seconds
**Dimensions:** [1080x1080 + 1080x1920]
**Style:** [Talking head / B-roll montage / Animation / Screen recording]

**Script/Storyboard:**

**Hook (0-3 seconds):**
Visual: [Bold text or surprising visual]
Audio/text: "[Question or statement that stops the scroll]"

**Problem (3-8 seconds):**
Visual: [Show the frustration or pain point]
Audio/text: "[Agitate the problem]"

**Solution (8-20 seconds):**
Visual: [Show the product in action]
Audio/text: "[How the product solves it + key benefit]"

**Proof (20-25 seconds):**
Visual: [Testimonial, results, or social proof]
Audio/text: "[Specific result or quote]"

**CTA (25-30 seconds):**
Visual: [Product + CTA text overlay]
Audio/text: "[Clear instruction: Visit, sign up, shop now]"

**Music/Sound:** [Upbeat / Calm / Trending audio]
**Captions:** Always on (80% of video is watched without sound)
```

### Carousel Brief Template

```
## Carousel Brief: [Angle Name]

**Number of cards:** [3-5]

**Card 1 (Hook):** [Eye-catching image + hook headline]
**Card 2 (Problem):** [Pain point or "before" state]
**Card 3 (Solution):** [Product introduction]
**Card 4 (Proof):** [Result or testimonial]
**Card 5 (CTA):** [Clear call to action + offer]

Each card: 1080x1080, consistent visual style, text readable at mobile size
```

---

## Phase 4: Polish

### 1. Platform-Specific Notes

Document any platform requirements:
- Meta: 20% text rule (guideline, not hard limit), video auto-plays without sound
- Google Display: stricter formatting, multiple required sizes
- TikTok: organic-feeling creative outperforms polished ads
- YouTube: first 5 seconds must hook before the skip button

### 2. Production Checklist

- [ ] All dimensions produced for each format
- [ ] Copy variations written for each angle
- [ ] Brand colors and fonts applied consistently
- [ ] Files named with clear convention (angle_format_dimension)
- [ ] Mobile preview checked for readability
- [ ] Video captions added

### 3. Testing Matrix

```
## A/B Test Plan

| Test | Variable | Version A | Version B |
|------|----------|----------|----------|
| 1 | Image style | Product shot | Lifestyle photo |
| 2 | Headline | Problem-focused | Benefit-focused |
| 3 | Format | Static image | Video |
| 4 | CTA | "Learn More" | "Shop Now" |
```

---

## Anti-Patterns

- **Designing for desktop first** — 80%+ of social media ads are seen on mobile. Design for small screens first.
- **Too much text on images** — cluttered ads get scrolled past. One message, one visual, one CTA.
- **Generic stock photos** — authentic, real photos and videos outperform polished stock imagery on social platforms.
- **No hook in the first 2 seconds** — if the visual or headline doesn't grab attention instantly, the ad fails.
- **Same creative for every platform** — what works on Facebook may not work on TikTok. Adapt the format and style.

---

## Recovery

- **No brand guidelines:** Define basic elements now — pick 2-3 colors, one font, and a logo placement. Consistency matters more than perfection.
- **No design skills or tools:** Use Canva templates for static ads, CapCut for video editing. Both are free and sufficient for most ad creative.
- **All creatives performing poorly:** The offer or audience may be the problem, not the creative. Test a new angle before producing more of the same.
- **User needs ads quickly:** Start with 2 static images (problem-solution and social proof angles) at 1080x1080. Expand formats after testing.
