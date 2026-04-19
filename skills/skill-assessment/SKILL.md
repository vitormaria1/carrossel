---
name: skill-assessment
description: "Builds skill assessment tools with competency levels, evaluation rubrics, and development recommendations."
allowed-tools: Read Write Glob
metadata:
  author: matthewhitcham
  version: "1.0"
---

# Skill Assessment

## When to Use This Skill

Use this skill when you need to:
- Build a competency assessment tool to evaluate skills at different proficiency levels
- Create rubrics for grading student work, contractor deliverables, or team capabilities
- Design self-assessment questionnaires with development path recommendations
- Produce evaluation instruments for hiring, training, or certification programs

**DO NOT** use this skill for personality tests, customer satisfaction surveys, or general quizzes. This is for measuring specific competencies against defined standards.

---

## Core Principle

AN ASSESSMENT IS ONLY USEFUL IF IT CLEARLY DISTINGUISHES BETWEEN SKILL LEVELS AND TELLS THE PERSON EXACTLY WHAT TO DO NEXT — MEASUREMENT WITHOUT A DEVELOPMENT PATH IS JUST A LABEL.

---

## Phase 1: Brief

### Required Inputs

| Input | What to Ask | Default |
|-------|------------|---------|
| **Skill domain** | "What skill or competency area are you assessing?" | No default — must be provided |
| **Assessment purpose** | "Is this for hiring, training placement, certification, or self-development?" | Self-development |
| **Proficiency levels** | "How many levels? (3, 4, or 5)" | 4 levels (Beginner, Intermediate, Advanced, Expert) |
| **Assessment format** | "Self-assessment questionnaire, evaluator rubric, or practical test?" | Self-assessment questionnaire |
| **Audience** | "Who will be assessed?" | Solopreneurs and small business owners |

**GATE: Confirm the brief before proceeding.**

---

## Phase 2: Competency Framework

### Build the Competency Map

Break the skill domain into 4-6 sub-competencies. For each:

```
## Sub-Competency: [Name]

| Level | Description | Observable Behaviors |
|-------|------------|---------------------|
| Beginner | [What this looks like] | [Specific actions they can/cannot do] |
| Intermediate | [What this looks like] | [Specific actions] |
| Advanced | [What this looks like] | [Specific actions] |
| Expert | [What this looks like] | [Specific actions] |
```

### Level Definition Rules

- Each level must be objectively distinguishable from the others
- Use observable behaviors, not subjective judgments ("can write a sales page that converts above 2%" vs. "writes good copy")
- Each level builds on the previous — no skipping
- Expert level should represent top 10% performance, not perfection

**GATE: Present the competency framework for approval.**

---

## Phase 3: Build the Assessment

### For Self-Assessment Questionnaires

Create 3-5 questions per sub-competency. Each question describes a scenario and offers level-aligned response options:

```
Q: When you need to [skill scenario], you typically:
A) [Beginner behavior] — 1 point
B) [Intermediate behavior] — 2 points
C) [Advanced behavior] — 3 points
D) [Expert behavior] — 4 points
```

### For Evaluator Rubrics

Create a scoring grid:

```
| Criteria | 1 - Beginner | 2 - Intermediate | 3 - Advanced | 4 - Expert | Score |
|----------|-------------|-----------------|-------------|-----------|-------|
| [Criterion 1] | [Description] | [Description] | [Description] | [Description] | /4 |
```

### Scoring and Interpretation

```
## Scoring Guide

**Total possible:** [X points]
**Beginner:** 0-25% — [What this means + immediate next step]
**Intermediate:** 26-50% — [What this means + next step]
**Advanced:** 51-75% — [What this means + next step]
**Expert:** 76-100% — [What this means + next step]
```

---

## Phase 4: Polish

### 1. Development Recommendations

For each proficiency level, provide:
- Top 3 skills to develop next
- Recommended resources or exercises
- Estimated time to reach the next level
- One quick win they can implement this week

### 2. Validity Check

Review the assessment for:
- Every sub-competency is covered by at least 3 questions
- No question can be answered "correctly" without actual skill
- Questions progress in difficulty within each sub-competency
- Language is clear and free of jargon the audience would not know

### 3. Delivery Format

```
## Assessment Package
- Assessment questionnaire (ready to use in Google Forms, Typeform, or PDF)
- Scoring guide with level descriptions
- Development roadmap per level
- Reassessment timeline (recommend retaking every 90 days)
```

---

## Example 1: Content Marketing Skills Assessment

```
Sub-competencies: Strategy, Writing, SEO, Distribution, Analytics
Sample question:
Q: When planning content for next month, you typically:
A) Write about whatever comes to mind that week
B) Follow a basic editorial calendar with planned topics
C) Map content to funnel stages with keyword targets for each
D) Use data from previous content performance to prioritize topics by revenue impact
```

## Example 2: Sales Skills Assessment (Evaluator Rubric)

```
| Criteria | 1 | 2 | 3 | 4 |
|----------|---|---|---|---|
| Discovery questions | Reads from a script | Asks open-ended questions | Uncovers pain, budget, and timeline | Identifies unstated needs and links to ROI |
```

---

## Anti-Patterns

- **Vague level descriptions** — "good at writing" is not measurable. Use observable behaviors.
- **Too many sub-competencies** — more than 6 makes the assessment exhausting. Combine related areas.
- **Leading questions** — do not make the "right" answer obvious. All options should sound reasonable.
- **No development path** — labeling someone "beginner" without telling them how to improve is demoralizing.
- **Binary scoring** — yes/no questions miss nuance. Use scaled responses.
- **Assessment without reassessment** — skills grow. Build in a timeline to retake.

---

## Recovery

- **Skill domain too broad:** Ask "If someone mastered just one part of this, which part would matter most to their business?" Start there.
- **User wants pass/fail, not levels:** Create a minimum competency threshold with clear criteria. Score above = pass.
- **User cannot define expert level:** Ask them to describe the best person they have seen perform this skill. Use that as the expert benchmark.
- **Assessment too long:** Cap at 20 questions total. Prioritize the 3 most business-critical sub-competencies.
