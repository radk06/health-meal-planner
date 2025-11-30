import { query, param, body } from "express-validator";

export const listUserRules = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
];

export const updateUserRules = [
  param("id").isMongoId(),
  body("name").optional().isString().trim().notEmpty(),
  body("email").optional().isEmail().normalizeEmail(),
  body("goals").optional().isString().trim(),
  body("role").optional().isIn(["user", "admin"]),
];
