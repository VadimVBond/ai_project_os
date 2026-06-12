# PDF Export Module for AI Project OS

This module generates professional PDF reports for clients and management using data from `project.json`.

## Features
- **Client Reports:** Clean, focused PDF reports without technical details.
- **Progress Visualization:** Includes total progress and module breakdown.
- **Branding:** Support for project name and versioning in headers.

## Requirements
To run the PDF generator, you need the `fpdf2` library:
```bash
pip install fpdf2
```

## Scripts
- `scripts/generate_pdf.py`: Primary script for PDF generation.

## Usage
```bash
python scripts/generate_pdf.py
```
This will generate `reports/project_report.pdf`.
