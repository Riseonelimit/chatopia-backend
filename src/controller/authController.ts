import { Request, Response, NextFunction } from "express";
import apiResponse from "../utils/apiResponse";
import prisma from "../../db/prisma.client";

export const authUser = async (req: Request, res: Response) => {
    const email = req.query.email as string;

    if (email == "") {
        return res
            .status(404)
            .json(
                new apiResponse(404, { data: "User Invalid Email" }, "Invalid")
            );
    }

    const result = await prisma.user.findFirst({
        where: {
            email: email,
        },
        include: {
            Profile: {},
            friendId: {},
        },
    });

    const friendList = await prisma.user.findMany({
        where: {
            friendId: {
                every: {
                    userId: result?.id,
                },
            },
            email: {
                not: result?.email,
            },
        },
        include: {
            Profile: {},
        },
    });

    // console.log(friendList);

    if (result) {
        return res
            .status(200)
            .json(
                new apiResponse(
                    200,
                    { userInfo: result, friendList },
                    "Record Found"
                )
            );
    } else {
        return res.status(404).json(new apiResponse(404, result, "Not Found"));
    }
};
