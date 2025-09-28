import sample from "../data/meals.sample.json" with { type: "json" };
import paginate from "../utils/paginate.js";

let MEALS = [...sample];

export const listMeals = (req, res) => {
  const { q, tag, page, limit } = req.query;
  let filtered = [...MEALS];

  if (q) {
    const needle = q.toLowerCase();
    filtered = filtered.filter(m =>
      m.title.toLowerCase().includes(needle) ||
      (m.tags || []).some(t => t.toLowerCase().includes(needle))
    );
  }

  if (tag) {
    filtered = filtered.filter(m => (m.tags || []).includes(tag));
  }

  res.json(paginate(filtered, page, limit));
};

export const getMeal = (req, res) => {
  const meal = MEALS.find(m => m.id === req.params.id);
  if (!meal) return res.status(404).json({ error: "Meal not found" });
  res.json(meal);
};

export const createMeal = (req, res) => {
  const payload = req.body || {};
  const newMeal = {
    id: `meal_${Date.now()}`,
    title: payload.title || "Untitled Meal",
    ingredients: payload.ingredients || [],
    calories: payload.calories || 0,
    tags: payload.tags || []
  };
  MEALS.unshift(newMeal);
  res.status(201).json({ message: "Meal created (dummy)", meal: newMeal });
};

export const updateMeal = (req, res) => {
  const idx = MEALS.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Meal not found" });
  MEALS[idx] = { ...MEALS[idx], ...req.body };
  res.json({ message: "Meal updated (dummy)", meal: MEALS[idx] });
};

export const deleteMeal = (req, res) => {
  const before = MEALS.length;
  MEALS = MEALS.filter(m => m.id !== req.params.id);
  if (before === MEALS.length) return res.status(404).json({ error: "Meal not found" });
  res.json({ message: "Meal deleted (dummy)", id: req.params.id });
};
