# UPDATE PROTOCOL

Whenever you (the AI Agent) perform an update to the project, follow these steps strictly:

## 1. Data Update
Update `data/project.json`:
- Adjust module `progress` and `status`.
- Recalculate `summary.progress_total`.
- Append a concise entry to the `logbook`.
- Update `updated_at` timestamp.

## 2. Context Sync
Update `.ai/context/PROJECT_STATE.md`:
- Sync progress numbers with `project.json`.
- Mark completed tasks in the "Active Tasks" list.
- Update "Next Milestones" if needed.

## 3. History Preservation
Update `.ai/memory/changelog.md`:
- Add a new entry under the current version.
- Never delete old history.

## 4. Decision Log
If a major architectural or process decision was made:
- Append to `.ai/memory/decisions.md` with a unique ID (e.g., [D002]).

## 5. Report Generation (Optional)
If requested, run `scripts/generate_report.ps1` to reflect the new state.

**Constraint:** Always preserve the repository structure and the integrity of the JSON schema.
