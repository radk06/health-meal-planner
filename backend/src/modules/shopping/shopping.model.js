import Meal from "../meals/meals.model.js";

/**
 * Build a shopping list for the given meal ids.
 * For each ingredient string in the meals, aggregate how many times it appears
 * and which meals use it.
 */
export async function buildShoppingList(mealIds) {
  const meals = await Meal.find({ _id: { $in: mealIds } });

  const itemsMap = new Map();

  for (const meal of meals) {
    if (!Array.isArray(meal.ingredients)) continue;

    for (const ing of meal.ingredients) {
      const name =
        typeof ing === "string"
          ? ing
          : ing?.name
          ? ing.name
          : String(ing);

      if (!itemsMap.has(name)) {
        itemsMap.set(name, {
          name,
          count: 1,
          meals: [meal.title],
        });
      } else {
        const item = itemsMap.get(name);
        item.count += 1;
        if (!item.meals.includes(meal.title)) {
          item.meals.push(meal.title);
        }
      }
    }
  }

  return {
    meals: meals.map(m => ({ id: m._id, title: m.title })),
    items: Array.from(itemsMap.values()),
  };
}

export default {
  buildShoppingList,
};
