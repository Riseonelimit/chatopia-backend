import { Server } from "socket.io";
import { httpServer } from "./app";

export const createSocketInstance = () => {
    return new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN,
        },
    });
};
