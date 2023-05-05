import express from "express";
import cors from "cors";
import { connectDB } from "./db/connection";

const app = express();

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

connectDB();

app.listen("3000", () => {
  console.log(`⚡️[server]: Server is running at http://localhost:3000`);
});
