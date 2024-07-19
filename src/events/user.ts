import { Socket } from "socket.io";
import { OnlineUsersSet, THEME } from "../types";
import UserRepository from "../../db/repository/UserRepository";
import { ThemeType } from "@prisma/client";

export const userEvents = (socket: Socket, onlineUsers: OnlineUsersSet) => {
    socket.on("get-online-users", () => {
        console.log("getOnline");
        socket.broadcast.emit("online-users", Array.from(onlineUsers));
        socket.emit("online-users", Array.from(onlineUsers));
    });

    socket.on(
        "user:update-theme",
        ({ theme, userId }: { theme: ThemeType; userId: string }) => {
            UserRepository.setTheme(theme, userId);
        }
    );
};
