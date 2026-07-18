import { Router } from "express";
import type { Request, Response } from "express";
import { signIn, signUp } from "../controllers/auth.controller.ts";
import signInValidation, { signUpValidation } from "../middlewares/auth.validation.ts";
import { validateRequest } from "../middlewares/validateRequest.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";

const authRoutes = Router();

authRoutes.post("/sign-up", signUpValidation, validateRequest, signUp);
authRoutes.post("/sign-in", signInValidation, validateRequest, signIn);
authRoutes.post(
  "/profile",
  authMiddleware,
  (req, res) => {
    res.json({
      message: "You are authenticated",
      user: req.user,
    });
  }
);


export default authRoutes;