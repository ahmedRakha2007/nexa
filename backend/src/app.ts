import express from "express";
import authRoutes from "./routes/auth.routes.ts";
import postRoutes from "./routes/posts.routes.ts";
import errorHandler from "./middlewares/errorHandler.ts";
import profileRoutes from "./routes/profile.routes.ts";
import feedRouter from "./routes/feed.routes.ts";
import friendShipRouter from "./routes/friendship.routes.ts";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.ts";
import cors from "cors";

const app = express();

app.use(
cors({
    origin: "http://localhost:8080",
  })
);

app.use(express.json());



app.get("/", (req, res) => {
  res.status(200).json({
    message: "Nexa API is running",
  });
});

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use("/v1/auth", authRoutes);
app.use("/v1/posts", postRoutes);
app.use("/v1/profile", profileRoutes);
app.use("/v1/feed", feedRouter);
app.use("/v1/friend-requests", friendShipRouter);

app.use(errorHandler);

export default app;