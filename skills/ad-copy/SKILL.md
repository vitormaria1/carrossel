---
name: ad-copy
description: "Writes high-converting ad copy for Facebook, Google, and LinkedIn with multiple creative variations, audience targeting suggestions, and optional ad graphics via Canva. Use when a user needs paid advertising copy, wants to launch ad campaigns, or needs creative variations for A/B testing across ad platforms."
allowed-tools: Read Write Glob mcp__claude_ai_Canva__generate-design mcp__claude_ai_Canva__generate-design-structured mcp__claude_ai_Canva__resize-design mcp__claude_ai_Canva__export-design mcp__claude_ai_Canva__get-export-formats mcp__claude_ai_Canva__list-brand-kits mcp__claude_ai_Canva__get-design-thumbnail
metadata:
  author: matthewhitcham
  version: "1.0"
---

# Ad Copy Generator

EVERY AD MUST BE NATIVE TO ITS PLATFORM, HIT CHARACTER LIMITS EXACTLY, AND DRIVE A SINGLE CLEAR ACTION.

## When to Use This Skill

- User needs paid ad copy for Facebook, Instagram, Google, or LinkedIn
- User is launching a new campaign and needs creative variations
- User wants A/B test variations for existing ads
- User needs ad graphics designed in Canva alongside copy
- User asks for audience targeting recommendations for paid ads

---

## Phase 1: Brief

Gather these inputs before writing a single word of copy.

1. **Product/Service** — What are you advertising? Get the name, core value prop, and key differentiator.
2. **Target Audience** — Who is the ideal customer? Demographics, pain points, desires.
3. **Platform(s)** — Which ad platforms: Facebook/Instagram, Google Search, Google Display, LinkedIn.
4. **Offer/CTA** — What action should the viewer take? Free trial, buy now, book a call, download, sign up.
5. **Objective** — Awareness (top of funnel) or Conversion (bottom of funnel).
6. **Landing Page URL** — Where does the ad send traffic? Read the page to align messaging.
7. **Brand Voice** — Professional, casual, bold, empathetic, authoritative. Default to professional-casual if unspecified.
8. **Canva Graphics** — Does the user want ad images generated? If yes, check for brand kits.

### Brief Template (Filled Example)

```
Product:       Taskflow — AI project management for solo founders
Audience:      Solopreneurs running online businesses, 25-45, overwhelmed by task juggling
Platforms:     Facebook, Google Search
Offer:         14-day free trial, no credit card required
Objective:     Conversion
Landing Page:  https://taskflow.app/start
Brand Voice:   Confident, direct, founder-friendly
Canva:         Yes — generate Facebook ad image
```

**GATE: Do not proceed to Phase 2 until you have product, audience, at least one platform, and CTA confirmed. If any are missing, ask the user directly.**

---

## Phase 2: Write Primary Ads

Write one primary ad per requested platform using the format specs below. Count every character. Choose the best formula for the audience and objective.

### Ad Copy Formulas

| Formula | Structure | Best For |
|---------|-----------|----------|
| PAS | Pain > Agitate > Solve | Conversion, problem-aware audiences |
| AIDA | Attention > Interest > Desire > Action | Awareness, cold audiences |
| Before/After | Old way vs New way | Product launches, differentiators |
| Social Proof | Result + proof + CTA | High-trust offers, testimonials |
| Urgency | Time/scarcity pressure + CTA | Limited offers, launches |

Default to **PAS** for conversion campaigns. Default to **AIDA** for awareness campaigns.

### Platform Format Specs

#### Facebook / Instagram

| Element | Max Length | Notes |
|---------|-----------|-------|
| Primary text | 125 chars above fold (up to 300 total) | First 125 chars must hook — rest is behind "See more" |
| Headline | 40 chars | Appears below image, bold |
| Description | 30 chars | Below headline, gray text |
| CTA Button | Platform preset | Shop Now, Learn More, Sign Up, Book Now, Download, Get Offer |

