import { Socket } from "socket.io";
import prisma from "../../db/prisma.client";

export const chatEvents = (socket: Socket) => {
    socket.on(
        `chat:send-message:${socket.handshake.query.uuid}`,
        async (message) => {
            const res = await prisma.message.create({
                data: {
                    chatId: message.chatId,
                    senderId: message.senderId,
                    receiverId: message.receiverId,
                    content: message.content,
                    type: message.type,
                    isGroup: message.isGroup,
                },
            });

            socket.broadcast
                .to(message.receiverId)
                .emit(`chat:receive-message:${message.receiverId}`, message);
            console.log("Msg is sent to ", message.receiverId);
        }
    );
};
