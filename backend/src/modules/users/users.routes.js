import express from "express";
import User from "./users.model.js";
import validate from "../../middlewares/validate.js";
import {
  listUserRules,
  updateUserRules,
} from "./users.validators.js";
import {
  requireAuth,
  requireRole,
} from "../../middlewares/auth.js";

const router = express.Router();

/**
 * GET /api/users
 * Admin-only — list all users with pagination
 */
router.get("/", requireAuth, requireRole("admin"), listUserRules, validate, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("-passwordHash");
    const total = await User.countDocuments();

    res.json({
      data: users,
      page: Number(page),
      limit: Number(limit),
      total,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/users/me
 * Authenticated user — return own profile
 */
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const me = await User.findById(req.user.id).select("-passwordHash");
    if (!me) return res.status(404).json({ message: "User not found" });
    res.json(me);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/users/:id
 * Admin-only — update another user's info
 */
router.put("/:id", requireAuth, requireRole("admin"), updateUserRules, validate, async (req, res, next) => {
  try {
    const update = req.body;
    const updated = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select("-passwordHash");
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/users/:id
 * Admin-only — delete a user
 */
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
