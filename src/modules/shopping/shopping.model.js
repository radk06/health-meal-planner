import { readJson } from "../../utils/file-db.js";

const MEALS_PATH = "src/modules/meals/meals.data.json";
const INGS_PATH  = "src/modules/ingredients/ingredients.data.json";

// With the new meals schema, ingredients are strings.
// We'll compute a list of ingredient names missing from pantry.
export async function buildShoppingList(mealIds = []) {
  const meals = await readJson(MEALS_PATH, []);
  const pantry = await readJson(INGS_PATH, []);

  const chosen = mealIds.length ? meals.filter(m => mealIds.includes(m.id)) : [];

  const haveSet = new Set(
    pantry.map(i => i.name.trim().toLowerCase())
  );

  const needed = new Map(); // key=name, value={name, count}

  for (const meal of chosen) {
    for (const ingName of meal.ingredients || []) {
      const key = ingName.trim().toLowerCase();
      if (!haveSet.has(key)) {
        needed.set(key, { name: ingName, count: (needed.get(key)?.count || 0) + 1 });
      }
    }
  }

  return Array.from(needed.values());
}
