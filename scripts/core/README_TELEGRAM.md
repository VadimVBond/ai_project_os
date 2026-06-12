# Telegram Integration Module for AI Project OS

This module handles automated notifications to Telegram regarding project status updates, milestones, and blockers.

## Features
- **Status Alerts:** Sends message when a module progress changes.
- **Milestone Notifications:** Alerts when a milestone is completed.
- **Daily Summary:** (Planned) Optional daily digest of project activity.

## Configuration
To use this module, you need:
1. A Telegram Bot Token (from @BotFather).
2. A Chat ID (where notifications will be sent).

Stored in: `.env` (not committed) or passed as parameters.

## Scripts
- `scripts/telegram_notify.py`: Primary script for sending notifications.
