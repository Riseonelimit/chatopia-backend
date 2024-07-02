import { createSocketConnection } from "./events/connection";
import { httpServer } from "./lib/app";
import { createSocketInstance } from "./lib/socketInstance";

export const io = createSocketInstance();

if (io) {
    createSocketConnection();
}

httpServer.listen(8000, () => console.log("Server Started on Port 8000"));
