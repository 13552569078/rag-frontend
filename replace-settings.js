// replace-settings.ts
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const settingsProdPath = path.join(__dirname, "public", "settings-prod.js");
const settingsPath = path.join(__dirname, "public", "settings.js");

async function replaceSettings() {
  try {
    const data = await readFile(settingsProdPath, "utf8");
    await writeFile(settingsPath, data, "utf8");
    console.log("replaced");
  } catch (err) {
    console.error("no replaced", err);
  }
}

replaceSettings();
