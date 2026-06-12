# AGENTS.md

# Project AI Agent Rules

This repository uses a partially migrated component-based architecture.

AI agents MUST follow these rules strictly.

---

# Primary Goals

* Preserve repository stability
* Avoid architectural regressions
* Keep rendering lifecycle deterministic
* Prevent duplicate rendering systems
* Maintain Git synchronization integrity
* Prefer minimal safe fixes over rewrites

---

# Repository Architecture

Current architecture:

* HTML templates
* JSON-driven content
* ComponentLoader rendering system
* Vanilla JS + partial jQuery legacy layer
* Dynamic template injection
* i18n localization system
* Theme system
* Plugin initialization layer

---

# Critical Rule: Single Rendering Pipeline

ONLY ONE rendering system is allowed.

Approved rendering flow:

DOM Ready
→ ComponentLoader init
→ Template rendering
→ i18n apply
→ Theme apply
→ Plugin initialization
→ Final UI initialization

Forbidden:

* duplicate render systems
* direct fetch() template rendering outside ComponentLoader
* parallel template loaders
* duplicate DOMContentLoaded handlers
* legacy direct innerHTML injection bypassing ComponentLoader

---

# Git Rules

Before making changes:

1. Verify current branch
2. Verify repository is writable
3. Verify edits affect real filesystem
4. Verify no detached HEAD state
5. Verify no ephemeral workspace mode

Required commands before large refactors:

git status
git branch -vv
git remote -v

---

# File Modification Rules

AI MUST:

* modify real repository files only
* show modified file paths
* generate unified diffs when possible
* avoid hidden virtual workspace edits
* avoid phantom modifications

AI MUST NOT:

* silently create duplicate files
* create alternate architectures
* rewrite unrelated files
* introduce frameworks without request
* move files without explanation

---

# Runtime Stability Rules

Console target:

* zero runtime errors
* zero template 404 errors
* zero duplicate renders
* zero race conditions

Every modification must preserve:

* template rendering stability
* plugin initialization timing
* i18n timing
* theme timing
* event listener consistency

---

# ComponentLoader Rules

ComponentLoader is the single source of component rendering.

Allowed:

* template caching
* JSON-driven rendering
* async template loading
* render lifecycle hooks

Forbidden:

* secondary loaders
* direct template fetch systems
* duplicate template caches
* component rendering outside loader

---

# i18n Rules

Translations must execute AFTER components are rendered.

Correct order:

1. render templates
2. apply translations
3. initialize plugins

AI must avoid:

* translation execution before render
* duplicate translation passes
* DOM mutation loops

---

# Dependency Rules

Before adding dependencies:

* verify necessity
* verify bundle impact
* verify compatibility with current architecture

Prefer:

* native browser APIs
* lightweight utilities
* existing project dependencies

Avoid:

* framework rewrites
* unnecessary libraries
* overlapping plugin functionality

---

# Debugging Rules

When debugging:

1. identify root cause first
2. avoid speculative rewrites
3. preserve stable subsystems
4. isolate regressions
5. prefer minimal fixes

AI must provide:

* exact file locations
* runtime impact explanation
* minimal safe patch

---

# Migration Rules

Migration must be incremental.

Allowed:

* isolated component migration
* JSON extraction
* template modularization

Forbidden:

* full rewrites
* simultaneous architecture replacement
* migration without stabilization

---

# Branch Strategy

Recommended branches:

* stable/*
* stabilization/*
* migration/*
* feature/*
* experiment/*

Never perform risky refactors directly on stable branches.

---

# Validation Checklist

Before completing tasks:

* verify no console errors
* verify no duplicate rendering
* verify no broken template paths
* verify plugins initialize correctly
* verify Git status clean
* verify runtime matches filesystem state

---

# AI Workflow Requirements

AI agents must:

* explain runtime impact
* avoid hidden assumptions
* avoid generating parallel systems
* preserve repository consistency
* prioritize stabilization over expansion

Preferred outputs:

* unified diffs
* exact code replacements
* precise file modifications
* minimal patches

Avoid:

* vague summaries
* speculative rewrites
* uncontrolled architectural changes

---

# Current Priority

Current project priority is:

1. stabilization
2. runtime consistency
3. Git/workspace integrity
4. lifecycle normalization
5. migration continuation

Feature expansion is secondary until stabilization is complete.

---

# AI RULES

- Always work in feature branches
- Never push to main
- Always show git status before finish
- Never assume GitHub push succeeded
- All changes must be visible in git log