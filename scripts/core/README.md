# STATE ENGINE

Core component of AI Project OS.

## Purpose

Ensures consistency between:

- AI output
- project.json
- reports
- dashboard

## Responsibilities

- validate project state
- normalize progress
- reconcile AI updates
- prevent data corruption
- maintain history integrity

## Usage

```bash
python state_engine.py status
python state_engine.py validate
python state_engine.py update


Rule

This is the ONLY safe entry point for modifying project state.