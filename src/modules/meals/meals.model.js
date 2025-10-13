import { readJson, writeJson, genId } from "../../utils/file-db.js";
import { paginate } from "../../utils/paginate.js";

const DATA_PATH = "src/modules/meals/meals.data.json";

export async function getAllMeals({ q, tag, page = 1, limit = 10 }) {
  const items = await readJson(DATA_PATH, []);
  let data = items;

  if (q) {
    const s = q.toLowerCase();
    data = data.filter(m =>
      m.title.toLowerCase().includes(s) ||
      (m.ingredients || []).some(i => i.toLowerCase().includes(s))
    );
  }
  if (tag) data = data.filter(m => (m.tags || []).includes(tag));

  return paginate(data, { page, limit });
}

export async function getMealById(id) {
  const items = await readJson(DATA_PATH, []);
  return items.find(m => m.id === id) || null;
}

export async function addNewMeal(payload) {
  const items = await readJson(DATA_PATH, []);
  const meal = {
    id: genId("meal_"),
    title: "",
    ingredients: [],
    calories: 0,
    tags: [],
    ...payload
  };
  items.push(meal);
  await writeJson(DATA_PATH, items);
  return meal;
}

export async function updateExistingMeal(id, payload) {
  const items = await readJson(DATA_PATH, []);
  const idx = items.findIndex(m => m.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...payload, id };
  await writeJson(DATA_PATH, items);
  return items[idx];
}

export async function deleteMeal(id) {
  const items = await readJson(DATA_PATH, []);
  const idx = items.findIndex(m => m.id === id);
  if (idx === -1) return false;
  items.splice(idx, 1);
  await writeJson(DATA_PATH, items);
  return true;
}
