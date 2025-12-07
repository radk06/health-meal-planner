import express from "express";
import { body } from "express-validator";
import validate from "../../middlewares/validate.js";
import User from "../users/users.model.js";
import { signupRules, loginRules } from "./auth.validators.js";
import { hashPassword, comparePassword, signToken } from "./crypto.js";
import { sendOtpEmail } from "./email.js";

const router = express.Router();

function generateOtp() {
  // 6 digit numeric code as string
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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
 * Step 1: Authenticate credentials, generate OTP, send by email.
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

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otpCode = otp;
    user.otpExpiresAt = expiresAt;
    await user.save();

    // fire and forget; if email fails, you can still log error
    await sendOtpEmail(user.email, otp);

    res.json({
      message: "OTP sent to your email",
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/verify-otp
 * Step 2: Verify OTP and issue JWT.
 */
router.post(
  "/verify-otp",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be a 6 digit code"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, otp } = req.body;

      const user = await User.findOne({ email });
      if (!user || !user.otpCode || !user.otpExpiresAt) {
        return res
          .status(400)
          .json({ message: "No active OTP session for this user" });
      }

      if (user.otpCode !== otp) {
        return res.status(401).json({ message: "Invalid OTP" });
      }

      if (user.otpExpiresAt.getTime() < Date.now()) {
        return res.status(401).json({ message: "OTP has expired" });
      }

      // clear OTP fields
      user.otpCode = undefined;
      user.otpExpiresAt = undefined;
      await user.save();

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
  }
);

export default router;
