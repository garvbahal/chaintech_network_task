import mongoose from "mongoose";

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
      process.exit(1);
    });
};
