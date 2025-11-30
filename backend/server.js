import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";


import { connectDB } from "./src/shared/middlewares/connect-db.js";
import notFound from "./src/middlewares/notFound.js";
import errorHandler from "./src/middlewares/errorHandler.js";


// Routes
import authRoutes from "./src/modules/auth/auth.routes.js";
import mealRoutes from "./src/modules/meals/meals.routes.js";
import ingredientRoutes from "./src/modules/ingredients/ingredients.routes.js";
import userRoutes from "./src/modules/users/users.routes.js";
import shoppingRoutes from "./src/modules/shopping/shopping.routes.js";


dotenv.config();
const app = express();


// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// DB
await connectDB();


// Health check
app.get("/", (req, res) => res.json({ ok: true, service: "health-meal-planner" }));


// API
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/users", userRoutes);
app.use("/api/shopping", shoppingRoutes);


// 404 & Error
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));