# AI COMPATIBILITY LAYER

This system is designed to work with:

- Gemini 3 Flash Preview
- Claude Code
- GPT-based agents
- Copilot Agent
- Aider CLI

---

## RULE

All agents must:

- follow START_CONTRACT.md
- obey SSOT_RULE.md
- avoid direct file mutation of derived outputs

---

## SAFETY

If agent behavior differs:

- fallback to project.json
- ignore derived inconsistencies