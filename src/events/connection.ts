import { Socket } from "socket.io";
import { io } from "..";
import { userEvents } from "./user";
import { OnlineUsersSet } from "../types";
import { chatEvents } from "./chat";

let onlineUsers: OnlineUsersSet = new Set();

export const createSocketConnection = () => {
    io.on("connection", (socket: Socket) => {
        // ...
        console.log("a new connection ", socket.handshake.query.uuid);
        let uid = socket.handshake.query.uuid as string;
        //adding the user to room
        socket.join(uid);

        //adding the user in onlineList
        onlineUsers.add(socket.handshake.query.uuid);

        //-----EVENTS------

        userEvents(socket, onlineUsers);

        chatEvents(socket);

        // -----0N-DISCONNECT-------
        socket.on("disconnect", (reason) => {
            onlineUsers.delete(socket.handshake.query.uuid);
            socket.broadcast.emit("online-users", Array.from(onlineUsers));
            console.log(onlineUsers);
        });
    });
};
