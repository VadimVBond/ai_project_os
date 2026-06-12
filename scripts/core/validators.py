def validate_project(data: dict):
    errors = []

    if "project" not in data:
        errors.append("Missing project root")

    if "modules" not in data:
        errors.append("Missing modules")

    for m in data.get("modules", []):
        if m.get("progress", 0) > 100:
            errors.append(f"Module {m.get('id')} progress > 100")

        if m.get("progress", 0) < 0:
            errors.append(f"Module {m.get('id')} progress < 0")

        if m.get("status") not in ["todo", "in_progress", "blocked", "review", "done"]:
            errors.append(f"Invalid status in module {m.get('id')}")

    return {"valid": len(errors) == 0, "errors": errors}
