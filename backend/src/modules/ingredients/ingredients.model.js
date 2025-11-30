import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: {
      type: String,
      enum: ["pantry", "fridge", "freezer"],
      required: true,
    },
    qty: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
    expiresOn: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Ingredient", ingredientSchema);
