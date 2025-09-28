import { Router } from "express";
import { generateShoppingList } from "../controllers/shopping.controller.js";

const router = Router();

router.get("/", generateShoppingList);

export default router;
