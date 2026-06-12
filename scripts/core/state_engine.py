import json
from datetime import datetime
from validators import validate_project
from normalizer import normalize_project
from reconciler import reconcile_update


class StateEngine:
    def __init__(self, path="data/project.json", settings_path="data/settings.json"):
        self.path = path
        self.settings_path = settings_path
        self.data = self._load(self.path)
        self.settings = self._load(self.settings_path)

    def _load(self, file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except FileNotFoundError:
            return {}

    def _save(self, file_path, data):
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    def _save_all(self):
        self._save(self.path, self.data)
        self._save(self.settings_path, self.settings)

    # ---------------------------
    # PUBLIC API
    # ---------------------------

    def get_setting(self, key, default=None):
        keys = key.split('.')
        val = self.settings
        for k in keys:
            val = val.get(k, {})
        return val if val != {} else default

    def update_setting(self, key, value):
        keys = key.split('.')
        target = self.settings
        for k in keys[:-1]:
            target = target.setdefault(k, {})
        target[keys[-1]] = value
        self._save(self.settings_path, self.settings)

    def validate(self):
        return validate_project(self.data)

    def normalize(self):
        self.data = normalize_project(self.data)
        self._save(self.path, self.data)
        return self.data

    def update(self, ai_payload: dict):
        self.data = reconcile_update(self.data, ai_payload)
        self.data = normalize_project(self.data)
        self._save(self.path, self.data)
        return self.data

    def status(self):
        return {
            "project": self.data.get("project"),
            "progress": self.data.get("summary", {}).get("progress_total", 0),
            "modules": len(self.data.get("modules", [])),
            "timestamp": datetime.utcnow().isoformat(),
        }
