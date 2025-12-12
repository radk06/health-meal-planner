import { body } from "express-validator";

export const buildShoppingListRules = [
  body("mealIds")
    .isArray({ min: 1 })
    .withMessage("mealIds must be a non empty array"),
  body("mealIds.*")
    .isString()
    .withMessage("each meal id must be a string"),
];
