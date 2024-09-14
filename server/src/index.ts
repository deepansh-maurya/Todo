import express from "express";
import cors from "cors";
import { mongoDbConnect } from "./database/dbconnect";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
mongoDbConnect()
  .then(() => {
    app.listen(8080, () => {
      console.log("server is running");
    });
  })
  .catch(() => {
    console.log("server error");
  });

import router from "./routes/app.routes";
app.use("/api/v1", router);
