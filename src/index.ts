import { Socket } from "socket.io";

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
    },
});

app.use(cors());

let users = new Map();
users.set(0, "Lele Ome");
users.set(1, "John Doe");
users.set(2, "Foo bar");

let socket;
io.on("connection", (socket: Socket) => {
    // ...
    socket.on("message", ({ uuid, message }: any) => {

        console.log("Client :" + users.get(uuid) + " => " + message);
        io.emit("message", {uuid,message});

    });
});

httpServer.listen(8000, () => console.log("Server Started on Port 8000"));
