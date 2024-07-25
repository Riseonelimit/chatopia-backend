import { Socket } from "socket.io";
import { io } from "..";
import { userEvents } from "./user";
import { OnlineUsersSet } from "../types";
import { chatEvents } from "./chat";
import { friendEvents } from "./friend";
import { groupEvents } from "./group";

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
        console.log(onlineUsers);

        userEvents(socket, onlineUsers);

        chatEvents(socket, uid);
        friendEvents(socket, uid);
        groupEvents(socket, uid);

        // -----0N-DISCONNECT-------
        socket.on("disconnect", (reason) => {
            onlineUsers.delete(socket.handshake.query.uuid);
            socket.broadcast.emit("online-users", Array.from(onlineUsers));
        });
    });
};
