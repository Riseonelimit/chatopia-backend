import { Socket } from "socket.io";
import MessageRepository from "../../db/repository/MessageRepository";
import { ChatMessage } from "../types";
import DBError from "../utils/DBError";

export const chatEvents = (socket: Socket, uid: string) => {
    socket.on(
        `chat:send-message:${socket.handshake.query.uuid}`,
        async (message: ChatMessage) => {
            try {
                const result = await MessageRepository.addMessage(message);
                if (!result) {
                    throw new DBError(
                        `Failed to add Message for User: ${socket.handshake.query.uuid}`
                    );
                }
                if (result)
                    socket.broadcast
                        .to(message.receiverId)
                        .emit(
                            `chat:receive-message:${message.receiverId}`,
                            message
                        );
            } catch (error) {
                if (error instanceof DBError) {
                    console.error(error.message);
                }
            }
        }
    );
};
