import mongoose from "mongoose";
import * as Types from "@src/Types";

const RecipeSchema = new mongoose.Schema<Types.TRecipeModel>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const recipeModel = mongoose.model<Types.TRecipeModel>(
  "Recipe",
  RecipeSchema
);
