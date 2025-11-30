import { body, param, query } from "express-validator";

export const listMealRules = [
  query("q").optional().isString(),
  query("tag").optional().isString(),
  query("minCal").optional().isInt({ min: 0 }),
  query("maxCal").optional().isInt({ min: 0 }),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("sort").optional().isString() // e.g. "title" or "-calories"
];

export const createMealRules = [
  body("title").isString().trim().notEmpty().withMessage("Title is required"),
  body("ingredients").isArray({ min: 1 }).withMessage("Ingredients must be a non-empty array of strings"),
  body("ingredients.*").isString().trim(),
  body("calories").isInt({ min: 0 }).withMessage("Calories must be a non-negative integer"),
  body("tags").optional().isArray(),
  body("tags.*").optional().isString().trim()
];

export const updateMealRules = [
  param("id").isMongoId(),
  body("title").optional().isString().trim().notEmpty(),
  body("ingredients").optional().isArray({ min: 1 }),
  body("ingredients.*").optional().isString().trim(),
  body("calories").optional().isInt({ min: 0 }),
  body("tags").optional().isArray(),
  body("tags.*").optional().isString().trim()
];
