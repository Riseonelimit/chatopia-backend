import ChatRepository from "../../db/repository/ChatRepository";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { Request, Response } from "express";

export const createNewChat = async (req: Request, res: Response) => {
    try {
        const chatData = req.body;
        console.log(chatData);

        if (!chatData) {
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
        const result = await ChatRepository.createChat(chatData);
        if (!result) {
            throw new ApiError(404, "");
        }
        if (result) {
            return res
                .status(201)
                .json(
                    new ApiResponse(
                        201,
                        { chat: result },
                        "Chat Created Successfully"
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
