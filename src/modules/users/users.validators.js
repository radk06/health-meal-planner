import { body, param, query } from "express-validator";

export const listUsersRules = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt()
];

export const userIdRules = [param("id").isString().trim().notEmpty()];

export const createUserRules = [
  body("name").isString().trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("role").optional().isIn(["user", "admin"]),
  body("goals").optional().isObject()
];

export const updateUserRules = [
  body("name").optional().isString().trim(),
  body("role").optional().isIn(["user", "admin"]),
  body("goals").optional().isObject()
];
