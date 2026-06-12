# COMMIT SCOPE RULE

## Core Principle

Not all changes are equal.

---

## COMMIT TYPES

### 1. STATE COMMIT
Affects:
- data/project.json
- .ai/context/PROJECT_STATE.md

Message:
state: update

---

### 2. ENGINE COMMIT
Affects:
- scripts/
- state_engine/
- git_sync

Message:
engine: update

---

### 3. AI COMMIT
Affects:
- .ai/prompts/
- .ai/context/
- UPDATE_PROTOCOL

Message:
ai: update

---

### 4. PRESENTATION COMMIT
Affects:
- dashboard/
- reports/
- templates/

Message:
ui: update

---

## RULE

NEVER use `git add .` blindly.

Always scope commits by category.

---

## SAFETY RULE

If scope is unclear:
→ do NOT commit
→ request clarification