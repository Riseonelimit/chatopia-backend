import ChatRepository from "../../db/repository/ChatRepository";
import UserRepository from "../../db/repository/UserRepository";
import { NewChatData } from "../types";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { Request, Response } from "express";

export const createNewChat = async (req: Request, res: Response) => {
    try {
        const chatData: NewChatData = req.body;
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
        const friendResult = await UserRepository.addFriend(
            chatData.currentUser.id,
            chatData.userDetails.id
        );
        await UserRepository.addFriend(
            chatData.userDetails.id,
            chatData.currentUser.id
        );

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
