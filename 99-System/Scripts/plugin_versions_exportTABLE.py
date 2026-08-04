import os
import json

# Zadej cestu ke svému Vaultu zde:
VAULT_PATH = r"C:\Users\YourName\Documents\Origin"  # <-- změň podle sebe

plugins_dir = os.path.join(VAULT_PATH, ".obsidian", "plugins")
output_file = os.path.join(VAULT_PATH, "plugin_versions.txt")

lines = ["Plugin Name | ID | Version"]

for plugin_folder in os.listdir(plugins_dir):
    manifest_path = os.path.join(plugins_dir, plugin_folder, "manifest.json")
    if os.path.isfile(manifest_path):
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                manifest = json.load(f)
                name = manifest.get("name", "Unknown")
                plugin_id = manifest.get("id", plugin_folder)
                version = manifest.get("version", "Unknown")
                lines.append(f"{name} | {plugin_id} | {version}")
        except Exception as e:
            print(f"Chyba při čtení {plugin_folder}: {e}")

# Uložení do souboru
with open(output_file, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"Hotovo! Výstup uložen do: {output_file}")
