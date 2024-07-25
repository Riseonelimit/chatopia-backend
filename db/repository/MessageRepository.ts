import { PrismaClient } from "@prisma/client";
import prisma from "../prisma.client";
import { ChatMessage, MessageType } from "../../src/types";

class MessageRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = prisma;
    }

    async addMessage(message: ChatMessage) {
        try {
            
            const response = await prisma.message.create({
                data: {
                    chatId: message.chatId,
                    senderId: message.senderId,
                    receiverId: message.receiverId,
                    content: message.content,
                    type: message.type == MessageType.IMAGE ? "IMAGE" : "TEXT",
                    isGroup: message.isGroup,
                },
            });
            return response;
        } catch (error) {
            console.error("Error adding message:", error);
            throw error;
        }
    }

    async getMessage(messageId: string) {
        try {
            const message = await prisma.message.findUnique({
                where: {
                    id: messageId,
                },
            });
            return message;
        } catch (error) {
            console.error("Error adding message:", error);
            throw error;
        }
    }
    async getAllMessagesByChatId(chatId: string) {
        try {
            const chatMessages = await prisma.message.findMany({
                where: {
                    chatId: chatId,
                },
                include: {
                    sender: {
                        select: {
                            name: true,
                            Profile: {
                                select: {
                                    image: true,
                                },
                            },
                        },
                    },
                },
            });
            console.log(chatMessages);

            return chatMessages;
        } catch (error) {
            console.error("No messages Found:", error);
            throw error;
        }
    }
}

export default new MessageRepository();
