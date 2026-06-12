import json
import os
from datetime import datetime
from detector import ProjectDetector
from state_engine import StateEngine


class Bootstrapper:
    """
    Класс для автоматической инициализации и настройки AI Project OS в репозитории.
    """

    def __init__(self, root_dir="."):
        self.root_dir = root_dir
        self.detector = ProjectDetector(root_dir)
        self.state = StateEngine(
            path=os.path.join(root_dir, "data/project.json"),
            settings_path=os.path.join(root_dir, "data/settings.json")
        )

    PROFILES = {
        "bot": {
            "telegram": {
                "token": "YOUR_BOT_TOKEN_HERE",
                "use_webhook": False,
                "webhook_url": ""
            }
        },
        "webapp": {
            "deployment": {
                "provider": "vercel",
                "auto_deploy": True
            }
        },
        "api": {
            "database": {
                "type": "sqlite",
                "url": "db.sqlite3"
            },
            "auth": {
                "enabled": True,
                "type": "jwt"
            }
        },
        "documentation": {
            "docs": {
                "theme": "material",
                "search_enabled": True
            }
        }
    }

    def run(self):
        print(f"[*] Начало процесса автоопределения в {os.path.abspath(self.root_dir)}...")
        
        # 1. Запуск детектора
        info = self.detector.detect()
        print(f"[+] Обнаружен тип проекта: {info['type']}")
        print(f"[+] Стек технологий: {', '.join(info['stack']) if info['stack'] else 'не определен'}")

        # 2. Обновление settings.json
        self.state.update_setting("bootstrap.project_type", info["type"])
        self.state.update_setting("bootstrap.stack", info["stack"])
        self.state.update_setting("bootstrap.detected_at", datetime.utcnow().isoformat())
        
        # Сбрасываем старые настройки фреймворка, если они были
        self.state.update_setting("bootstrap.framework", None)

        # Добавляем специфичные для стека настройки
        for stack_item in info["stack"]:
            if stack_item in ["nextjs", "astro", "mkdocs", "django", "flask", "fastapi", "telegram_bot", "ai_project_os"]:
                self.state.update_setting("bootstrap.framework", stack_item)
                break

        # Применяем профиль настроек
        profile = self.PROFILES.get(info["type"])
        if profile:
            for key, value in profile.items():
                # Обновляем только если настройки еще нет, чтобы не затереть существующую
                if self.state.get_setting(key) is None:
                    self.state.update_setting(key, value)
                    print(f"[+] Применен профиль настроек для: {key}")

        # 3. Обновление project.json
        project_data = self.state.data
        if not project_data.get("project"):
            project_data["project"] = {}
        
        project_data["project"]["type"] = info["type"]
        project_data["project"]["stack"] = info["stack"]
        project_data["project"]["updated_at"] = datetime.utcnow().isoformat()[:10]
        
        # Если имя проекта не задано или дефолтное, пытаемся взять лучшее
        current_name = project_data["project"].get("name")
        new_name = info.get("name") or os.path.basename(os.path.abspath(self.root_dir))
        
        if not current_name or current_name in ["AI Project OS", "ai_project_os"]:
            project_data["project"]["name"] = new_name

        # Сохраняем изменения
        self.state.normalize()
        print("[!] Конфигурация проекта успешно обновлена.")
        
        return info


if __name__ == "__main__":
    bootstrapper = Bootstrapper()
    bootstrapper.run()
