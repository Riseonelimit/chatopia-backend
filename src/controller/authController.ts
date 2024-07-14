import { Request, Response, NextFunction } from "express";
import prisma from "../../db/prisma.client";
import ApiResponse from "../utils/ApiResponse";
import UserRepository from "../../db/repository/UserRepository";
import ApiError from "../utils/ApiError";

export const authUser = async (req: Request, res: Response) => {
    try {
        const email = req.query.email as string;

        if (email == "") {
            return res
                .status(404)
                .json(
                    new ApiResponse(
                        404,
                        { data: "User Invalid Email" },
                        "Invalid"
                    )
                );
        }

        const result = await UserRepository.getUserByEmail(email);
        // NON ACCURATE METHOD -- NEEDS A FIX LATER AND DB UPDATE
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
        if (!result) {
            throw new ApiError(404, "Not Found");
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { userInfo: result, friendList },
                    "Record Found"
                )
            );
    } catch (error) {
        if (error instanceof ApiError)
            return res
                .status(error.statusCode)
                .json(
                    new ApiResponse(error.statusCode, error.data, error.message)
                );
    }
};
