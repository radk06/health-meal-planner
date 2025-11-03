import express from "express";
import Meal from "../meals/meals.model.js";
import validate from "../../middlewares/validate.js";
import { buildListRules } from "./shopping.validators.js";

const router = express.Router();

/**
 * POST /api/shopping
 * Body:
 *   {
 *     "mealIds": ["64ff3e...","6500a1..."],
 *     "includeMeals": true   // optional: include chosen meals in response
 *   }
 *
 * Response:
 *   {
 *     "items": [{ "name": "chicken", "count": 2 }, ...],
 *     "meals": [{ "id": "...", "title": "..." }, ...] // when includeMeals = true
 *   }
 */
router.post("/", buildListRules, validate, async (req, res, next) => {
  try {
    const { mealIds = [], includeMeals = false } = req.body;

    // Fetch the selected meals
    const meals = await Meal.find({ _id: { $in: mealIds } }).select("title ingredients");

    // Aggregate ingredient strings and count occurrences
    const counts = new Map();
    for (const meal of meals) {
      for (const raw of meal.ingredients || []) {
        // normalize: trim + lowercase
        const name = String(raw).trim().toLowerCase();
        if (!name) continue;
        counts.set(name, (counts.get(name) || 0) + 1);
      }
    }

    const items = Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const payload = { items };

    if (includeMeals) {
      payload.meals = meals.map(m => ({ id: m._id, title: m.title }));
    }

    res.json(payload);
  } catch (err) {
    next(err);
  }
});

export default router;
