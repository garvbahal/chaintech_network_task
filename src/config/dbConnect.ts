import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbUri = process.env.MONGO_URI;

if (!dbUri) {
  throw new Error("mongodb url missing");
}

export const dbConnect = () => {
  mongoose
    .connect(dbUri)
    .then((res) => {
      console.log("DB connection successfull");
    })
    .catch((error) => {
      console.log("DB connection not successfull");
      console.log(error);
      process.exit(1);
    });
};
