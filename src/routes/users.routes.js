import { Router } from "express";
import { me, listUsers } from "../controllers/users.controller.js";

const router = Router();

router.get("/", listUsers);  // GET /api/users
router.get("/me", me);       // GET /api/users/me

export default router;
