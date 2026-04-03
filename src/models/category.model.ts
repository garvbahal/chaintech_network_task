import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

categorySchema.index({ categoryName: 1, createdBy: 1 }, { unique: true });

export const CategoryModel = mongoose.model("Category", categorySchema);
