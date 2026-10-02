import type { Request, Response } from "express";
import createConversationService from "../services/conversation/createConversation.ts";
import getConversationsService from "../services/conversation/getConversations.ts";
import getConversationMessagesService from "../services/conversation/getConversationMessages.ts";

// import {
//   createConversationService,
//   getConversationsService,
//   getConversationMessagesService,
// } from "../services/conversation.service";

export const createConversation = async (req: Request & { user?: { userId: string } }, res: Response) => {
    const { userId } = req.user!;
    const { other_user_id } = req.body;

    const conversation = await createConversationService(
      userId,
      other_user_id
    );

    res.status(201).json({
      message: "Conversation created successfully",
      conversation,
    });
};

export const getConversations = async (req: Request & { user?: { userId: string } }, res: Response) => {
    const { userId } = req.user!;

    const conversations = await getConversationsService(userId);

    res.status(200).json({
      conversations,
    });
};

export const getConversationMessages = async (
  req: Request & { user?: { userId: string }},
  res: Response 
) => {
    const { userId } = req.user!;
    const conversationId = String(req.params.conversationId);

    const messages = await getConversationMessagesService(
      userId,
      conversationId
    );

    res.status(200).json({
      messages,
    });
};