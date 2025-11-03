import express from "express";
import Ingredient from "./ingredients.model.js";
import validate from "../../middlewares/validate.js";
import {
  createIngRules,
  updateIngRules,
  listIngRules,
} from "./ingredients.validators.js";

const router = express.Router();

/**
 * GET /api/ingredients
 * Supports filtering, sorting, pagination
 */
router.get("/", listIngRules, validate, async (req, res, next) => {
  try {
    const {
      location,
      expBefore,
      page = 1,
      limit = 10,
      sort = "name",
    } = req.query;

    const filter = {};
    if (location) filter.location = location;
    if (expBefore) filter.expiresOn = { $lte: new Date(expBefore) };

    const ingredients = await Ingredient.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Ingredient.countDocuments(filter);

    res.json({
      data: ingredients,
      page: Number(page),
      limit: Number(limit),
      total,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/ingredients/:id
 */
router.get("/:id", async (req, res, next) => {
  try {
    const doc = await Ingredient.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Ingredient not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/ingredients
 */
router.post("/", createIngRules, validate, async (req, res, next) => {
  try {
    const created = await Ingredient.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/ingredients/:id
 */
router.put("/:id", updateIngRules, validate, async (req, res, next) => {
  try {
    const updated = await Ingredient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Ingredient not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/ingredients/:id
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Ingredient.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Ingredient not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
