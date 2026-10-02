import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.ts";
import { createConversation, getConversationMessages, getConversations } from "../controllers/conversation.controller.ts";

const conversationRouter = Router();

conversationRouter.use(authMiddleware);

conversationRouter.post("/", createConversation);
conversationRouter.get("/", getConversations);
conversationRouter.get("/:conversationId/messages", getConversationMessages);

export default conversationRouter;