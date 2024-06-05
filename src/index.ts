import { Socket } from "socket.io";
import prisma from "../db/prisma.client";
import { response } from "express";
import { DefaultArgs } from "@prisma/client/runtime/library";
import crypto from "crypto";
import { Prisma } from "@prisma/client";

import express from "express";
import { urlencoded } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import router from "./routes/auth.routes";
import { userRouter } from "./routes/user.routes";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
    },
});

app.use(cors());
app.use(urlencoded());

app.use("/api/v1", router);
app.use("/api/v1/user", userRouter);

const foo = async () => {
    const deletedRecor = await prisma.profile.deleteMany();
    const deletedRecord = await prisma.user.deleteMany();
    console.log(deletedRecord.count);
};
// foo();

const addFriend = async () => {
    const result = await prisma.user.update({
        where: {
            id: "1691d7e0-ae3e-4903-a4a7-707c1edb03a2",
        },
        data: {
            userId: {
                create: {
                    friendId: "85c8c286-c99e-4495-b06c-5d1390d1249a",
                },
            },
        },
    });
};

let onlineUsers: Set<string | string[] | undefined> = new Set();

io.on("connection", (socket: Socket) => {
    // ...
    console.log("a new connection ", socket.handshake.query.uuid);

    let uid = socket.handshake.query.uuid as string;

    socket.join(uid);

    onlineUsers.add(socket.handshake.query.uuid);
    socket.on("get-online-users", () => {
        socket.broadcast.emit("online-users", Array.from(onlineUsers));
        socket.emit("online-users", Array.from(onlineUsers));
    });

    socket.on(`chat:send-message:${socket.handshake.query.uuid}`, (args) => {
        socket.broadcast
            .to(args.receiverId)
            .emit(`chat:receive-message:${args.receiverId}`, args);
        console.log("Msg is sent to ", args.receiverId);
    });

    socket.on("disconnect", (reason) => {
        onlineUsers.delete(socket.handshake.query.uuid);
        socket.broadcast.emit("online-users", Array.from(onlineUsers));
        console.log(onlineUsers);
    });
});


httpServer.listen(8000, () => console.log("Server Started on Port 8000"));
