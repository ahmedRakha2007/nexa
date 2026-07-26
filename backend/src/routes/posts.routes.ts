import {Router} from "express"
import type { Request, Response } from "express";
import { validateRequest } from "../middlewares/validateRequest.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";
import { createPost, deletePost, editPost, getPost } from "../controllers/posts.controller.ts";
import { createPostValidation, editPostValidation, postIdValidation } from "../middlewares/posts.validation.ts";
import upload from "../middlewares/upload.middleware.ts";

const postRoutes = Router();

postRoutes.post("/", authMiddleware, upload.single("image"), createPostValidation, validateRequest, createPost);
postRoutes.get("/:id", postIdValidation, validateRequest, getPost);
postRoutes.patch("/:id", authMiddleware, upload.single("image"), editPostValidation, validateRequest, editPost);
postRoutes.delete("/:id", authMiddleware, postIdValidation, validateRequest, deletePost);

export default postRoutes;