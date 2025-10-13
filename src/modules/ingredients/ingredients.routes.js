import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import {
  getAllIngredients, getIngredientById, addNewIngredient,
  updateExistingIngredient, deleteIngredient
} from "./ingredients.model.js";
import {
  listIngredientsRules, ingredientIdRules, createIngredientRules, updateIngredientRules
} from "./ingredients.validators.js";

const router = Router();

router.get("/", validate(listIngredientsRules), async (req, res, next) => {
  try { res.json(await getAllIngredients(req.query)); }
  catch (e) { next(e); }
});

router.get("/:id", validate(ingredientIdRules), async (req, res, next) => {
  try {
    const item = await getIngredientById(req.params.id);
    if (!item) return res.status(404).json({ error: "Ingredient not found" });
    res.json(item);
  } catch (e) { next(e); }
});

router.post("/", validate(createIngredientRules), async (req, res, next) => {
  try { res.status(201).json(await addNewIngredient(req.body)); }
  catch (e) { next(e); }
});

router.put("/:id", validate([...ingredientIdRules, ...updateIngredientRules]), async (req, res, next) => {
  try {
    const updated = await updateExistingIngredient(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Ingredient not found" });
    res.json(updated);
  } catch (e) { next(e); }
});

router.delete("/:id", validate(ingredientIdRules), async (req, res, next) => {
  try {
    const ok = await deleteIngredient(req.params.id);
    if (!ok) return res.status(404).json({ error: "Ingredient not found" });
    res.json({ success: true });
  } catch (e) { next(e); }
});

export default router;
