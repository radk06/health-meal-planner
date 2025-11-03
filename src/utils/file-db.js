import fs from "fs/promises";
import path from "path";

/**
 * Reads JSON file and parses it.
 */
export async function readJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading JSON file:", err.message);
    return [];
  }
}

/**
 * Writes data to a JSON file.
 */
export async function writeJSON(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Saved ${data.length} records to ${filePath}`);
  } catch (err) {
    console.error("Error writing JSON file:", err.message);
  }
}
