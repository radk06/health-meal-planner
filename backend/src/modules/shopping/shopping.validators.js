import { body } from "express-validator";

export const buildListRules = [
  body("mealIds")
    .isArray({ min: 1 })
    .withMessage("mealIds must be a non-empty array"),
  body("mealIds.*")
    .isMongoId()
    .withMessage("Each mealId must be a valid Mongo ObjectId"),
];
