import "express-async-errors";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./documentation/swagger.json";
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

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.status(404).send("Main path is /api");
});

if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Routes
app.use("/api", router);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
