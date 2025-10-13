import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import {
  getAllUsers, getUserById, addNewUser, updateExistingUser, deleteUser
} from "./users.model.js";
import {
  listUsersRules, userIdRules, createUserRules, updateUserRules
} from "./users.validators.js";

const router = Router();

router.get("/", validate(listUsersRules), async (req, res, next) => {
  try { res.json(await getAllUsers(req.query)); }
  catch (e) { next(e); }
});

router.get("/:id", validate(userIdRules), async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (e) { next(e); }
});

router.post("/", validate(createUserRules), async (req, res, next) => {
  try { res.status(201).json(await addNewUser(req.body)); }
  catch (e) { next(e); }
});

router.put("/:id", validate([...userIdRules, ...updateUserRules]), async (req, res, next) => {
  try {
    const updated = await updateExistingUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (e) { next(e); }
});

router.delete("/:id", validate(userIdRules), async (req, res, next) => {
  try {
    const ok = await deleteUser(req.params.id);
    if (!ok) return res.status(404).json({ error: "User not found" });
    res.json({ success: true });
  } catch (e) { next(e); }
});

export default router;
