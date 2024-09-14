import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const mongoDbConnect = async () => {
  try {
    const url = process.env.MONGODB_STRING;
    await mongoose.connect(`${url}`);

    console.log("connection succesfull");
  } catch (error) {
    console.log("connection error", (error as Error).message);
  }
};
