import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.ts";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../controllers/notification.controller.ts";

const router = Router();

router.get("/", authMiddleware, getNotifications);

router.patch("/:id/read", authMiddleware, markNotificationAsRead);

router.patch("/read-all", authMiddleware, markAllNotificationsAsRead);

export default router;