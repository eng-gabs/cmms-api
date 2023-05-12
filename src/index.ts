import "express-async-errors";
import express from "express";
import cors from "cors";
import { connectDB } from "./db/connection";
import { router } from "./routes/router";
import { config } from "dotenv";
import { errorMiddleware } from "./middlewares/error";

config({
  path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env",
});

const PORT = process.env.PORT || 3000;
export const app = express();

// Add a list of allowed origins.
const allowedOrigins = ["http://localhost:3000"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Routes
app.use("/api", router);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
