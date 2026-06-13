import json
import os

def get_i18n_dict():
    i18n_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'i18n.json')
    with open(i18n_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def t(key, lang='en'):
    i18n = get_i18n_dict()
    return i18n.get(lang, i18n.get('en', {})).get(key, key)
