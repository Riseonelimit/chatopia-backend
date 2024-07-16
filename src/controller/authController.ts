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
        const userChats = await prisma.chat.findMany({
            where: {
                participants: {
                    some: {
                        id: result?.id,
                    },
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

        // console.log(userChats);
        if (!result) {
            throw new ApiError(404, "Not Found");
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { userInfo: result, userChats },
                    "Record Found"
                )
            );
    } catch (error) {
        if (error instanceof ApiError) {
            return res
                .status(error.statusCode)
                .json(
                    new ApiResponse(error.statusCode, error.data, error.message)
                );
        }

        return res
            .status(500)
            .json(new ApiResponse(500, error, "Something Went Wrong"));
    }
};
