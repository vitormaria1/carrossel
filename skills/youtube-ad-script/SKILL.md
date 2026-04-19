---
name: youtube-ad-script
description: "Writes YouTube ad scripts for pre-roll, mid-roll, and bumper formats with hooks, messaging, and CTA variations. Use when creating video ad scripts for YouTube advertising campaigns."
allowed-tools: Read Write Glob
metadata:
  author: matthewhitcham
  version: "1.0"
---

# YouTube Ad Script

## When to Use This Skill

Use this skill when you need to:
- Write scripts for YouTube pre-roll (skippable/non-skippable), mid-roll, or bumper ads
- Create hook variations to test in YouTube ad campaigns
- Develop scripts that follow YouTube's ad format requirements
- Produce multiple script versions for A/B testing

**DO NOT** use this skill for YouTube organic video scripts, YouTube Shorts content, or non-video ad copy. This is specifically for paid YouTube advertising scripts.

---

## Core Principle

YOU HAVE 5 SECONDS BEFORE THE SKIP BUTTON APPEARS — THE HOOK MUST STOP THE SCROLL AND THE FIRST LINE MUST EARN THE NEXT LINE.

---

## Phase 1: Brief

Gather the inputs that determine ad format, messaging, and tone.

### Required Inputs

| Input | What to Ask | Default |
|-------|------------|---------|
| **Product/service** | "What are you advertising?" | No default — must be provided |
| **Ad format** | "Which format? (15s skippable, 30s skippable, 6s bumper, 15s non-skippable)" | 15-second skippable |
| **Target audience** | "Who is watching? Demographics, interests, pain points." | Business owners 25-45 |
| **Primary CTA** | "What should viewers do? (visit site, sign up, buy, download)" | Visit website |
| **Key benefit** | "What is the single biggest benefit to lead with?" | No default — must be provided |
| **Tone** | "What tone? (urgent, conversational, authoritative, humorous)" | Conversational and direct |

**GATE: Do not proceed until the user confirms the product, format, and key benefit.**

---

## Phase 2: Script Structure

Build the script framework based on the chosen format.

### Format Frameworks

**15-Second Skippable (most common)**
- Seconds 0-3: Hook (pattern interrupt — must work before skip button)
- Seconds 3-10: Problem + Solution bridge
- Seconds 10-15: CTA with urgency

**30-Second Skippable**
- Seconds 0-5: Hook with bold claim or question
- Seconds 5-15: Problem agitation + solution intro
- Seconds 15-25: Proof (testimonial, stat, demo)
- Seconds 25-30: CTA with clear next step

**6-Second Bumper (non-skippable)**
- Seconds 0-2: One visual/verbal punch
- Seconds 2-4: Brand + benefit
- Seconds 4-6: CTA (URL or action)

**15-Second Non-Skippable**
- Seconds 0-3: Hook with immediate relevance
- Seconds 3-10: Single benefit with proof point
- Seconds 10-15: Brand + CTA

Present the framework to the user before writing scripts.

---

## Phase 3: Write Scripts

Deliver 3 script variations per format, each with a different hook style.

### Hook Styles (Rotate Across Variations)

1. **Question hook:** "Are you still [painful thing]?"
2. **Bold claim:** "[Specific result] in [specific timeframe]."
3. **Pattern interrupt:** Unexpected visual or statement that breaks expectations
4. **Social proof lead:** "[Number] people already [desired outcome]."
5. **Negative hook:** "Stop doing [common mistake] — here's why."

### Script Format

```
## Script [A/B/C]: [Hook Style]

**Format:** [15s skippable / 30s / 6s bumper]
**Duration:** [X seconds]

---

[SECOND 0-3]
(Visual: [describe what's on screen])
"[Spoken line — the hook]"

[SECOND 3-10]
(Visual: [describe what's on screen])
"[Spoken lines — problem/solution]"

[SECOND 10-15]
(Visual: [CTA on screen with URL])
"[Spoken CTA line]"

---

**On-screen text:** [Any supers or text overlays]
**End card:** [CTA button text + URL]
```

---

## Phase 4: Polish

After delivering scripts, provide production guidance.

### Production Notes

- **Pacing guide:** Word count per second (aim for 2-2.5 words/second for natural delivery)
- **Thumbnail recommendation:** First frame should work as a static image in case of autoplay-off
- **Caption reminder:** 85% of mobile video is watched without sound — include text overlays for key messages
- **CTA card specs:** YouTube end screen requirements and companion banner dimensions

### Testing Plan

Recommend which script to test first and what metrics to track:
- Hook rate (% who watch past 5 seconds)
- View-through rate (% who watch to completion)
- Click-through rate
- Cost per conversion

---

## Example: Online Course Ad (15s Skippable)

**Script A — Question Hook:**
```
[SECOND 0-3]
(Visual: Founder speaking directly to camera)
"Spending 20 hours a week on tasks AI could do in minutes?"

[SECOND 3-10]
(Visual: Screen recording of the product in action)
"This toolkit automates your entire content workflow — writing, scheduling, repurposing — all from one command."

[SECOND 10-15]
(Visual: CTA card with URL)
"Try it free — link below."
```

---

## Anti-Patterns

- **Burying the hook** — if your value proposition does not land in the first 3 seconds, the ad fails
- **Feature dumps** — list one benefit, not five features. YouTube ads are not product pages.
- **Weak CTAs** — "learn more" is vague. Use "Start your free trial" or "Get the toolkit."
- **Ignoring sound-off viewing** — always plan for text overlays since most mobile viewers watch muted
- **Writing radio scripts** — YouTube is visual. Every second needs a visual direction, not just dialogue.

---

## Recovery

- **User unsure of format:** Default to 15-second skippable — it is the most versatile and widely used format. Recommend bumper ads for retargeting.
- **No clear key benefit:** Ask what their best customers say about the product. Use the most specific customer quote as the benefit angle.
- **Multiple products to advertise:** Write scripts for one product at a time. Start with the highest-margin or best-converting offer.
- **No video production capability:** Adapt scripts for static/slideshow format with text overlays and voiceover — still effective on YouTube.
