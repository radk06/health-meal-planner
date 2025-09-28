import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import mealsRouter from "./src/routes/meals.routes.js";
import ingredientsRouter from "./src/routes/ingredients.routes.js";
import shoppingRouter from "./src/routes/shopping.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import usersRouter from "./src/routes/users.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ ok: true, service: "Health & Meal Prep Planner API", version: "1.0.0" });
});

app.use("/api/meals", mealsRouter);
app.use("/api/ingredients", ingredientsRouter);
app.use("/api/shopping", shoppingRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
