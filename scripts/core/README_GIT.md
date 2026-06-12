# Git Integration Module for AI Project OS

This module automates Git operations to maintain synchronization between the codebase and the project state.

## Features
- **Auto-Commit:** Automatically creates commits with standardized messages based on `project.json` updates.
- **State Sync:** Ensures `git status` results are considered during project state updates.
- **Validation:** Prevents commits if `project.json` is invalid.

## Scripts
- `scripts/git_sync.ps1`: Primary script for committing state changes.
