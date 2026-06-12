def normalize_project(data: dict):
    modules = data.get("modules", [])

    done = 0
    in_progress = 0
    todo = 0
    total_progress = 0

    for m in modules:
        progress = m.get("progress", 0)

        total_progress += progress

        if m.get("status") == "done":
            done += 1
        elif m.get("status") == "in_progress":
            in_progress += 1
        else:
            todo += 1

    if modules:
        avg_progress = total_progress / len(modules)
    else:
        avg_progress = 0

    data["summary"] = {
        "done": done,
        "in_progress": in_progress,
        "todo": todo,
        "progress_total": round(avg_progress, 2),
    }

    return data
