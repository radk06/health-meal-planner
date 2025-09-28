import { Router } from "express";
import { listIngredients, getIngredient, addIngredient, deleteIngredient } from "../controllers/ingredients.controller.js";

const router = Router();

router.get("/", listIngredients);
router.get("/:id", getIngredient);
router.post("/", addIngredient);
router.delete("/:id", deleteIngredient);

export default router;
