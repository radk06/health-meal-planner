import { body } from "express-validator";

export const signupRules = [
  body("name").isString().trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 6 })
];

export const loginRules = [
  body("email").isEmail().normalizeEmail(),
  body("password").isString().notEmpty()
];
