import express from "express";
import Meal from "./meals.model.js";
import validate from "../../middlewares/validate.js";
import {
  createMealRules,
  updateMealRules,
  listMealRules,
} from "./meals.validators.js";

const router = express.Router();

/**
 * GET /api/meals
 * Query params:
 *   q        : fuzzy search in title
 *   tag      : filter by tag
 *   minCal   : min calories
 *   maxCal   : max calories
 *   page     : page number (default 1)
 *   limit    : page size (default 10)
 *   sort     : e.g. "title", "-calories"
 */
router.get("/", listMealRules, validate, async (req, res, next) => {
  try {
    const {
      q,
      tag,
      minCal,
      maxCal,
      page = 1,
      limit = 10,
      sort = "title",
    } = req.query;

    const filter = {};
    if (q) filter.title = new RegExp(q, "i");
    if (tag) filter.tags = tag;

    if (minCal || maxCal) {
      filter.calories = {};
      if (minCal) filter.calories.$gte = Number(minCal);
      if (maxCal) filter.calories.$lte = Number(maxCal);
    }

    const docs = await Meal.find(filter)
      .sort(sort) // allow "-field" desc
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Meal.countDocuments(filter);
    res.json({
      data: docs,
      page: Number(page),
      limit: Number(limit),
      total,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/meals/:id
 */
router.get("/:id", async (req, res, next) => {
  try {
    const doc = await Meal.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Meal not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/meals
 */
router.post("/", createMealRules, validate, async (req, res, next) => {
  try {
    const created = await Meal.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/meals/:id
 */
router.put("/:id", updateMealRules, validate, async (req, res, next) => {
  try {
    const updated = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Meal not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/meals/:id
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Meal.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Meal not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
