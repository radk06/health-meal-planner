import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { readJson, writeJson } from "../../utils/file-db.js";
import { signupRules, loginRules } from "./auth.validators.js";
import { hashPassword, verifyPassword, makeToken } from "./crypto.js";

const router = Router();
const USERS_PATH = "src/modules/users/users.data.json";

// Helpers
function publicUser(u) {
  const { passwordHash, passwordSalt, ...safe } = u;
  return safe;
}
function emailEq(a, b) { return a.toLowerCase() === b.toLowerCase(); }

// POST /api/auth/signup
router.post("/signup", validate(signupRules), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const users = await readJson(USERS_PATH, []);
    if (users.some(u => emailEq(u.email, email))) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const { salt, hash } = hashPassword(password);
    const id = "u" + Math.random().toString(36).slice(2, 10);

    const newUser = {
      id,
      name,
      email,
      role: "user",
      goals: { target: "balanced" },
      passwordSalt: salt,
      passwordHash: hash
    };

    users.push(newUser);
    await writeJson(USERS_PATH, users);

    const token = makeToken({ sub: id, email });
    res.status(201).json({ token, user: publicUser(newUser) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", validate(loginRules), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const users = await readJson(USERS_PATH, []);
    const user = users.find(u => emailEq(u.email, email));
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const ok = verifyPassword(password, user.passwordSalt, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    const token = makeToken({ sub: user.id, email: user.email });
    res.status(200).json({ token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

export default router;
