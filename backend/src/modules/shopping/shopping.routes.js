import express from "express";
import validate from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/auth.js";
import { buildShoppingListRules } from "./shopping.validators.js";
import { buildShoppingList } from "./shopping.model.js";

const router = express.Router();

/**
 * POST /api/shopping
 * body: { "mealIds": ["<mealId1>", "<mealId2>", ...] }
 *
 * Returns aggregated ingredients for the selected meals.
 * Route is protected so only authenticated users can generate a list.
 */
router.post(
  "/",
  authenticate,
  buildShoppingListRules,
  validate,
  async (req, res, next) => {
    try {
      const { mealIds } = req.body;
      const list = await buildShoppingList(mealIds);
      res.json(list);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
