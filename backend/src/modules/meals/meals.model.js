import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    // simple ingredients as strings; can be upgraded to refs later
    ingredients: {
      type: [String],
      required: true,
      validate: v => Array.isArray(v) && v.length > 0
    },
    calories: { type: Number, required: true, min: 0 },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Meal", mealSchema);
