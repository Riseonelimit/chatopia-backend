import cors from "cors";
import express, { json, urlencoded } from "express";
import { createServer } from "http";
import { authRouter } from "../routes/auth.routes";
import { chatRouter } from "../routes/chat.routes";
import { userRouter } from "../routes/user.routes";

export const app = express();
export const httpServer = createServer(app);

//-------middleware---------
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

//--------routes-----------
app.use("/api/v1", authRouter);
app.use("/api/v1", chatRouter);
app.use("/api/v1/user", userRouter);
