import { Request, Response } from "express";
import prisma from "../../db/prisma.client";
import apiResponse from "../utils/apiResponse";

export const addUser = async (req: Request, res: Response) => {
    const userData = req.body;
    console.log("UserData", userData);
    
    if (!userData) {
        return res
            .status(400)
            .json(
                new apiResponse(
                    400,
                    { success: false },
                    "No Data Found to insert"
                )
            );
    }
    const result = await prisma.user.create({
        data: {
            email: userData.email,
            name: userData.name,
            Profile: {
                create: {
                    image: userData.image || "",
                    about: "",
                    theme: "LIGHT",
                },
            },
        },
    });
    if (result) {
        const userProfile = await prisma.profile.findFirst({
            where: {
                userId: result.id,
            },
        });
        console.log(userProfile);

        return res
            .status(201)
            .json(
                new apiResponse(
                    201,
                    { result: userData, userProfile },
                    "User Created Successfully"
                )
            );
    }

    return res
        .status(400)
        .json(new apiResponse(400, { success: false }, "Something Went Wrong"));
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

    // const res = await prisma.chat.create({
    //     data: {
    //         groupName: "Test",
    //         isGroup: false,
    //         chatIcon: user1?.name,
    //         lastMessageId: null,
    //         participants: {
    //             connect: [{ id: user1?.id }],
    //         },
    //     },
    // });

    const groupMembers = await prisma.chat.findMany({
        include: {
            participants: true,
        },
    });
    console.log(groupMembers[0].participants);
};

// chatMessage();