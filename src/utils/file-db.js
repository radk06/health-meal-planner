import fs from "fs/promises";
import path from "path";
const root = path.resolve(process.cwd());

export async function readJson(relPath, fallback = []) {
  const file = path.join(root, relPath);
  try {
    const text = await fs.readFile(file, "utf-8");
    return JSON.parse(text || "[]");
  } catch (e) {
    if (e.code === "ENOENT") return fallback;
    throw e;
  }
}

export async function writeJson(relPath, data) {
  const file = path.join(root, relPath);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
  return data;
}

export function genId(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 10);
}
