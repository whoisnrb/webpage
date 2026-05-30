import re
import os

def fix_json_file(file_path):
    print(f"Fixing JSON file: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace "price": 190000, with "price": "190000",
    fixed = re.sub(r'"price":\s*(\d+)', r'"price": "\1"', content)
    # Replace "priceFrom": true, with "priceFrom": "true",
    fixed = re.sub(r'"priceFrom":\s*true', r'"priceFrom": "true"', fixed)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(fixed)
    print(f"Successfully fixed {file_path}")

base_dir = r"c:\Users\Török Norbert\.gemini\antigravity\scratch\webpage 2.0"
fix_json_file(os.path.join(base_dir, "messages", "hu.json"))
fix_json_file(os.path.join(base_dir, "messages", "en.json"))
