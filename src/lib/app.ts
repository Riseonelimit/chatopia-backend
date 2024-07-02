import cors from "cors";
import express, { json, urlencoded } from "express";
import { createServer } from "http";
import router from "../routes/auth.routes";
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
app.use("/api/v1", router);
app.use("/api/v1/user", userRouter);
