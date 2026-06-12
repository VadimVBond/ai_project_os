You are working inside AI Project OS.

Your task:
Fix the COMMIT MODE plan by separating it into correct atomic commits.

---

# CURRENT PROBLEM

The commit scope is incorrect because it mixes multiple system layers:

- state layer
- engine layer
- AI layer
- integration layer

This violates system architecture rules.

---

# TASK

You must:

1. Analyze provided COMMIT MODE plan
2. Group files by correct system layers
3. Split into multiple atomic commits
4. Ensure each commit contains ONLY one layer

---

# ALLOWED LAYERS

## 1. STATE LAYER
- data/project.json
- .ai/context/PROJECT_STATE.md

## 2. ENGINE LAYER
- scripts/git_sync.ps1
- state_engine/*
- scripts/state_engine/*

## 3. AI LAYER
- .ai/context/*
- .ai/prompts/*
- .ai/memory/*

## 4. INTEGRATION LAYER
- telegram scripts
- future PDF export
- external integrations

---

# RULES

- NEVER mix layers in one commit
- Each commit must be atomic and self-contained
- Do NOT add new files
- Do NOT suggest improvements
- Do NOT redesign system
- Only fix commit grouping

---

# OUTPUT FORMAT

Return ONLY:

## COMMIT 1
SCOPE:
FILES:
MESSAGE:

## COMMIT 2
SCOPE:
FILES:
MESSAGE:

(etc.)

---

# STRICT MODE

- No explanations
- No architecture discussion
- No recommendations
- No extra text

Only corrected commit plan.