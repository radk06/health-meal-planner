import { readJson, writeJson, genId } from "../../utils/file-db.js";
import { paginate } from "../../utils/paginate.js";

const DATA_PATH = "src/modules/ingredients/ingredients.data.json";

export async function getAllIngredients({ q, location, expBefore, page = 1, limit = 10 }) {
  const items = await readJson(DATA_PATH, []);
  let data = items;

  if (q) {
    const s = q.toLowerCase();
    data = data.filter(i => i.name.toLowerCase().includes(s));
  }
  if (location) data = data.filter(i => i.location === location);
  if (expBefore) data = data.filter(i => new Date(i.expiresOn) <= new Date(expBefore));

  return paginate(data, { page, limit });
}

export async function getIngredientById(id) {
  const items = await readJson(DATA_PATH, []);
  return items.find(i => i.id === id) || null;
}

export async function addNewIngredient(payload) {
  const items = await readJson(DATA_PATH, []);
  const ing = { id: genId("i"), ...payload };
  items.push(ing);
  await writeJson(DATA_PATH, items);
  return ing;
}

export async function updateExistingIngredient(id, payload) {
  const items = await readJson(DATA_PATH, []);
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...payload, id };
  await writeJson(DATA_PATH, items);
  return items[idx];
}

export async function deleteIngredient(id) {
  const items = await readJson(DATA_PATH, []);
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return false;
  items.splice(idx, 1);
  await writeJson(DATA_PATH, items);
  return true;
}
