import json
from datetime import datetime
from validators import validate_project
from normalizer import normalize_project
from reconciler import reconcile_update


class StateEngine:
    def __init__(self, path="data/project.json"):
        self.path = path
        self.data = self._load()

    def _load(self):
        with open(self.path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _save(self):
        with open(self.path, "w", encoding="utf-8") as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)

    # ---------------------------
    # PUBLIC API
    # ---------------------------

    def validate(self):
        return validate_project(self.data)

    def normalize(self):
        self.data = normalize_project(self.data)
        self._save()
        return self.data

    def update(self, ai_payload: dict):
        self.data = reconcile_update(self.data, ai_payload)
        self.data = normalize_project(self.data)
        self._save()
        return self.data

    def status(self):
        return {
            "project": self.data.get("project"),
            "progress": self.data.get("summary", {}).get("progress_total", 0),
            "modules": len(self.data.get("modules", [])),
            "timestamp": datetime.utcnow().isoformat(),
        }
