import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import {
  getAllMeals, getMealById, addNewMeal, updateExistingMeal, deleteMeal
} from "./meals.model.js";
import {
  listMealsRules, mealIdRules, createMealRules, updateMealRules
} from "./meals.validators.js";

const router = Router();

router.get("/", validate(listMealsRules), async (req, res, next) => {
  try { res.json(await getAllMeals(req.query)); }
  catch (e) { next(e); }
});

router.get("/:id", validate(mealIdRules), async (req, res, next) => {
  try {
    const meal = await getMealById(req.params.id);
    if (!meal) return res.status(404).json({ error: "Meal not found" });
    res.json(meal);
  } catch (e) { next(e); }
});

router.post("/", validate(createMealRules), async (req, res, next) => {
  try { res.status(201).json(await addNewMeal(req.body)); }
  catch (e) { next(e); }
});

router.put("/:id", validate([...mealIdRules, ...updateMealRules]), async (req, res, next) => {
  try {
    const updated = await updateExistingMeal(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Meal not found" });
    res.json(updated);
  } catch (e) { next(e); }
});

router.delete("/:id", validate(mealIdRules), async (req, res, next) => {
  try {
    const ok = await deleteMeal(req.params.id);
    if (!ok) return res.status(404).json({ error: "Meal not found" });
    res.json({ success: true });
  } catch (e) { next(e); }
});

export default router;
