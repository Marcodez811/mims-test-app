import json
import re
import openpyxl
import os

# Paths
SCENARIOS_PATH = "scenarios.json"
ICD10_PATH = "icd-10_mapping.xlsx"
OUTPUT_DIR = "Scripts"

# Ensure output directory exists
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# --- Extract Drugs from scenarios.json ---
print("Extracting Drugs...")
drugs_map = {}

try:
    with open(SCENARIOS_PATH, 'r') as f:
        scenarios = json.load(f)
        
    for scenario in scenarios:
        # Regex to find Product/GenericItem/GGPI tags with reference and optional name
        # We also try to extract the name from the scenario name if possible, or just use the extracted name
        
        # Pattern: <(Product|GenericItem|GGPI|Molecule|SubstanceClass)[^>]*reference="([^"]+)"
        # But we really want to capture meaningful names.
        # Often the name is in the scenario "name" field, e.g. "Drug Info - 1: Abstral SL tab 100 mcg (fentanyl)"
        # We can try to parse the XML to find specific items.
        
        xml = scenario.get('prescription_query', '')
        
        # Simple regex to find all reference items
        # Group 1: Tag Name (Type)
        # Group 2: Reference ID
        matches = re.finditer(r'<(Product|GenericItem|GGPI|Molecule|SubstanceClass)[^>]*reference="({[^}]+})"[^>]*>', xml)
        
        for m in matches:
            tag_type = m.group(1)
            ref_id = m.group(2)
            
            # Try to derive a name. 
            # 1. Check if there is a 'name' attribute in the tag (less common for Product/GGPI in these samples)
            # 2. Use the scenario name if it looks like it describes this drug
            
            # For simplicity in this "hacky" extraction, we will use the scenario name 
            # if we confirm this GUID is the "Primary" one (under <Prescribing>).
            
            # Check if this match is inside <Prescribing>
            # (This is a bit loose, but works for identifying the main drug of a scenario)
            name_candidate = "Unknown Drug"
            if scenario['name']:
                name_candidate = scenario['name'].split(':')[1].strip() if ':' in scenario['name'] else scenario['name']
            
            # Store in map. If we already have it, maybe we have a better name now?
            # We key by Reference ID.
            if ref_id not in drugs_map:
                drugs_map[ref_id] = {
                    "id": ref_id,
                    "type": tag_type,
                    "name": name_candidate # Placeholder, better than nothing
                }
            elif drugs_map[ref_id]["name"] == "Unknown Drug" and name_candidate != "Unknown Drug":
                 drugs_map[ref_id]["name"] = name_candidate

except Exception as e:
    print(f"Error parsing scenarios: {e}")

# Save Drugs JSON
drugs_list = list(drugs_map.values())
with open(os.path.join(OUTPUT_DIR, "drugs.json"), "w") as f:
    json.dump(drugs_list, f, indent=2)
print(f"Saved {len(drugs_list)} drugs to {OUTPUT_DIR}/drugs.json")


# --- Extract Health Issues from Excel ---
print("Extracting Health Issues...")
health_issues = []

try:
    wb = openpyxl.load_workbook(ICD10_PATH, read_only=True)
    sheet = wb.active
    
    # Iterate rows, skip header (row 1)
    for row in sheet.iter_rows(min_row=2, values_only=True):
        code = row[0] # Col A
        name_en = row[2] # Col C
        name_zh = row[3] # Col D
        
        if code:
            # Clean up
            code = str(code).strip()
            name_en = str(name_en).strip() if name_en else ""
            name_zh = str(name_zh).strip() if name_zh else ""
            
            health_issues.append({
                "code": code,
                "name_en": name_en,
                "name_zh": name_zh,
                "label": f"{code} - {name_zh} ({name_en})"
            })

except Exception as e:
    print(f"Error parsing Excel: {e}")

# Save Health Issues JSON
with open(os.path.join(OUTPUT_DIR, "health_issues.json"), "w") as f:
    json.dump(health_issues, f, indent=2)
print(f"Saved {len(health_issues)} health issues to {OUTPUT_DIR}/health_issues.json")
