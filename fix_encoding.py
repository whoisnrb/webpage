import json
import os

def repair_json(file_path):
    print(f"Repairing {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix double-encoding patterns
    # These are very common when UTF-8 is treated as Latin-1 and re-saved
    replacements = {
        'Ă©': 'é', 'Ăˇ': 'á', 'Ă\xad': 'í', 'Ăł': 'ó', 
        'Ă¶': 'ö', 'Ĺ\x91': 'ő', 'Ăş': 'ú', 'ĂĽ': 'ü', 
        'Ĺ\xb1': 'ű', 'Ă\x81': 'Á', 'Ă\x89': 'É', 'Ă\x8d': 'Í', 
        'Ă\x93': 'Ó', 'Ă\x96': 'Ö', 'Ĺ\x90': 'Ő', 'Ă\x9a': 'Ú', 
        'Ă\x9c': 'Ü', 'Ĺ\xb0': 'Ű', 
        'Ăš': 'Ú', 'Ăś': 'ö', 'Ăź': 'ü', 'Ă–': 'Ö',
        'ĂŤ': 'Í', 'Ă˘': 'â', # wait, â might be right
        'â†’': '→',
        'đźš€': '🚀',
        'đź’ˇ': '💰',
        'đź“ˆ': '📈',
        'đź•’': '🕒',
        'đź›ˇ': '🛡️',
        'đź—ł': '🗓️',
        'âœ…': '✅',
        'âś¨': '✨',
        'âš™': '⚙️',
        'â„š': 'ℹ️',
        # Cleanup mixed cases
        'ElĂ©gedett Ă¶gyfĂ©l': 'Elégedett ügyfél',
        'Ă¶gyfél': 'ügyfél',
        'Ă¶dvĂ¶zlĂ¶m': 'Üdvözlöm',
        'ögyvédi': 'ügyvédi',
        'ögyfél': 'ügyfél'
    }

    for garbled, correct in replacements.items():
        content = content.replace(garbled, correct)

    # 2. Fix the whitespace mess (remove multiple consecutive newlines)
    import re
    content = re.sub(r'\n\s*\n', '\n', content)

    # 3. Double check JSON validity
    try:
        data = json.loads(content)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"Successfully repaired and formatted {file_path}")
    except Exception as e:
        print(f"JSON integrity check failed for {file_path}: {e}")
        # Save the string version anyway if we can't parse it, but we should try to fix it
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

if __name__ == "__main__":
    repair_json('messages/hu.json')
    repair_json('messages/en.json')
