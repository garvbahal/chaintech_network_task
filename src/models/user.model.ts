import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    passwordHashed: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model("User", userSchema);
