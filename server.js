import express from "express";
import morgan from "morgan";

import mealsRouter from "./src/modules/meals/meals.routes.js";
import ingredientsRouter from "./src/modules/ingredients/ingredients.routes.js";
import shoppingRouter from "./src/modules/shopping/shopping.routes.js";
import usersRouter from "./src/modules/users/users.routes.js";
import authRouter from "./src/modules/auth/auth.routes.js";

import { notFound } from "./src/middlewares/notFound.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/meals", mealsRouter);
app.use("/api/ingredients", ingredientsRouter);
app.use("/api/shopping", shoppingRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));
