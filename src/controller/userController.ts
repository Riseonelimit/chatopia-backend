import { Request, Response } from "express";
import prisma from "../../db/prisma.client";
import apiResponse from "../utils/apiResponse";

export const addUser = async (req: Request, res: Response) => {
    const userData = req.body;

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