**Primary Ad Example (Taskflow — Facebook, PAS formula):**

```
Primary text (118 chars):
You're juggling 6 tools to manage one business. Taskflow replaces them all with AI that actually knows your priorities.

Headline (34 chars):
Stop Managing. Start Finishing.

Description (28 chars):
Free 14-day trial. No card.

CTA Button: Sign Up
```

#### Google Search

| Element | Max Length | Notes |
|---------|-----------|-------|
| Headline 1 | 30 chars | Include primary keyword |
| Headline 2 | 30 chars | Value proposition |
| Headline 3 | 30 chars | CTA or differentiator |
| Description 1 | 90 chars | Expand on value, include keyword naturally |
| Description 2 | 90 chars | Social proof, features, or urgency |
| Display path | 15 chars x2 | Cosmetic URL path segments |

**Primary Ad Example (Taskflow — Google Search, PAS formula):**

```
Headline 1 (29 chars): AI Project Management Tool
Headline 2 (28 chars): Built for Solo Founders
Headline 3 (25 chars): Start Free — No Card

Description 1 (88 chars):
Stop juggling 6 apps. Taskflow uses AI to prioritize your tasks and manage your projects.

Description 2 (84 chars):
Trusted by 2,400+ solopreneurs. 14-day free trial with full features. Sign up today.

Display path: /solo-founders/free-trial
```

#### Google Display

| Element | Max Length | Notes |
|---------|-----------|-------|
| Short headline | 30 chars | Punchy, scannable |
| Long headline | 90 chars | Full value proposition |
| Description | 90 chars | Supporting detail |
| Image sizes | 300x250, 728x90, 160x600 | Responsive display ads use multiple |

**Primary Ad Example (Taskflow — Google Display):**

```
Short headline (27 chars): Manage Less. Build More.

Long headline (67 chars):
AI project management that replaces 6 tools for solo founders.

Description (82 chars):
Taskflow prioritizes your tasks automatically. 14-day free trial, no card needed.
```

#### LinkedIn

| Element | Max Length | Notes |
|---------|-----------|-------|
| Intro text | 150 chars above fold (up to 600 total) | First 150 chars visible before "see more" |
| Headline | 70 chars | Below image |
| Description | 100 chars | Below headline |
| CTA Button | Platform preset | Learn More, Sign Up, Download, Register, Apply Now |

**Primary Ad Example (Taskflow — LinkedIn, Before/After formula):**

```
Intro text (142 chars):
Before Taskflow: spreadsheets, sticky notes, and 3 PM panic. After Taskflow: one AI dashboard that runs your entire project pipeline for you.

Headline (51 chars):
AI Project Management Built for Solo Founders

Description (52 chars):
14-day free trial. No credit card. Full features.

CTA Button: Sign Up
```

**GATE: Verify every character count before proceeding. If any element exceeds its platform limit, rewrite it immediately. Do not present over-limit copy to the user.**

---

## Phase 3: Creative Variations

Generate **3 variations per platform** using different hooks, angles, or audience segments.

### Variation Strategy

| Variation | What Changes | Why |
|-----------|-------------|-----|
| V1 (Hook shift) | Opening line / headline uses a different emotional trigger | Tests which pain point resonates most |
| V2 (Angle shift) | Different formula (e.g., switch PAS to Social Proof) | Tests messaging framework |
| V3 (Audience shift) | Same product, different audience segment or use case | Tests audience targeting |

### A/B Testing Matrix

Present variations in this format so the user can track what is being tested:

```
Platform: Facebook
| Version | Hook | Formula | Audience Angle | Key Difference |
|---------|------|---------|----------------|----------------|
| Primary | Pain (tool overload) | PAS | Solopreneurs | Baseline |
| V1 | Fear (missed deadlines) | PAS | Solopreneurs | Different pain point |
| V2 | Social proof (2,400 users) | Social Proof | Solopreneurs | Framework change |
| V3 | Ambition (scale faster) | AIDA | Freelancers | Audience shift |
```

