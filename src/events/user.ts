import { Socket } from "socket.io";
import { OnlineUsersSet } from "../types";

export const userEvents = (socket: Socket, onlineUsers: OnlineUsersSet) => {
    socket.on("get-online-users", () => {
        console.log("getOnline");
        socket.broadcast.emit("online-users", Array.from(onlineUsers));
        socket.emit("online-users", Array.from(onlineUsers));
    });
};
