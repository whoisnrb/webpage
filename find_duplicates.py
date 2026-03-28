import sys
import json

def find_duplicates(obj, path=""):
    duplicates = []
    if isinstance(obj, dict):
        keys = list(obj.keys())
        for key in keys:
            if keys.count(key) > 1:
                duplicates.append(f"{path}.{key}" if path else key)
            find_duplicates(obj[key], f"{path}.{key}" if path else key)
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            find_duplicates(item, f"{path}[{i}]")
    return duplicates

# This won't work with standard json.loads because it overwrites duplicates.
# We need a custom decoder or just read the file and look for "key": multiple times in the same level.

def find_duplicate_keys_raw(content):
    import re
    stack = []
    duplicates = []
    lines = content.split('\n')
    current_object_keys = [set()]
    
    for i, line in enumerate(lines):
        line_num = i + 1
        # Match "key":
        match = re.search(r'"([^"]+)":', line)
        if match:
            key = match.group(1)
            if key in current_object_keys[-1]:
                duplicates.append((line_num, key))
            else:
                current_object_keys[-1].add(key)
        
        if '{' in line:
            current_object_keys.append(set())
        if '}' in line:
            if len(current_object_keys) > 1:
                current_object_keys.pop()
    
    return duplicates

for filename in ['messages/en.json', 'messages/hu.json']:
    print(f"Checking {filename}...")
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
            duplicates = find_duplicate_keys_raw(content)
            for line_num, key in duplicates:
                print(f"  Line {line_num}: Duplicate key '{key}'")
    except Exception as e:
        print(f"  Error: {e}")
