import os
import json
import csv

# Změň tuto cestu na cestu ke svému Vaultu
VAULT_PATH = r"C:\Users\YourName\Documents\Origin"  # <-- uprav

plugins_dir = os.path.join(VAULT_PATH, ".obsidian", "plugins")
output_file = os.path.join(VAULT_PATH, "plugin_versions.csv")

with open(output_file, "w", newline="", encoding="utf-8") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(["Plugin Name", "Plugin ID", "Version"])  # hlavička

    for plugin_folder in os.listdir(plugins_dir):
        manifest_path = os.path.join(plugins_dir, plugin_folder, "manifest.json")
        if os.path.isfile(manifest_path):
            try:
                with open(manifest_path, "r", encoding="utf-8") as f:
                    manifest = json.load(f)
                    name = manifest.get("name", "Unknown")
                    plugin_id = manifest.get("id", plugin_folder)
                    version = manifest.get("version", "Unknown")
                    writer.writerow([name, plugin_id, version])
            except Exception as e:
                print(f"Chyba při zpracování {plugin_folder}: {e}")

print(f"✅ CSV export hotový: {output_file}")
