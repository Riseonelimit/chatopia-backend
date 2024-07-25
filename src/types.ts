import { Chat, ThemeType } from "@prisma/client";

export type OnlineUsersSet = Set<string | string[] | undefined>;

export type ChatMessage = {
    id?: string;
    chatId: string;
    senderId: string;
    receiverId: string;
    message: string;
    userName: string;
    type: MessageType;
    content: string;
    isGroup: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export enum MessageType {
    TEXT,
    IMAGE,
}

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;

    Profile: Profile;
}

export interface Profile {
    id: string;
    about: string;
    image: string;
    theme: ThemeType;
}
export enum THEME {
    DEFAULT,
    EMERALD,
    PINK,
    MOCHA,
    DARK,
}

export interface ApiErrorInterface {
    statusCode: number;
    message: string;
    stack?: string;
    success: boolean;
    data: string | JSON;
    errors: any[];
}

export type NewChatData = {
    currentUser: User;
    userDetails: Pick<User, "name" | "id"> & {
        Profile: Pick<Profile, "image">;
    };
};

export type NewGroup = Pick<Chat, "groupName" | "chatIcon" | "isGroup">;
