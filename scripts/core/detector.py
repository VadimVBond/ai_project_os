import os
import json


class ProjectDetector:
    """
    Универсальная система автоопределения типа проекта и его стека.
    """

    MARKERS = {
        "ai_project_os": [".ai"],
        "mkdocs": ["mkdocs.yml"],
        "astro": ["astro.config.mjs", "astro.config.js", "astro.config.ts"],
        "nextjs": ["next.config.js", "next.config.mjs", "next.config.ts"],
        "django": ["manage.py"],
        "flask": ["wsgi.py", "app.py"],
        "fastapi": ["main.py", "api.py"],
        "telegram_bot": ["bot.py", "main.py", "run.py"], 
    }

    DEPENDENCY_MARKERS = {
        "python": {
            "flask": ["flask"],
            "fastapi": ["fastapi"],
            "django": ["django"],
            "telegram_bot": ["python-telegram-bot", "aiogram", "telebot", "pygram", "telethon"],
        },
        "node": {
            "nextjs": ["next"],
            "astro": ["astro"],
            "react": ["react"],
            "vue": ["vue"],
            "tailwind": ["tailwindcss"],
        }
    }

    def __init__(self, root_dir="."):
        self.root_dir = root_dir

    def detect(self):
        results = {
            "name": None,
            "type": "unknown",
            "stack": [],
            "markers_found": [],
            "dependencies": {
                "python": [],
                "node": []
            }
        }

        # 1. Поиск по маркерам файлов
        for p_type, markers in self.MARKERS.items():
            for marker in markers:
                if os.path.exists(os.path.join(self.root_dir, marker)):
                    results["markers_found"].append(marker)
                    if p_type not in results["stack"]:
                        results["stack"].append(p_type)

        # 2. Анализ зависимостей Python
        req_path = os.path.join(self.root_dir, "requirements.txt")
        if os.path.exists(req_path):
            with open(req_path, "r", encoding="utf-8") as f:
                content = f.read().lower()
                for p_type, deps in self.DEPENDENCY_MARKERS["python"].items():
                    for dep in deps:
                        if dep in content:
                            if dep not in results["dependencies"]["python"]:
                                results["dependencies"]["python"].append(dep)
                            if p_type not in results["stack"]:
                                results["stack"].append(p_type)

        # 3. Анализ зависимостей Node.js и имени проекта
        pkg_path = os.path.join(self.root_dir, "package.json")
        if os.path.exists(pkg_path):
            try:
                with open(pkg_path, "r", encoding="utf-8") as f:
                    pkg_data = json.load(f)
                    results["name"] = pkg_data.get("name")
                    all_deps = {**pkg_data.get("dependencies", {}), **pkg_data.get("devDependencies", {})}
                    for p_type, deps in self.DEPENDENCY_MARKERS["node"].items():
                        for dep in deps:
                            if dep in all_deps:
                                if dep not in results["dependencies"]["node"]:
                                    results["dependencies"]["node"].append(dep)
                                if p_type not in results["stack"]:
                                    results["stack"].append(p_type)
            except Exception:
                pass

        # 4. Уточнение для Telegram Bot (часто main.py или bot.py)
        if "telegram_bot" in results["dependencies"]["python"]:
            if "telegram_bot" not in results["stack"]:
                results["stack"].append("telegram_bot")

        # 5. Определение основного типа
        if "ai_project_os" in results["stack"]:
            results["type"] = "framework"
        elif "nextjs" in results["stack"]:
            results["type"] = "webapp"
        elif "astro" in results["stack"]:
            results["type"] = "static_site"
        elif "mkdocs" in results["stack"]:
            results["type"] = "documentation"
        elif "django" in results["stack"]:
            results["type"] = "api"
        elif "fastapi" in results["stack"] or "flask" in results["stack"]:
            results["type"] = "api"
        elif "telegram_bot" in results["stack"]:
            results["type"] = "bot"
        elif results["stack"]:
            results["type"] = results["stack"][0]

        return results


if __name__ == "__main__":
    detector = ProjectDetector()
    print(json.dumps(detector.detect(), indent=2))
