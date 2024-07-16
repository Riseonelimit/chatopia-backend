import { Router } from "express";
import { authUser } from "../controller/authController";
import { createNewChat } from "../controller/chatController";

export const chatRouter = Router();

chatRouter.post("/chat", createNewChat);
