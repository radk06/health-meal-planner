import { body } from "express-validator";

export const buildListRules = [
  body("mealIds")
    .isArray({ min: 1 })
    .withMessage("mealIds is required and must be a non-empty array"),
  body("mealIds.*").isString().trim().notEmpty()
];
