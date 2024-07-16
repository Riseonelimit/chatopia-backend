import { Router } from "express";
import { authUser } from "../controller/authController";

export const authRouter = Router();

authRouter.get("/auth", authUser);

