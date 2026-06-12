import sys
import requests
import json
import os

def send_telegram_notification(token, chat_id, message):
    """Sends a message to a Telegram chat."""
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "Markdown"
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        print(f"Notification sent successfully: {response.status_code}")
        return True
    except Exception as e:
        print(f"Failed to send notification: {e}")
        return False

if __name__ == "__main__":
    # In a real scenario, these would come from env vars or project.json
    # For now, we provide a template for the user to fill.
    TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "YOUR_BOT_TOKEN")
    CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "YOUR_CHAT_ID")
    
    if len(sys.argv) < 2:
        print("Usage: python telegram_notify.py 'Your message here'")
        sys.exit(1)
        
    msg = sys.argv[1]
    
    if TOKEN == "YOUR_BOT_TOKEN" or CHAT_ID == "YOUR_CHAT_ID":
        print("SKIPPING: Telegram credentials not set.")
        # We don't fail the build/process, just log it.
    else:
        send_telegram_notification(TOKEN, CHAT_ID, msg)
