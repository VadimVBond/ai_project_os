from .i18n import t

def validate_project(data: dict, lang='en'):
    errors = []

    if "project" not in data:
        errors.append(t("error_missing_project", lang))

    if "modules" not in data:
        errors.append(t("error_missing_modules", lang))

    for m in data.get("modules", []):
        if m.get("progress", 0) > 100:
            errors.append(t("error_progress_gt_100", lang).format(id=m.get('id')))

        if m.get("progress", 0) < 0:
            errors.append(t("error_progress_lt_0", lang).format(id=m.get('id')))

        if m.get("status") not in ["todo", "in_progress", "blocked", "review", "done"]:
            errors.append(t("error_invalid_status", lang).format(id=m.get('id')))

    return {"valid": len(errors) == 0, "errors": errors}
