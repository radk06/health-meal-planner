import sample from "../data/ingredients.sample.json" with { type: "json" };

let INGREDIENTS = [...sample];

export const listIngredients = (req, res) => {
  res.json({ items: INGREDIENTS });
};

export const getIngredient = (req, res) => {
  const item = INGREDIENTS.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Ingredient not found" });
  res.json(item);
};

export const addIngredient = (req, res) => {
  const newItem = { id: `ing_${Date.now()}`, ...req.body };
  INGREDIENTS.push(newItem);
  res.status(201).json({ message: "Ingredient added (dummy)", item: newItem });
};

export const deleteIngredient = (req, res) => {
  INGREDIENTS = INGREDIENTS.filter(i => i.id !== req.params.id);
  res.json({ message: "Ingredient deleted (dummy)", id: req.params.id });
};
