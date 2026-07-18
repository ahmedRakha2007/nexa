import express from "express";
import authRoutes from "./routes/auth.routes.ts";

const app = express();


app.use(express.json());

app.use("/v1/auth", authRoutes);

export default app;