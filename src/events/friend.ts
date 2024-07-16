import { Socket } from "socket.io";
import DBError from "../utils/DBError";
import prisma from "../../db/prisma.client";
import { io } from "..";

export const friendEvents = (socket: Socket, uid: string) => {
    socket?.on(
        `chat:find-user:${uid}`,
        async ({ id, searchName }: { id: string; searchName: string }) => {
            try {
                console.log("here");

                const result = await prisma.user.findMany({
                    where: {
                        name: { contains: searchName },
                        chats: {
                            none: {
                                participants: {},
                            },
                        },
                    },
                    select: {
                        name: true,
                        id: true,
                        Profile: {
                            select: {
                                image: true,
                            },
                        },
                    },
                });
                console.log(result);

                return io.to(uid).emit(`chat:find-user-result`, result);
            } catch (error) {
                if (error instanceof DBError) {
                    console.error("No Records Found");
                }
            }
        }
    );
};
