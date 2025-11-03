import express from "express";
import validate from "../../middlewares/validate.js";
import User from "../users/users.model.js";
import { signupRules, loginRules } from "./auth.validators.js";
import { hashPassword, comparePassword, signToken } from "./crypto.js";

const router = express.Router();

/**
 * POST /api/auth/signup
 * Register new user and issue JWT.
 */
router.post("/signup", signupRules, validate, async (req, res, next) => {
  try {
    const { name, email, password, goals } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({ name, email, goals, passwordHash });

    const token = signToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 * Authenticate existing user.
 */
router.post("/login", loginRules, validate, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
