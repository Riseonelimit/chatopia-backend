import { Socket } from "socket.io";
import DBError from "../utils/DBError";
import prisma from "../../db/prisma.client";
import { io } from "..";

export const friendEvents = (socket: Socket, uid: string) => {
    socket?.on(
        `chat:find-user:${uid}`,
        async ({ id, searchName }: { id: string; searchName: string }) => {
            try {
                const result = await prisma.user.findMany({
                    where: {
                        AND: {
                            name: { contains: searchName, mode: "insensitive" },
                            friendId: {
                                none: { userId: id },
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

                return io.to(uid).emit(`chat:find-user-result`, result);
            } catch (error) {
                if (error instanceof DBError) {
                    console.error("No Records Found");
                }
            }
        }
    );
};
