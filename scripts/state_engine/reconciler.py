from datetime import datetime


def reconcile_update(current: dict, ai_payload: dict):
    """
    Safely merges AI updates into project state
    without breaking consistency.
    """

    modules = current.get("modules", [])

    updates = ai_payload.get("module_updates", [])

    module_map = {m["id"]: m for m in modules}

    for u in updates:
        mid = u.get("id")

        if mid in module_map:
            module = module_map[mid]

            # safe progress clamp
            if "progress" in u:
                new_progress = max(0, min(100, u["progress"]))
                module["progress"] = new_progress

            if "status" in u:
                module["status"] = u["status"]

            module["updated_at"] = datetime.utcnow().isoformat()

    current["modules"] = list(module_map.values())

    # append logbook safely
    if "logbook_add" in ai_payload:
        if "logbook" not in current:
            current["logbook"] = []

        current["logbook"].append(
            {"timestamp": datetime.utcnow().isoformat(), "entry": ai_payload}
        )

    return current
