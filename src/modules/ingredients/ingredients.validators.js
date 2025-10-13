import { body, param, query } from "express-validator";

export const listIngredientsRules = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("q").optional().isString().trim(),
  query("location").optional().isIn(["pantry", "fridge", "freezer"]),
  query("expBefore").optional().isISO8601().toDate()
];

export const ingredientIdRules = [param("id").isString().trim().notEmpty()];

export const createIngredientRules = [
  body("name").isString().trim().notEmpty(),
  body("location").isIn(["pantry", "fridge", "freezer"]),
  body("qty").isFloat({ min: 0 }).toFloat(),
  body("unit").isString().trim().notEmpty(),
  body("expiresOn").isISO8601().withMessage("expiresOn must be ISO date")
];

export const updateIngredientRules = [
  body("name").optional().isString().trim().notEmpty(),
  body("location").optional().isIn(["pantry", "fridge", "freezer"]),
  body("qty").optional().isFloat({ min: 0 }).toFloat(),
  body("unit").optional().isString().trim().notEmpty(),
  body("expiresOn").optional().isISO8601()
];
