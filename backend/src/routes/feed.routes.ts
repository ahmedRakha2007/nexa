import { Router } from "express";
import { getFeed, getFriendsFeed } from "../controllers/feed.controller.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";


const feedRouter = Router();

feedRouter.get("/", getFeed);

feedRouter.get("/friends", authMiddleware, getFriendsFeed);

export default feedRouter;