import { PrismaClient } from "@prisma/client";
import { NewChatData, NewGroup, User } from "../../src/types";
import prisma from "../prisma.client";
import ApiError from "../../src/utils/ApiError";
import DBError from "../../src/utils/DBError";

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

    async createGroup({
        groupDetails,
        participantArray,
    }: {
        groupDetails: NewGroup;
        participantArray: Array<Pick<User, "id">>;
    }) {
        try {
            const result = await prisma.chat.create({
                data: {
                    chatIcon: groupDetails.chatIcon,
                    groupName: groupDetails.groupName,
                    isGroup: true,
                    participants: {
                        connect: [...participantArray],
                    },
                },
                include: {
                    participants: true,
                },
            });

            if (!result) throw new DBError("Unable to Create Group");

            if (result) return result;
        } catch (error) {}
    }
}

export default new ChatRepository();
