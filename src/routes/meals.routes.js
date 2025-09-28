import { Router } from "express";
import { listMeals, getMeal, createMeal, updateMeal, deleteMeal } from "../controllers/meals.controller.js";

const router = Router();

router.get("/", listMeals);
router.get("/:id", getMeal);
router.post("/", createMeal);
router.put("/:id", updateMeal);
router.delete("/:id", deleteMeal);

export default router;
