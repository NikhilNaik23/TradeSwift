import express from "express";
import cors from "cors";
import dotenvx from "@dotenvx/dotenvx";
import connectDB from "./config/db.js";
import apis from "./apis/apis.js";
import cookieParser from "cookie-parser";

dotenvx.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();
apis(app);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
