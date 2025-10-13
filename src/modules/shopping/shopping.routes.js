import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { buildListRules } from "./shopping.validators.js";
import { buildShoppingList } from "./shopping.model.js";

const router = Router();

// POST /api/shopping { mealIds: [...] }
router.post("/", validate(buildListRules), async (req, res, next) => {
  try {
    const list = await buildShoppingList(req.body.mealIds);
    res.json({ items: list });
  } catch (e) { next(e); }
});

export default router;
