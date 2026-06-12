# SINGLE SOURCE OF TRUTH (SSOT)

## CORE RULE

The ONLY source of truth is:

data/project.json

---

## DERIVED FILES (READ ONLY)

- .ai/context/PROJECT_STATE.md
- .ai/memory/changelog.md
- dashboard/*
- reports/*

These are regenerated only.

---

## RULE OF CONSISTENCY

If conflict exists:

1. project.json wins
2. regenerate all derived files
3. log inconsistency

---

## FORBIDDEN

- manual edits to derived state
- duplicate progress tracking
- multiple sources of truth

---

## SYSTEM BEHAVIOR

AI must always:
- read project.json first
- update only via controlled pipeline