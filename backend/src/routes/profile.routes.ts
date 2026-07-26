import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.ts";
import { getProfile, getProfilePosts, updateProfile } from "../controllers/profile.controller.ts";
import { updateProfileValidation } from "../middlewares/profile.validation.ts";
import { validateRequest } from "../middlewares/validateRequest.ts";
import upload from "../middlewares/upload.middleware.ts";


// get /username
//  patch /profile/me

const profileRoutes = Router();

profileRoutes.get("/:username", getProfile);
profileRoutes.get("/:username/posts", getProfilePosts)
profileRoutes.patch("/me", authMiddleware, upload.single("profile_image"),  updateProfileValidation, validateRequest, updateProfile)



export default profileRoutes;