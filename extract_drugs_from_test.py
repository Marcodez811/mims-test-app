"""
Extract all unique drugs from test.json and map them to their MIMS reference IDs.

Parses the scenario names and XML prescription_query fields to build a
comprehensive drug list with: name, reference ID (GUID), and drug type
(Product, GenericItem, GGPI, Molecule, SubstanceClass).

Output: Scripts/drugs.json  (for use by the React frontend)
"""

import json
import re
import os

TEST_JSON = "test.json"
OUTPUT_DIR = "Scripts"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "drugs.json")

# Regex to match drug reference tags in XML
# Captures: tag type, reference GUID
DRUG_REF_PATTERN = re.compile(
    r'<(Product|GenericItem|GGPI|Molecule|SubstanceClass)\s+reference="(\{[^}]+\})"'
)


def extract_drug_name_from_scenario(scenario_name: str, position: str) -> str:
    """
    Try to extract a human-readable drug name from the scenario name.
    
    Scenarios typically have format:
      "Category - N: DrugName1 + DrugName2"
      "Category - N: DrugName1"
    
    position: "prescribing" or "prescribed" or "allergy"
    For interaction scenarios with "+", the first drug is prescribing, second is prescribed/allergy.
    For single-drug scenarios, there's only one drug.
    """
    # Remove category prefix like "Drug Info - 1: " or "Drug Drug Interaction - 3: "
    match = re.match(r'^[^:]+:\s*(.+)$', scenario_name)
    if not match:
        return scenario_name.strip()
    
    drug_part = match.group(1).strip()
    
    # Check if there's a "+" separator (interaction scenarios)
    if " + " in drug_part:
        parts = drug_part.split(" + ", 1)
        if position == "prescribing":
            return parts[0].strip()
        else:
            return parts[1].strip()
    
    return drug_part


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    with open(TEST_JSON, "r") as f:
        scenarios = json.load(f)

    # Map: reference_id -> { id, name, type }
    drugs_map: dict[str, dict] = {}

    for scenario in scenarios:
        name = scenario.get("name", "")
        xml = scenario.get("prescription_query", "")
        
        # Find all drug references in the XML
        matches = DRUG_REF_PATTERN.findall(xml)
        
        if not matches:
            continue
        
        # Determine which section each reference belongs to
        # by looking at surrounding XML context
        for drug_type, ref_id in matches:
            if ref_id in drugs_map:
                continue  # Already found this drug
            
            # Determine position based on XML context
            # Find the match position in xml
            ref_escaped = re.escape(ref_id)
            
            # Check if this reference is inside <Prescribing>, <Prescribed>, <Allergies>, <Content>, or <Detail>
            prescribing_match = re.search(
                r'<Prescribing>.*?' + ref_escaped + r'.*?</Prescribing>', xml, re.DOTALL
            )
            prescribed_match = re.search(
                r'<Prescribed>.*?' + ref_escaped + r'.*?</Prescribed>', xml, re.DOTALL
            )
            allergy_match = re.search(
                r'<Allergies>.*?' + ref_escaped + r'.*?</Allergies>', xml, re.DOTALL
            )
            content_match = re.search(
                r'<Content>.*?' + ref_escaped + r'.*?</Content>', xml, re.DOTALL
            )
            detail_match = re.search(
                r'<Detail>.*?' + ref_escaped + r'.*?</Detail>', xml, re.DOTALL
            )
            
            if prescribing_match:
                position = "prescribing"
            elif prescribed_match or allergy_match:
                position = "prescribed"
            elif content_match or detail_match:
                position = "prescribing"  # Single drug scenarios
            else:
                position = "prescribing"
            
            drug_name = extract_drug_name_from_scenario(name, position)
            
            # Clean up names - remove parenthetical generic names for branded products
            # but keep them for clarity
            drugs_map[ref_id] = {
                "id": ref_id,
                "name": drug_name,
                "type": drug_type,
            }

    # Convert to sorted list
    drugs_list = sorted(drugs_map.values(), key=lambda d: d["name"].lower())

    # Write output
    with open(OUTPUT_FILE, "w") as f:
        json.dump(drugs_list, f, indent=2, ensure_ascii=False)

    print(f"Extracted {len(drugs_list)} unique drugs from {len(scenarios)} scenarios")
    print(f"Output written to: {OUTPUT_FILE}")
    print()
    
    # Print summary table
    type_counts: dict[str, int] = {}
    for d in drugs_list:
        t = d["type"]
        type_counts[t] = type_counts.get(t, 0) + 1
    
    print("Drug types breakdown:")
    for t, count in sorted(type_counts.items()):
        print(f"  {t}: {count}")
    
    print()
    print("Sample entries:")
    for d in drugs_list[:10]:
        print(f"  [{d['type']:15s}] {d['id']}  →  {d['name']}")


if __name__ == "__main__":
    main()
