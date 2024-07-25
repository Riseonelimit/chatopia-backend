import { Socket } from "socket.io";
import ChatRepository from "../../db/repository/ChatRepository";

export const groupEvents = (socket: Socket, uid: string) => {
    socket.on(
        "group:create-new",
        async ({ groupDetails, participantArray }, callback) => {
            try {
                console.log(participantArray);

                const result = await ChatRepository.createGroup({
                    groupDetails,
                    participantArray,
                });

                if (result) {
                    return callback(result);
                }
            } catch (error) {
                console.log(error);
            }
        }
    );
};
