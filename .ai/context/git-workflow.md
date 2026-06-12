# GIT WORKFLOW PROTOCOL

This protocol ensures that project state is always synchronized with Git activities.

## 1. Pre-Commit Check
Before committing changes, the AI Agent should:
- Run `UPDATE` command (update `project.json` and `PROJECT_STATE.md`).
- Ensure `changelog.md` reflects the changes in this commit.

## 2. Commit Message Standard
Follow this format for state-related commits:
`state: [module_id] updated to [X]% - [Brief summary of work]`

Example:
`state: dashboard updated to 100% - fixed CORS issues and added responsive charts`

## 3. Post-Update Action
After a successful update and commit, generate a Developer Report to summarize the current sprint/session.

## 4. Automation Goal
Phase 3 aims to automate these updates via Git Hooks (scripts/git-hooks/) that trigger validation of `project.json` against its schema.
