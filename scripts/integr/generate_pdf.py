import json
import os
from fpdf import FPDF

class ProjectReportPDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'AI Project OS - Client Report', 0, 1, 'C')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def generate_report():
    # 1. Load data
    try:
        with open('data/project.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Error: data/project.json not found.")
        return

    project = data.get('project', {})
    summary = data.get('summary', {})
    modules = data.get('modules', [])

    # 2. Setup PDF
    pdf = ProjectReportPDF()
    pdf.add_page()
    pdf.set_font('Arial', '', 12)

    # 3. Project Info
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, f"Project: {project.get('name', 'N/A')}", 0, 1)
    pdf.set_font('Arial', '', 12)
    pdf.cell(0, 10, f"Version: {project.get('version', 'N/A')}", 0, 1)
    pdf.cell(0, 10, f"Status: {project.get('status', 'N/A')}", 0, 1)
    pdf.cell(0, 10, f"Overall Progress: {summary.get('progress_total', 0)}%", 0, 1)
    pdf.ln(10)

    # 4. Modules
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, "Module Breakdown", 0, 1)
    pdf.set_font('Arial', '', 12)
    
    for m in modules:
        name = m.get('name', 'Unnamed')
        progress = m.get('progress', 0)
        status = m.get('status', 'todo')
        pdf.cell(0, 10, f"- {name}: {progress}% ({status})", 0, 1)

    # 5. Output
    if not os.path.exists('reports'):
        os.makedirs('reports')
    
    output_path = 'reports/project_report.pdf'
    try:
        pdf.output(output_path)
        print(f"Report generated successfully: {output_path}")
    except Exception as e:
        print(f"Failed to generate PDF: {e}")
        print("Tip: Make sure 'fpdf2' is installed: pip install fpdf2")

if __name__ == "__main__":
    generate_report()
