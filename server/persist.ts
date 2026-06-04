import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data.json");

export function loadData(): Record<string, unknown> | null {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch {}
  return null;
}

export function saveData(data: Record<string, unknown>): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("[persist] Failed to save data:", e);
  }
}
