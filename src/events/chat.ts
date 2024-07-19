import { Socket } from "socket.io";
import MessageRepository from "../../db/repository/MessageRepository";
import { ChatMessage } from "../types";
import DBError from "../utils/DBError";

export const chatEvents = (socket: Socket, uid: string) => {
    socket.on(`chat:send-message:${uid}`, async (message: ChatMessage) => {
        try {
            const result = await MessageRepository.addMessage(message);
            if (!result) {
                throw new DBError(`Failed to add Message for User: ${uid}`);
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
    });
    socket.on("chat:get-messages", async (chatId: string) => {
        try {
            console.log(chatId);

            const messages = await MessageRepository.getAllMessagesByChatId(
                chatId
            );
            if (!messages) {
                throw new DBError(`Failed to add Message for User: ${uid}`);
            }
            console.log(messages);

            if (messages) socket.emit(`chat:get-all-messages`, messages);
        } catch (error) {
            if (error instanceof DBError) {
                console.error(error.message);
            }
        }
    });
};

// 26f957bd-662c-43f3-bc15-8c5a75d98bc2