**Facebook V1 Example (Hook shift — fear of missed deadlines):**

```
Primary text (123 chars):
Missed another deadline? When you're the whole team, one dropped ball costs you a client. Taskflow keeps every ball in play.

Headline (35 chars):
Never Miss a Deadline Again

Description (28 chars):
Free 14-day trial. No card.

CTA Button: Sign Up
```

**Facebook V2 Example (Angle shift — Social Proof):**

```
Primary text (119 chars):
2,400+ solo founders switched to Taskflow last quarter. They manage projects in half the time. Your free trial is ready.

Headline (33 chars):
Join 2,400+ Solo Founders

Description (28 chars):
Free 14-day trial. No card.

CTA Button: Sign Up
```

**Facebook V3 Example (Audience shift — freelancers):**

```
Primary text (124 chars):
Freelancers: you started this to have freedom, not to spend 3 hours a day on project admin. Taskflow gives you those hours back.

Headline (37 chars):
Get Your Freelance Hours Back

Description (28 chars):
Free 14-day trial. No card.

CTA Button: Sign Up
```

### Optional: Canva Ad Graphics

If the user requests ad graphics, generate them using Canva integration:

1. Check for existing brand kits with `list-brand-kits` and apply if available.
2. Generate designs at platform-specific sizes:
   - Facebook/Instagram feed: 1200x628
   - Instagram square: 1080x1080
   - LinkedIn: 1200x627
   - Google Display: 300x250 and 728x90
3. Include the headline text and CTA on the graphic.
4. Generate a thumbnail preview for user approval before exporting.
5. Export in PNG format for upload-ready files.

**GATE: All variations must stay within platform character limits. Count characters on every variation before presenting.**

---

## Phase 4: Deliver

### Delivery Format

Organize all output by platform. For each platform, present:

1. **Primary Ad** — Full copy with character counts per element
2. **Variations V1-V3** — Full copy with the A/B testing matrix
3. **Audience Targeting Suggestions** — Platform-specific targeting recommendations
4. **Ad Graphics** — Canva exports if requested

### Audience Targeting Suggestions

Provide 2-3 targeting recommendations per platform:

**Facebook/Instagram Example:**
- Interest targeting: Project management, Entrepreneurship, Freelancing
- Lookalike audience: Based on existing customers or email list
- Custom audience: Website visitors who viewed pricing page (retargeting)

**Google Search Example:**
- Keywords: "project management for solopreneurs", "solo founder tools", "AI task manager"
- Negative keywords: "enterprise", "team collaboration", "free project management"
- Match types: Phrase match for primary, exact match for brand terms

**LinkedIn Example:**
- Job titles: Founder, CEO, Freelancer, Independent Consultant
- Company size: 1-10 employees
- Industries: Technology, Professional Services, Creative Services

### Pre-Delivery Checklist

Verify every item before presenting to the user:

- [ ] Every ad element is within its platform character limit
- [ ] Character counts are displayed next to each element
- [ ] Each platform has 1 primary ad + 3 variations
- [ ] A/B testing matrix is included per platform
- [ ] Ad copy matches the confirmed offer/CTA from the brief
- [ ] No pricing is mentioned unless the user explicitly provided it
- [ ] Landing page messaging aligns with ad copy (if URL was provided and read)
- [ ] Audience targeting suggestions are included per platform
- [ ] Canva graphics exported if requested
- [ ] Brand voice is consistent across all ads

---

## Full Example: Online Fitness Coaching

**Brief:**
```
Product:       FitPro Academy — 12-week online coaching for busy professionals
Audience:      Working professionals, 30-50, want to get fit but have no time
Platforms:     Instagram, LinkedIn
Offer:         $97 program launch, limited to 50 spots
Objective:     Conversion
Landing Page:  https://fitproacademy.com/launch
Brand Voice:   Motivating, empathetic, no-nonsense
Canva:         No
```

**Instagram Primary Ad (PAS):**

