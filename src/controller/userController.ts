import { Request, Response } from "express";
import prisma from "../../db/prisma.client";
import UserRepository from "../../db/repository/UserRepository";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

export const addUser = async (req: Request, res: Response) => {
    try {
        const userData = req.body;

        if (!userData) {
            return res
                .status(400)
                .json(
                    new ApiResponse(
                        400,
                        { success: false },
                        "No Data Found to insert"
                    )
                );
        }
        const result = await UserRepository.addUser(userData);
        if (!result) {
            throw new ApiError(404, "");
        }
        if (result) {
            return res
                .status(201)
                .json(
                    new ApiResponse(
                        201,
                        { result: userData },
                        "User Created Successfully"
                    )
                );
        }

        return res
            .status(400)
            .json(
                new ApiResponse(400, { success: false }, "Something Went Wrong")
            );
    } catch (error) {
        if (error instanceof ApiError) {
            return res
                .status(error.statusCode)
                .json(
                    new ApiResponse(
                        error.statusCode,
                        { success: false },
                        error.message
                    )
                );
        }
    }
};

// MISC

const deleteDB = async () => {
    const profileDeleted = await prisma.profile.deleteMany();
    const deletedRecord = await prisma.user.deleteMany();
    console.log(deletedRecord.count);
};
// deleteDB();

const addFriend = async () => {
    const result = await prisma.user.update({
        where: {
            id: "1691d7e0-ae3e-4903-a4a7-707c1edb03a2",
        },
        data: {
            userId: {
                create: {
                    friendId: "85c8c286-c99e-4495-b06c-5d1390d1249a",
                },
            },
        },
    });
};

const chatMessage = async () => {
    const user1 = await prisma.user.findFirst({
        where: {
            id: "1691d7e0-ae3e-4903-a4a7-707c1edb03a2",
        },
    });

    console.log(user1);

    const res = await prisma.chat.create({
        data: {
            groupName: "Test",
            isGroup: false,
            chatIcon: user1?.name,
            lastMessageId: null,
            participants: {
                connect: [{ id: user1?.id }],
            },
        },
    });

    const groupMembers = await prisma.chat.findMany({
        include: {
            participants: true,
        },
    });
};

// chatMessage();