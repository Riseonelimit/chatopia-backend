import { PrismaClient } from "@prisma/client";
import { NewChatData } from "../../src/types";
import prisma from "../prisma.client";
import ApiError from "../../src/utils/ApiError";

class ChatRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = prisma;
    }

    async checkIfChatExist({ userDetails, currentUser }: NewChatData) {
        try {
            const isExist = await prisma.chat.findMany({
                where: {
                    participants: {
                        every: {
                            id: {
                                in: [userDetails.id, currentUser.id],
                            },
                        },
                    },
                },
            });

            if (isExist.length == 0) return false;
            if (isExist) {
                return true;
            }
        } catch (error) {}
    }

    // userData = 2nd user to create a Chat
    async createChat({ userDetails, currentUser }: NewChatData) {
        if (await this.checkIfChatExist({ userDetails, currentUser })) {
            throw new ApiError(403, "Chat Already Exist");
        }

        const newChat = await prisma.chat.create({
            data: {
                chatIcon: null,
                isGroup: false,
                lastMessageId: null,
                participants: {
                    connect: [{ id: currentUser.id }, { id: userDetails.id }],
                },
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        email: true,
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
        return newChat;
    }
}

export default new ChatRepository();