```
Primary text (124 chars):
You keep saying "I'll start Monday." It's been 47 Mondays. FitPro Academy fits real workouts into your actual schedule. $97.

Headline (35 chars):
12 Weeks. Real Results. Only $97.

Description (22 chars):
Just 50 spots open.

CTA Button: Learn More
```

**Instagram V1 (Hook shift — identity):**

```
Primary text (121 chars):
You built a career. You can build a body. FitPro Academy gives busy professionals a 12-week plan that fits your calendar.

Headline (34 chars):
Built for Professionals Like You

Description (22 chars):
Just 50 spots open.

CTA Button: Learn More
```

**Instagram V2 (Angle shift — Urgency):**

```
Primary text (118 chars):
50 spots. 12 weeks. One decision. FitPro Academy launches this month and slots are filling. Lock in your spot for $97.

Headline (30 chars):
Doors Close When It's Full

Description (17 chars):
$97. 50 spots.

CTA Button: Learn More
```

**LinkedIn Primary Ad (Before/After):**

```
Intro text (148 chars):
Before FitPro: skipped workouts, guilt, another failed gym membership. After FitPro: 30-minute sessions that actually fit between your 9am and 6pm.

Headline (54 chars):
12-Week Fitness Program for Working Professionals

Description (64 chars):
$97 launch price. Only 50 spots. Workouts designed for your life.

CTA Button: Learn More
```

**LinkedIn V1 (Hook shift — productivity angle):**

```
Intro text (144 chars):
Top performers protect their health like they protect their calendar. FitPro Academy gives you a 12-week system that takes 30 minutes, not two hours.

Headline (49 chars):
Fit in 30 Minutes. Built for Busy Schedules.

Description (64 chars):
$97 launch price. Only 50 spots. Workouts designed for your life.

CTA Button: Learn More
```

---

## Anti-Patterns

- **DO NOT exceed platform character limits** — count every character, every time
- **DO NOT use clickbait that mismatches the landing page** — ad copy must reflect what the user actually sees when they click
- **DO NOT write identical copy across platforms** — Facebook is visual-emotional, Google is intent-based, LinkedIn is professional-contextual
- **DO NOT use ALL CAPS in ad body copy** — reserve caps for one or two words in a hook, never full sentences
- **DO NOT include pricing unless the user explicitly provides it** — assumed pricing damages trust
- **DO NOT use generic CTAs like "Click Here"** — every CTA must be specific to the action (Sign Up, Start Free Trial, Book Your Call)
- **DO NOT stuff keywords unnaturally in Google ads** — write for humans first, search engines second
- **DO NOT ignore the objective** — awareness ads educate and build interest, conversion ads drive immediate action. They are not interchangeable.
- **DO NOT present variations without the A/B testing matrix** — the user needs to know what is being tested and why
- **DO NOT generate Canva graphics without checking for brand kits first** — always check before generating

---

## Recovery

**No landing page URL provided:**
Write ad copy based on the product description and offer. Note to the user that reviewing the landing page would improve message alignment, and offer to revise once a URL is available.

**Unknown target audience:**
Ask the user to describe their best customer in one sentence. If they cannot, default to the broadest reasonable segment for the product category and flag that narrower targeting will improve performance.

**Budget or objective unclear:**
Default to conversion objective. Most solopreneurs and small businesses need direct-response ads, not brand awareness. Mention this assumption and offer to adjust.

**Platform not listed in specs above:**
Inform the user that this skill covers Facebook, Instagram, Google Search, Google Display, and LinkedIn. For other platforms (TikTok, X, Pinterest, YouTube), write copy following the closest platform format and note that character limits should be verified against the platform's current ad specs.

**Three revision attempts fail to satisfy:**
Stop revising. Ask the user to share an example of ad copy they admire or a competitor ad they want to emulate. Use that as a style reference and restart from Phase 2 with the new direction.

**Canva integration unavailable:**
Provide the ad copy with image specifications (dimensions, recommended text overlay, suggested visual direction) so the user can create graphics manually or with another tool.
