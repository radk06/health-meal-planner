import { body, param, query } from "express-validator";

export const createIngRules = [
  body("name").isString().trim().notEmpty().withMessage("Name is required"),
  body("location")
    .isIn(["pantry", "fridge", "freezer"])
    .withMessage("Location must be pantry, fridge, or freezer"),
  body("qty").isFloat({ min: 0 }).withMessage("Quantity must be a positive number"),
  body("unit").isString().trim().notEmpty().withMessage("Unit is required"),
  body("expiresOn").optional().isISO8601().toDate(),
];

export const updateIngRules = [
  param("id").isMongoId().withMessage("Invalid ID"),
  body("name").optional().isString().trim().notEmpty(),
  body("location").optional().isIn(["pantry", "fridge", "freezer"]),
  body("qty").optional().isFloat({ min: 0 }),
  body("unit").optional().isString().trim().notEmpty(),
  body("expiresOn").optional().isISO8601().toDate(),
];

export const listIngRules = [
  query("location").optional().isIn(["pantry", "fridge", "freezer"]),
  query("expBefore").optional().isISO8601().toDate(),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("sort").optional().isString(),
];
