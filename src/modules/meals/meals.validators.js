import { body, param, query } from "express-validator";

export const listMealsRules = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("q").optional().isString().trim(),
  query("tag").optional().isString().trim()
];

export const mealIdRules = [param("id").isString().trim().notEmpty()];

export const createMealRules = [
  body("title").isString().trim().notEmpty(),
  body("ingredients").isArray({ min: 1 }),
  body("ingredients.*").isString().trim().notEmpty(),
  body("calories").isInt({ min: 0 }).toInt(),
  body("tags").optional().isArray(),
  body("tags.*").optional().isString().trim()
];

export const updateMealRules = [
  body("title").optional().isString().trim(),
  body("ingredients").optional().isArray({ min: 1 }),
  body("ingredients.*").optional().isString().trim().notEmpty(),
  body("calories").optional().isInt({ min: 0 }).toInt(),
  body("tags").optional().isArray(),
  body("tags.*").optional().isString().trim()
];
