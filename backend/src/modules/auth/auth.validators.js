import { body } from "express-validator";

export const signupRules = [
  body("name").isString().trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("goals").optional().isString(),
];

export const loginRules = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isString().notEmpty().withMessage("Password is required"),
];

export const verifyOtpRules = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("otp")
    .isString()
    .trim()
    .isLength({ min: 4, max: 10 })
    .withMessage("OTP is required"),
];
